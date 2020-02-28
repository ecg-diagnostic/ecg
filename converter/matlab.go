package main

import (
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
		stdin.Write(fileContent)
	}()

	return matlabCommand.CombinedOutput()
}

func init() {
	parsers = append(parsers, parseMatlabFile)
}
