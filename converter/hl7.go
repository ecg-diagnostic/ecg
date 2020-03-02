package main

import (
	"bytes"
	"encoding/binary"
	"encoding/xml"
	"errors"
	"strconv"
	"strings"
)

// Spec to implement
// http://www.amps-llc.com/uploads/2017-12-7/aECG_Implementation_Guide(1).pdf

type Document struct {
	Series  []Series `xml:"component>series"`
	XMLName xml.Name `xml:"AnnotatedECG"`
}

type Series struct {
	Code       Code        `xml:"code"`
	Components []Component `xml:"component>sequenceSet>component"`
}

type Code struct {
	Code string `xml:"code,attr"`
}

type Component struct {
	Sequence Sequence `xml:"sequence"`
}

type Sequence struct {
	Code  Code  `xml:"code"`
	Value Value `xml:"value"`
}

type Value struct {
	Digits string `xml:"digits"`
	Scale  Scale  `xml:"scale"`
}

type Scale struct {
	Value string `xml:"value,attr"`
}

func parseHL7(fileContent []byte) ([]byte, error) {
	var document Document
	err := xml.Unmarshal(fileContent, &document)
	if err != nil || document.XMLName.Local != "AnnotatedECG" {
		return nil, nil
	}

	for _, series := range document.Series {
		if series.Code.Code == "RHYTHM" {
			var signalNames = []string{
				"MDC_ECG_LEAD_I",
				"MDC_ECG_LEAD_II",
				"MDC_ECG_LEAD_III",
				"MDC_ECG_LEAD_AVR",
				"MDC_ECG_LEAD_AVL",
				"MDC_ECG_LEAD_AVF",
				"MDC_ECG_LEAD_V1",
				"MDC_ECG_LEAD_V2",
				"MDC_ECG_LEAD_V3",
				"MDC_ECG_LEAD_V4",
				"MDC_ECG_LEAD_V5",
				"MDC_ECG_LEAD_V6",
			}

			signals := make(map[string][]byte)
			for _, signalName := range signalNames {
				signals[signalName] = []byte{}
			}

			for _, component := range series.Components {
				code := component.Sequence.Code.Code

				_, isKnownSignal := signals[code]
				if !isKnownSignal {
					continue
				}

				scale, err := strconv.ParseFloat(component.Sequence.Value.Scale.Value, 8)
				if err != nil {
					return nil, err
				}

				var buf bytes.Buffer
				for _, digit := range strings.Fields(component.Sequence.Value.Digits) {
					n, err := strconv.ParseFloat(digit, 8)
					if err != nil {
						break
					}

					_ = binary.Write(&buf, binary.LittleEndian, n/255*scale)
				}

				signals[code] = buf.Bytes()
			}

			var buf bytes.Buffer
			buf.Write([]byte{0xff, 0xff})

			for _, signalBytes := range signals {
				buf.Write(signalBytes)
			}

			return buf.Bytes(), nil
		}
	}

	return nil, errors.New("no valid series found in hl7 file")
}

func init() {
	parsers = append(parsers, parseHL7)
}
