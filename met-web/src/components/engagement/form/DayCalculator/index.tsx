import React, { useState } from 'react';
import { Modal, Grid, Stack, useMediaQuery, TextField, Autocomplete, Link as MuiLink, Typography } from '@mui/material';
import {
    modalStyle,
    MetHeader1,
    MetHeader4,
    PrimaryButton,
    SecondaryButton,
    MetLabel,
    MetBody,
} from 'components/common';
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
    const isSmallScreen = useMediaQuery(muitheme.breakpoints.down('lg'));
    const dateFormat = 'YYYY-MM-DD';
    const dayZeroLabel = options[0].label;
    const calendarLabel = options[1].label;
    const suspensionLabel = options[2].label;

    // variable to capture the option selected within Calculation Type
    const [selectedOption, setSelectedOption] = useState<ISelectOptions | null>(options[0]);

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
    const isDayZeroSelected = selectedOption?.label == dayZeroLabel;
    const isCalendarSelected = selectedOption?.label == calendarLabel;
    const isSuspensionSelected = selectedOption?.label == suspensionLabel;
    const calculateNumberOfDays = startDate && endDate && !numberOfDays;
    const calculateEndDate = startDate && !endDate && numberOfDays;
    const calculateStartDate = !startDate && endDate && numberOfDays;
    let calculatedStartDate = startDate;
    let calculatedEndDate = endDate;
    let calculatedNumberOfDays = numberOfDays;

    const calculatorForDayZero = () => {
        if (calculateNumberOfDays) {
            calculatedNumberOfDays = dayjs(endDate).diff(dayjs(startDate), 'days');
        } else if (calculateEndDate) {
            calculatedEndDate = dayjs(startDate).add(numberOfDays, 'day').format(dateFormat);
        } else if (calculateStartDate) {
            calculatedStartDate = dayjs(endDate).subtract(numberOfDays, 'day').format(dateFormat);
        }
    };

    const calculatorForCalendar = () => {
        if (calculateNumberOfDays) {
            calculatedNumberOfDays = dayjs(endDate).add(1, 'day').diff(dayjs(startDate), 'days');
        } else if (calculateEndDate) {
            calculatedEndDate = dayjs(startDate)
                .add(numberOfDays - 1, 'day')
                .format(dateFormat);
        } else if (calculateStartDate) {
            calculatedStartDate = dayjs(endDate)
                .subtract(numberOfDays - 1, 'day')
                .format(dateFormat);
        }
    };

    const calculatorForSuspension = () => {
        if (suspensionDate && resumptionDate) {
            const calcNumberOfSuspendedDays = dayjs(resumptionDate).add(1, 'day').diff(dayjs(suspensionDate), 'days');
            if (calculateNumberOfDays) {
                calculatedNumberOfDays =
                    dayjs(endDate).add(1, 'day').diff(dayjs(startDate), 'days') - calcNumberOfSuspendedDays;
            } else if (calculateEndDate) {
                calculatedEndDate = dayjs(startDate)
                    .add(numberOfDays - 1 + calcNumberOfSuspendedDays, 'day')
                    .format(dateFormat);
            } else if (calculateStartDate) {
                calculatedStartDate = dayjs(endDate)
                    .subtract(numberOfDays - 1 + calcNumberOfSuspendedDays, 'day')
                    .format(dateFormat);
            }
        }
    };

    const calculator = () => {
        if (isDayZeroSelected) {
            calculatorForDayZero();
        }

        if (isCalendarSelected) {
            calculatorForCalendar();
        }

        if (isSuspensionSelected) {
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
            calculatorForSuspension();
        }

        setDayCalcData({
            ...dayCalcData,
            startDate: calculatedStartDate,
            endDate: calculatedEndDate,
            numberOfDays: calculatedNumberOfDays,
        });
    };

    return (
        <Modal aria-labelledby="modal-title" open={open} onClose={() => updateModal(false)}>
            <Grid
                container
                direction="row"
                justifyContent="flex-start"
                alignItems="space-between"
                sx={{ ...modalStyle, overflowY: 'scroll' }}
                rowSpacing={2}
            >
                <Grid container direction="row" item xs={12} wrap="nowrap">
                    <Grid item md={11} xs={12}>
                        <Stack direction="row" alignItems="center" spacing={2}>
                            <MetHeader1 bold={true} sx={{ mb: 2 }} data-testid="daycalculator-title">
                                Day Calculator
                            </MetHeader1>
                        </Stack>
                    </Grid>
                </Grid>
                <Grid container direction="row" item xs={12}>
                    <MetHeader4 sx={{ mb: 3 }}>Enter any two fields to calculate the third</MetHeader4>
                </Grid>
                <Grid container direction="row" item xs={12}>
                    <MetLabel sx={{ mb: 0 }}>Engagement Date</MetLabel>
                </Grid>
                {isSmallScreen ? (
                    <>
                        <Grid container direction="row" item xs={12}>
                            <Grid item md={6} xs={12}>
                                <Stack direction="row" alignItems="center" spacing={2}>
                                    <Typography minWidth={{ xs: '2.5em', md: 'auto' }}>From</Typography>
                                </Stack>
                            </Grid>
                            <Grid item md={6} xs={12}>
                                <Stack direction="row" alignItems="center" spacing={2}>
                                    <TextField
                                        id="start-date"
                                        data-testid="start-date"
                                        type="date"
                                        label=" "
                                        InputLabelProps={{
                                            shrink: false,
                                        }}
                                        sx={{ width: '80%' }}
                                        name="startDate"
                                        value={startDate}
                                        placeholder="startDate"
                                        InputProps={{ inputProps: { max: endDate || null } }}
                                        onChange={handleChange}
                                    />
                                </Stack>
                            </Grid>
                        </Grid>
                        <Grid container direction="row" item xs={12}>
                            <Grid item md={6} xs={12}>
                                <Stack direction="row" alignItems="center" spacing={2}>
                                    <Typography minWidth={{ xs: '2.5em', md: 'auto' }}>To</Typography>
                                </Stack>
                            </Grid>
                            <Grid item md={6} xs={12}>
                                <Stack direction="row" alignItems="center" spacing={2}>
                                    <TextField
                                        id="end-date"
                                        data-testid="end-date"
                                        type="date"
                                        label=" "
                                        InputLabelProps={{
                                            shrink: false,
                                        }}
                                        sx={{ width: '80%' }}
                                        name="endDate"
                                        value={endDate}
                                        placeholder="endDate"
                                        InputProps={{ inputProps: { min: startDate || null } }}
                                        onChange={handleChange}
                                    />
                                </Stack>
                            </Grid>
                        </Grid>
                    </>
                ) : (
                    <>
                        <Grid container direction="row" item xs={12} columnSpacing={2}>
                            <Grid item md={6} xs={12}>
                                <Stack direction="row" alignItems="center" spacing={2}>
                                    <Typography minWidth={{ xs: '2.5em', md: 'auto' }} align="center">
                                        From
                                    </Typography>
                                    <TextField
                                        id="start-date"
                                        data-testid="start-date"
                                        type="date"
                                        label=" "
                                        InputLabelProps={{
                                            shrink: false,
                                        }}
                                        sx={{ width: '95%' }}
                                        name="startDate"
                                        value={startDate}
                                        placeholder="startDate"
                                        InputProps={{ inputProps: { max: endDate || null } }}
                                        onChange={handleChange}
                                    />
                                </Stack>
                            </Grid>
                            <Grid item md={6} xs={12}>
                                <Stack direction="row" alignItems="center" spacing={2}>
                                    <Typography minWidth={{ xs: '2.5em', md: 'auto' }} align="center">
                                        To
                                    </Typography>
                                    <TextField
                                        id="end-date"
                                        data-testid="end-date"
                                        type="date"
                                        label=" "
                                        InputLabelProps={{
                                            shrink: false,
                                        }}
                                        sx={{ width: '100%' }}
                                        name="endDate"
                                        value={endDate}
                                        placeholder="endDate"
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
                            <When condition={selectedOption?.label == suspensionLabel}>
                                {
                                    <Grid container direction="row" item xs={12}>
                                        <Grid item md={6} xs={12}>
                                            <Stack direction="row" alignItems="center" spacing={2}>
                                                <MetLabel sx={{ mb: 0 }}>Suspension Date</MetLabel>
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
                            <When condition={selectedOption?.label == suspensionLabel}>
                                {
                                    <Grid container direction="row" item xs={12}>
                                        <Grid item md={6} xs={12}>
                                            <Stack direction="row" alignItems="center" spacing={2}>
                                                <MetLabel sx={{ mb: 0 }}>Resumption Date</MetLabel>
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
                            <When condition={selectedOption?.label == suspensionLabel}>
                                {
                                    <Grid container direction="row" item xs={12}>
                                        <Grid item md={6} xs={12}>
                                            <Stack direction="row" alignItems="center" spacing={2}>
                                                <MetLabel sx={{ mb: 0 }}>Suspension Date</MetLabel>
                                            </Stack>
                                        </Grid>
                                        <Grid item md={6} xs={12}>
                                            <Stack direction="row" alignItems="center" spacing={2}>
                                                <MetLabel sx={{ mb: 0 }}>Resumption Date</MetLabel>
                                            </Stack>
                                        </Grid>
                                    </Grid>
                                }
                            </When>
                        </>
                        <>
                            <When condition={selectedOption?.label == suspensionLabel}>
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
                                                    sx={{ width: '95%' }}
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
                                                    sx={{ width: '100%' }}
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
                                    <MetLabel sx={{ mb: 0 }}>Calculation Type</MetLabel>
                                </Stack>
                            </Grid>
                            <Grid item md={6} xs={12}>
                                <Stack direction="row" alignItems="center" spacing={2}>
                                    <Autocomplete
                                        id="drop-down"
                                        options={options}
                                        getOptionLabel={(option: ISelectOptions) => option.label}
                                        onChange={(
                                            _e: React.SyntheticEvent<Element, Event>,
                                            option: ISelectOptions | null,
                                        ) => {
                                            setSelectedOption(option);
                                        }}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                aria-labelledby="drop-down"
                                                variant="outlined"
                                                fullWidth
                                            />
                                        )}
                                        sx={{ width: '80%' }}
                                        isOptionEqualToValue={(option: ISelectOptions, value: ISelectOptions) =>
                                            option.id == value.id
                                        }
                                        defaultValue={options[0]}
                                        data-testid={'autocomplete'}
                                        value={selectedOption}
                                        placeholder="selectedOption"
                                    />
                                </Stack>
                            </Grid>
                        </Grid>
                        <Grid container direction="row" item xs={12}>
                            <Grid item md={6} xs={12}>
                                <Stack direction="row" alignItems="center" spacing={2}>
                                    <MetLabel sx={{ mb: 0 }}>Number of Days</MetLabel>
                                </Stack>
                            </Grid>
                            <Grid item md={6} xs={12}>
                                <Stack direction="row" alignItems="center" spacing={2}>
                                    <TextField
                                        id="number-of-days"
                                        data-testid="number-of-days"
                                        variant="outlined"
                                        label=" "
                                        InputLabelProps={{
                                            shrink: false,
                                        }}
                                        sx={{ width: '80%' }}
                                        name="numberOfDays"
                                        value={numberOfDays}
                                        placeholder="numberOfDays"
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
                                    <MetLabel sx={{ mb: 0 }}>Calculation Type</MetLabel>
                                </Stack>
                            </Grid>
                            <Grid item md={6} xs={12}>
                                <Stack direction="row" alignItems="center" spacing={2}>
                                    <MetLabel sx={{ mb: 0 }}>Number of Days</MetLabel>
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
                                        onChange={(
                                            _e: React.SyntheticEvent<Element, Event>,
                                            option: ISelectOptions | null,
                                        ) => {
                                            setSelectedOption(option);
                                        }}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                aria-labelledby="drop-down"
                                                variant="outlined"
                                                fullWidth
                                            />
                                        )}
                                        sx={{ width: '95%' }}
                                        isOptionEqualToValue={(option: ISelectOptions, value: ISelectOptions) =>
                                            option.id == value.id
                                        }
                                        defaultValue={options[0]}
                                        data-testid={'autocomplete'}
                                        value={selectedOption}
                                        placeholder="selectedOption"
                                    />
                                </Stack>
                            </Grid>
                            <Grid item md={6} xs={12}>
                                <Stack direction="row" alignItems="center" spacing={2}>
                                    <TextField
                                        id="number-of-days"
                                        data-testid="number-of-days"
                                        variant="outlined"
                                        label=" "
                                        InputLabelProps={{
                                            shrink: false,
                                        }}
                                        sx={{ width: '100%' }}
                                        name="numberOfDays"
                                        value={numberOfDays}
                                        placeholder="numberOfDays"
                                        onChange={handleChange}
                                    />
                                </Stack>
                            </Grid>
                        </Grid>
                    </>
                )}
                <Grid container direction="row" item xs={12}>
                    <Grid
                        item
                        container
                        direction={{ xs: 'column', sm: 'row' }}
                        xs={12}
                        justifyContent="flex-end"
                        spacing={1}
                    >
                        <Stack
                            direction={{ xs: 'column', sm: 'row' }}
                            spacing={1}
                            width="100%"
                            justifyContent="flex-end"
                        >
                            <SecondaryButton data-testid={'reset-button'} onClick={() => resetToDefault()}>
                                Reset All
                            </SecondaryButton>
                        </Stack>
                    </Grid>
                </Grid>
                <Grid item md={12} xs={12}>
                    <Stack direction="row" alignItems="center" spacing={2}>
                        <MetHeader4 bold={true}>Description</MetHeader4>
                    </Stack>
                </Grid>
                <Grid item md={12} xs={12}>
                    <Stack direction="row" alignItems="center" spacing={2}>
                        <When condition={selectedOption?.label == dayZeroLabel}>
                            {
                                <MetBody sx={{ mb: 2 }}>
                                    {options[0].description}
                                    <MuiLink onClick={() => setShowHideStatus(!showHideStatus)}>{`${
                                        showHideStatus ? 'Hide' : 'Show'
                                    }`}</MuiLink>{' '}
                                    Day Zero rules.
                                </MetBody>
                            }
                        </When>
                        <When condition={selectedOption?.label == calendarLabel}>
                            {<MetBody sx={{ mb: 2 }}>{options[1].description}</MetBody>}
                        </When>
                        <When condition={selectedOption?.label == suspensionLabel}>
                            {<MetBody sx={{ mb: 2 }}>{options[2].description}</MetBody>}
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
                            <SecondaryButton data-testid={'cancel-button'} onClick={() => updateModal(false)}>
                                Close
                            </SecondaryButton>
                            <PrimaryButton data-testid={'calculator-button'} onClick={() => calculator()}>
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
