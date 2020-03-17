FROM golang:latest

WORKDIR /converter-app
#installing python and python dependencies:
RUN apt-get update && apt-get install -y python3-pip libopenblas-dev gfortran

COPY ./requirements.txt ./

RUN pip3 install scipy
RUN pip3 install -r requirements.txt

COPY . /converter-app

# Build the Go app
RUN go build -o main .

# Expose port 8002 to the outside world
EXPOSE 8002

CMD ["./main"]
