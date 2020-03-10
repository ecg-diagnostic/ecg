FROM golang:latest

WORKDIR /be-app
#installing python and python dependencies:
RUN apt-get update && apt-get install -y python3-pip
RUN apt-get install -y libopenblas-dev gfortran

COPY ./requirements.txt ./

RUN pip3 install scipy
RUN pip3 install -r requirements.txt

COPY . /be-app

# Build the Go app
RUN go get github.com/google/uuid
RUN go get github.com/gorilla/handlers
RUN go get github.com/gorilla/mux
RUN go build -o main .

# Expose port 8001 to the outside world
EXPOSE 8001

CMD ["./main"]
