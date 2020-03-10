import numpy as np
import sys
import pydicom
import struct
import io

dataset = pydicom.dcmread(io.BytesIO(sys.stdin.buffer.read()))

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

sys.stdout.buffer.write(signals.tobytes())
