package main

func parseDicomFile(fileContent []byte) ([]byte, error) {
	signature := string(fileContent[128: 132])
	if signature != "DICM" {
		return nil, nil
	}

	// TODO: Start parse here
	return []byte("dicom file content"), nil
}

func init() {
	parsers = append(parsers, parseDicomFile)
}
