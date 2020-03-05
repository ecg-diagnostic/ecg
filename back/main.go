package main

import (
	"bytes"
	"flag"
	"fmt"
	"io"
	"io/ioutil"
	"log"
	"mime"
	"mime/multipart"
	"net/http"
	"strconv"

	"github.com/gorilla/handlers"
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
	contentType, params, err := mime.ParseMediaType(r.Header.Get("Content-Type"))
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	if contentType != "multipart/form-data" {
		http.Error(w, http.ErrNotMultipart.Error(), http.StatusBadRequest)
		return
	}

	var multipartReader = multipart.NewReader(r.Body, params["boundary"])
	defer r.Body.Close()

	var entry = Entry{}
	var converterRequest = new(bytes.Buffer)

	var converterWriter = multipart.NewWriter(converterRequest)
	_ = converterWriter.SetBoundary(params["boundary"])

	for {
		part, err := multipartReader.NextPart()
		if err == io.EOF {
			break
		} else if err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}

		_, params, err := mime.ParseMediaType(part.Header.Get("Content-Disposition"))
		if err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}

		partContent, err := ioutil.ReadAll(part)
		if err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}

		switch params["name"] {
		case "sex":
			sex, err := strconv.Atoi(string(partContent))
			if err != nil {
				http.Error(w, err.Error(), http.StatusBadRequest)
				return
			}
			entry.Sex = Sex(sex)

		case "age":
			age, err := strconv.Atoi(string(partContent))
			if err != nil {
				http.Error(w, err.Error(), http.StatusBadRequest)
				return
			}
			entry.Age = Age(age)

		case "files[]":
			partWriter, err := converterWriter.CreatePart(part.Header)
			if err != nil {
				http.Error(w, err.Error(), http.StatusBadRequest)
				return
			}
			_, _ = partWriter.Write(partContent)

		default:
			http.Error(w, "unknown field name", http.StatusBadRequest)
			return
		}
	}

	converterWriter.Close()

	var converterUrl = fmt.Sprintf("http://localhost:%d", *converterPort)
	resp, err := http.Post(converterUrl, r.Header.Get("Content-Type"), converterRequest)
	defer resp.Body.Close()
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	if resp.StatusCode != 200 {
		http.Error(w, "invalid file format", http.StatusBadRequest)
		return
	}

	// responseBody, err := ioutil.ReadAll(resp.Body)
	// defer resp.Body.Close()
	// if err != nil {
	// 	http.Error(w, err.Error(), http.StatusBadRequest)
	// 	return
	// }
	//
	// signals := preprocess(entry.Signals, preprocessParams{})

	w.Header().Set("Content-Type", "application/octet-stream")
	fmt.Fprintf(w, "hello from backend")
	// _, _ = w.Write(signals)
}
