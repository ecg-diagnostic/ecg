package main

import "sync"

type Token string

type Sex int
type Age int
type Signals []byte

type Entry struct {
	Age     Age
	Sex     Sex
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
