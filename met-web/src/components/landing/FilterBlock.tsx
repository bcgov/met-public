import React, { useEffect, useRef, useState, useContext } from 'react';
import { LandingContext } from './LandingContext';
import { Button as MuiButton, Grid, IconButton, Stack, useTheme } from '@mui/material';
import { DeletableFilterChip } from './DeletableFilterChip';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/pro-regular-svg-icons/faMagnifyingGlass';
import { faCircleXmark } from '@fortawesome/pro-regular-svg-icons/faCircleXmark';
import { faXmark } from '@fortawesome/pro-regular-svg-icons/faXmark';
import { faSliders } from '@fortawesome/pro-regular-svg-icons/faSliders';
import { MetadataFilter } from 'components/metadataManagement/types';
import { MetLabel } from 'components/common';
import { debounce } from 'lodash';
import { EngagementDisplayStatus } from 'constants/engagementStatus';
import { useAppTranslation } from 'hooks';
import { Button } from 'components/common/Input/Button';
import { colors } from '../common';
import { CustomTextField, CommonSelect } from 'components/common/Input';
import { If, Then } from 'react-if';

const FilterBlock = () => {
    const { searchFilters, setSearchFilters, setPage, clearFilters, page, setDrawerOpened } =
        useContext(LandingContext);
    const selectedValue = searchFilters.status.length === 0 ? -1 : searchFilters.status[0];

    const tileBlockRef = useRef<HTMLDivElement>(null);
    const [didMount, setDidMount] = useState(false);

    const theme = useTheme();
    const { t: translate } = useAppTranslation();

    const selectableStatuses: Map<number, string> = new Map([
        [EngagementDisplayStatus.Open, translate('landing.filters.status.open')],
        [EngagementDisplayStatus.Upcoming, translate('landing.filters.status.upcoming')],
        [EngagementDisplayStatus.Closed, translate('landing.filters.status.closed')],
        [-1, translate('landing.filters.status.all')],
    ]);

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
        console.log('search', searchFilters);
    }, [searchFilters]);

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
                    <MetLabel paddingBottom={'3px'}>{translate('landing.filters.search')}</MetLabel>
                    <CustomTextField
                        aria-label="Search box for filtering engagements. Search by title or select filters to narrow results automatically."
                        tabIndex={0}
                        fullWidth
                        placeholder={translate('landing.filters.searchPlaceholder')}
                        value={searchText}
                        onChange={(event) => {
                            setSearchText(event.target.value);
                            debounceSetSearchFilters(event.target.value);
                        }}
                        InputProps={{
                            sx: { height: 48 },
                            startAdornment: (
                                <FontAwesomeIcon
                                    icon={faMagnifyingGlass}
                                    style={{
                                        fontSize: '20px',
                                        color: theme.palette.primary.main,
                                        marginRight: '5px',
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
                                    <FontAwesomeIcon icon={faCircleXmark} style={{ fontSize: '22px' }} />
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
                        aria-label={translate('landing.filters.aria.openDrawer')}
                        variant="primary"
                        icon={<FontAwesomeIcon icon={faSliders} style={{ fontSize: '18px' }} />}
                        onClick={() => setDrawerOpened(true)}
                    >
                        {translate('landing.filters.drawer.openButton')}
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
                    spacing={2}
                >
                    <CommonSelect
                        value={selectedValue}
                        id="status-filter"
                        aria-label={`Filtering by ${selectableStatuses.get(
                            selectedValue,
                        )}. Change this filter value by expanding to view all options.`}
                        onChange={(event) => {
                            const selectedValue = Number(event.target.value);
                            if (selectedValue === -1) {
                                setSearchFilters({
                                    ...searchFilters,
                                    status: [],
                                });
                            } else {
                                setSearchFilters({
                                    ...searchFilters,
                                    status: [selectedValue],
                                });
                            }
                            setPage(1);
                        }}
                        renderValue={(value) => selectableStatuses.get(value as number) ?? ''}
                        displayEmpty
                        inputProps={{
                            'aria-label': `Status Filter - ${selectableStatuses.get(selectedValue) ?? ''}`,
                        }}
                        options={Array.from(selectableStatuses).map(([status, label]) => ({
                            value: status,
                            label: label,
                        }))}
                    />
                    {searchFilters.metadata.map((filter) =>
                        filter.values.map((value) => (
                            <DeletableFilterChip
                                key={`${filter.taxon_id}-${value}`}
                                name={value}
                                onDelete={() => handleDeleteFilterChip(filter.taxon_id, value)}
                            />
                        )),
                    )}
                    <If condition={searchFilters.status.length || searchFilters.metadata.length}>
                        <Then>
                            <MuiButton
                                variant="text"
                                onClick={clearFilters}
                                sx={{
                                    fontWeight: 'normal',
                                    height: 48,
                                    fontSize: '15px',
                                    borderRadius: '2em',
                                    p: 2,
                                    '&:focus, &:focus-visible': {
                                        backgroundColor: `${colors.focus.regular.inner}`,
                                        boxShadow: `0 0 0 2px white, 0 0 0 4px ${colors.focus.regular.outer}`,
                                    },
                                }}
                                endIcon={<FontAwesomeIcon icon={faXmark} style={{ fontSize: '20px' }} />}
                            >
                                {translate('landing.filters.clear')}
                            </MuiButton>
                        </Then>
                    </If>
                </Stack>
            </Grid>
        </Grid>
    );
};

export default FilterBlock;
