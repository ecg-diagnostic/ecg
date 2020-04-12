import os

import cv2
import numpy as np
import scipy.io
import torch
import tqdm
from albumentations import Compose, CenterCrop, RandomCrop
from albumentations.pytorch import ToTensorV2
from torch.utils.data import Dataset


def create_dots_tile(grid_size: int, color: tuple):
    tile = np.ones((grid_size, grid_size, 3))
    pts = np.array([
        [0, grid_size - 1],
        [0, 0],
        [grid_size - 1, 0],
    ])
    cv2.polylines(img=tile, pts=[pts], isClosed=False, color=color)
    for i in range(grid_size // 5, grid_size, grid_size // 5):
        for j in range(grid_size // 5, grid_size, grid_size // 5):
            tile[i][j] = color
    return tile


def map_signal_to_image(signal):
    signal = signal[:2500]

    grid_size = 20
    sample_rate = 500
    speed = 25

    padding_bottom = np.int32(grid_size * 4)
    padding_left = np.int32(grid_size * 1)
    padding_top = np.int32(grid_size * 4)
    padding_right = np.int32(grid_size * 1)

    height = padding_bottom + padding_top
    mm_size = grid_size / 5
    mv_size = grid_size * 2
    seconds = int(len(signal) / sample_rate)
    width = np.int32(padding_left + seconds * speed * mm_size + padding_right)

    color_black = (0, 0, 0)
    x = np.array(list(range(0, len(signal)))) / sample_rate * speed * mm_size + padding_left
    y = -signal * mv_size + padding_top
    pts = np.array(list(zip(x.astype(np.int32), y.astype(np.int32))))

    tile = create_dots_tile(grid_size, (0, 0xa5 / 0xff, 1))
    img = np.tile(tile, (height // grid_size, width // grid_size, 1))
    cv2.polylines(img=img, pts=[pts], isClosed=False, color=color_black, lineType=cv2.LINE_AA)

    return img


class EcgDataset(Dataset):
    def __init__(self, source_dir: str, transform=None):
        if transform is not None:
            self.transform = transform
        else:
            self.transform = Compose([
                CenterCrop(height=128, width=512),
                ToTensorV2(),
            ])

        self.file_names = []
        self.len = 0
        for file_name in tqdm.tqdm(os.listdir(source_dir)):
            self.file_names.append(os.path.join(source_dir, file_name))
            self.len += 1

    def __len__(self):
        return self.len

    def __getitem__(self, idx):
        mat = scipy.io.loadmat(self.file_names[idx])
        signals = mat['ECG'][0][0][2]

        lead = signals[0][:2500]
        lead_img = map_signal_to_image(lead)
        augmented = self.transform(image=lead_img)
        target = lead[::5]

        return augmented['image'].float(), torch.tensor(target).float()


if __name__ == '__main__':
    transform = Compose([
        CenterCrop(height=128, width=512),
        # RandomCrop(height=128, width=512),
        ToTensorV2(),
    ])
    dataset = EcgDataset('train', transform=None)
    tensor, signal = dataset.__getitem__(0)
    img = tensor.numpy().transpose(1, 2, 0)

    cv2.imwrite('sample.png', img * 255)

    window_name = 'ecg'
    cv2.namedWindow(window_name)
    cv2.imshow(window_name, img)
    cv2.waitKey()
    cv2.destroyWindow(window_name)
