import os
import sys
import numpy as np
from scipy import signal
from scipy.interpolate import CubicSpline


def butter_lowpass_filter(data, cutoff, fs, order=3):
    normal_cutoff = cutoff / fs
    if normal_cutoff < 1:
        b, a = signal.butter(order, normal_cutoff, btype='low', analog=False)
        return signal.filtfilt(b, a, data)
    else:
        return data


def apply_filter(input_signals, float_precision, input_sample_rate,
                 output_sample_rate, lower_frequency_bound, upper_frequency_bound):
    x = butter_lowpass_filter(input_signals, upper_frequency_bound, input_sample_rate)
    new_points = np.arange(x.shape[1], step=input_sample_rate / output_sample_rate)
    x = CubicSpline(np.arange(x.shape[1]), x, axis=1)(new_points)
    x = x.astype(float_precision)
    return x


def create_settings():
    if 'floatPrecision' not in os.environ:
        float_precision = np.float32
    else:
        float_precision = int(os.environ['floatPrecision'])
        if float_precision not in [32, 64]:
            raise Exception(f'invalid float precision: {float_precision}')

    return {
        'float_precision': np.float32 if float_precision == 32 else np.float64,
        'input_sample_rate': 500,
        'output_sample_rate': int(os.environ['sampleRate']),
        'lower_frequency_bound': int(os.environ['lowerFrequencyBound']),
        'upper_frequency_bound': int(os.environ['upperFrequencyBound']),
    }


def read_signals():
    input_bytes = sys.stdin.buffer.read()
    return np.frombuffer(input_bytes, dtype=np.float64)\
        .reshape(12, len(input_bytes) // (12 * np.dtype(np.float64).itemsize))


output_signals = apply_filter(read_signals(), **create_settings())
sys.stdout.buffer.write(output_signals.tobytes())
