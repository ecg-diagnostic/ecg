from typing import List
from pydantic import BaseModel
from fastapi import FastAPI, File, UploadFile, Depends
import numpy as np

from .ml.arrhythmia_classifier import leads, ArrhythmiaClassifier, get_model


class PredictResponse(BaseModel):
    prediction: List[float]


app = FastAPI()


@app.post('/predict', response_model=PredictResponse)
def predict(ecg_bin: UploadFile = File(...), model: ArrhythmiaClassifier = Depends(get_model)):
    contents = ecg_bin.file.read()
    signal = np.frombuffer(contents, dtype=np.float64)
    X = signal.reshape((leads, signal.size // leads))

    prediction = np.squeeze(model.predict(X))
    response = PredictResponse(prediction=prediction.tolist())

    return response
