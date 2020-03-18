from PIL import Image
import numpy as np

def align_image(image_path, min_angle = -120, max_angle = 120, step = 0.2):
    n_steps = int((max_angle - min_angle) / step)
    img_color = Image.open(image_path)
    img_bw = img_color.convert('L')
    
    hist = np.zeros((n_steps, np.asarray(img_bw).shape[1]))
    fill = int(np.asarray(img_bw).mean())

    for i in range(n_steps):
        img = img_bw.rotate(min_angle + step * i, fillcolor=(fill))
        img_array = np.asarray(img)
        size = np.asarray(img_array).shape
        black = (np.ones(size) * 255 - np.asarray(img_array)).astype('uint8')
        hist[i] = black.sum(axis=0)

    hist = 255 * hist / hist.max()
    stds = np.array([hist[i].std() for i in range(n_steps)])

    img_color = img_color.rotate(min_angle + step * stds.argmax(), fillcolor=(255, 255, 255))
    
    return img_color
