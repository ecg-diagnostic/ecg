package main

import (
	"io"
	"io/ioutil"
	"log"
	"mime"
	"mime/multipart"
	"net/http"
	"os/exec"
)

func main() {
	http.HandleFunc("/", handleFiles)
	err := http.ListenAndServe(":8002", nil)
	log.Fatal(err)
}

func handleFiles(w http.ResponseWriter, r *http.Request) {
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

		var convertedFile []byte
		signature := string(partBody[:8])

		switch signature {
		case "MATLAB 5":
			{
				convertedFile, err = convertMatlabFile(partBody)
				if err != nil {
					http.Error(w, err.Error(), http.StatusInternalServerError)
					return
				}
			}

		default:
			{
				http.Error(w, "unknown file type", http.StatusBadRequest)
				return
			}
		}

		w.Header().Set("Content-Type", "application/octet-stream")
		w.Write(convertedFile)
		return
	}
}

func convertMatlabFile(matlabFileContent []byte) ([]byte, error) {
	matlabCommand := exec.Command("python3", "matlab.py")
	stdin, err := matlabCommand.StdinPipe()
	if err != nil {
		return nil, err
	}

	go func() {
		defer stdin.Close()
		stdin.Write(matlabFileContent)
	}()

	return matlabCommand.Output()
}
