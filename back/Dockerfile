FROM golang:alpine AS builder
WORKDIR /back
COPY . .
RUN apk update \
    && apk add git \
    && go get -d -v \
    && go build -o /go/bin/back

FROM python:alpine
WORKDIR /back
COPY --from=builder /back .
COPY --from=builder /go/bin/back .
RUN apk update \
    && apk add openblas-dev gfortran \
    && pip3 install pipenv \
    && export LC_ALL=C.UTF-8 \
    && export LANG=C.UTF-8 \
    && pipenv install --ignore-pipfile
CMD ["./back"]
