import scipy.io
import sys
import tempfile

with tempfile.TemporaryFile() as file:
    file.write(sys.stdin.buffer.read())
    mat = scipy.io.loadmat(file)
    signals = mat['ECG'][0][0][2]
    sys.stdout.buffer.write(signals.tobytes())
