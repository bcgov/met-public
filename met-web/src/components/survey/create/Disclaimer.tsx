import { Checkbox, FormControl, FormControlLabel, Grid } from '@mui/material';
import { MetDisclaimer } from 'components/common';
import React, { useContext } from 'react';
import { CreateSurveyContext } from './CreateSurveyContext';

export const Disclaimer = () => {
    const { isDisclaimerChecked, setIsDisclaimerChecked } = useContext(CreateSurveyContext);
    return (
        <Grid item xs={12} container direction="row" alignItems="flex-start" justifyContent="flex-start" spacing={2}>
            <Grid item xs={6}>
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
                    even if they do not collect personally information.
                `}
                </MetDisclaimer>
            </Grid>
            <Grid item xs={12}>
                <FormControl required component="fieldset" variant="standard">
                    <FormControlLabel
                        control={
                            <Checkbox
                                onChange={(event) => {
                                    setIsDisclaimerChecked(event.target.checked);
                                }}
                                checked={isDisclaimerChecked}
                            />
                        }
                        label="I agree to the disclaimer and statement of responsibility for Survey Designers."
                    />
                </FormControl>
            </Grid>
        </Grid>
    );
};
