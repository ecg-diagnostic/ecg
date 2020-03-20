package main

import (
	"errors"
	"log"
	"os"
	"os/exec"
)

func parseDicomFile(fileContent []byte) ([]byte, error) {
	signature := string(fileContent[128:132])
	if signature != "DICM" {
		return nil, nil
	}

	log.Println("dicom parse started")
	dicomCommand := exec.Command("poetry", "run", "python3", "dicom.py")
	dicomCommand.Env = append(dicomCommand.Env, os.Environ()...)

	stdin, err := dicomCommand.StdinPipe()
	if err != nil {
		log.Println("dicom command stdin pipe error:\n", err.Error())
		return nil, err
	}

	go func() {
		defer stdin.Close()
		_, _ = stdin.Write(fileContent)
	}()

	output, err := dicomCommand.CombinedOutput()
	if err != nil {
		log.Println("dicom command combined output error")
		log.Println("\toutput:", string(output))
		log.Println("\terror:", err.Error())
		return nil, errors.New(string(output))
	}

	log.Println("dicom parse finished")
	return output, nil
}

func init() {
	parsers = append(parsers, parseDicomFile)
}
