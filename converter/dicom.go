package main

import (
	"errors"
	"os/exec"
)

func parseDicomFile(fileContent []byte) ([]byte, error) {
   dicomCommand := exec.Command("python3", "dicom.py")

	stdin, err := dicomCommand.StdinPipe()

	if err != nil {
		return nil, err
	}

	go func() {
		defer stdin.Close()
		stdin.Write(fileContent)
	}()

	output, err := dicomCommand.CombinedOutput()

	if err != nil {
		return nil, errors.New(string(output))
	}

	return output, nil
}

func init() {
	parsers = append(parsers, parseDicomFile)
}
