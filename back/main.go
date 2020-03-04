package main

import (
	"flag"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"

	"github.com/gorilla/mux"
)

var (
	converterPort *int
	store         Store
)

func main() {
	r := mux.NewRouter()
	r.HandleFunc("/{token}", handleGet).Methods("GET")
	r.HandleFunc("/", handleUpload).Methods("POST")
	r.HandleFunc("/process", handleProcess).Methods("POST")
	http.Handle("/", r)

	port := flag.Int("port", 8001, "port for listening")
	converterPort = flag.Int("converter-port", 8002, "port for converter")
	flag.Parse()

	err := http.ListenAndServe(fmt.Sprintf(":%d", *port), nil)
	log.Fatal(err)
}

func handleGet(w http.ResponseWriter, r *http.Request) {
	token, ok := mux.Vars(r)["token"]
	if !ok {
		http.Error(w, "empty token", http.StatusBadRequest)
		return
	}

	preprocessParams, err := parsePreprocessParams(r)
	if err != nil {
		http.Error(w, "invalid query params", http.StatusBadRequest)
		return
	}

	store.RLock()
	entry, ok := store.tokenToEntry[Token(token)]
	store.RUnlock()

	if !ok {
		http.Error(w, fmt.Sprintf("entry with token %s not found", token), http.StatusNotFound)
		return
	}

	signals := preprocess(entry.Signals, preprocessParams)

	w.Header().Set("Content-Type", "application/octet-stream")
	_, _ = w.Write(signals)
}

func handleProcess(w http.ResponseWriter, r *http.Request) {
	//
}

func handleUpload(w http.ResponseWriter, r *http.Request) {
	if r.Method != "POST" {
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var converterUrl = fmt.Sprintf("http://localhost:%d", *converterPort)
	resp, err := http.Post(converterUrl, r.Header.Get("Content-Type"), r.Body)
	defer resp.Body.Close()
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	if resp.StatusCode != 200 {
		http.Error(w, "invalid file format", http.StatusBadRequest)
		return
	}

	_, err = ioutil.ReadAll(resp.Body)
	defer resp.Body.Close()
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	var entry = Entry{}

	var params = preprocessParams{}
	signals := preprocess(entry.Signals, params)

	w.Header().Set("Content-Type", "application/octet-stream")
	_, _ = w.Write(signals)
}
