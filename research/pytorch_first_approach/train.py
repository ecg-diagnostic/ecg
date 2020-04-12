from collections import OrderedDict

import cv2
import numpy as np
import torch
from catalyst.dl import SupervisedRunner
from torch import nn
from torch.utils.data import DataLoader

from Dataset import create_dots_tile, EcgDataset


class Model(nn.Module):
    class Flatten(nn.Module):
        def forward(self, x: torch.Tensor):
            return x.view(x.size(0), -1)

    def __init__(self):
        super(Model, self).__init__()
        modules = [
            nn.Conv2d(in_channels=3, out_channels=32, kernel_size=3, padding=1),
            nn.BatchNorm2d(32),
            nn.ReLU(),
            nn.Conv2d(in_channels=32, out_channels=32, kernel_size=3, padding=1),
            nn.BatchNorm2d(32),
            nn.ReLU(),
            nn.MaxPool2d(2),

            nn.Conv2d(in_channels=32, out_channels=64, kernel_size=3, padding=1),
            nn.BatchNorm2d(64),
            nn.ReLU(),
            nn.Conv2d(in_channels=64, out_channels=64, kernel_size=3, padding=1),
            nn.BatchNorm2d(64),
            nn.ReLU(),
            nn.MaxPool2d(2),

            nn.Conv2d(in_channels=64, out_channels=128, kernel_size=3, padding=1),
            nn.BatchNorm2d(128),
            nn.ReLU(),
            nn.Conv2d(in_channels=128, out_channels=128, kernel_size=3, padding=1),
            nn.BatchNorm2d(128),
            nn.ReLU(),
            nn.MaxPool2d(2),

            nn.Conv2d(in_channels=128, out_channels=256, kernel_size=3, padding=1),
            nn.BatchNorm2d(256),
            nn.ReLU(),
            nn.Conv2d(in_channels=256, out_channels=256, kernel_size=3, padding=1),
            nn.BatchNorm2d(256),
            nn.ReLU(),
            nn.MaxPool2d(2),

            nn.Conv2d(in_channels=256, out_channels=512, kernel_size=3, padding=1),
            nn.BatchNorm2d(512),
            nn.ReLU(),
            nn.Conv2d(in_channels=512, out_channels=512, kernel_size=3, padding=1),
            nn.BatchNorm2d(512),
            nn.ReLU(),
            nn.MaxPool2d(2),

            nn.Conv2d(in_channels=512, out_channels=1024, kernel_size=3, padding=1),
            nn.BatchNorm2d(1024),
            nn.ReLU(),
            nn.Conv2d(in_channels=1024, out_channels=1024, kernel_size=3, padding=1),
            nn.BatchNorm2d(1024),
            nn.ReLU(),
            nn.MaxPool2d(2),

            nn.Conv2d(in_channels=1024, out_channels=2048, kernel_size=3, padding=1),
            nn.BatchNorm2d(2048),
            nn.ReLU(),
            nn.Conv2d(in_channels=2048, out_channels=2048, kernel_size=3, padding=1),
            nn.BatchNorm2d(2048),
            nn.ReLU(),
            nn.MaxPool2d(2),

            self.Flatten(),

            # nn.Linear(8192, 2048),
            # nn.BatchNorm1d(),
            # nn.ReLU(),

            # nn.Linear(2048, 1024),
            # nn.BatchNorm1d(1024),
            # nn.ReLU(),

            nn.Linear(8192, 500),
        ]
        for i, module in enumerate(modules):
            self.add_module(f'module{i}_{module._get_name()}', module)

    def forward(self, x):
        for module in self.children():
            x = module(x)
        return x


model = Model()
criterion = nn.MSELoss()
optimizer = torch.optim.Adam(model.parameters())

class CustomMSELoss(nn.Module):
    # взвесить точки, увеличив веса точек в p qrs t пиках, и уменьшить веса во всех остальных
    pass

loaders = OrderedDict({
    'train': DataLoader(EcgDataset('test'), batch_size=1),
    'valid': DataLoader(EcgDataset('val'), batch_size=1),
    # 'train': DataLoader(EcgDataset('test'), batch_size=1),
    # 'valid': DataLoader(EcgDataset('val'), batch_size=1),
})

runner = SupervisedRunner()
runner.train(
    model=model,
    criterion=criterion,
    optimizer=optimizer,
    loaders=loaders,
    logdir="./logdir",
    num_epochs=1,
    verbose=True,
)

loader_logits = runner.predict_loader(
    model=model,
    loader=DataLoader(EcgDataset('one'), batch_size=1),
    verbose=True,
)


def map_predicts_to_image(signal, predicted_signal):
    signal = signal[:500]
    if predicted_signal is not None:
        predicted_signal = predicted_signal[:500]

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
    width = np.int32(padding_left + seconds * speed * mm_size * 5 + padding_right)

    tile = create_dots_tile(grid_size, (0, 0xa5 / 0xff, 1))
    img = np.tile(tile, (height // grid_size, width // grid_size, 1))

    color_black = (0, 0, 0)
    x = np.array(list(range(0, len(signal)))) / sample_rate * speed * mm_size * 5 + padding_left
    y = -signal * mv_size + padding_top
    pts = np.array(list(zip(x.astype(np.int32), y.astype(np.int32))))
    cv2.polylines(img=img, pts=[pts], isClosed=False, color=color_black, lineType=cv2.LINE_AA)

    color_red = (0, 1, 0)
    x = np.array(list(range(0, len(predicted_signal)))) / sample_rate * speed * mm_size * 5 + padding_left
    y = -predicted_signal * mv_size + padding_top
    pts = np.array(list(zip(x.astype(np.int32), y.astype(np.int32))))
    cv2.polylines(img=img, pts=[pts], isClosed=False, color=color_red, lineType=cv2.LINE_AA)

    return img


_, target = EcgDataset('one').__getitem__(0)
img = map_predicts_to_image(target.numpy(), loader_logits[0])

window_name = 'ecg'
cv2.namedWindow(window_name)
cv2.imshow(window_name, img)
cv2.waitKey()
cv2.destroyWindow(window_name)
