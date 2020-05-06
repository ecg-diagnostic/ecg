package main

import (
	"errors"
	"log"
	"os"
	"os/exec"
	"strings"
)

var imagesFormatsTable = map[string]string{
	"\xff\xd8\xff":      "image/jpeg",
	"\x89PNG\r\n\x1a\n": "image/png",
}

func mimeFromBytes(fileContent []byte) (string, error) {
	fileContentStr := string(fileContent)

	for prefix, mime := range imagesFormatsTable {
		if strings.HasPrefix(fileContentStr, prefix) {
			return mime, nil
		}
	}

	return "", errors.New("ParseImage Format is not supported")
}

func parseImage(fileContent []byte) ([]byte, error) {
	log.Println("ParseImage Init")
	log.Println("ParseImage Getting image signature")
	_, err := mimeFromBytes(fileContent)

	if err != nil {
		log.Println("ParseImage fileContent type is not supported")
		return nil, err
	}
	log.Println("ParseImage fileContent type is supported")
	log.Println("ParseImage exec command: poetry run python3 imageConverter.py")
	imgConverterCommand := exec.Command("python3", "imageConverter.py")
	imgConverterCommand.Env = append(imgConverterCommand.Env, os.Environ()...)

	log.Println("ParseImage pipe stdin to subprocess")
	stdin, err := imgConverterCommand.StdinPipe()

	if err != nil {
		log.Println(err)
		return nil, err
	}

	go func() {
		defer stdin.Close()
		log.Println("ParseImage write file content to pipe")
		_, _ = stdin.Write(fileContent)
	}()

	log.Println("ParseImage wait combined output")
	output, err := imgConverterCommand.CombinedOutput()

	if err != nil {
		log.Println(err)
		log.Println(string(output))

		return nil, errors.New(string(output))
	}

	log.Println("ParseImage Finished Successfully")

	return output, nil
}

func init() {
	log.Println("register image parser")
	parsers = append(parsers, parseImage)
}
