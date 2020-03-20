FROM golang:1.14-alpine AS builder
WORKDIR /back
COPY . .
RUN apk update \
    && apk add git \
    && go get -d -v \
    && CGO_ENABLED=0 go build -o /go/bin/back

FROM python:3.8
WORKDIR /back
COPY --from=builder /back/*.py ./
COPY --from=builder /back/pyproject.toml .
COPY --from=builder /go/bin/back /go/bin/back
RUN apt-get update \
    && apt-get install curl \
    && pip3 install poetry \
    && poetry install
EXPOSE 80
CMD ["/go/bin/back", "-logtostderr=true"]
