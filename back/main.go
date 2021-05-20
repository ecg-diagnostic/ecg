package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"github.com/ecg-diagnostic/ecg/back/environment"
	"github.com/ecg-diagnostic/ecg/back/preprocess"
	"github.com/google/uuid"
	"github.com/gorilla/mux"
	"io"
	"io/ioutil"
	"log"
	"mime/multipart"
	"net/http"
	"net/textproto"
	"os"
	"path"
	"sync"
)

type Token string
type Signals []byte

type Entry struct {
	Signals Signals
}

func NewEntry(signals Signals) *Entry {
	return &Entry{
		Signals: signals,
	}
}

type Store struct {
	sync.RWMutex
	tokenToEntry map[Token]Entry
}



type TokenResponse struct {
	Token Token `json:"token"`
}

var store = Store{tokenToEntry: make(map[Token]Entry)}

func handler(next func(w http.ResponseWriter, r *http.Request) (int, error)) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		status, err := next(w, r)
		if err != nil {
			log.Println(err.Error())
			http.Error(w, err.Error(), status)
			return
		}
	}
}

func main() {
	router := mux.NewRouter()
	router.Path("/api/presets/{class}").Methods(http.MethodGet).HandlerFunc(handler(handlePreset))
	router.Path("/api/upload").Methods(http.MethodPost).HandlerFunc(handleUpload)
	router.Path("/api/{token}").Methods(http.MethodGet).HandlerFunc(handleGet)
	router.Path("/api/{token}/predictions").Methods(http.MethodGet).HandlerFunc(handlePredictions)

	var backAddr, listenAddr = environment.GetBackAddr()
	log.Println("backend listening", backAddr)
	err := http.ListenAndServe(listenAddr, router)
	log.Fatal(err)
}

func toConverter(multipartBody *bytes.Buffer, multipartWriter *multipart.Writer) (int, error, []byte) {
	converterAddr, _ := environment.GetConverterAddr()
	contentType := multipartWriter.FormDataContentType()

	response, err := http.Post(converterAddr, contentType, multipartBody)
	if err != nil {
		return http.StatusBadRequest, err, nil
	}
	defer response.Body.Close()
	log.Println("sent request with multipart/form-data to converter at ", converterAddr)

	body, err := ioutil.ReadAll(response.Body)
	if err != nil {
		return http.StatusBadRequest, err, nil
	}

	if response.StatusCode != http.StatusOK {
		return response.StatusCode, fmt.Errorf("converter response: %s\n%s", response.Status, body), nil
	}
	log.Println("converter response status:", response.Status)

	return http.StatusOK, nil, body
}

func writeToken(w http.ResponseWriter, token Token)  {
	response, _ := json.Marshal(TokenResponse{Token: token})
	w.Header().Set("Content-Type", "application/json")
	_, _ = w.Write(response)

	log.Println("sent response to front")
}

func handlePreset(w http.ResponseWriter, r *http.Request) (int, error) {
	log.Println("handle preset")

	class, ok := mux.Vars(r)["class"]
	if !ok {
		return http.StatusNotFound, fmt.Errorf("failed to found 'class' param in url.Path")
	}

	classToPresetFileName := map[string]string{
		"1": "A1961.mat",
		"2": "A1957.mat",
		"3": "A0042.mat",
		"4": "A0057.mat",
		"5": "A0022.mat",
		"6": "A0108.mat",
		"7": "A0012.mat",
		"8": "A0060.mat",
		"9": "A1960.mat",
	}

	presetFileName, ok := classToPresetFileName[class]
	presetFilePath := path.Join("presets", presetFileName)
	if !ok {
		return http.StatusNotFound, fmt.Errorf("invalid preset class: %s", class)
	}

	f, err := os.Open(presetFilePath)
	if err != nil {
		return http.StatusInternalServerError, fmt.Errorf("failed to open %s", presetFilePath)
	}

	log.Println("opened " + presetFilePath)
	requestBody := &bytes.Buffer{}
	multipartWriter := multipart.NewWriter(requestBody)

	partWriter, err := multipartWriter.CreatePart(textproto.MIMEHeader{})
	if err != nil {
		return http.StatusInternalServerError, err
	}

	_, err = io.Copy(partWriter, f)
	if err != nil {
		return http.StatusInternalServerError, err
	}

	err = multipartWriter.Close()
	if err != nil {
		return http.StatusInternalServerError, err
	}

	status, err, signals := toConverter(requestBody, multipartWriter)
	if err != nil {
		return status, err
	}

	store.Lock()
	token := Token(class)
	store.tokenToEntry[token] = *NewEntry(signals)
	store.Unlock()

	writeToken(w, token)
	return http.StatusOK, nil
}

