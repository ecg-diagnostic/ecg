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
COPY --from=builder /back/poetry.lock .
COPY --from=builder /back/pyproject.toml .
COPY --from=builder /back/presets ./
COPY --from=builder /go/bin/back /go/bin/back
RUN apt-get update \
    && pip3 install poetry \
    && poetry install
CMD ["/go/bin/back", "-logtostderr=true"]
