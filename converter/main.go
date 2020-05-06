package main

import (
	"errors"
	"github.com/gorilla/mux"
	"io"
	"io/ioutil"
	"log"
	"mime"
	"mime/multipart"
	"net/http"
)

var (
	errNotSupported = errors.New("format is not supported")
	parsers []func([]byte) ([]byte, error)
)

func main() {
	r := mux.NewRouter()
	r.HandleFunc("/", handleConvert).Methods("POST")
	http.Handle("/", r)

	var converterAddr, listenAddr = GetConverterAddr()
	log.Println("converter listening", converterAddr)
	err := http.ListenAndServe(listenAddr, nil)
	log.Fatal(err)
}

func handleConvert(w http.ResponseWriter, r *http.Request) {
	log.Println("handle convert")

	log.Println("parse content-type")
	contentType, params, err := mime.ParseMediaType(r.Header.Get("Content-Type"))

	if err != nil {
		log.Println(err)
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	if contentType != "multipart/form-data" {
		log.Println(http.ErrNotMultipart)
		http.Error(w, http.ErrNotMultipart.Error(), http.StatusBadRequest)
		return
	}

	log.Println("create multipart reader")
	multipartReader := multipart.NewReader(r.Body, params["boundary"])
	defer r.Body.Close()

	for {
		log.Println("create part")

		part, err := multipartReader.NextPart()
		if err == io.EOF {
			return
		} else if err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}

		partContent, err := ioutil.ReadAll(part)
		if err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}

		for _, parseFile := range parsers {
			convertedFile, err := parseFile(partContent)
			if errors.Is(err, errNotSupported) {
				continue
			}

			if err != nil {
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}

			w.Header().Set("Content-Type", "application/octet-stream")
			_, _ = w.Write(convertedFile)
			return
		}

		http.Error(w, "unknown file type", http.StatusNotFound)
		return
	}
}

func init() {
	log.SetFlags(log.Ldate | log.Ltime | log.Lshortfile)
}