func handleGet(w http.ResponseWriter, r *http.Request) {
	log.Println("handle get")

	token, ok := mux.Vars(r)["token"]
	if !ok {
		log.Println("empty token")
		http.Error(w, "empty token", http.StatusNotFound)
		return
	}

	log.Println("load entry from store related to token", token)

	store.RLock()
	entry, ok := store.tokenToEntry[Token(token)]
	store.RUnlock()

	if !ok {
		var err = fmt.Errorf("entry related to token %s does not found", token)
		log.Println(err)
		http.Error(w, err.Error(), http.StatusNotFound)
		return
	}

	preprocessParams, err := preprocess.ParsePreprocessParams(r)

	if err != nil {
		var err = fmt.Errorf("parse preprocess params: %w", err)
		log.Println(err)
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	signals, err := preprocess.Preprocess(entry.Signals, preprocessParams)

	if err != nil {
		var err = fmt.Errorf("preprocess: %w", err)
		log.Println(err)
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	log.Println("send response to front")
	w.Header().Set("Content-Type", "application/octet-stream")
	_, _ = w.Write(signals)
}

func handleUpload(w http.ResponseWriter, r *http.Request) {
	log.Println("handle upload")

	log.Println("parse multipart form")
	err := r.ParseMultipartForm(1_000_000)

	if err != nil {
		log.Println(err)
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	log.Println("create converter multipart writer")
	requestBody := &bytes.Buffer{}
	multipartWriter := multipart.NewWriter(requestBody)

	for _, fileHeader := range r.MultipartForm.File["files[]"] {
		log.Println("create part")
		partWriter, err := multipartWriter.CreatePart(fileHeader.Header)

		if err != nil {
			log.Println(err)
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		log.Println("write file content to part")
		file, _ := fileHeader.Open()
		fileContent, _ := ioutil.ReadAll(file)
		_, _ = partWriter.Write(fileContent)
	}

	_ = multipartWriter.Close()

	status, err, signals := toConverter(requestBody, multipartWriter)
	if err != nil {
		log.Println(err)
		http.Error(w, err.Error(), status)
		return
	}

	log.Println("create entry")
	token := Token(r.Form.Get("token"))

	store.Lock()
	if len(token) > 0 {
		delete(store.tokenToEntry, token)
		log.Println("token", token, "exists, remove related entry")
	} else {
		token = Token(uuid.New().String())
		log.Println("create new token", token)
	}
	log.Println("save entry")
	store.tokenToEntry[token] = *NewEntry(signals)
	store.Unlock()

	log.Println("create response")
	response, _ := json.Marshal(TokenResponse{Token: token})

	log.Println("send response to front")
	w.Header().Set("Content-Type", "application/json")
	_, _ = w.Write(response)
}

func handlePredictions(w http.ResponseWriter, r *http.Request) {
	log.Println("handle abnormalities")

	token, ok := mux.Vars(r)["token"]
	if !ok {
		log.Println("empty token")
		http.Error(w, "empty token", http.StatusNotFound)
		return
	}

	log.Println("load entry from store related to token", token)

	store.RLock()
	entry, ok := store.tokenToEntry[Token(token)]
	store.RUnlock()

	if !ok {
		var err = fmt.Errorf("entry related to token %s does not found", token)
		log.Println(err)
		http.Error(w, err.Error(), http.StatusNotFound)
		return
	}

	var modelAddr, _ = environment.GetModelAddr()
	modelAddr = fmt.Sprintf("%s/predict", modelAddr)
	var contentType = "application/octet-stream"
	var modelRequestBody = bytes.NewBuffer(entry.Signals)

	log.Println("post signals to model", modelAddr)
	modelResponse, err := http.Post(modelAddr, contentType, modelRequestBody)

	if err != nil {
		log.Println(err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	defer modelResponse.Body.Close()

	log.Println("read model response body")
	modelResponseBody, err := ioutil.ReadAll(modelResponse.Body)

	if err != nil {
		log.Println(err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	if modelResponse.StatusCode != http.StatusOK {
		log.Println("model status code", modelResponse.StatusCode)
		log.Println("model response body\n", string(modelResponseBody))
		http.Error(w, string(modelResponseBody), http.StatusInternalServerError)
		return
	}

	log.Println("send response to front")
	w.Header().Set("Content-Type", "application/json")
	_, _ = w.Write(modelResponseBody)
}

func init() {
	log.SetFlags(log.Ldate | log.Ltime | log.Lshortfile)
}
