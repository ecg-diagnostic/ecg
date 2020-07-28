package preprocess

import (
	"errors"
	"fmt"
	"log"
	"net/http"
	"os"
	"os/exec"
	"strconv"
)

type Params struct {
	floatPrecision      int
	lowerFrequencyBound int
	sampleRate          int
	upperFrequencyBound int
}

func Preprocess(rawSignals []byte, p Params) ([]byte, error) {
	log.Println("preprocess")

	log.Println("exec command: poetry run python3 preprocess.py")
	c := exec.Command("poetry", "run", "python3", "preprocess.py")

	c.Env = append(c.Env, os.Environ()...)
	c.Env = append(c.Env, fmt.Sprintf("floatPrecision=%d", p.floatPrecision))
	c.Env = append(c.Env, fmt.Sprintf("lowerFrequencyBound=%d", p.lowerFrequencyBound))
	c.Env = append(c.Env, fmt.Sprintf("sampleRate=%d", p.sampleRate))
	c.Env = append(c.Env, fmt.Sprintf("upperFrequencyBound=%d", p.upperFrequencyBound))

	log.Println("pipe stdin to subprocess")
	stdin, err := c.StdinPipe()
	if err != nil {
		log.Println(err)
		return nil, err
	}

	go func() {
		defer stdin.Close()
		log.Println("write raw signals to pipe")
		_, _ = stdin.Write(rawSignals)
	}()

	log.Println("wait combined output")
	output, err := c.CombinedOutput()

	if err != nil {
		log.Println(err)
		log.Println(string(output))
		return nil, errors.New(string(output))
	}

	return output, nil
}

func ParsePreprocessParams(r *http.Request) (Params, error) {
	log.Println("parse preprocess params")

	var params = Params{}

	log.Println("parse form")
	err := r.ParseForm()

	if err != nil {
		log.Println(err)
		return params, err
	}

	params.floatPrecision, err = strconv.Atoi(r.Form.Get("floatPrecision"))
	if err != nil {
		return params, err
	}

	params.lowerFrequencyBound, err = strconv.Atoi(r.Form.Get("lowerFrequencyBound"))
	if err != nil {
		return params, err
	}

	params.sampleRate, err = strconv.Atoi(r.Form.Get("sampleRate"))
	if err != nil {
		return params, err
	}

	params.upperFrequencyBound, err = strconv.Atoi(r.Form.Get("upperFrequencyBound"))
	if err != nil {
		return params, err
	}

	return params, nil
}
