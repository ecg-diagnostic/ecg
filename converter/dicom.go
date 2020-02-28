package main

func parseDicomFile(fileContent []byte) ([]byte, error) {
	return nil, nil
}

func init() {
	mapSignatureToParser["DICM"] = parseDicomFile
}
