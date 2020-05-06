# Проверь свое сердце
*Приложение для предсказания заболеваний по электрокардиограмме*

![Docker Images CI](https://github.com/ecg-diagnostic/ecg/workflows/Docker%20Images%20CI/badge.svg?branch=master)
![Unit Tests](https://github.com/ecg-diagnostic/ecg/workflows/Unit%20Tests/badge.svg?branch=master)


## Description

<p align="justify">
Приложение <i>"Проверь свое сердце"</i> было разработанно студентами Школы анализа данных Яндекса в рамках курса <i>ML Engineering Practice</i>. Оно помогает найти патологии на электрокардиограмме. Приложение доступно по ссылке:
</p>

<p align="center">
  <a href="http://check-ecg.ru"><img src="./images/check.png" alt="This browser doesn't support PNG file" width="30%" height="30%"/></a>
</p>

<p align="justify">
ПРЕДУПРЕЖДЕНИЕ: Предлагаемая система не является системой поддержки принятия врачебного решения и не может заменить врача.
В случае необходимости обращайтесь к квалифицированному кардиологу.
</p>


## How to use

<p align="justify">
На главной странице приложения вы можете загрузить свое ЭКГ или выбрать один из готовых примеров для изучения возможностей системы. Нажмите кнопку
</p>

<p align="center">
  <img src="./images/guide/load.png" alt="This browser doesn't support PNG file"/>
</p>
<p align="center">Рисунок 1. Кнопка "Загрузить"</p>

<p align="justify">
для загрузки ЭКГ или выберите интересующий вас пример из списка. После этого на экране будут отображены 12 отведений ЭКГ. Вы можете скачать данное изображение, нажав кнопку
</p>

<p align="center">
  <img src="./images/guide/download_as_image.png" alt="This browser doesn't support PNG file"/>
</p>
<p align="center">Рисунок 2. Кнопка "Скачать изображение"</p>

С помощью кнопки

<p align="center">
  <img src="./images/guide/settings.png" alt="This browser doesn't support PNG file"/>
</p>
<p align="center">Рисунок 3. Кнопка "Настройки"</p>

<p align="justify">
вы можете открыть окно с настройками визуализации ЭКГ. Оно позволяет скрыть определенные отведения ЭКГ, изменить маcштаб, изменить расстояние между отведениями и т.п..
</p>

<p align="center">
  <img src="./images/guide/settings_all.png" alt="This browser doesn't support PNG file"/>
</p>
<p align="center">Рисунок 4. Кнопка "Окно настроек"</p>

Для получения диагноза следует нажать на кнопку

<p align="center">
  <img src="./images/guide/diagnose.png" alt="This browser doesn't support PNG file"/>
</p>
<p align="center">Рисунок 5. Кнопка "Предсказать диагноз"</p>

<p align="justify">
Результаты диагностики будут показаны в новом окне. Чтобы вернуться к предыдущему экрану, воспользуйтесь кнопкой
</p>

<p align="center">
  <img src="./images/guide/back.png" alt="This browser doesn't support PNG file"/>
</p>
<p align="center">Рисунок 6. Кнопка "Назад"</p>


## Project Structure

<p align="justify">
Приложение <i>"Проверь свое сердце"</i> представляет собой клиент-серверное приложение, основанное на микросервисной архитектуре. Оно состоит из следующих компонентов:
</p>

- Frontend
- Backend
- [Converter](./converter/README.md)
- [Model](./model/README.md)

<p align="center">
  <img src="./images/app_architecture.png" alt="This browser doesn't support PNG file" width="40%" height="40%"/>
</p>

<p align="center">Рисунок 7. Взаимодействие компонентов</p>

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

