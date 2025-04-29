import { Button, Select, MenuItem } from '@mui/material';
import React from 'react'

function CommonFilters() {
    const commonFilters = {"Display Option": ["Both Input and Output", "Output"], "Display Size": ["Small", "Medium", "Large"], "Select Settings": ["1", "2", "3"]}
    let [saveSettings, setSaveSettings] = React.useState(false);
    let [reset, setReset] = React.useState(false);
    let [close, setClose] = React.useState(false);

    // State to store selected values
    const [selectedDisplayOption, setSelectedDisplayOption] = React.useState(commonFilters['Display Option'][0]);
    const [selectedDisplaySize, setSelectedDisplaySize] = React.useState(commonFilters['Display Size'][0]);
    const [selectedSelectSettings, setSelectedSelectSettings] = React.useState(commonFilters['Select Settings'][0]);

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
            <Select
                value={selectedDisplayOption}
                onChange={(e) => setSelectedDisplayOption(e.target.value)}
            >
                {commonFilters['Display Option'].map((option) => (
                    <MenuItem key={option} value={option}>
                        {option}
                    </MenuItem>
                ))}
            </Select>
            <Select
                value={selectedDisplaySize}
                onChange={(e) => setSelectedDisplaySize(e.target.value)}
            >
                {commonFilters['Display Size'].map((size) => (
                    <MenuItem key={size} value={size}>
                        {size}
                    </MenuItem>
                ))}
            </Select>
            <Select
                value={selectedSelectSettings}
                onChange={(e) => setSelectedSelectSettings(e.target.value)}
            >
                {commonFilters['Select Settings'].map((setting) => (
                    <MenuItem key={setting} value={setting}>
                        {setting}
                    </MenuItem>
                ))}
            </Select>
            <Button
                onClick={handleSaveSettings}
            >Save Settings</Button>
            <Button
                onClick={handleReset}
            >Reset</Button>
            <Button
                onClick={handleClose}
            >Close</Button>
        </div>
    )
}

export default CommonFilters
