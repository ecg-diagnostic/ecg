from typing import List
from pydantic import BaseModel
from fastapi import FastAPI, Depends, Request
import numpy as np

from .ml.arrhythmia_classifier import leads, ArrhythmiaClassifier, get_model


class PredictResponse(BaseModel):
    prediction: List[float]


app = FastAPI()


@app.post('/predict', response_model=PredictResponse)
async def predict(request: Request, model: ArrhythmiaClassifier = Depends(get_model)):
    contents = await request.body()
    signal = np.frombuffer(contents, dtype=np.float64)
    X = signal.reshape((leads, signal.size // leads))

    prediction = np.squeeze(model.predict(X))
    response = PredictResponse(prediction=prediction.tolist())

    return response
