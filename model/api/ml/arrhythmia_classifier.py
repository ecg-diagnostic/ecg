from .qrs import QRSDetectorOffline
from typing import Dict
from os.path import join, dirname
import numpy as np

import tensorflow
from tensorflow.keras.models import model_from_json
from tensorflow.keras.preprocessing import sequence


class ArrhythmiaClassifier:
    def __init__(self, model_topology: str, model_weights: str):
        self.ECG_length = 15000
        self.sample_frequency = 500
        self.ecg_part_name = 'beats_learner'

        with open(model_topology, 'r') as json_file:
            self.model = model_from_json(json_file.read())
        self.model.load_weights(model_weights)


    def _prepare_input(self, X: np.ndarray) -> Dict[str, np.ndarray]:
        signal = np.copy(np.transpose(X))
        qrsdetector = QRSDetectorOffline(signal, self.sample_frequency, verbose=False,
                                         plot_data=False, show_plot=False)
        for i in range(signal.shape[1]):
            signal[:, i] = qrsdetector.bandpass_filter(signal[:, i], 0.5, 49.0, self.sample_frequency, 1)
        ecg = sequence.pad_sequences([signal], maxlen=self.ECG_length, dtype='float32', truncating='post')

        return {self.ecg_part_name: ecg}


    def predict(self, X: np.ndarray) -> np.ndarray:
        results = self.model.predict(self._prepare_input(X))
        return results


_model_topology = join(dirname(__file__), 'resources', 'model_topology.json')
_model_weights = join(dirname(__file__), 'resources', 'model_weights.model')
_model = ArrhythmiaClassifier(_model_topology, _model_weights)
leads = 12


def get_model():
    return _model
