package main

import (
	"errors"
	"fmt"
	"github.com/golang/glog"
	"net/http"
	"os"
	"os/exec"
	"strconv"
)

func preprocess(rawSignals []byte, p preprocessParams) ([]byte, error) {
	glog.Infoln("preprocess")

	glog.Infoln("poetry run python3 preprocess.py")
	c := exec.Command("poetry", "run", "python3", "preprocess.py")

	c.Env = append(c.Env, os.Environ()...)
	c.Env = append(c.Env, fmt.Sprintf("floatPrecision=%d", p.floatPrecision))
	c.Env = append(c.Env, fmt.Sprintf("lowerFrequencyBound=%d", p.lowerFrequencyBound))
	c.Env = append(c.Env, fmt.Sprintf("sampleRate=%d", p.sampleRate))
	c.Env = append(c.Env, fmt.Sprintf("upperFrequencyBound=%d", p.upperFrequencyBound))

	glog.Infoln("pipe stdin to subprocess")
	stdin, err := c.StdinPipe()
	if err != nil {
		glog.Errorln(err.Error())
		return nil, err
	}

	go func() {
		defer stdin.Close()
		_, _ = stdin.Write(rawSignals)
	}()

	glog.Infoln("wait combined output")
	output, err := c.CombinedOutput()
	if err != nil {
		glog.Errorln(err.Error())
		glog.Errorln(string(output))
		return nil, errors.New(string(output))
	}

	glog.Infoln("preprocess end")
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
