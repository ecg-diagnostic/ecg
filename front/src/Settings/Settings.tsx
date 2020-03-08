import React from 'react'
import { DefaultButton, Label, Slider, Stack } from 'office-ui-fabric-react'

function Settings() {
    return (
        <Stack tokens={{ childrenGap: 12 }} className="settings">
            <Slider
                defaultValue={4}
                label="Scale"
                max={10}
                min={3}
                step={1}
                valueFormat={(value: number) => `${value} px/mm`}
            />

            <Stack>
                <Label>Horizontal scale</Label>
                <Stack horizontal className="signals__switches">
                    <DefaultButton checked>25 mm/s</DefaultButton>
                    <DefaultButton>50 mm/s</DefaultButton>
                </Stack>
            </Stack>

            <Stack>
                <Label>Visible leads</Label>
                <Stack horizontal className="signals__switches">
                    <DefaultButton>{'I'}</DefaultButton>
                    <DefaultButton checked>{'II'}</DefaultButton>
                    <DefaultButton checked>{'III'}</DefaultButton>
                    <DefaultButton>{'aVL'}</DefaultButton>
                    <DefaultButton>{'aVR'}</DefaultButton>
                    <DefaultButton>{'aVF'}</DefaultButton>
                </Stack>

                <Stack horizontal className="signals__switches">
                    <DefaultButton>{'V1'}</DefaultButton>
                    <DefaultButton>{'V2'}</DefaultButton>
                    <DefaultButton>{'V3'}</DefaultButton>
                    <DefaultButton>{'V4'}</DefaultButton>
                    <DefaultButton>{'V5'}</DefaultButton>
                    <DefaultButton checked>{'V6'}</DefaultButton>
                </Stack>
            </Stack>

            <Slider
                defaultValue={500}
                label="Sample rate"
                max={500}
                min={100}
                step={10}
                valueFormat={(value: number) => `${value} Hz`}
            />

            <Stack>
                <Label>Frontend data transfer float precision</Label>
                <Stack horizontal className="signals__switches">
                    <DefaultButton>float16</DefaultButton>
                    <DefaultButton>float32</DefaultButton>
                    <DefaultButton checked>float64</DefaultButton>
                </Stack>
            </Stack>

            <Stack>
                <Slider
                    defaultValue={5}
                    label="Lower frequency bound"
                    max={50}
                    min={1}
                    step={1}
                    valueFormat={(value: number) => `${value} Hz`}
                />
                <Slider
                    defaultValue={80}
                    label="Upper frequency bound"
                    max={200}
                    min={50}
                    step={10}
                    valueFormat={(value: number) => `${value} Hz`}
                />
            </Stack>

            <DefaultButton>Reset to defaults</DefaultButton>
        </Stack>
    )
}

export { Settings }
