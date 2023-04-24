import React, { useContext } from 'react';
import { Divider, FormControl, FormControlLabel, FormLabel, Grid, RadioGroup, Stack, Radio } from '@mui/material';
import { MetPageGridContainer, PrimaryButton, SecondaryButton, MetHeader3 } from 'components/common';
import CloneOptions from './CloneOptions';
import { CreateOptions } from './CreateOptions';
import { useNavigate } from 'react-router-dom';
import { Palette } from 'styles/Theme';
import LinkOptions from './LinkOptions';
import { CreateSurveyContext } from './CreateSurveyContext';
import { OptionsFormSkeleton } from './OptionsFormSkeleton';
import { When } from 'react-if';

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
                    <MetHeader3>Survey</MetHeader3>
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
                        <When condition={!engagementToLink}>
                            <FormControlLabel value="CREATE" control={<Radio />} label="Create a new Survey" />
                        </When>
                        <FormControlLabel value="CLONE" control={<Radio />} label="Clone an existing Survey/Template" />
                        <When condition={!!engagementToLink}>
                            <FormControlLabel
                                value="LINK"
                                control={<Radio />}
                                label="Add an existing survey to my engagement"
                            />
                        </When>
                    </RadioGroup>
                </FormControl>
            </Grid>

            <When condition={value === 'CREATE'}>
                <CreateOptions />
            </When>

            <When condition={value === 'CLONE'}>
                <Grid item xs={12}>
                    <CloneOptions />
                </Grid>
            </When>

            <When condition={value === 'LINK'}>
                <Grid item xs={12}>
                    <LinkOptions />
                </Grid>
            </When>

            <When condition={!value}>
                <Grid item xs={12}>
                    <Stack direction="row" spacing={2}>
                        <PrimaryButton disabled={true}>{'Save & Continue'}</PrimaryButton>
                        <SecondaryButton onClick={() => navigate('/surveys')}>Cancel</SecondaryButton>
                    </Stack>
                </Grid>
            </When>
        </MetPageGridContainer>
    );
};

export default OptionsForm;
