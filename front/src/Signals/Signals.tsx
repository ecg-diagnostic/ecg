import React, {useState} from 'react'
import {
    DefaultButton,
    PrimaryButton,
    Slider,
    Stack,
} from 'office-ui-fabric-react';
import { Chart } from './Chart'
import './Signals.css'

const Signals: React.FunctionComponent = () => {
    const [isFilterOpen, setFilterState] = useState<boolean>(false)
    const setFilterOpen = (filterState: boolean) => {
        document.body.style.overflow = isFilterOpen ? 'auto' : 'hidden'
        setFilterState(filterState)
    }

    return (
        <div className={`signals${isFilterOpen ? ' signals_filter' : ''}`}>
            <div className="signals__chart">
                <Chart />
            </div>

            <div className="signals__controls">
                {isFilterOpen && (
                    <Stack horizontal className="signals__filter">
                        <Slider
                            label="Lower frequency, Hz"
                            className="signals__frequency-slider"
                            min={1}
                            max={50}
                            step={1}
                            defaultValue={5}
                        />
                        <Slider
                            label="Upper frequency, Hz"
                            className="signals__frequency-slider"
                            min={50}
                            max={200}
                            step={1}
                            defaultValue={80}
                        />
                    </Stack>
                )}
                <div className="signals__buttons">
                    <Stack horizontal gap={8}>
                        <DefaultButton onClick={() => setFilterOpen(!isFilterOpen)}>
                            {isFilterOpen ? 'Apply' : 'Filter'}
                        </DefaultButton>
                        <PrimaryButton disabled={isFilterOpen}>{'Predict'}</PrimaryButton>
                    </Stack>
                </div>
            </div>
        </div>
    )
}

export { Signals }
