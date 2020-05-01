import { useStore } from 'effector-react'
import { DefaultButton } from 'office-ui-fabric-react'
import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useHistory } from 'react-router-dom'
import { $token } from '../App/model'
import { Page } from '../ui/Page'
import { $predictions } from './model'
import { Abnormality } from './types'

function ResultsView() {
    const history = useHistory()
    const predictions = useStore($predictions)
    const token = useStore($token)
    const { t } = useTranslation()

    useEffect(() => {
        if (token === null) {
            history.push('/')
        }
    })

    const isNormal =
        predictions.mostConfidentPrediction.abnormality === Abnormality.Normal

    return (
        <Page title={t('Результаты диагностики')}>
            {isNormal ? (
                <p>По результатам диагностики патологий не обнаружено.</p>
            ) : (
                <p>
                    По результатам диагностики обнаружена следующая патология:
                    <br />
                    <strong>
                        {t(predictions.mostConfidentPrediction.name)}
                    </strong>
                </p>
            )}
            <p>
                Результаты данного исследования не являются окончательным
                диагнозом.<br /> Клинический диагноз, основанный на полном пациента,
                устанавливает лечащий врач.
            </p>
            <DefaultButton
                iconProps={{ iconName: 'Back' }}
                onClick={() => history.goBack()}
            >
                Назад
            </DefaultButton>
        </Page>
    )
}

export { ResultsView }
