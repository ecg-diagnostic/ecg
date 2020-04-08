package main

import (
	"fmt"
	"github.com/stretchr/testify/assert"
	"testing"
)

func GetMockOsLookupEnv(paramsMap map[string]string) func (string)(string, bool) {
	return func(arg string) (string, bool) {
		value, ok := paramsMap[arg]
		return value, ok
	}
}

func TestGetBackAddr(t *testing.T) {
	for _, tc := range []struct {
		name    string
		port interface{}
		host interface{}
	}{
		{name: "Port is valid, host is valid", port: "8080", host: "https://localhost"},
		{name: "Port is invalid, host is valid", port: nil, host: "https://localhost"},
		{name: "Port is valid, host is invalid", port: "4200", host: nil},
		{name: "Port is invalid, host is invalid", port: nil, host: nil},
	} {
		t.Run(tc.name, func(t *testing.T) {
			origLookupEnv := osLookupEnv
			origLogFatal := logFatal

			defer func() { osLookupEnv = origLookupEnv } ()
			defer func() { logFatal = origLogFatal } ()


			paramsMap := make(map[string]string)
			if tc.host != nil {
				paramsMap["BACK_HOST"] = tc.host.(string)
			}
			if tc.port != nil {
				paramsMap["BACK_PORT"] = tc.port.(string)
			}

			osLookupEnv = GetMockOsLookupEnv(paramsMap)
			var errorFromErrFatal string

			logFatal = func(v ...interface{}) {
				errorFromErrFatal = fmt.Sprint(v...)
			}
			host, port := GetBackAddr()

			if tc.port != nil && tc.host != nil {
				assert.EqualValues(t, host, fmt.Sprintf("http://%s:%s", tc.host, tc.port))
				assert.EqualValues(t, port, fmt.Sprintf(":%s", tc.port))
			}

			if tc.port == nil {
				assert.EqualValues(t, errorFromErrFatal, "environment variable BACK_PORT doesn't exist")
				return
			}

			if tc.host == nil {
				assert.EqualValues(t, errorFromErrFatal, "environment variable BACK_HOST doesn't exist")
			}
		})
	}
}

func TestGetConverterAddr(t *testing.T) {
	for _, tc := range []struct {
		name    string
		port interface{}
		host interface{}
	}{
		{name: "Port is valid, host is valid", port: "8080", host: "https://localhost"},
		{name: "Port is invalid, host is valid", port: nil, host: "https://localhost"},
		{name: "Port is valid, host is invalid", port: "4200", host: nil},
		{name: "Port is invalid, host is invalid", port: nil, host: nil},
	} {
		t.Run(tc.name, func(t *testing.T) {
			origLookupEnv := osLookupEnv
			origLogFatal := logFatal

			defer func() { osLookupEnv = origLookupEnv } ()
			defer func() { logFatal = origLogFatal } ()


			paramsMap := make(map[string]string)
			if tc.host != nil {
				paramsMap["CONVERTER_HOST"] = tc.host.(string)
			}
			if tc.port != nil {
				paramsMap["CONVERTER_PORT"] = tc.port.(string)
			}

			osLookupEnv = GetMockOsLookupEnv(paramsMap)
			var errorFromErrFatal string

			logFatal = func(v ...interface{}) {
				errorFromErrFatal = fmt.Sprint(v...)
			}
			host, port := GetConverterAddr()

			if tc.port != nil && tc.host != nil {
				assert.EqualValues(t, host, fmt.Sprintf("http://%s:%s", tc.host, tc.port))
				assert.EqualValues(t, port, fmt.Sprintf(":%s", tc.port))
			}

			if tc.port == nil {
				assert.EqualValues(t, errorFromErrFatal, "environment variable CONVERTER_PORT doesn't exist")
				return
			}

			if tc.host == nil {
				assert.EqualValues(t, errorFromErrFatal, "environment variable CONVERTER_HOST doesn't exist")
			}
		})
	}
}

func TestGetModelAddr(t *testing.T) {
	for _, tc := range []struct {
		name    string
		port interface{}
		host interface{}
	}{
		{name: "Port is valid, host is valid", port: "8080", host: "https://localhost"},
		{name: "Port is invalid, host is valid", port: nil, host: "https://localhost"},
		{name: "Port is valid, host is invalid", port: "4200", host: nil},
		{name: "Port is invalid, host is invalid", port: nil, host: nil},
	} {
		t.Run(tc.name, func(t *testing.T) {
			origLookupEnv := osLookupEnv
			origLogFatal := logFatal

			defer func() { osLookupEnv = origLookupEnv } ()
			defer func() { logFatal = origLogFatal } ()


			paramsMap := make(map[string]string)
			if tc.host != nil {
				paramsMap["MODEL_HOST"] = tc.host.(string)
			}
			if tc.port != nil {
				paramsMap["MODEL_PORT"] = tc.port.(string)
			}

			osLookupEnv = GetMockOsLookupEnv(paramsMap)
			var errorFromErrFatal string

			logFatal = func(v ...interface{}) {
				errorFromErrFatal = fmt.Sprint(v...)
			}
			host, port := GetModelAddr()

			if tc.port != nil && tc.host != nil {
				assert.EqualValues(t, host, fmt.Sprintf("http://%s:%s", tc.host, tc.port))
				assert.EqualValues(t, port, fmt.Sprintf(":%s", tc.port))
			}

			if tc.port == nil {
				assert.EqualValues(t, errorFromErrFatal, "environment variable MODEL_PORT doesn't exist")
				return
			}

			if tc.host == nil {
				assert.EqualValues(t, errorFromErrFatal, "environment variable MODEL_HOST doesn't exist")
			}
		})
	}
}
