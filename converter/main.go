package main

import (
	"io"
	"io/ioutil"
	"log"
	"mime"
	"mime/multipart"
	"net/http"
)

var mapSignatureToParser = make(map[string]func([]byte) ([]byte, error))

func main() {
	http.HandleFunc("/", handle)
	err := http.ListenAndServe(":8002", nil)
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
		http.Error(w, "invalid content-type", http.StatusBadRequest)
		return
	}

	multipartReader := multipart.NewReader(r.Body, params["boundary"])
	defer r.Body.Close()

	for {
		part, err := multipartReader.NextPart()
		if err == io.EOF {
			return
		}
		if err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}

		partBody, err := ioutil.ReadAll(part)
		if err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}

		signature := string(partBody[:8])
		parseFile, isParserFound := mapSignatureToParser[signature]
		if !isParserFound {
			http.Error(w, "unknown file type", http.StatusInternalServerError)
			return
		}

		convertedFile, err := parseFile(partBody)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/octet-stream")
		w.Write(convertedFile)
		return
	}
}
