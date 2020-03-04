package main

import (
	"errors"
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
	var params = preprocessParams{}

	p := r.URL.Query().Get("downsampleFactor")
	if p, err := strconv.Atoi(p); err == nil {
		params.lowerFrequencyBound = p
	} else {
		return params, errors.New("invalid downsample factor in query")
	}

	p = r.URL.Query().Get("lowerFrequencyBound")
	if p, err := strconv.Atoi(p); err == nil {
		params.lowerFrequencyBound = p
	} else {
		return params, errors.New("invalid lower frequency bound in query")
	}

	p = r.URL.Query().Get("upperFrequencyBound")
	if p, err := strconv.Atoi(p); err == nil {
		params.upperFrequencyBound = p
	} else {
		return params, errors.New("invalid upper frequency bound in query")
	}

	return params, nil
}
