package main

import (
	"fmt"
	"io"
	"io/ioutil"
	"log"
	"mime"
	"mime/multipart"
	"net/http"
)

var parsers []func([]byte) ([]byte, error)

func main() {
	http.HandleFunc("/", handle)

	var converterAddr, listenAddr = GetConverterAddr()
	fmt.Printf("Converter listening %s\n", converterAddr)
	err := http.ListenAndServe(listenAddr, nil)
	log.Fatal(err)
}

func handle(w http.ResponseWriter, r *http.Request) {
	if r.Method != "POST" {
		http.Error(w, "invalid method", http.StatusMethodNotAllowed)
		return
	}

	contentType, params, err := mime.ParseMediaType(r.Header.Get("Content-Type"))
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	if contentType != "multipart/form-data" {
		http.Error(w, http.ErrNotMultipart.Error(), http.StatusBadRequest)
		return
	}

	multipartReader := multipart.NewReader(r.Body, params["boundary"])
	defer r.Body.Close()

	for {
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
			if err != nil {
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}

			if convertedFile == nil {
				continue
			}

			w.Header().Set("Content-Type", "application/octet-stream")
			_, _ = w.Write(convertedFile)
			return
		}

		http.Error(w, "unknown file type", http.StatusNotFound)
		return
	}
}
