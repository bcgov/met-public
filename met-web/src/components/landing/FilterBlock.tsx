// FilterBlock.js
import React, { useEffect, useRef, useState } from 'react';
import { useContext } from 'react';
import { LandingContext } from './LandingContext';
import {
    Button,
    Select,
    MenuItem,
    ListItemIcon,
    ListItemText,
    Grid,
    TextField,
    IconButton,
    Stack,
    useTheme,
} from '@mui/material';
import { DeletableFilterChip } from './DeletableFilterChip';
import { Close, Check, HighlightOff, Tune } from '@mui/icons-material';
import { MetadataFilter } from 'components/metadataManagement/types';
import { MetLabel } from 'components/common';
import { debounce } from 'lodash';
import { Search } from '@mui/icons-material';
import { EngagementDisplayStatus } from 'constants/engagementStatus';

const FilterBlock = () => {
    const { searchFilters, setSearchFilters, setPage, clearFilters, page, setDrawerOpened } =
        useContext(LandingContext);
    const selectedValue = searchFilters.status.length === 0 ? -1 : searchFilters.status[0];

    const tileBlockRef = useRef<HTMLDivElement>(null);
    const [didMount, setDidMount] = useState(false);

    const selectableStatuses: number[] = [
        EngagementDisplayStatus.Open,
        EngagementDisplayStatus.Upcoming,
        EngagementDisplayStatus.Closed,
    ];

    const theme = useTheme();

    const debounceSetSearchFilters = useRef(
        debounce((searchText: string) => {
            setSearchFilters({
                ...searchFilters,
                name: searchText,
            });
        }, 300),
    ).current;

    useEffect(() => {
        setDidMount(true);
        return () => setDidMount(false);
    }, []);

    useEffect(() => {
        if (didMount) {
            const yOffset = tileBlockRef?.current?.offsetTop;
            window.scrollTo({ top: yOffset || 0, behavior: 'smooth' });
        }
    }, [page]);

    const [searchText, setSearchText] = useState('');

    const handleDeleteFilterChip = (taxonId: number, value: string) => {
        const newMetadataFilters = searchFilters.metadata
            .map((filter: MetadataFilter) => {
                if (filter.taxon_id === taxonId) {
                    // Remove the value
                    const newValues = filter.values.filter((v) => v !== value);
                    return { ...filter, values: newValues };
                }
                return filter;
            })
            .filter((filter) => filter.values.length > 0); // Remove any filters with no values left

        setSearchFilters({ ...searchFilters, metadata: newMetadataFilters });
        setPage(1);
    };

    return (
        <Grid container item xs={10} justifyContent="flex-start" alignItems="flex-start" rowSpacing={3}>
            <Grid
                container
                item
                xs={12}
                justifyContent="flex-start"
                alignItems="self-end"
                columnSpacing={2}
                rowSpacing={4}
                marginTop="2em"
                ref={tileBlockRef}
            >
                <Grid item xl={6} lg={8} md={10} sm={8} xs={12}>
                    <MetLabel>Search Engagements</MetLabel>
                    <TextField
                        fullWidth
                        placeholder="Engagement Title"
                        value={searchText}
                        onChange={(event) => {
                            setSearchText(event.target.value);
                            debounceSetSearchFilters(event.target.value);
                        }}
                        InputProps={{
                            sx: { height: 48 },
                            startAdornment: (
                                <Search
                                    sx={{
                                        color: theme.palette.primary.main,
                                        mr: 0.5,
                                    }}
                                />
                            ),
                            endAdornment: searchText ? (
                                <IconButton
                                    aria-label="clear search"
                                    title="Clear search"
                                    sx={{ color: '#9F9D9C' }}
                                    onClick={() => {
                                        setSearchFilters({
                                            ...searchFilters,
                                            name: '',
                                        });
                                        setSearchText('');
                                    }}
                                >
                                    <HighlightOff />
                                </IconButton>
                            ) : undefined,
                        }}
                    />
                </Grid>
                <Grid
                    item
                    xs={12}
                    sm={3}
                    md={2}
                    lg={2}
                    xl={1}
                    container
                    justifyContent="flex-start"
                    alignItems="flex-start"
                >
                    <Button
                        fullWidth
                        variant="contained"
                        color="primary"
                        startIcon={<Tune />}
                        onClick={() => setDrawerOpened(true)}
                        sx={{ height: 48 }}
                    >
                        Filter
                    </Button>
                </Grid>
            </Grid>
            <Grid item xs={12} container justifyContent="flex-start" alignItems="flex-start">
                <Stack
                    direction="row"
                    sx={{ mb: 2 }}
                    flexWrap="wrap"
                    justifyContent="flex-start"
                    alignItems="flex-start"
                >
                    <Select
                        value={selectedValue}
                        id="status-filter"
                        onChange={(event) => {
                            const selectedValue = Number(event.target.value);
                            if (selectedValue === -1) {
                                // Reset status filter to an empty array for "All Engagements"
                                setSearchFilters({
                                    ...searchFilters,
                                    status: [],
                                });
                            } else {
                                // Add selected status to the filter array
                                setSearchFilters({
                                    ...searchFilters,
                                    status: [selectedValue],
                                });
                            }
                            setPage(1);
                        }}
                        renderValue={(value) => {
                            // for rendering the selected value
                            if (Number(value) === -1) return 'All Engagements';
                            return EngagementDisplayStatus[Number(value)] + ' Engagements';
                        }}
                        displayEmpty
                        inputProps={{
                            'aria-label': 'Select engagement status filter',
                            style: { padding: 0 },
                        }}
                        sx={{
                            mr: 1,
                            mb: 1.5,
                            p: 1,
                            height: 48,
                            borderRadius: '2em',
                            backgroundColor: theme.palette.primary.main,
                            color: 'white',
                            borderColor: 'transparent',
                            boxShadow: 3,
                            // the arrow icon
                            '& svg': {
                                color: 'white',
                            },
                        }}
                        MenuProps={{
                            anchorOrigin: {
                                vertical: 'bottom',
                                horizontal: 'left',
                            },
                            transformOrigin: {
                                vertical: 'top',
                                horizontal: 'left',
                            },
                            sx: {
                                backgroundColor: 'transparent',
                                borderRadius: '8px',
                                boxShadow: 3,
                                mt: 1,
                                ml: -1,
                                '& .MuiPaper-root': {
                                    borderRadius: '8px',
                                    boxShadow: 3,
                                    overflow: 'hidden',
                                    border: '1px solid var(--Border-Light, #D9D9D9);',
                                },
                                '& ul': {
                                    p: 0,
                                    '& li': {
                                        fontSize: '16px',
                                        height: 48,
                                        '&:hover': {
                                            backgroundColor: 'var(--surface-color-secondary-hover, #ECEAE8)',
                                        },
                                        '&.Mui-selected': {
                                            backgroundColor: 'var(--surface-color-brand-blue-20, #D8EAFD);',
                                        },
                                        '& span': {
                                            color: 'var(--Type-Primary, #292929);',
                                        },
                                        '&.Mui-selected span': {
                                            fontWeight: 'bold',
                                            color: theme.palette.primary.main,
                                        },
                                        '&:not(:first-of-type)': {
                                            borderTop: '1px solid var(--Border-Light, #D9D9D9);',
                                        },
                                    },
                                },
                            },
                        }}
                    >
                        {selectableStatuses.map((status) => (
                            <MenuItem key={status} value={status}>
                                {selectedValue === status && (
                                    <ListItemIcon>
                                        <Check fontSize="small" />
                                    </ListItemIcon>
                                )}
                                <ListItemText primary={EngagementDisplayStatus[status] + ' Engagements'} />
                            </MenuItem>
                        ))}
                        <MenuItem value={-1}>
                            {selectedValue === -1 && (
                                <ListItemIcon>
                                    <Check fontSize="small" />
                                </ListItemIcon>
                            )}
                            <ListItemText primary="All Engagements" />
                        </MenuItem>
                    </Select>
                    {searchFilters.metadata.map((filter) =>
                        filter.values.map((value) => (
                            <DeletableFilterChip
                                key={`${filter.taxon_id}-${value}`}
                                name={value}
                                onDelete={() => handleDeleteFilterChip(filter.taxon_id, value)}
                                value={value}
                            />
                        )),
                    )}
                    <Button
                        variant="text"
                        onClick={clearFilters}
                        sx={{
                            fontWeight: 'normal',
                            height: 48,
                            fontSize: '15px',
                            borderRadius: '2em',
                            p: 2,
                        }}
                        endIcon={<Close />}
                    >
                        Clear Filters
                    </Button>
                </Stack>
            </Grid>
        </Grid>
    );
};

export default FilterBlock;
