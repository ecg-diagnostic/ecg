import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
    en: {
        translation: {
            'Atrial fibrillation': 'Atrial fibrillation (AF)',
            'First-degree atrioventricular block': 'First-degree atrioventricular block (I-AVB)',
            'Left bundle brunch block': 'Left bundle brunch block (LBBB)',
            'Right bundle brunch block': 'Right bundle brunch block (RBBB)',
            'Premature atrial contraction': 'Premature atrial contraction (PAC)',
            'Premature ventricular contraction': 'Premature ventricular contraction (PVC)',
            'ST-segment depression': 'ST-segment depression (STD)',
            'ST-segment elevated': 'ST-segment elevated (STE)',
            'Normal ECG': 'Normal ECG',
        },
    },
    ru: {
        translation: {
            'Atrial fibrillation': 'Фибрилляция предсердий (ФП)',
            'First-degree atrioventricular block': 'Атриовентрикулярная блокада первой степени',
            'Left bundle brunch block': 'Блокада левой ножки пучка Гиса',
            'Right bundle brunch block': 'Блокада правой ножки пучка Гиса',
            'Premature atrial contraction': 'Предсердная экстрасистолия',
            'Premature ventricular contraction': 'Желудочковая экстрасистолия',
            'ST-segment depression': 'Депрессия сегмента ST',
            'ST-segment elevated': 'Элевация сегмента ST',
            'Normal ECG': 'Нормальная ЭКГ',
        },
    },
};

i18n.use(initReactI18next).init({
    resources,
    lng: 'ru',
});

export default i18n;
