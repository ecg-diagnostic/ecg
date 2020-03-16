package main

import (
	"bytes"
	"encoding/json"
	"flag"
	"fmt"
	"github.com/google/uuid"
	"github.com/gorilla/handlers"
	"github.com/gorilla/mux"
	"io/ioutil"
	"log"
	"mime/multipart"
	"net/http"
)

var (
	converterPort *int
	modelPort     *int
	store         = Store{tokenToEntry: make(map[Token]Entry)}
)

func main() {
	r := mux.NewRouter()
	r.HandleFunc("/{token}", handleGet).Methods("GET")
	r.HandleFunc("/", handleUpload).Methods("POST")
	r.HandleFunc("/abnormalities/{token}", handleGetAbnormalities).Methods("POST")
	http.Handle("/", handlers.CORS()(r))

	port := flag.Int("port", 8001, "port for listening")
	converterPort = flag.Int("converter-port", 8002, "port for converter")
	modelPort = flag.Int("model-port", 8003, "port for model")
	flag.Parse()

	fmt.Printf("Backend listening :%d\n", *port)
	err := http.ListenAndServe(fmt.Sprintf(":%d", *port), nil)
	log.Fatal(err)
}

func handleGet(w http.ResponseWriter, r *http.Request) {
	token, ok := mux.Vars(r)["token"]
	if !ok {
		http.Error(w, "empty token", http.StatusNotFound)
		return
	}

	store.RLock()
	entry, ok := store.tokenToEntry[Token(token)]
	store.RUnlock()

	if !ok {
		http.Error(w, fmt.Sprintf("entry with token %s not found", token), http.StatusNotFound)
		return
	}

	preprocessParams, err := parsePreprocessParams(r)
	if err != nil {
		http.Error(w, fmt.Errorf("parse preprocess params: %w", err).Error(), http.StatusBadRequest)
		return
	}

	signals, err := preprocess(entry.Signals, preprocessParams)
	if err != nil {
		http.Error(w, fmt.Errorf("preprocess: %w", err).Error(), http.StatusBadRequest)
		return
	}

	w.Header().Set("Content-Type", "application/octet-stream")
	_, _ = w.Write(signals)
}

func handleUpload(w http.ResponseWriter, r *http.Request) {
	err := r.ParseMultipartForm(1_000_000)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	var converterRequestBody = new(bytes.Buffer)
	var converterWriter = multipart.NewWriter(converterRequestBody)

	for _, fileHeader := range r.MultipartForm.File["files[]"] {
		partWriter, err := converterWriter.CreatePart(fileHeader.Header)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		file, _ := fileHeader.Open()
		fileContent, _ := ioutil.ReadAll(file)
		_, _ = partWriter.Write(fileContent)
	}

	_ = converterWriter.Close()

	var converterUrl = fmt.Sprintf("http://localhost:%d", *converterPort)
	var contentType = converterWriter.FormDataContentType()

	converterResponse, err := http.Post(converterUrl, contentType, converterRequestBody)
	defer converterResponse.Body.Close()

	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	if converterResponse.StatusCode != http.StatusOK {
		http.Error(w, "invalid file format", http.StatusBadRequest)
		return
	}

	converterResponseBody, err := ioutil.ReadAll(converterResponse.Body)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	var entry = Entry{
		Signals: converterResponseBody,
	}

	var token = Token(r.Form.Get("token"))

	store.Lock()
	if len(token) > 0 {
		delete(store.tokenToEntry, token)
	} else {
		token = Token(uuid.New().String())
	}
	store.tokenToEntry[token] = entry
	store.Unlock()

	response, _ := json.Marshal(TokenResponse{Token: token})

	w.Header().Set("Content-Type", "application/json")
	_, _ = w.Write(response)
}

func handleGetAbnormalities(w http.ResponseWriter, r *http.Request) {
	token, ok := mux.Vars(r)["token"]
	if !ok {
		http.Error(w, "empty token", http.StatusNotFound)
		return
	}

	store.RLock()
	entry, ok := store.tokenToEntry[Token(token)]
	store.RUnlock()

	if !ok {
		http.Error(w, fmt.Sprintf("entry with token %s not found", token), http.StatusNotFound)
		return
	}

	var modelUrl = fmt.Sprintf("http://localhost:%d", *modelPort)
	var contentType = "application/octet-stream"
	var modelRequestBody = bytes.NewBuffer(entry.Signals)

	modelResponse, err := http.Post(modelUrl, contentType, modelRequestBody)
	defer modelResponse.Body.Close()

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	if modelResponse.StatusCode != http.StatusOK {
		var message = fmt.Sprintf("can't read signals with token %s in model", token)
		http.Error(w, message, http.StatusInternalServerError)
		return
	}

	modelResponseBody, err := ioutil.ReadAll(modelResponse.Body)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	_, _ = w.Write(modelResponseBody)
}
