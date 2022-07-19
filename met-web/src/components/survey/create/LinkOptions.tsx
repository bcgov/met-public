import React, { useContext, useEffect, useState } from 'react';
import {
    Grid,
    TextField,
    Typography,
    Stack,
    Button,
    CircularProgress,
    MenuItem,
    Autocomplete,
    Skeleton,
} from '@mui/material';
import { CreateSurveyContext } from './CreateSurveyContext';
import { useNavigate } from 'react-router-dom';
import { hasKey } from 'utils';
import { fetchSurveys, postSurvey } from 'services/surveyService/form';
import { useAppDispatch } from 'hooks';
import { openNotification } from 'services/notificationService/notificationSlice';
import { MetLabel } from 'components/common';
import { Survey } from 'models/survey';

const LinkOptions = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const [selectedSurvey, setSelectedSurvey] = useState<Survey | null>(null);
    const [loadingSurveys, setLoadingSurveys] = useState(true);

    const { availableSurveys, setAvailableSurveys } = useContext(CreateSurveyContext);

    const handleFetchSurveys = async () => {
        if (!!availableSurveys) {
            setLoadingSurveys(false);
            return;
        }

        try {
            const fetchedSurveys = await fetchSurveys({
                unlinked: true,
            });
            setAvailableSurveys(fetchedSurveys);
            setLoadingSurveys(false);
        } catch (error) {
            dispatch(openNotification({ severity: 'error', text: 'Error occurred while fetching available surveys' }));
        }
    };
    useEffect(() => {
        handleFetchSurveys();
    }, [availableSurveys]);

    return (
        <Grid container direction="row" alignItems="flex-start" justifyContent="flex-start" item xs={12} spacing={2}>
            <Grid item xs={6}>
                <MetLabel sx={{ marginBottom: '2px' }}>Select Survey</MetLabel>
                <Autocomplete
                    id="survey-selector"
                    options={availableSurveys || []}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label=" "
                            InputLabelProps={{
                                shrink: false,
                            }}
                            fullWidth
                        />
                    )}
                    getOptionLabel={(survey: Survey) => survey.name}
                    onChange={(_e: React.SyntheticEvent<Element, Event>, survey: Survey | null) =>
                        setSelectedSurvey(survey)
                    }
                    disabled={loadingSurveys}
                />
            </Grid>
            <Grid item xs={12}>
                <Stack direction="row" spacing={2}>
                    <Button variant="contained">
                        {'Save & Continue'}
                        {/* {isSaving && <CircularProgress sx={{ marginLeft: 1 }} size={20} />} */}
                    </Button>
                    <Button variant="outlined" onClick={() => navigate(-1)}>
                        Cancel
                    </Button>
                </Stack>
            </Grid>
        </Grid>
    );
};

export default LinkOptions;
