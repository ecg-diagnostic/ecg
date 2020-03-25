package main

import "sync"

type Token string
type Signals []byte

type Entry struct {
	Signals Signals
}

type Store struct {
	sync.RWMutex
	tokenToEntry map[Token]Entry
}

type preprocessParams struct {
	floatPrecision      int
	lowerFrequencyBound int
	sampleRate          int
	upperFrequencyBound int
}

type TokenResponse struct {
	Token Token `json:"token"`
}
