# Pytorch model + Dataset from .mat dataset

Работает сие чудо очень просто, качаем зависимости:

`pip3 install albumentations cv2 numpy scipy torch tqdm`

Скачиваем вот [отсюда](http://2018.icbeb.org/Challenge.html) все три трейнинг сета, выпиливаем из каждой папки REFERENCE.csv.
Сливаем все в одну папку `TrainingSet`, после чего вызываем `python prepare.py`,
который распилит нам данные на три части с двумя валидациями.

Дальше можно посмотреть картинки из датасета

`python Dataset.py`

Или потренировать сеть

`python train.py`
