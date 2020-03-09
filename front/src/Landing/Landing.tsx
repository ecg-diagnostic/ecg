import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { setToken } from '../App/events'

function Landing() {
    const [files, setFiles] = useState<Array<File>>([])
    const history = useHistory()

    function handleSubmit(event: any) {
        event.preventDefault()

        const formData = new FormData()
        files.forEach(file => {
            formData.append('files[]', file)
        })

        fetch('http://localhost:8001', {
            body: formData,
            method: 'POST',
            mode: 'cors',
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
    }

    function handleFilesChange(event: React.FormEvent<HTMLInputElement>) {
        if (!(event.target instanceof HTMLInputElement)) {
            return
        }

        if (event.target.files) {
            setFiles(Array.from(event.target.files))
        }
    }

    return (
        <div className="landing">
            <form
                action="/"
                encType="multipart/form-data"
                method="post"
                onSubmit={handleSubmit}
            >
                <label>
                    <div>File</div>
                    <input type="file" multiple onChange={handleFilesChange} />
                </label>

                <div>
                    <input type="submit" />
                </div>
            </form>
        </div>
    )
}

export { Landing }
