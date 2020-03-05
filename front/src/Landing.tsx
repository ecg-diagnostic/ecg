import React, { useState } from 'react';

enum Sex {
    Male = 1,
    Female = 0,
}

type Age = number

function Landing() {
    const [sex, setSex] = useState<Sex>(Sex.Male)
    const [age, setAge] = useState<Age>(0)
    const [files, setFiles] = useState<Array<File>>([])

    function handleSubmit(event: any) {
        event.preventDefault()

        const formData = new FormData()
        formData.append('sex', sex.toString())
        formData.append('age', age.toString())

        formData.append('downsampleFactor', '3')
        formData.append('lowerFrequencyBound', '7')
        formData.append('upperFrequencyBound', '11')

        files.forEach(file => {
            formData.append('files[]', file)
        })

        fetch("http://localhost:8001", {
            body: formData,
            method: 'POST',
            mode: 'cors',
        }).then(response => console.log(response))
    }

    function handleSexChange(event: React.FormEvent<HTMLInputElement>) {
        if (!(event.target instanceof HTMLInputElement)) {
            return
        }

        setSex(Number(event.target.value))
    }

    function handleAgeChange(event: React.FormEvent<HTMLInputElement>) {
        if (!(event.target instanceof HTMLInputElement)) {
            return
        }

        const age = Number(event.target.value)
        if (Number.isInteger(age)) {
            setAge(age)
        }
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
                <div>Sex</div>
                {[Sex.Male, Sex.Female].map(s => (
                    <label key={s}>
                        <input
                            checked={sex === s}
                            onChange={handleSexChange}
                            type="radio"
                            value={s}
                        />
                        {s === 1 ? 'Male' : 'Female'}
                    </label>
                ))}

                <label>
                    <div>Age</div>
                    <input
                        type="text"
                        value={age === 0 ? "" : age}
                        onChange={handleAgeChange}
                    />
                </label>

                <label>
                    <div>File</div>
                    <input
                        type="file"
                        multiple
                        onChange={handleFilesChange}
                    />
                </label>

                <div>
                    <input type="submit" />
                </div>
            </form>
        </div>
    )
}

export { Landing }
