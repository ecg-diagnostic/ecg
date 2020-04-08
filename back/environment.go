package main

import (
	"fmt"
	"log"
	"os"
)

var osLookupEnv = os.LookupEnv
var logFatal = log.Fatal

func GetBackAddr() (string, string) {
	backHost, ok := osLookupEnv("BACK_HOST")
	if !ok {
		logFatal("environment variable BACK_HOST doesn't exist")
	}

	backPort, ok := osLookupEnv("BACK_PORT")
	if !ok {
		logFatal("environment variable BACK_PORT doesn't exist")
	}

	return fmt.Sprintf("http://%s:%s", backHost, backPort), fmt.Sprintf(":%s", backPort)
}

func GetConverterAddr() (string, string) {
	converterHost, ok := osLookupEnv("CONVERTER_HOST")
	if !ok {
		logFatal("environment variable CONVERTER_HOST doesn't exist")
	}

	converterPort, ok := osLookupEnv("CONVERTER_PORT")
	if !ok {
		logFatal("environment variable CONVERTER_PORT doesn't exist")
	}

	return fmt.Sprintf("http://%s:%s", converterHost, converterPort), fmt.Sprintf(":%s", converterPort)
}

func GetModelAddr() (string, string) {
	modelHost, ok := osLookupEnv("MODEL_HOST")
	if !ok {
		logFatal("environment variable MODEL_HOST doesn't exist")
	}

	modelPort, ok := osLookupEnv("MODEL_PORT")
	if !ok {
		logFatal("environment variable MODEL_PORT doesn't exist")
	}

	return fmt.Sprintf("http://%s:%s", modelHost, modelPort), fmt.Sprintf(":%s", modelPort)
}
