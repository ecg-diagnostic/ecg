FROM golang:latest

WORKDIR /converter-app

COPY . .

# Build the Go app
RUN go build -o main .

# Expose port 8002 to the outside world
EXPOSE 8002

CMD ["./main"]
