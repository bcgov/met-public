import React from 'react';
import {
    Divider,
    FormControl,
    FormControlLabel,
    FormLabel,
    Grid,
    RadioGroup,
    Stack,
    Typography,
    Radio,
    Button,
} from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import { ConditionalComponent, MetPageGridContainer } from 'components/common';
import { CreateOptions } from './CreateOptions';
import { useNavigate } from 'react-router-dom';

const OptionsForm = () => {
    const navigate = useNavigate();
    const [value, setValue] = React.useState('');

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setValue((event.target as HTMLInputElement).value);
    };
    return (
        <MetPageGridContainer container direction="row" alignItems="flex-start" justifyContent="flex-start" spacing={2}>
            <Grid item xs={12}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6">Survey</Typography>
                    <ClearIcon />
                </Stack>
                <Divider />
            </Grid>

            <Grid item xs={12}>
                <FormControl>
                    <FormLabel
                        id="controlled-radio-buttons-group"
                        // sx={{ fontWeight: 'bold', color: Palette.text.primary }}
                    >
                        I want to
                    </FormLabel>
                    <RadioGroup
                        aria-labelledby="controlled-radio-buttons-group"
                        name="controlled-radio-buttons-group"
                        value={value}
                        onChange={handleChange}
                    >
                        <FormControlLabel value="CREATE" control={<Radio />} label="Create a new Survey" />
                        <FormControlLabel
                            value="CLONE"
                            control={<Radio />}
                            label="Clone an existing Survey"
                            disabled={true}
                        />
                    </RadioGroup>
                </FormControl>
            </Grid>

            <ConditionalComponent condition={value === 'CREATE'}>
                <CreateOptions />
            </ConditionalComponent>

            <ConditionalComponent condition={value === 'CLONE'}>
                <Grid item xs={12}>
                    <Typography>This is where clone options would go</Typography>
                </Grid>
            </ConditionalComponent>

            <ConditionalComponent condition={!value}>
                <Grid item xs={12}>
                    <Stack direction="row" spacing={2}>
                        <Button variant="contained" disabled={true}>
                            {'Save & Continue'}
                        </Button>
                        <Button variant="outlined" onClick={() => navigate('/survey/listing')}>
                            Cancel
                        </Button>
                    </Stack>
                </Grid>
            </ConditionalComponent>
        </MetPageGridContainer>
    );
};

export default OptionsForm;
