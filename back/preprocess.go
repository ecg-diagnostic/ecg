package main

import (
	"errors"
	"fmt"
	"log"
	"net/http"
	"os"
	"os/exec"
	"strconv"
)

func preprocess(rawSignals []byte, p preprocessParams) ([]byte, error) {
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

func parsePreprocessParams(r *http.Request) (preprocessParams, error) {
	log.Println("parse preprocess params")

	var params = preprocessParams{}

	log.Println("parse form")
	err := r.ParseForm()

	if err != nil {
		log.Println(err)
		return params, err
	}

	parseParam(&params.floatPrecision, r, "floatPrecision")
	parseParam(&params.lowerFrequencyBound, r, "lowerFrequencyBound")
	parseParam(&params.sampleRate, r, "sampleRate")
	parseParam(&params.upperFrequencyBound, r, "upperFrequencyBound")

	return params, nil
}

func parseParam(p *int, r *http.Request, key string) {
	log.Println("parse param", key)

	if param, err := strconv.Atoi(r.Form.Get(key)); err == nil {
		*p = param
	} else {
		log.Println(err)
	}
}
