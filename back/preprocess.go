package main

import (
	"errors"
	"fmt"
	"net/http"
	"os/exec"
	"strconv"
)

func preprocess(rawSignals []byte, p preprocessParams) ([]byte, error) {
	preprocessCommand := exec.Command("python3", "preprocess.py")
	preprocessCommand.Env = append(
		preprocessCommand.Env,
		fmt.Sprintf("floatPrecision=%d", p.floatPrecision),
	)
	preprocessCommand.Env = append(
		preprocessCommand.Env,
		fmt.Sprintf("lowerFrequencyBound=%d", p.lowerFrequencyBound),
	)
	preprocessCommand.Env = append(
		preprocessCommand.Env,
		fmt.Sprintf("sampleRate=%d", p.sampleRate),
	)
	preprocessCommand.Env = append(
		preprocessCommand.Env,
		fmt.Sprintf("upperFrequencyBound=%d", p.upperFrequencyBound),
	)

	stdin, err := preprocessCommand.StdinPipe()
	if err != nil {
		return nil, err
	}

	go func() {
		defer stdin.Close()
		_, _ = stdin.Write(rawSignals)
	}()

	output, err := preprocessCommand.CombinedOutput()
	if err != nil {
		return nil, errors.New(string(output))
	}

	return output, nil
}

func parsePreprocessParams(r *http.Request) (preprocessParams, error) {
	var params = preprocessParams{}

	err := r.ParseForm()
	if err != nil {
		return params, err
	}

	parseParam(&params.floatPrecision, r, "floatPrecision")
	parseParam(&params.lowerFrequencyBound, r, "lowerFrequencyBound")
	parseParam(&params.sampleRate, r, "sampleRate")
	parseParam(&params.upperFrequencyBound, r, "upperFrequencyBound")

	return params, nil
}

func parseParam(p *int, r *http.Request, key string) {
	if param, err := strconv.Atoi(r.Form.Get(key)); err == nil {
		*p = param
	}
}
