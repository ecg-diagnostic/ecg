package main

import (
	"fmt"
	"github.com/golang/glog"
	"os"
)

func GetConverterAddr() (string, string) {
	converterHost, ok := os.LookupEnv("CONVERTER_HOST")
	if !ok {
		glog.Fatal("environment variable CONVERTER_HOST doesn't exist")
	}

	converterPort, ok := os.LookupEnv("CONVERTER_PORT")
	if !ok {
		glog.Fatal("environment variable CONVERTER_PORT doesn't exist")
	}

	return fmt.Sprintf("http://%s:%s", converterHost, converterPort), fmt.Sprintf(":%s", converterPort)
}
