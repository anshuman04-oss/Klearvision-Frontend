/* eslint-disable prefer-const */
import React, { useEffect } from 'react'
import Dropdown from '../Dropdown'
import Button from '../Button'

function CommonFilters() {
    const commonFilters = {"Display Option": ["Both Input and Output", "Output"], "Display Size": ["Small", "Medium", "Large"], "Select Settings": ["1", "2", "3"]}
    let [saveSettings, setSaveSettings] = React.useState(false);
    let [reset, setReset] = React.useState(false);
    let [close, setClose] = React.useState(false);

    const handleSaveSettings = () => {
        saveSettings = !saveSettings;
        setSaveSettings(saveSettings);
    }

    const handleReset = () => {
        reset = !reset;
        setReset(reset);
    }

    const handleClose = () => {
        close = !close;
        setClose(close);
    }

    return (
        <div className='mt-4'>
            <Dropdown mainElement='Display Option' sideElements={commonFilters['Display Option']}/>
            <Dropdown mainElement='Display Size' sideElements={commonFilters['Display Size']}/>
            <Dropdown mainElement='Select Settings' sideElements={commonFilters['Select Settings']}/>
            <Button
                onClick={useEffect(handleSaveSettings, [saveSettings])}
            >Save Settings</Button>
            <Button
                onClick={useEffect(handleReset, [reset])}
            >Reset</Button>
            <Button
                onClick={useEffect(handleClose, [close])}
            >Close</Button>
        </div>
    )
}

export default CommonFilters
