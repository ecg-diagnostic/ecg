FROM python:3.7

WORKDIR /model-app

COPY ./requirements.txt ./
RUN apt-get update
RUN apt-get install -y libopenblas-dev gfortran

RUN pip install scipy
RUN pip install tensorflow
RUN pip install -r requirements.txt

COPY . /model-app

CMD ["uvicorn", "api.server:app", "--host", "0.0.0.0", "--port", "80"]
