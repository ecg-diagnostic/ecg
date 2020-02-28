import scipy.io
import sys
import tempfile

with tempfile.TemporaryFile() as file:
    file.write(sys.stdin.buffer.read())

    mat = scipy.io.loadmat(file)
    sex = 1 if mat['ECG'][0][0][0][0] == 'Male' else 0
    age = mat['ECG'][0][0][1][0][0].item()
    signals = mat['ECG'][0][0][2]

    sys.stdout.buffer.write(sex.to_bytes(1, 'little'))
    sys.stdout.buffer.write(age.to_bytes(1, 'little'))
    sys.stdout.buffer.write(signals.tobytes())
