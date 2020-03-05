package main

import (
	"fmt"
	"net/http"
	"strconv"
)

func preprocess(rawSignals []byte, params preprocessParams) []byte {
	// BIND TO THE PYTHON SCRIPT
	fmt.Printf("preprocess params: %v\n", params)

	var pointsPerSignal = len(rawSignals) / 12
	var signals []byte

	for i := 0; i < 12; i++ {
		for j := 0; j < pointsPerSignal; j++ {
			// Here is a problem, use params.downsampleFactor instead
			if j%2 == 0 {
				continue
			}

			signals = append(signals, rawSignals[i*5000+j])
		}
	}

	return signals
}

func parsePreprocessParams(r *http.Request) (preprocessParams, error) {
	r.ParseForm()
	var params = preprocessParams{}

	if p, err := strconv.Atoi(r.Form.Get("downsampleFactor")); err == nil {
		params.downsampleFactor = p
	}

	if p, err := strconv.Atoi(r.Form.Get("lowerFrequencyBound")); err == nil {
		params.downsampleFactor = p
	}

	if p, err := strconv.Atoi(r.Form.Get("upperFrequencyBound")); err == nil {
		params.downsampleFactor = p
	}

	return params, nil
}
