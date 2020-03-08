import scipy.io
import sys
import os
import numpy as np
from scipy.interpolate import CubicSpline
from scipy import signal

def butter_lowpass_filter(data, cutoff, fs, order=3):
    normal_cutoff = cutoff / fs
    if normal_cutoff < 1:
        b, a = signal.butter(order, normal_cutoff, btype='low', analog=False)
        return signal.filtfilt(b, a, data)
    else:
        return data

def to_precision(x, precision):
    if precision == '16':
        return x.astype(np.float16)
    if precision == '32':
        return x.astype(np.float32)
    if precision == '64':
        return x.astype(np.float64)
    return x

def apply_filter(rawSignals, rawSampleRate, sampleRate, floatPrecison, lowerFrequencyBound, upperFrequencyBound):
    x = butter_lowpass_filter(rawSignals, upperFrequencyBound, rawSampleRate)
    new_points = np.arange(x.shape[1], step = rawSampleRate / sampleRate)
    x = CubicSpline(np.arange(x.shape[1]), x, axis=1)(new_points)
    x = to_precision(x, floatPrecison)
    return x

rawSampleRate = 500
rawSignals = sys.stdin.buffer.read()
convertedSignals = apply_filter(rawSignals, rawSampleRate, os.environ['sampleRate'], os.environ['floatPrecison'], os.environ['lowerFrequencyBound'], os.environ['upperFrequencyBound'])
sys.stdout.buffer.write(convertedSignals.tobytes())
