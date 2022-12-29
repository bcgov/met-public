import React, { useState } from 'react';
import { Modal, Grid, Stack, IconButton, useMediaQuery, Theme, Divider, TextField, Autocomplete } from '@mui/material';
import { modalStyle, MetHeader1, MetHeader3, PrimaryButton } from 'components/common';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { When } from 'react-if';
import dayjs from 'dayjs';
import { muitheme, options } from './constants';
import DayZeroRules from './dayZeroRules';

interface DayCalcModalProps {
    open: boolean;
    updateModal: (open: boolean) => void;
}
interface ISelectOptions {
    id: number;
    label: string;
}

const DayCalculatorModal = ({ open, updateModal }: DayCalcModalProps) => {
    const isSmallScreen = useMediaQuery((theme: Theme) => muitheme.breakpoints.down('lg'));

    // variable to capture the option selected within Calculation Type
    const [selectedOption, setSelectedOption] = useState('');
    function handleDropDownChange(event: React.SyntheticEvent<Element, Event>, value: string) {
        setSelectedOption(value);
    }

    // variable to throw error in case suspension or resumption dates are blank
    const [dayCalcError, setdayCalcError] = useState({
        suspensionDate: false,
        resumptionDate: false,
    });
    const validateDayCalcInputs = () => {
        const errors = {
            suspensionDate: !suspensionDate,
            resumptionDate: !resumptionDate,
        };
        setdayCalcError(errors);

        return Object.values(errors).some((isError: unknown) => isError);
    };

    // variable to show or hide the day zero rules
    const [showHideStatus, setShowHideStatus] = useState(false);

    // variable to capture changes on the input fields
    const [dayCalcData, setDayCalcData] = useState({
        startDate: '',
        endDate: '',
        suspensionDate: '',
        resumptionDate: '',
        numberOfDays: 0,
    });
    const { startDate, endDate, suspensionDate, resumptionDate, numberOfDays } = dayCalcData;
    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        setDayCalcData({
            ...dayCalcData,
            [e.target.name]: e.target.value,
        });
        setdayCalcError({
            ...dayCalcError,
            [e.target.name]: false,
        });
    };

    // reset to default
    const resetToDefault = () => {
        setDayCalcData({
            startDate: '',
            endDate: '',
            suspensionDate: '',
            resumptionDate: '',
            numberOfDays: 0,
        });
    };

    // calculator
    const calculator = () => {
        let calcStartDate = startDate;
        let calcEndDate = endDate;
        let calcNumberOfDays = numberOfDays;
        if (selectedOption == options[0].label) {
            if (startDate && endDate && !numberOfDays) {
                calcNumberOfDays = dayjs(endDate).diff(dayjs(startDate), 'days');
            } else if (startDate && !endDate && numberOfDays) {
                calcEndDate = dayjs(startDate).add(numberOfDays, 'day').format('YYYY-MM-DD');
            } else if (!startDate && endDate && numberOfDays) {
                calcStartDate = dayjs(endDate).subtract(numberOfDays, 'day').format('YYYY-MM-DD');
            }
        }

        if (selectedOption == options[1].label) {
            if (startDate && endDate && !numberOfDays) {
                calcNumberOfDays = dayjs(endDate).add(1, 'day').diff(dayjs(startDate), 'days');
            } else if (startDate && !endDate && numberOfDays) {
                calcEndDate = dayjs(startDate)
                    .add(numberOfDays - 1, 'day')
                    .format('YYYY-MM-DD');
            } else if (!startDate && endDate && numberOfDays) {
                calcStartDate = dayjs(endDate)
                    .subtract(numberOfDays - 1, 'day')
                    .format('YYYY-MM-DD');
            }
        }

        if (selectedOption == options[2].label) {
            const hasErrors = validateDayCalcInputs();
            if (hasErrors) {
                return {
                    startDate: dayCalcData.startDate,
                    endDate: dayCalcData.endDate,
                    suspensionDate: dayCalcData.suspensionDate,
                    resumptionDate: dayCalcData.resumptionDate,
                    numberOfDays: dayCalcData.numberOfDays,
                };
            }

            if (suspensionDate && resumptionDate) {
                const calcNumberOfSuspendedDays = dayjs(resumptionDate)
                    .add(1, 'day')
                    .diff(dayjs(suspensionDate), 'days');
                if (startDate && endDate && !numberOfDays) {
                    calcNumberOfDays =
                        dayjs(endDate).add(1, 'day').diff(dayjs(startDate), 'days') - calcNumberOfSuspendedDays;
                } else if (startDate && !endDate && numberOfDays) {
                    calcEndDate = dayjs(startDate)
                        .add(numberOfDays - 1 + calcNumberOfSuspendedDays, 'day')
                        .format('YYYY-MM-DD');
                } else if (!startDate && endDate && numberOfDays) {
                    calcStartDate = dayjs(endDate)
                        .subtract(numberOfDays - 1 + calcNumberOfSuspendedDays, 'day')
                        .format('YYYY-MM-DD');
                }
            }
        }

        setDayCalcData({
            ...dayCalcData,
            startDate: calcStartDate,
            endDate: calcEndDate,
            numberOfDays: calcNumberOfDays,
        });
    };

    return (
        <Modal aria-labelledby="modal-title" open={open} onClose={() => updateModal(false)}>
            <Grid
                container
                direction="row"
                justifyContent="flex-start"
                alignItems="space-between"
                sx={{ ...modalStyle }}
                rowSpacing={2}
            >
                <Grid container direction="row" item xs={12} wrap="nowrap">
                    <Grid item md={11} xs={12}>
                        <Stack direction="row" alignItems="center" spacing={2}>
                            <MetHeader1 bold={true} sx={{ mb: 2 }}>
                                Day Calculator
                            </MetHeader1>
                        </Stack>
                    </Grid>
                    <Grid item md={1} xs={12}>
                        <Stack direction="row" alignItems="right">
                            <IconButton
                                onClick={() => updateModal(false)}
                                sx={{ paddingLeft: 3, margin: 0 }}
                                color="inherit"
                            >
                                <HighlightOffIcon />
                            </IconButton>
                        </Stack>
                    </Grid>
                </Grid>
                <Grid container direction="row" item xs={12}>
                    <Divider style={{ marginTop: '1em', width: '100%' }} />
                </Grid>
                <Grid container direction="row" item xs={12}>
                    <MetHeader3 sx={{ mb: 6 }}>Enter any two fields to calculate the third</MetHeader3>
                </Grid>
                {isSmallScreen ? (
                    <>
                        <Grid container direction="row" item xs={12}>
                            <Grid item md={6} xs={12}>
                                <Stack direction="row" alignItems="center" spacing={2}>
                                    <MetHeader3 bold={true} sx={{ mb: 0 }}>
                                        Start Date
                                    </MetHeader3>
                                </Stack>
                            </Grid>
                            <Grid item md={6} xs={12}>
                                <Stack direction="row" alignItems="center" spacing={2}>
                                    <TextField
                                        id="start-date"
                                        type="date"
                                        label=" "
                                        InputLabelProps={{
                                            shrink: false,
                                        }}
                                        sx={{ width: '80%' }}
                                        name="startDate"
                                        value={startDate}
                                        InputProps={{ inputProps: { max: endDate || null } }}
                                        onChange={handleChange}
                                    />
                                </Stack>
                            </Grid>
                        </Grid>
                        <Grid container direction="row" item xs={12}>
                            <Grid item md={6} xs={12}>
                                <Stack direction="row" alignItems="center" spacing={2}>
                                    <MetHeader3 bold={true} sx={{ mb: 0 }}>
                                        End Date
                                    </MetHeader3>
                                </Stack>
                            </Grid>
                            <Grid item md={6} xs={12}>
                                <Stack direction="row" alignItems="center" spacing={2}>
                                    <TextField
                                        id="end-date"
                                        type="date"
                                        label=" "
                                        InputLabelProps={{
                                            shrink: false,
                                        }}
                                        sx={{ width: '80%' }}
                                        name="endDate"
                                        value={endDate}
                                        InputProps={{ inputProps: { min: startDate || null } }}
                                        onChange={handleChange}
                                    />
                                </Stack>
                            </Grid>
                        </Grid>
                    </>
                ) : (
                    <>
                        <Grid container direction="row" item xs={12}>
                            <Grid item md={6} xs={12}>
                                <Stack direction="row" alignItems="center" spacing={2}>
                                    <MetHeader3 bold={true} sx={{ mb: 0 }}>
                                        Start Date
                                    </MetHeader3>
                                </Stack>
                            </Grid>
                            <Grid item md={6} xs={12}>
                                <Stack direction="row" alignItems="center" spacing={2}>
                                    <MetHeader3 bold={true} sx={{ mb: 0 }}>
                                        End Date
                                    </MetHeader3>
                                </Stack>
                            </Grid>
                        </Grid>
                        <Grid container direction="row" item xs={12}>
                            <Grid item md={6} xs={12}>
                                <Stack direction="row" alignItems="center" spacing={2}>
                                    <TextField
                                        id="start-date"
                                        type="date"
                                        label=" "
                                        InputLabelProps={{
                                            shrink: false,
                                        }}
                                        sx={{ width: '80%' }}
                                        name="startDate"
                                        value={startDate}
                                        InputProps={{ inputProps: { max: endDate || null } }}
                                        onChange={handleChange}
                                    />
                                </Stack>
                            </Grid>
                            <Grid item md={6} xs={12}>
                                <Stack direction="row" alignItems="center" spacing={2}>
                                    <TextField
                                        id="end-date"
                                        type="date"
                                        label=" "
                                        InputLabelProps={{
                                            shrink: false,
                                        }}
                                        sx={{ width: '80%' }}
                                        name="endDate"
                                        value={endDate}
                                        InputProps={{ inputProps: { min: startDate || null } }}
                                        onChange={handleChange}
                                    />
                                </Stack>
                            </Grid>
                        </Grid>
                    </>
                )}
                {isSmallScreen ? (
                    <>
                        <>
                            <When condition={selectedOption == options[2].label}>
                                {
                                    <Grid container direction="row" item xs={12}>
                                        <Grid item md={6} xs={12}>
                                            <Stack direction="row" alignItems="center" spacing={2}>
                                                <MetHeader3 bold={true} sx={{ mb: 0 }}>
                                                    Suspension Date
                                                </MetHeader3>
                                            </Stack>
                                        </Grid>
                                        <Grid item md={6} xs={12}>
                                            <Stack direction="row" alignItems="center" spacing={2}>
                                                <TextField
                                                    id="suspension-date"
                                                    type="date"
                                                    label=" "
                                                    InputLabelProps={{
                                                        shrink: false,
                                                    }}
                                                    sx={{ width: '80%' }}
                                                    name="suspensionDate"
                                                    value={suspensionDate}
                                                    InputProps={{
                                                        inputProps: {
                                                            max:
                                                                (resumptionDate < endDate ? endDate : resumptionDate) ||
                                                                null,
                                                            min: startDate || null,
                                                        },
                                                    }}
                                                    onChange={handleChange}
                                                    error={dayCalcError.suspensionDate}
                                                    helperText={
                                                        dayCalcError.suspensionDate
                                                            ? 'Suspension Date must be specified'
                                                            : ''
                                                    }
                                                />
                                            </Stack>
                                        </Grid>
                                    </Grid>
                                }
                            </When>
                        </>
                        <>
                            <When condition={selectedOption == options[2].label}>
                                {
                                    <Grid container direction="row" item xs={12}>
                                        <Grid item md={6} xs={12}>
                                            <Stack direction="row" alignItems="center" spacing={2}>
                                                <MetHeader3 bold={true} sx={{ mb: 0 }}>
                                                    Resumption Date
                                                </MetHeader3>
                                            </Stack>
                                        </Grid>
                                        <Grid item md={6} xs={12}>
                                            <Stack direction="row" alignItems="center" spacing={2}>
                                                <TextField
                                                    id="resumption-date"
                                                    type="date"
                                                    label=" "
                                                    InputLabelProps={{
                                                        shrink: false,
                                                    }}
                                                    sx={{ width: '80%' }}
                                                    name="resumptionDate"
                                                    value={resumptionDate}
                                                    InputProps={{
                                                        inputProps: {
                                                            max: endDate || null,
                                                            min:
                                                                (startDate > suspensionDate
                                                                    ? startDate
                                                                    : suspensionDate) || null,
                                                        },
                                                    }}
                                                    onChange={handleChange}
                                                    error={dayCalcError.resumptionDate}
                                                    helperText={
                                                        dayCalcError.resumptionDate
                                                            ? 'Resumption Date must be specified'
                                                            : ''
                                                    }
                                                />
                                            </Stack>
                                        </Grid>
                                    </Grid>
                                }
                            </When>
                        </>
                    </>
                ) : (
                    <>
                        <>
                            <When condition={selectedOption == options[2].label}>
                                {
                                    <Grid container direction="row" item xs={12}>
                                        <Grid item md={6} xs={12}>
                                            <Stack direction="row" alignItems="center" spacing={2}>
                                                <MetHeader3 bold={true} sx={{ mb: 0 }}>
                                                    Suspension Date
                                                </MetHeader3>
                                            </Stack>
                                        </Grid>
                                        <Grid item md={6} xs={12}>
                                            <Stack direction="row" alignItems="center" spacing={2}>
                                                <MetHeader3 bold={true} sx={{ mb: 0 }}>
                                                    Resumption Date
                                                </MetHeader3>
                                            </Stack>
                                        </Grid>
                                    </Grid>
                                }
                            </When>
                        </>
                        <>
                            <When condition={selectedOption == options[2].label}>
                                {
                                    <Grid container direction="row" item xs={12}>
                                        <Grid item md={6} xs={12}>
                                            <Stack direction="row" alignItems="center" spacing={2}>
                                                <TextField
                                                    id="suspension-date"
                                                    type="date"
                                                    label=" "
                                                    InputLabelProps={{
                                                        shrink: false,
                                                    }}
                                                    sx={{ width: '80%' }}
                                                    name="suspensionDate"
                                                    value={suspensionDate}
                                                    InputProps={{
                                                        inputProps: {
                                                            max:
                                                                (resumptionDate < endDate ? endDate : resumptionDate) ||
                                                                null,
                                                            min: startDate || null,
                                                        },
                                                    }}
                                                    onChange={handleChange}
                                                    error={dayCalcError.suspensionDate}
                                                    helperText={
                                                        dayCalcError.suspensionDate
                                                            ? 'Suspension Date must be specified'
                                                            : ''
                                                    }
                                                />
                                            </Stack>
                                        </Grid>
                                        <Grid item md={6} xs={12}>
                                            <Stack direction="row" alignItems="center" spacing={2}>
                                                <TextField
                                                    id="resumption-date"
                                                    type="date"
                                                    label=" "
                                                    InputLabelProps={{
                                                        shrink: false,
                                                    }}
                                                    sx={{ width: '80%' }}
                                                    name="resumptionDate"
                                                    value={resumptionDate}
                                                    InputProps={{
                                                        inputProps: {
                                                            max: endDate || null,
                                                            min:
                                                                (startDate > suspensionDate
                                                                    ? startDate
                                                                    : suspensionDate) || null,
                                                        },
                                                    }}
                                                    onChange={handleChange}
                                                    error={dayCalcError.resumptionDate}
                                                    helperText={
                                                        dayCalcError.resumptionDate
                                                            ? 'Resumption Date must be specified'
                                                            : ''
                                                    }
                                                />
                                            </Stack>
                                        </Grid>
                                    </Grid>
                                }
                            </When>
                        </>
                    </>
                )}
                {isSmallScreen ? (
                    <>
                        <Grid container direction="row" item xs={12}>
                            <Grid item md={6} xs={12}>
                                <Stack direction="row" alignItems="center" spacing={2}>
                                    <MetHeader3 bold={true} sx={{ mb: 0 }}>
                                        Calculation Type
                                    </MetHeader3>
                                </Stack>
                            </Grid>
                            <Grid item md={6} xs={12}>
                                <Stack direction="row" alignItems="center" spacing={2}>
                                    <Autocomplete
                                        id="drop-down"
                                        options={options}
                                        getOptionLabel={(option: ISelectOptions) => option.label}
                                        onInputChange={handleDropDownChange}
                                        renderInput={(params) => <TextField {...params} variant="outlined" fullWidth />}
                                        sx={{ width: '80%' }}
                                        isOptionEqualToValue={(option: ISelectOptions, value: ISelectOptions) =>
                                            option.id == value.id
                                        }
                                        defaultValue={options[0]}
                                    />
                                </Stack>
                            </Grid>
                        </Grid>
                        <Grid container direction="row" item xs={12}>
                            <Grid item md={6} xs={12}>
                                <Stack direction="row" alignItems="center" spacing={2}>
                                    <MetHeader3 bold={true} sx={{ mb: 0 }}>
                                        Number of Days
                                    </MetHeader3>
                                </Stack>
                            </Grid>
                            <Grid item md={6} xs={12}>
                                <Stack direction="row" alignItems="center" spacing={2}>
                                    <TextField
                                        id="number-of-days"
                                        variant="outlined"
                                        label=" "
                                        InputLabelProps={{
                                            shrink: false,
                                        }}
                                        sx={{ width: '80%' }}
                                        name="numberOfDays"
                                        value={numberOfDays}
                                        onChange={handleChange}
                                    />
                                </Stack>
                            </Grid>
                        </Grid>
                    </>
                ) : (
                    <>
                        <Grid container direction="row" item xs={12}>
                            <Grid item md={6} xs={12}>
                                <Stack direction="row" alignItems="center" spacing={2}>
                                    <MetHeader3 bold={true} sx={{ mb: 0 }}>
                                        Calculation Type
                                    </MetHeader3>
                                </Stack>
                            </Grid>
                            <Grid item md={6} xs={12}>
                                <Stack direction="row" alignItems="center" spacing={2}>
                                    <MetHeader3 bold={true} sx={{ mb: 0 }}>
                                        Number of Days
                                    </MetHeader3>
                                </Stack>
                            </Grid>
                        </Grid>
                        <Grid container direction="row" item xs={12}>
                            <Grid item md={6} xs={12}>
                                <Stack direction="row" alignItems="center" spacing={2}>
                                    <Autocomplete
                                        id="drop-down"
                                        options={options}
                                        getOptionLabel={(option: ISelectOptions) => option.label}
                                        onInputChange={handleDropDownChange}
                                        renderInput={(params) => <TextField {...params} variant="outlined" fullWidth />}
                                        sx={{ width: '80%' }}
                                        isOptionEqualToValue={(option: ISelectOptions, value: ISelectOptions) =>
                                            option.id == value.id
                                        }
                                        defaultValue={options[0]}
                                    />
                                </Stack>
                            </Grid>
                            <Grid item md={6} xs={12}>
                                <Stack direction="row" alignItems="center" spacing={2}>
                                    <TextField
                                        id="number-of-days"
                                        variant="outlined"
                                        label=" "
                                        InputLabelProps={{
                                            shrink: false,
                                        }}
                                        sx={{ width: '80%' }}
                                        name="numberOfDays"
                                        value={numberOfDays}
                                        onChange={handleChange}
                                    />
                                </Stack>
                            </Grid>
                        </Grid>
                    </>
                )}
                <Grid item md={12} xs={12}>
                    <Stack direction="row" alignItems="center" spacing={2}>
                        <MetHeader3 bold={true}>Description</MetHeader3>
                    </Stack>
                </Grid>
                <Grid item md={12} xs={12}>
                    <Stack direction="row" alignItems="center" spacing={2}>
                        <When condition={selectedOption == options[0].label}>
                            {
                                <MetHeader3 sx={{ mb: 2 }}>
                                    {options[0].description}
                                    <a style={{ color: 'blue' }} onClick={() => setShowHideStatus(!showHideStatus)}>{`${
                                        showHideStatus ? ' Hide ' : ' Show '
                                    }`}</a>
                                    Day Zero rules.
                                </MetHeader3>
                            }
                        </When>
                        <When condition={selectedOption == options[1].label}>
                            {<MetHeader3 sx={{ mb: 2 }}>{options[1].description}</MetHeader3>}
                        </When>
                        <When condition={selectedOption == options[2].label}>
                            {<MetHeader3 sx={{ mb: 2 }}>{options[2].description}</MetHeader3>}
                        </When>
                    </Stack>
                </Grid>
                <Grid item md={12} xs={12}>
                    <When condition={showHideStatus}>
                        <DayZeroRules />
                    </When>
                </Grid>
                <Grid container direction="row" item xs={12}>
                    <Grid
                        item
                        container
                        direction={{ xs: 'column', sm: 'row' }}
                        xs={12}
                        justifyContent="flex-end"
                        spacing={1}
                        sx={{ mt: '1em' }}
                    >
                        <Stack
                            direction={{ xs: 'column', sm: 'row' }}
                            spacing={1}
                            width="100%"
                            justifyContent="flex-end"
                        >
                            <PrimaryButton
                                className="btn btn-lg btn-secondary"
                                data-testid={'reset-button'}
                                onClick={() => resetToDefault()}
                            >
                                Reset
                            </PrimaryButton>
                            <PrimaryButton
                                className="btn btn-lg btn-primary"
                                data-testid={'cancel-button'}
                                onClick={() => updateModal(false)}
                            >
                                Close
                            </PrimaryButton>
                            <PrimaryButton
                                className="btn btn-success"
                                data-testid={'cancel-button'}
                                onClick={() => calculator()}
                            >
                                Calculate
                            </PrimaryButton>
                        </Stack>
                    </Grid>
                </Grid>
            </Grid>
        </Modal>
    );
};

export default DayCalculatorModal;
