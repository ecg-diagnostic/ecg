import os
import sys

rawSignals = sys.stdin.buffer.read()
# print(f'rawSignals len: {len(rawSignals)}')

downsampleFactor = os.environ['downsampleFactor']
# print(f'downsampleFactor: {downsampleFactor}')

lowerFrequencyBound = os.environ['lowerFrequencyBound']
# print(f'lowerFrequencyBound: {lowerFrequencyBound}')

upperFrequencyBound = os.environ['upperFrequencyBound']
# print(f'upperFrequencyBound: {upperFrequencyBound}')

convertedSignals = rawSignals
print(convertedSignals)
