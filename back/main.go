package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"github.com/google/uuid"
	"github.com/gorilla/mux"
	"io/ioutil"
	"log"
	"mime/multipart"
	"net/http"
)

var store = Store{tokenToEntry: make(map[Token]Entry)}

func main() {
	r := mux.NewRouter()
	r.HandleFunc("/api/upload", handleUpload).Methods("POST")
	r.HandleFunc("/api/{token}", handleGet).Methods("GET")
	r.HandleFunc("/api/{token}/abnormalities", handleGetAbnormalities).Methods("GET")
	http.Handle("/", r)

	var backAddr, listenAddr = GetBackAddr()
	log.Println("backend listening", backAddr)
	err := http.ListenAndServe(listenAddr, nil)
	log.Fatal(err)
}

func handleGet(w http.ResponseWriter, r *http.Request) {
	log.Println("handle get")

	token, ok := mux.Vars(r)["token"]
	if !ok {
		log.Println("empty token")
		http.Error(w, "empty token", http.StatusNotFound)
		return
	}

	log.Println("load entry from store related to token", token)

	store.RLock()
	entry, ok := store.tokenToEntry[Token(token)]
	store.RUnlock()

	if !ok {
		var err = fmt.Errorf("entry related to token %s does not found", token)
		log.Println(err)
		http.Error(w, err.Error(), http.StatusNotFound)
		return
	}

	preprocessParams, err := parsePreprocessParams(r)

	if err != nil {
		var err = fmt.Errorf("parse preprocess params: %w", err)
		log.Println(err)
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	signals, err := preprocess(entry.Signals, preprocessParams)

	if err != nil {
		var err = fmt.Errorf("preprocess: %w", err)
		log.Println(err)
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	log.Println("send response to front")
	w.Header().Set("Content-Type", "application/octet-stream")
	_, _ = w.Write(signals)
}

func handleUpload(w http.ResponseWriter, r *http.Request) {
	log.Println("handle upload")

	log.Println("parse multipart form")
	err := r.ParseMultipartForm(1_000_000)

	if err != nil {
		log.Println(err)
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	log.Println("create converter multipart writer")
	var converterRequestBody = new(bytes.Buffer)
	var converterWriter = multipart.NewWriter(converterRequestBody)

	for _, fileHeader := range r.MultipartForm.File["files[]"] {
		log.Println("create part")
		partWriter, err := converterWriter.CreatePart(fileHeader.Header)

		if err != nil {
			log.Println(err)
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		log.Println("write file content to part")
		file, _ := fileHeader.Open()
		fileContent, _ := ioutil.ReadAll(file)
		_, _ = partWriter.Write(fileContent)
	}

	_ = converterWriter.Close()

	var converterAddr, _ = GetConverterAddr()
	var contentType = converterWriter.FormDataContentType()

	log.Println("post multipart to converter", converterAddr)
	converterResponse, err := http.Post(converterAddr, contentType, converterRequestBody)

	if err != nil {
		log.Println(err)
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	defer converterResponse.Body.Close()

	log.Println("read converter response body")
	converterResponseBody, err := ioutil.ReadAll(converterResponse.Body)

	if err != nil {
		log.Println(err)
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	if converterResponse.StatusCode != http.StatusOK {
		log.Println("converter status code", converterResponse.StatusCode)
		log.Println("converter response body\n", string(converterResponseBody))
		http.Error(w, "can't convert files", http.StatusBadRequest)
		return
	}

	log.Println("create entry")
	var entry = Entry{
		Signals: converterResponseBody,
	}
	var token = Token(r.Form.Get("token"))

	store.Lock()
	if len(token) > 0 {
		delete(store.tokenToEntry, token)
		log.Println("token", token, "exists, remove related entry")
	} else {
		token = Token(uuid.New().String())
		log.Println("create new token", token)
	}
	log.Println("save entry")
	store.tokenToEntry[token] = entry
	store.Unlock()

	log.Println("create response")
	response, _ := json.Marshal(TokenResponse{Token: token})

	log.Println("send response to front")
	w.Header().Set("Content-Type", "application/json")
	_, _ = w.Write(response)
}

func handleGetAbnormalities(w http.ResponseWriter, r *http.Request) {
	log.Println("handle abnormalities")

	token, ok := mux.Vars(r)["token"]
	if !ok {
		log.Println("empty token")
		http.Error(w, "empty token", http.StatusNotFound)
		return
	}

	log.Println("load entry from store related to token", token)

	store.RLock()
	entry, ok := store.tokenToEntry[Token(token)]
	store.RUnlock()

	if !ok {
		var err = fmt.Errorf("entry related to token %s does not found", token)
		log.Println(err)
		http.Error(w, err.Error(), http.StatusNotFound)
		return
	}

	var modelAddr, _ = GetModelAddr()
	modelAddr = fmt.Sprintf("%s/predict", modelAddr)
	var contentType = "application/octet-stream"
	var modelRequestBody = bytes.NewBuffer(entry.Signals)

	log.Println("post signals to model", modelAddr)
	modelResponse, err := http.Post(modelAddr, contentType, modelRequestBody)

	if err != nil {
		log.Println(err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	defer modelResponse.Body.Close()

	log.Println("read model response body")
	modelResponseBody, err := ioutil.ReadAll(modelResponse.Body)

	if err != nil {
		log.Println(err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	if modelResponse.StatusCode != http.StatusOK {
		log.Println("model status code", modelResponse.StatusCode)
		log.Println("model response body\n", string(modelResponseBody))
		http.Error(w, string(modelResponseBody), http.StatusInternalServerError)
		return
	}

	log.Println("send response to front")
	w.Header().Set("Content-Type", "application/json")
	_, _ = w.Write(modelResponseBody)
}

func init() {
	log.SetFlags(log.Ldate | log.Ltime | log.Lshortfile)
}
