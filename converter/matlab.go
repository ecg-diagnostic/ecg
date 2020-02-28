package main

import "os/exec"

func parseMatlabFile(fileContent []byte) ([]byte, error) {
	matlabCommand := exec.Command("python3", "matlab.py")

	stdin, err := matlabCommand.StdinPipe()
	if err != nil {
		return nil, err
	}

	go func() {
		defer stdin.Close()
		stdin.Write(fileContent)
	}()

	return matlabCommand.Output()
}

func init() {
	mapSignatureToParser["MATLAB 5"] = parseMatlabFile
}
