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
	fmt.Printf("Backend listening %s\n", backAddr)
	err := http.ListenAndServe(listenAddr, nil)
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

	var modelAddr, _ = GetModelAddr()
	var contentType = "application/octet-stream"
	var modelRequestBody = bytes.NewBuffer(entry.Signals)

	modelResponse, err := http.Post(modelAddr, contentType, modelRequestBody)
	defer modelResponse.Body.Close()

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	modelResponseBody, err := ioutil.ReadAll(modelResponse.Body)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	if modelResponse.StatusCode != http.StatusOK {
		http.Error(w, string(modelResponseBody), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	_, _ = w.Write(modelResponseBody)
}
