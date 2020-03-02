package main

import (
	"errors"
	"os/exec"
)

func parseMatlabFile(fileContent []byte) ([]byte, error) {
	signature := string(fileContent[:8])
	if signature != "MATLAB 5" {
		return nil, nil
	}

	matlabCommand := exec.Command("python3", "matlab.py")

	stdin, err := matlabCommand.StdinPipe()
	if err != nil {
		return nil, err
	}

	go func() {
		defer stdin.Close()
		_, _ = stdin.Write(fileContent)
	}()

	output, err := matlabCommand.CombinedOutput()
	if err != nil {
		return nil, errors.New(string(output))
	}

	return output, nil
}

func init() {
	parsers = append(parsers, parseMatlabFile)
}
