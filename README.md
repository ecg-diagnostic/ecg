# ECG Disease Classification
### Приложение для предсказания заболеваний по электрокардиограмме

![Docker Images CI](https://github.com/ecg-diagnostic/ecg/workflows/Docker%20Images%20CI/badge.svg?branch=master)
![Unit Tests](https://github.com/ecg-diagnostic/ecg/workflows/Unit%20Tests/badge.svg?branch=master)
## Description
ML Engineering Practice Project, YSDA, Nizhny Novgorod, 2020


## Project Structure

<p align="justify">
Проект <i>"Проверь свое сердце"</i> представляет собой клиент-серверное приложение, основанное на микросервисной архитектуре. Оно состоит из следующих компонентов:
</p>

- Frontend
- Backend
- [Converter](./converter/README.md)
- [Model](./model/README.md)

<p align="center">
  <img src="./images/app_architecture.png" alt="This browser doesn't support PNG file" width="40%" height="40%"/>
</p>

<p align="center">Рисунок 1. Взаимодействие компонентов</p>

<p align="justify">
Каждая компонета по большей части независима и представляет собой изолированное приложение. Так, например, компонента <code>Model</code> отвечает за автоматическую идентификацию нарушений ритма/морфологии в ЭКГ с 12 отведениями. Идентификация осуществляется посредством нейросетевого классификатора. Компонента <code>Converter</code> отвечает за преобразование входных данных пользователя (DICOM/HL7 файл или изображение) во внутренний формат приложения. Более подробное описание функционирования каждой компоненты представленно в соответствующем разделе.
</p>


## Installation
Для простого поднятия всех компонентов приложения достаточно выполнить:

`sudo docker-compose up`

Поднимутся следующие 4 докер-образа
- Frontend
- Backend
- Photo to signal encoder (ML)
- Disease Classification by ECG (ML)

Для запуска каждого модуля отдельно следует смотреть в README.md конкретного модуля
## Team

Куратор:  
[Золотых Николай Юрьевич](https://github.com/NikolaiZolotykh)  
  
Developers:
- [Антонов Дмитрий](https://github.com/Lashby8)
- [Рябикин Николай](https://github.com/ryabsky)  
- [Хлевнов Олег](https://github.com/khlevnov)  
- [Чуркин Андрей](https://github.com/2-71-churkin)
  
## Licence

