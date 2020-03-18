package main

import (
	"fmt"
	"log"
	"os"
)

func GetConverterAddr() (string, string) {
	converterHost, ok := os.LookupEnv("CONVERTER_HOST")
	if !ok {
		log.Fatal("environment variable CONVERTER_HOST doesn't exist")
	}

	converterPort, ok := os.LookupEnv("CONVERTER_PORT")
	if !ok {
		log.Fatal("environment variable CONVERTER_PORT doesn't exist")
	}

	return fmt.Sprintf("http://%s:%s", converterHost, converterPort), fmt.Sprintf(":%s", converterPort)
}
