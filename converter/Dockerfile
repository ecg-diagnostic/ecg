FROM golang:1.14-alpine AS builder
WORKDIR /converter
COPY . .
RUN apk update \
    && apk add git \
    && go get -d -v \
    && CGO_ENABLED=0 go build -o /go/bin/converter

FROM python:3.8
WORKDIR /converter
COPY --from=builder /converter/*.py ./
COPY --from=builder /converter/poetry.lock .
COPY --from=builder /converter/pyproject.toml .
COPY --from=builder /go/bin/converter /go/bin/converter
RUN apt-get update \
    && pip3 install poetry \
    && poetry install
CMD ["/go/bin/converter", "-logtostderr=true"]
