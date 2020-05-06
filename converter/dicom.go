package main

import (
	"errors"
	"log"
	"os"
	"os/exec"
)

func parseDicomFile(fileContent []byte) ([]byte, error) {
	log.Println("get dicom signature")
	signature := string(fileContent[128:132])

	if signature != "DICM" {
		return nil, errNotSupported
	}

	log.Println("parse dicom file")
	log.Println("exec command: poetry run python3 dicom.py")
	dicomCommand := exec.Command("poetry", "run", "python3", "dicom.py")
	dicomCommand.Env = append(dicomCommand.Env, os.Environ()...)

	log.Println("pipe stdin to subprocess")
	stdin, err := dicomCommand.StdinPipe()

	if err != nil {
		log.Println(err)
		return nil, err
	}

	go func() {
		defer stdin.Close()
		log.Println("write file content to pipe")
		_, _ = stdin.Write(fileContent)
	}()

	log.Println("wait combined output")
	output, err := dicomCommand.CombinedOutput()

	if err != nil {
		log.Println(err)
		log.Println(string(output))
		return nil, errors.New(string(output))
	}

	return output, nil
}

func init() {
	log.Println("register dicom parser")
	parsers = append(parsers, parseDicomFile)
}
