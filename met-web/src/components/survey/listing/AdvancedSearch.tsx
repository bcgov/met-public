import React, { useContext, useState } from 'react';
import {
    Checkbox,
    FormControl,
    FormControlLabel,
    FormGroup,
    Grid,
    Stack,
    TextField,
    Theme,
    useMediaQuery,
} from '@mui/material';
import { MetLabel, PrimaryButtonOld, SecondaryButtonOld } from 'components/common';
import { AdvancedSearchFilters, SurveyListingContext } from './SurveyListingContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEyeSlash } from '@fortawesome/pro-solid-svg-icons/faEyeSlash';
import { faCheck } from '@fortawesome/pro-solid-svg-icons/faCheck';
import { faLinkSimple } from '@fortawesome/pro-regular-svg-icons/faLinkSimple';
import { faObjectsColumn } from '@fortawesome/pro-solid-svg-icons/faObjectsColumn';
import { Palette } from 'styles/Theme';

export const AdvancedSearch = () => {
    const isMediumScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down('lg'));
    const [searchFilters, setSearchFilters] = useState<AdvancedSearchFilters>({
        status: {
            linked: false,
            ready: false,
            template: false,
            hidden: false,
        },
        createdDateFrom: '',
        createdDateTo: '',
        publishedDateFrom: '',
        publishedDateTo: '',
    });
    const { setAdvancedSearchFilters, initialSearchFilters } = useContext(SurveyListingContext);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        const newFilters = { ...searchFilters, [name]: value };
        setSearchFilters(newFilters);
    };

    const handleStatusChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = event.target;
        const newFilters = { ...searchFilters, status: { ...searchFilters.status, [name]: checked } };
        setSearchFilters(newFilters);
    };

    const { status, createdDateFrom, createdDateTo, publishedDateFrom, publishedDateTo } = searchFilters;

    return (
        <Grid
            container
            direction="row"
            alignItems={'flex-start'}
            justifyContent={'flex-start'}
            spacing={2}
            mt={{ md: 2 }}
        >
            <Grid item xs={12} lg={2}>
                <FormControl component="fieldset">
                    <MetLabel>Status</MetLabel>
                    <FormGroup row={isMediumScreen}>
                        <FormControlLabel
                            control={<Checkbox checked={status.hidden} onChange={handleStatusChange} name="hidden" />}
                            label={
                                <Stack direction="row" alignItems="center" spacing={1}>
                                    <FontAwesomeIcon icon={faEyeSlash} style={{ fontSize: '20px' }} />
                                    <span>Hidden</span>
                                </Stack>
                            }
                        />
                        <FormControlLabel
                            control={
                                <Checkbox checked={status.template} onChange={handleStatusChange} name="template" />
                            }
                            label={
                                <Stack direction="row" alignItems="center" spacing={1}>
                                    <FontAwesomeIcon icon={faObjectsColumn} style={{ fontSize: '22px' }} />
                                    <span>Template</span>
                                </Stack>
                            }
                        />
                        <FormControlLabel
                            control={<Checkbox checked={status.ready} onChange={handleStatusChange} name="ready" />}
                            label={
                                <>
                                    <Stack direction="row" alignItems="center" spacing={1}>
                                        <FontAwesomeIcon
                                            icon={faCheck}
                                            style={{
                                                fontSize: '22px',
                                                color: Palette.icons.surveyReady,
                                                paddingRight: '2px',
                                            }}
                                        />
                                        <span>Ready</span>
                                    </Stack>
                                </>
                            }
                        />
                        <FormControlLabel
                            control={<Checkbox checked={status.linked} onChange={handleStatusChange} name="linked" />}
                            label={
                                <>
                                    <Stack direction="row" alignItems="center" spacing={1}>
                                        <FontAwesomeIcon icon={faLinkSimple} style={{ fontSize: '20px' }} />
                                        <span>Linked</span>
                                    </Stack>
                                </>
                            }
                        />
                    </FormGroup>
                </FormControl>
            </Grid>
            <Grid
                item
                xs={12}
                lg={10}
                container
                direction="row"
                alignItems={'flex-start'}
                justifyContent={'flex-start'}
                spacing={4}
            >
                <Grid
                    item
                    xs={12}
                    container
                    direction="row"
                    alignItems={'flex-start'}
                    justifyContent={'flex-start'}
                    spacing={2}
                >
                    <Grid item xs={12} sm={6} lg={4}>
                        <MetLabel>Date Created - From</MetLabel>
                        <TextField
                            name="createdDateFrom"
                            type="date"
                            variant="outlined"
                            label=" "
                            value={createdDateFrom}
                            fullWidth
                            size="small"
                            onChange={handleChange}
                            InputLabelProps={{
                                shrink: false,
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} lg={4}>
                        <MetLabel>Date Created - To</MetLabel>
                        <TextField
                            name="createdDateTo"
                            type="date"
                            variant="outlined"
                            label=" "
                            value={createdDateTo}
                            fullWidth
                            size="small"
                            onChange={handleChange}
                            InputLabelProps={{
                                shrink: false,
                            }}
                        />
                    </Grid>
                </Grid>
                <Grid
                    item
                    xs={12}
                    container
                    direction="row"
                    alignItems={'flex-start'}
                    justifyContent={'flex-start'}
                    spacing={2}
                >
                    <Grid item xs={12} sm={6} lg={4}>
                        <MetLabel>Date Published - From</MetLabel>
                        <TextField
                            name="publishedDateFrom"
                            type="date"
                            variant="outlined"
                            label=" "
                            value={publishedDateFrom}
                            fullWidth
                            size="small"
                            onChange={handleChange}
                            InputLabelProps={{
                                shrink: false,
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} lg={4}>
                        <MetLabel>Date Published - To</MetLabel>
                        <TextField
                            name="publishedDateTo"
                            type="date"
                            variant="outlined"
                            label=" "
                            value={publishedDateTo}
                            fullWidth
                            size="small"
                            onChange={handleChange}
                            InputLabelProps={{
                                shrink: false,
                            }}
                        />
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={12} container justifyContent="flex-end">
                <Stack
                    direction={{ xs: 'column-reverse', md: 'row' }}
                    spacing={2}
                    width="100%"
                    justifyContent="flex-end"
                >
                    <SecondaryButtonOld
                        onClick={() => {
                            setAdvancedSearchFilters(initialSearchFilters);
                            setSearchFilters(initialSearchFilters);
                        }}
                    >
                        Reset All Filters
                    </SecondaryButtonOld>
                    <PrimaryButtonOld
                        onClick={() => {
                            setAdvancedSearchFilters(searchFilters);
                        }}
                    >
                        Search
                    </PrimaryButtonOld>
                </Stack>
            </Grid>
        </Grid>
    );
};
