import React, { useState, useRef, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { setToken } from '../App/events'
import './FileUploadView.css'
import { DefaultButton, PrimaryButton, Toggle } from 'office-ui-fabric-react'

function FileUploadView() {
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [showSamplesButtons, setSamplesButtons] = useState<boolean>(false)
    const [files, setFiles] = useState<Array<File>>([])
    const history = useHistory()

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
    }, [files])

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

    function toggleSamplesButtons() {
        setSamplesButtons(!showSamplesButtons)
    }

    return (
        <div className="view file-upload-view">
            <div className="view__panel">
                <div className="file-upload-view__title">Проверь свое сердце!</div>
                <p>
                    Это приложение поможет найти отклонения на вашей электрокардиограмме.
                </p>
                <p>
                    Просто загрузите скан с 12&nbsp;отведениями, расположенными друг под другом,
                    или файл в формате DICOM или HL7.
                </p>

                <input
                    multiple
                    onChange={handleUpload}
                    ref={fileInputRef}
                    style={{ display: "none" }}
                    type="file"
                />

                <div className="file-upload-view__upload">
                    <PrimaryButton
                        className="button"
                        iconProps={{ iconName: 'LineChart' }}
                        onClick={handleUploadButtonClick}
                        text="Загрузить"
                    />
                </div>

                <p>
                    Вы можете просто посмотреть возможности приложения включив демо
                    режим и выбрав один из готовых примеров.
                </p>

                <Toggle
                    onText="Скрыть готовые примеры"
                    offText="Показать готовые примеры"
                    onChange={toggleSamplesButtons}
                />
                {showSamplesButtons && (
                    <div className="samples-buttons">
                        <div className="samples-buttons__item">
                            <DefaultButton text="ЭКГ в норме " />
                        </div>
                        <div className="samples-buttons__item">
                            <DefaultButton text="ФП" />
                        </div>
                        <div className="samples-buttons__item">
                            <DefaultButton text="I-AVB" />
                        </div>
                        <div className="samples-buttons__item">
                            <DefaultButton text="LBBB" />
                        </div>
                        <div className="samples-buttons__item">
                            <DefaultButton text="RBBB" />
                        </div>
                        <div className="samples-buttons__item">
                            <DefaultButton text="PAC" />
                        </div>
                        <div className="samples-buttons__item">
                            <DefaultButton text="PVC" />
                        </div>
                        <div className="samples-buttons__item">
                            <DefaultButton text="STD" />
                        </div>
                        <div className="samples-buttons__item">
                            <DefaultButton text="STE" />
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export { FileUploadView }
