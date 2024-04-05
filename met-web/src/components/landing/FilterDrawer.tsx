import React, { useContext, useMemo } from 'react';
import { LandingContext } from './LandingContext';
import { SwipeableDrawer, IconButton, Typography, Stack, Button, Grid, useTheme, useMediaQuery } from '@mui/material';
import { Close } from '@mui/icons-material';
import { MetadataFilterChip } from './MetadataFilterChip';
import { EngagementDisplayStatus } from 'constants/engagementStatus';
import { useAppTranslation } from 'hooks';

const FilterDrawer = () => {
    const { searchFilters, setSearchFilters, setPage, metadataFilters, clearFilters, drawerOpened, setDrawerOpened } =
        useContext(LandingContext);

    const theme = useTheme();
    const { t: translate } = useAppTranslation();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));

    const selectedValue = useMemo(() => {
        if (searchFilters.status.length === 0) {
            return -1;
        }
        return searchFilters.status[0];
    }, [searchFilters.status]);

    const handleMetadataFilterClick = (taxonId: number, value: string) => {
        const existingFilter = searchFilters.metadata.find((filter) => filter.taxon_id === taxonId);
        let newValues;
        if (existingFilter) {
            // Toggle value in or out
            newValues = existingFilter.values.includes(value)
                ? existingFilter.values.filter((v) => v !== value)
                : [...existingFilter.values, value];
        } else {
            newValues = [value];
        }
        const metadataFilter = metadataFilters.find((f) => f.taxon_id === taxonId);
        const newMetadataFilters = searchFilters.metadata.filter((filter) => filter.taxon_id !== taxonId);
        if (newValues.length > 0 && metadataFilter) {
            newMetadataFilters.push({
                name: metadataFilter.name,
                values: newValues,
                filter_type: metadataFilter.filter_type,
                taxon_id: taxonId,
            });
        }

        setSearchFilters({ ...searchFilters, metadata: newMetadataFilters });
        setPage(1);
    };

    return (
        <SwipeableDrawer
            aria-label="Filter Engagements"
            anchor="left"
            ModalProps={{
                keepMounted: true, // Better open performance on mobile
                sx: { zIndex: 1300 }, // Cover the floating feedback button
            }}
            PaperProps={{
                sx: {
                    width: isSmallScreen ? '100%' : '50%',
                    background: theme.palette.primary.main,
                    color: 'white',
                    padding: '3em',
                },
            }}
            open={drawerOpened}
            onClose={() => setDrawerOpened(false)}
            onOpen={() => setDrawerOpened(true)}
        >
            <IconButton
                onClick={() => setDrawerOpened(false)}
                title={translate('landing.filters.aria.closeDrawer')}
                sx={{
                    color: 'white',
                    position: 'absolute',
                    top: '1em',
                    right: '1em',
                }}
            >
                <Close />
            </IconButton>
            <Typography mt={3} mb={6} variant="h5">
                {translate('landing.filters.drawer.title')}
            </Typography>

            <Typography mt={3} variant="subtitle1">
                {translate('landing.filters.drawer.statusFilter')}
            </Typography>
            <Stack direction="row" sx={{ mb: 2, mt: 2.5 }} flexWrap="wrap">
                {[
                    -1,
                    EngagementDisplayStatus.Open,
                    EngagementDisplayStatus.Upcoming,
                    EngagementDisplayStatus.Closed,
                ].map((status) => (
                    <MetadataFilterChip
                        key={status}
                        name={(EngagementDisplayStatus[status] || 'All') + ' Engagements'}
                        selected={selectedValue == status}
                        onClick={() => {
                            setSearchFilters({
                                ...searchFilters,
                                status: status == -1 ? [] : [status],
                            });
                            setPage(1);
                        }}
                    />
                ))}
            </Stack>

            {metadataFilters.map((metadataFilter) => (
                <>
                    <Typography mt={3} variant="subtitle1">
                        {translate('landing.filters.drawer.filterHeader').replace(
                            '{0}',
                            metadataFilter.name ?? 'metadata',
                        )}
                    </Typography>
                    <Stack direction="row" sx={{ mb: 2, mt: 2.5 }} flexWrap="wrap">
                        {metadataFilter.values.map((value) => (
                            <MetadataFilterChip
                                key={`${metadataFilter.taxon_id}-${value}`}
                                name={value}
                                selected={searchFilters.metadata.some(
                                    (filter) =>
                                        filter.taxon_id === metadataFilter.taxon_id && filter.values.includes(value),
                                )}
                                onClick={() => handleMetadataFilterClick(metadataFilter.taxon_id, value)}
                            />
                        ))}
                    </Stack>
                </>
            ))}

            <Grid item xs={12} container justifyContent="flex-start" alignItems="flex-end">
                <Button
                    variant="contained"
                    aria-label={translate('landing.filters.aria.applyFilters')}
                    sx={{
                        height: 48,
                        mt: 4,
                        mr: 2,
                        width: '200px',
                        backgroundColor: 'white',
                        color: theme.palette.primary.main,
                        '&:hover, &:focus': {
                            backgroundColor: '#EDEBE9',
                        },
                    }}
                    onClick={() => setDrawerOpened(false)}
                >
                    {translate('landing.filters.drawer.apply')}
                </Button>

                <Button
                    variant="text"
                    sx={{
                        height: 48,
                        mt: 2,
                        width: '200px',
                        color: 'white',
                        '&:hover,&:focus': {
                            backgroundColor: '#1E5189',
                        },
                    }}
                    onClick={clearFilters}
                    endIcon={<Close />}
                >
                    {translate('landing.filters.clear')}
                </Button>
            </Grid>
        </SwipeableDrawer>
    );
};

export default FilterDrawer;
