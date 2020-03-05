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
	downsampleFactor    int
	lowerFrequencyBound int
	upperFrequencyBound int
}
