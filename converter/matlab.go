package main

import (
	"errors"
	"log"
	"os"
	"os/exec"
)

func parseMatlabFile(fileContent []byte) ([]byte, error) {
	signature := string(fileContent[:8])
	if signature != "MATLAB 5" {
		return nil, nil
	}

	log.Println("matlab parse started")
	matlabCommand := exec.Command("poetry", "run", "python3", "matlab.py")
	matlabCommand.Env = append(matlabCommand.Env, os.Environ()...)

	stdin, err := matlabCommand.StdinPipe()
	if err != nil {
		log.Println("matlab command stdin pipe error:\n", err.Error())
		return nil, err
	}

	go func() {
		defer stdin.Close()
		_, _ = stdin.Write(fileContent)
	}()

	output, err := matlabCommand.CombinedOutput()
	if err != nil {
		log.Println("matlab command combined output error")
		log.Println("\toutput:", string(output))
		log.Println("\terror:", err.Error())
		return nil, errors.New(string(output))
	}

	log.Println("matlab parse finished")
	return output, nil
}

func init() {
	parsers = append(parsers, parseMatlabFile)
}
