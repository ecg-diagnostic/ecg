package main

import (
	"errors"
	"log"
	"os"
	"os/exec"
)

func parseMatlabFile(fileContent []byte) ([]byte, error) {
	log.Println("get dicom signature")
	signature := string(fileContent[:8])

	if signature != "MATLAB 5" {
		return nil, nil
	}

	log.Println("parse matlab file")
	log.Println("exec command: poetry run python3 matlab.py")
	matlabCommand := exec.Command("poetry", "run", "python3", "matlab.py")
	matlabCommand.Env = append(matlabCommand.Env, os.Environ()...)

	log.Println("pipe stdin to subprocess")
	stdin, err := matlabCommand.StdinPipe()

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
	output, err := matlabCommand.CombinedOutput()

	if err != nil {
		log.Println(err)
		log.Println(string(output))
		return nil, errors.New(string(output))
	}

	return output, nil
}

func init() {
	log.Println("register matlab parser")
	parsers = append(parsers, parseMatlabFile)
}
