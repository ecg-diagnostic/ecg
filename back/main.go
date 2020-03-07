package main

import (
	"bytes"
	"flag"
	"fmt"
	"github.com/google/uuid"
	"github.com/gorilla/handlers"
	"github.com/gorilla/mux"
	"io/ioutil"
	"log"
	"mime/multipart"
	"net/http"
	"strconv"
)

var (
	converterPort *int
	store         = Store{tokenToEntry: make(map[Token]Entry)}
)

func main() {
	r := mux.NewRouter()
	r.HandleFunc("/{token}", handleGet).Methods("GET")
	r.HandleFunc("/", handleUpload).Methods("POST")
	r.HandleFunc("/process/{token}", handleProcess).Methods("POST")
	http.Handle("/", handlers.CORS()(r))

	port := flag.Int("port", 8001, "port for listening")
	converterPort = flag.Int("converter-port", 8002, "port for converter")
	flag.Parse()

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
		Sex: Sex(resolveEntryField(converterResponseBody[:1][0], r.Form.Get("sex"))),
		Age: Age(resolveEntryField(converterResponseBody[1:2][0], r.Form.Get("age"))),
		Signals: converterResponseBody[2:],
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
	w.Header().Set("Authorization", fmt.Sprintf("Bearer %s", token))
	_, _ = w.Write(signals)
}

func resolveEntryField(fromConverter byte, fromForm string) byte {
	if fromConverter != byte(0xff) {
		return fromConverter
	}

	if i, err := strconv.Atoi(fromForm); err == nil {
		return byte(i)
	}

	return fromConverter
}

func handleProcess(w http.ResponseWriter, r *http.Request) {
	// Get entry by request token, preprocess it without downsample and send it to the model
	// After that return model predictions to the front
}
