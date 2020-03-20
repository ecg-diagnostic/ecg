package main

import (
	"bytes"
	"encoding/json"
	"flag"
	"fmt"
	"github.com/golang/glog"
	"github.com/google/uuid"
	"github.com/gorilla/mux"
	"io/ioutil"
	"mime/multipart"
	"net/http"
)

var store = Store{tokenToEntry: make(map[Token]Entry)}

func main() {
	flag.Parse()

	r := mux.NewRouter()
	r.HandleFunc("/api/upload", handleUpload).Methods("POST")
	r.HandleFunc("/api/{token}", handleGet).Methods("GET")
	r.HandleFunc("/api/{token}/abnormalities", handleGetAbnormalities).Methods("GET")
	http.Handle("/", r)

	var backAddr, listenAddr = GetBackAddr()
	fmt.Printf("Backend listening %s\n", backAddr)
	err := http.ListenAndServe(listenAddr, nil)
	glog.Fatal(err)
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

	var converterAddr, _ = GetConverterAddr()
	var contentType = converterWriter.FormDataContentType()

	converterResponse, err := http.Post(converterAddr, contentType, converterRequestBody)
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
	glog.Infoln("handle abnormalities")

	token, ok := mux.Vars(r)["token"]
	if !ok {
		glog.Infoln("empty token")
		http.Error(w, "empty token", http.StatusNotFound)
		return
	}

	glog.Infoln("token", token)
	glog.Infoln("load entry from store")

	store.RLock()
	entry, ok := store.tokenToEntry[Token(token)]
	store.RUnlock()

	if !ok {
		var message = fmt.Sprintf("entry with token %s not found", token)
		glog.Error(message)
		http.Error(w, message, http.StatusNotFound)
		return
	}

	var modelAddr, _ = GetModelAddr()
	modelAddr = fmt.Sprintf("%s/predict", modelAddr)
	var contentType = "application/octet-stream"
	var modelRequestBody = bytes.NewBuffer(entry.Signals)

	glog.Infoln("send request to model")
	modelResponse, err := http.Post(modelAddr, contentType, modelRequestBody)
	defer modelResponse.Body.Close()

	if err != nil {
		glog.Errorln(err.Error())
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	glog.Infoln("read model response body")
	modelResponseBody, err := ioutil.ReadAll(modelResponse.Body)

	if err != nil {
		glog.Errorln(err.Error())
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	if modelResponse.StatusCode != http.StatusOK {
		glog.Errorln("model status code", modelResponse.StatusCode)
		glog.Errorln("model response body\n", string(modelResponseBody))
		http.Error(w, string(modelResponseBody), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	_, _ = w.Write(modelResponseBody)

	glog.Infoln("handle abnormalities end")
}
