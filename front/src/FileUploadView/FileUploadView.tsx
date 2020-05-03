import React, { useState, useRef, useEffect, ReactText } from 'react'
import { useTranslation } from 'react-i18next'
import { useHistory } from 'react-router-dom'
import { setToken } from '../App/events'
import './FileUploadView.css'
import { PrimaryButton, } from 'office-ui-fabric-react'
import { Link } from '../ui/Link'
import { Page } from '../ui/Page'
import { nameToPreset } from './presets'
import { List } from '../ui/List'

function FileUploadView() {
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [files, setFiles] = useState<Array<File>>([])
    const history = useHistory()
    const { t } = useTranslation()

    useEffect(() => {
        if (files.length === 0) {
            return
        }

        const formData = new FormData()
        files.forEach(file => formData.append('files[]', file))
        setFiles([])

        fetch('/api/upload', {
            body: formData,
            method: 'POST',
        })
            .then(response => {
                if (response.ok) {
                    return response.json()
                }
                throw new Error(
                    `fetch error: ${response.status} ${response.statusText}`,
                )
            })
            .then(response => {
                setToken(response.token)
                history.push('/plot')
            })
            .catch(error => console.error(error))
    }, [history, files])

    function handleUpload(event: React.FormEvent<HTMLInputElement>) {
        if (!(event.target instanceof HTMLInputElement)) {
            return
        }

        if (event.target.files) {
            setFiles(Array.from(event.target.files))
        }
    }

    function handleUploadButtonClick() {
        if (fileInputRef.current) {
            fileInputRef.current.click()
        }
    }

    function handlePresetClick(preset: ReactText) {
        return function(event: any) {
            event.preventDefault()

            fetch(`/api/presets/${preset}`)
                .then(response => {
                    if (response.ok) {
                        return response.json()
                    }
                    throw new Error(
                        `fetch error: ${response.status} ${response.statusText}`,
                    )
                })
                .then(response => {
                    setToken(response.token)
                    history.push('/plot')
                })
                .catch(error => console.error(error))
        }
    }

    return (
        <Page title="Проверь свое сердце!">
            <p>
                Это приложение поможет найти отклонения на вашей
                электрокардиограмме.
            </p>

            <p>
                Просто загрузите скан с 12&nbsp;отведениями, расположенными друг
                под другом, или файл в формате DICOM или HL7.
            </p>

            <input
                multiple
                onChange={handleUpload}
                ref={fileInputRef}
                style={{ display: 'none' }}
                type="file"
            />

            <PrimaryButton
                className="button"
                iconProps={{ iconName: 'LineChart' }}
                onClick={handleUploadButtonClick}
                text="Загрузить"
            />

            <p>
                Вы можете просто посмотреть возможности приложения выбрав один
                из готовых примеров:
            </p>

            <List listType={List.ListType.UnorderedList}>
                {nameToPreset.map(([name, preset]) => (
                    <Link
                        key={name}
                        to={`/plot/${preset}`}
                        onClick={handlePresetClick(preset)}
                        underlineType={Link.UnderlineType.Dotted}
                    >
                        {String(t(String(name)))}
                    </Link>
                ))}
            </List>
        </Page>
    )
}

export { FileUploadView }
