import React, { useState } from 'react';
import { Radio, RadioGroup, FormControlLabel, FormControl, FormLabel } from '@mui/material';
import { PollWidget } from 'models/pollWidget';

// type for the component's props
interface PollDisplayProps {
    pollWidget: PollWidget;
    interactionEnabled: boolean;
    onOptionChange?: (option: string) => void;
}

const PollDisplay = ({ pollWidget, interactionEnabled, onOptionChange }: PollDisplayProps) => {
    const [selectedOption, setSelectedOption] = useState('');

    const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedOption(event.target.value);
        if (onOptionChange) {
            onOptionChange(event.target.value);
        }
    };

    if (!pollWidget) {
        return null;
    }

    return (
        <FormControl component="fieldset" sx={{ minWidth: 275, marginTop: '1em' }}>
            <FormLabel component="legend" style={{ fontWeight: 'bold' }}>
                {pollWidget.title}
            </FormLabel>
            <p style={{ opacity: 0.6 }}>{pollWidget.description}</p>
            <RadioGroup
                style={{ pointerEvents: interactionEnabled ? 'auto' : 'none' }}
                name="poll-options"
                value={selectedOption}
                onChange={handleRadioChange}
            >
                {pollWidget.answers.map((answer, index) => (
                    <FormControlLabel
                        key={'answer' + index}
                        value={answer.id.toString()}
                        control={<Radio />}
                        label={answer.answer_text}
                    />
                ))}
            </RadioGroup>
        </FormControl>
    );
};

export default PollDisplay;
