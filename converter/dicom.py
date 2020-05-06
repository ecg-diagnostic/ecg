import numpy as np
import sys
import pydicom
import struct
import io

MILLIVOLTS_TO_MICROVOLTS = 1000.0

dataset = pydicom.dcmread(io.BytesIO(sys.stdin.buffer.read()))

dicom = dataset

sequence_item = dicom.WaveformSequence[0]

assert (sequence_item.WaveformSampleInterpretation == 'SS')

channel_definitions = sequence_item.ChannelDefinitionSequence
waveform_data = sequence_item.WaveformData
channels_no = sequence_item.NumberOfWaveformChannels
samples = sequence_item.NumberOfWaveformSamples

assert channels_no == 12

unpack_fmt = '<%dh' % (len(waveform_data) / 2)
unpacked_waveform_data = struct.unpack(unpack_fmt, waveform_data)
signals = (np.asarray(unpacked_waveform_data, dtype=np.float64).reshape(
    samples, channels_no).transpose()[:, ::2] / MILLIVOLTS_TO_MICROVOLTS)

sys.stdout.buffer.write(signals.tobytes())
