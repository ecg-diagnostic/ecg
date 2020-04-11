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


def luma(img):
    return 0.299 * img[:,:,0] + 0.587 * img[:,:,1] + 0.114 * img[:,:,2]


def get_groups(y):
    # threshold is darker than grid lines and brighter than the graph
    dark_threshold = (y.max() + y.min()) / 2 
    if dark_threshold > 0:
        darkest_y = np.argwhere(y < dark_threshold).T[0]
    else:
        darkest_y = np.argwhere(y == dark_threshold).T[0]

    groups = []

    for i in range(len(darkest_y)):
        if darkest_y[i] == darkest_y[i-1] + 1:
            groups[-1].append(darkest_y[i])
        else:
            groups.append([darkest_y[i]])
    
    return groups


def get_cell_size(img):
    if len(img.shape) > 2 and img.shape[2] > 1:
        img_bw = luma(img)
    elif len(img.shape) > 2 and img.shape[2] == 1:
        img_bw = img[:,:,0]
    else:
        img_bw = img

    dark_threshold = np.percentile(img_bw, 5)
    img_bw_removed_graph = np.copy(img_bw)
    for i in range(img_bw.shape[0]):
        for j in range(img_bw.shape[1]):
            if img_bw_removed_graph[i,j] < dark_threshold:
                img_bw_removed_graph[i,j] = 1

    sum_x = img_bw_removed_graph.sum(axis=0)

    grid_x = np.argwhere(sum_x < (sum_x.max() + sum_x.min()) / 2).T[0]

    current = grid_x[0]
    grid_x_single = np.array([current])
    padding = np.array([])

    for x in grid_x[1:]:
        if x - current > 1:
            padding = np.append(padding, x - grid_x_single[-1])
            grid_x_single = np.append(grid_x_single, x)
        current = x

    cell_size = padding.mean()
    return cell_size


def get_fixed_vector(mean, vector):
    result = np.copy(mean)
    n_graphs = mean.shape[0]
    for x in vector:
        i = np.argmin(np.abs(mean - x))
        result[i] = x
    return list(result.astype(np.int))


def get_signal_from_image_array(img, sec_per_cell = 0.2, px_per_sec = 500, mvolt_per_cell = 0.5):
    img_bw = luma(img)
    min_x = img_bw.min(axis=0)
    dark_threshold = (img_bw.max() + img_bw.min()) / 2 
    graph_starts_x = np.argwhere(dark_threshold > min_x).min()
    graph_ends_x = np.argwhere(dark_threshold > min_x).max()
    graph_x_range = range(graph_starts_x, graph_ends_x)
    
    groups = [get_groups(img_bw[:,x]) for x in graph_x_range] # TODO: detect end of graphs
    groups_lens = [len(group) for group in groups]
    n_graphs = stats.mode(groups_lens).mode[0]

    graph_points = []
    for x, group in zip(graph_x_range, groups):
        graph_points.append([g[np.argmin(img_bw[:,x][g])] for g in group])

    valid_points = np.array([b for b in graph_points if len(b) == n_graphs])
    valid_means = valid_points.mean(axis=0)
    
    for i in range(len(graph_points)):
        if len(graph_points[i]) != n_graphs:
            graph_points[i] = get_fixed_vector(valid_means, graph_points[i])

    graphs = np.array(graph_points)
    
    plt.figure(figsize = (20,10))
    plt.plot(graphs)
    plt.show()
    
    graphs_normalized = (graphs - graphs.T.mean(axis=1)).T

    cell_size = get_cell_size(img)
    px_per_sec_img = cell_size / sec_per_cell
    mvolt_per_px = mvolt_per_cell / cell_size
    new_points = np.arange(graphs_normalized.shape[1], step=px_per_sec_img / px_per_sec)
    graphs_normalized_scaled = mvolt_per_px * CubicSpline(np.arange(graphs_normalized.shape[1]), graphs_normalized, axis=1)(new_points)
    return graphs_normalized_scaled


def get_signal_from_image(img_path, sec_per_cell = 0.2, px_per_sec = 500, mvolt_per_cell = 0.5):
    img = plt.imread(img_path)
    return get_signal_from_image_array(img, sec_per_cell, px_per_sec, mvolt_per_cell)


output_signals = apply_filter(read_signals(), **create_settings())
sys.stdout.buffer.write(output_signals.tobytes())
