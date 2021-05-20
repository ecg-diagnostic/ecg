package preprocess

import (
	"github.com/stretchr/testify/assert"
	"net/http"
	"net/url"
	"testing"
)


func TestParsePreprocessParamsErrors(t *testing.T) {
	for _, tc := range []struct {
		name string
		req http.Request
		key string
	}{
		{name: "Error during parsing the form",
		req: http.Request{
			URL: &url.URL{
				RawQuery:   "%жйц",
			},
			Form: nil,
			PostForm: nil,
		},
		},
		{name: "Error during parsing the form - form is nil",
			req: http.Request{
				Form: nil,
				PostForm: nil,
			},
		},
		{name: "Error during parsing the form - not all fields are filled",
			req: http.Request{
				Form: url.Values{
					"floatPrecision": []string{"100"},
				},
			},
		},
		{name: "Error during parsing the form - not all fields are filled",
			req: http.Request{
				Form: url.Values{
					"floatPrecision": []string{"100"},
					"lowerFrequencyBound": []string{"100"},
				},
			},
		},
		{name: "Error during parsing the form",
			req: http.Request{
				Form: url.Values{
					"floatPrecision": []string{"100"},
					"lowerFrequencyBound": []string{"100"},
					"sampleRate": []string{"100"},
				},
			},
		},
	} {
		t.Run(tc.name, func(t *testing.T) {
			_, err := ParsePreprocessParams(&tc.req)
			assert.NotEqual(t, err, nil)
		})
	}
}

func TestParsePreprocessParams(t *testing.T) {
	req := http.Request{
		Form: url.Values{
			"floatPrecision": []string{"1"},
			"lowerFrequencyBound": []string{"2"},
			"sampleRate": []string{"3"},
			"upperFrequencyBound": []string{"4"},
		},
	}
	params, err := ParsePreprocessParams(&req)

	assert.Equal(t, err, nil)
	assert.Equal(t, params.floatPrecision, 1)
	assert.Equal(t, params.lowerFrequencyBound, 2)
	assert.Equal(t, params.sampleRate, 3)
	assert.Equal(t, params.upperFrequencyBound, 4)
}
