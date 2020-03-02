package main

import (
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

	return dicomCommand.CombinedOutput()
}

func init() {
	parsers = append(parsers, parseDicomFile)
}
