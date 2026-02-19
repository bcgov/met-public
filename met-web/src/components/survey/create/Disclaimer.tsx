import { Checkbox, FormControl, FormControlLabel, FormHelperText, Grid2 as Grid } from '@mui/material';
import { MetDisclaimer } from 'components/common';
import React, { useContext } from 'react';
import { CreateSurveyContext } from './CreateSurveyContext';

export const Disclaimer = () => {
    const { isDisclaimerChecked, setIsDisclaimerChecked, disclaimerError, setDisclaimerError } =
        useContext(CreateSurveyContext);
    return (
        <Grid container direction="row" alignItems="flex-start" justifyContent="flex-start" spacing={2}>
            <Grid>
                <MetDisclaimer>
                    <strong>Disclaimer and statement of responsibility for Survey Designers:</strong>
                    <br />
                    <br />
                    {`
                    It is your responsibility to comply with Privacy laws governing the collection, use and disclosure of personally identifable information.
                    Access to this form designer tools does not inherently grant permission to collect, use, or disclose any personally identifable information.
                    It is your responsibility to obtain consent to collect information as required by law.
                    Before publishing or distributing your survey, you are required to discuss the intention of the survey with your Ministry Privacy Officer
                    and to complete a Privacy Impact Assessment (PIA) as required. It is your responsibility to comply with this disclaimer for all surveys,
                    even if they do not collect personal information.
                `}
                </MetDisclaimer>
            </Grid>
            <Grid>
                <FormControl required error={disclaimerError} component="fieldset" variant="standard">
                    <FormControlLabel
                        control={
                            <Checkbox
                                onChange={(event) => {
                                    if (!isDisclaimerChecked && disclaimerError) {
                                        setDisclaimerError(false);
                                    }
                                    setIsDisclaimerChecked(event.target.checked);
                                }}
                                checked={isDisclaimerChecked}
                            />
                        }
                        label="I agree to the disclaimer and statement of responsibility for Survey Designers."
                    />
                    <FormHelperText>
                        {disclaimerError ? 'Please agree to the disclaimer and statement of responsibility' : ''}
                    </FormHelperText>
                </FormControl>
            </Grid>
        </Grid>
    );
};
