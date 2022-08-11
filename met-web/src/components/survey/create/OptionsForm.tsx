import React, { useContext } from 'react';
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
} from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import { ConditionalComponent, MetPageGridContainer, PrimaryButton, SecondaryButton } from 'components/common';
import { CreateOptions } from './CreateOptions';
import { useNavigate } from 'react-router-dom';
import { Palette } from 'styles/Theme';
import LinkOptions from './LinkOptions';
import { CreateSurveyContext } from './CreateSurveyContext';
import { OptionsFormSkeleton } from './OptionsFormSkeleton';

const OptionsForm = () => {
    const navigate = useNavigate();
    const { engagementToLink, loading } = useContext(CreateSurveyContext);

    const [value, setValue] = React.useState('');

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setValue((event.target as HTMLInputElement).value);
    };

    if (loading) {
        return <OptionsFormSkeleton />;
    }

    return (
        <MetPageGridContainer container direction="row" alignItems="flex-start" justifyContent="flex-start" spacing={2}>
            <Grid item xs={12}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="h3">Survey</Typography>
                    <ClearIcon />
                </Stack>
                <Divider />
            </Grid>

            <Grid item xs={12}>
                <FormControl>
                    <FormLabel
                        id="controlled-radio-buttons-group"
                        sx={{ fontWeight: 'bold', color: Palette.text.primary }}
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
                        <ConditionalComponent condition={!!engagementToLink}>
                            <FormControlLabel
                                value="LINK"
                                control={<Radio />}
                                label="Add an existing survey to my engagement"
                            />
                        </ConditionalComponent>
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

            <ConditionalComponent condition={value === 'LINK'}>
                <Grid item xs={12}>
                    <LinkOptions />
                </Grid>
            </ConditionalComponent>

            <ConditionalComponent condition={!value}>
                <Grid item xs={12}>
                    <Stack direction="row" spacing={2}>
                        <PrimaryButton disabled={true}>{'Save & Continue'}</PrimaryButton>
                        <SecondaryButton onClick={() => navigate('/survey/listing')}>Cancel</SecondaryButton>
                    </Stack>
                </Grid>
            </ConditionalComponent>
        </MetPageGridContainer>
    );
};

export default OptionsForm;
