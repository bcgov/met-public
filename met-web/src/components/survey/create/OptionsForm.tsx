import React, { useContext } from 'react';
import { FormControl, FormControlLabel, FormLabel, Grid2 as Grid, RadioGroup, Stack, Radio } from '@mui/material';
import { MetPageGridContainer } from 'components/common';
import CloneOptions from './CloneOptions';
import { CreateOptions } from './CreateOptions';
import { useNavigate } from 'react-router';
import { Palette } from 'styles/Theme';
import { CreateSurveyContext } from './CreateSurveyContext';
import { OptionsFormSkeleton } from './OptionsFormSkeleton';
import { When } from 'react-if';
import { Disclaimer } from './Disclaimer';
import { Header1 } from 'components/common/Typography';
import { Button, PrimaryButton } from 'components/common/Input/Button';

const OptionsForm = () => {
    const navigate = useNavigate();
    const { loading } = useContext(CreateSurveyContext);

    const [value, setValue] = React.useState('');

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setValue((event.target as HTMLInputElement).value);
    };

    if (loading) {
        return <OptionsFormSkeleton />;
    }

    return (
        <MetPageGridContainer
            container
            direction="column"
            alignItems="flex-start"
            justifyContent="flex-start"
            style={{ maxWidth: '700px', gap: '1rem' }}
        >
            <Header1>Survey</Header1>
            <FormControl sx={{ gap: '0.5rem' }}>
                <FormLabel
                    id="controlled-radio-buttons-group"
                    sx={{ fontWeight: 'bold', color: Palette.text.primary, mb: '1rem' }}
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
                    <FormControlLabel value="CLONE" control={<Radio />} label="Clone an existing Survey/Template" />
                </RadioGroup>
            </FormControl>

            <When condition={value === 'CREATE'}>
                <CreateOptions />
            </When>

            <When condition={value === 'CLONE'}>
                <Grid>
                    <CloneOptions />
                </Grid>
            </When>

            <When condition={!value}>
                <Grid>
                    <Disclaimer />
                </Grid>
            </When>

            <When condition={!value}>
                <Stack direction="row" spacing={2}>
                    <PrimaryButton disabled={true}>{'Save & Continue'}</PrimaryButton>
                    <Button variant="secondary" onClick={() => navigate('/surveys')}>
                        Cancel
                    </Button>
                </Stack>
            </When>
        </MetPageGridContainer>
    );
};

export default OptionsForm;
