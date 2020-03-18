package environment

import (
	"fmt"
	"log"
	"os"
)

func GetBackAddr() (string, string) {
	backHost, ok := os.LookupEnv("BACK_HOST")
	if !ok {
		log.Fatal("environment variable BACK_HOST doesn't exist")
	}

	backPort, ok := os.LookupEnv("BACK_PORT")
	if !ok {
		log.Fatal("environment variable BACK_PORT doesn't exist")
	}

	return fmt.Sprintf("http://%s:%s", backHost, backPort), fmt.Sprintf(":%s", backPort)
}

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

func GetFrontAddr() (string, string) {
	frontHost, ok := os.LookupEnv("FRONT_HOST")
	if !ok {
		log.Fatal("environment variable FRONT_HOST doesn't exist")
	}

	frontPort, ok := os.LookupEnv("FRONT_PORT")
	if !ok {
		log.Fatal("environment variable FRONT_PORT doesn't exist")
	}

	return fmt.Sprintf("http://%s:%s", frontHost, frontPort), fmt.Sprintf(":%s", frontPort)
}

func GetModelAddr() (string, string) {
	modelHost, ok := os.LookupEnv("MODEL_HOST")
	if !ok {
		log.Fatal("environment variable MODEL_HOST doesn't exist")
	}

	modelPort, ok := os.LookupEnv("MODEL_PORT")
	if !ok {
		log.Fatal("environment variable MODEL_PORT doesn't exist")
	}

	return fmt.Sprintf("http://%s:%s", modelHost, modelPort), fmt.Sprintf(":%s", modelPort)
}
