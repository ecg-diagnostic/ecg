import numpy as np
import sys
import pydicom
import struct
import re

if not pydicom.misc.is_dicom:
    assert False

dataset = pydicom.dcmread(sys.stdin.buffer)
sex = 1 if dataset.PatientSex == 'M' else 0
age = int(re.sub("[^0-9]", "", dataset.PatientAge).strip("0"))

dicom = dataset

sequence_item = dicom.WaveformSequence[0]

assert (sequence_item.WaveformSampleInterpretation == 'SS')

channel_definitions = sequence_item.ChannelDefinitionSequence
wavewform_data = sequence_item.WaveformData
channels_no = sequence_item.NumberOfWaveformChannels
samples = sequence_item.NumberOfWaveformSamples

assert channels_no == 12

unpack_fmt = '<%dh' % (len(wavewform_data) / 2)
unpacked_waveform_data = struct.unpack(unpack_fmt, wavewform_data)
signals = np.asarray(unpacked_waveform_data, dtype=np.float64).reshape(
    samples, channels_no).transpose()[:, ::2]

sys.stdout.buffer.write(sex.to_bytes(1, 'little'))
sys.stdout.buffer.write(age.to_bytes(1, 'little'))
sys.stdout.buffer.write(signals.tobytes())
