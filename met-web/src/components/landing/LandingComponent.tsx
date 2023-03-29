import React, { useContext, useEffect, useRef, useState } from 'react';
import { Autocomplete, CircularProgress, Grid, MenuItem, Select, TextField } from '@mui/material';
import { Banner } from 'components/banner/Banner';
import { MetHeader1, MetLabel, MetParagraph } from 'components/common';
import TileBlock from './TileBlock';
import { Engagement } from 'models/engagement';
import { debounce } from 'lodash';
import { getEngagements } from 'services/engagementService';
import { ENGAGEMENT_PROJECT_TYPES } from 'components/engagement/form/EngagementFormTabs/constants';
import { EngagementStatus } from 'constants/engagementStatus';
import { LandingContext } from './LandingContext';

interface SearchFilters {
    name: string;
    status: number[];
    project_type: string;
}
const LandingComponent = () => {
    const { searchFilters, setSearchFilters } = useContext(LandingContext);
    const [engagementOptionsLoading, setEngagementOptionsLoading] = useState(false);
    const [engagementOptions, setEngagementOptions] = useState<Engagement[]>([]);

    const loadEngagementOptions = async (searchText: string) => {
        if (!searchText) {
            return;
        }
        try {
            setEngagementOptionsLoading(true);
            const response = await getEngagements({
                search_text: searchText,
            });
            setEngagementOptions(response.items);
            setEngagementOptionsLoading(false);
        } catch (error) {
            setEngagementOptionsLoading(false);
        }
    };

    const debounceLoadEngagments = useRef(
        debounce((searchText: string) => {
            loadEngagementOptions(searchText);
        }, 1000),
    ).current;

    return (
        <Grid container direction="row" justifyContent="flex-start" alignItems="flex-start">
            <Grid item xs={12}>
                <Banner imageUrl="https://citz-gdx.objectstore.gov.bc.ca/new-bucket-048a62a2/6e20c9fe-e737-49fe-82eb-590c5ce575bc.jpg">
                    <Grid
                        container
                        direction="row"
                        justifyContent="flex-start"
                        alignItems="flex-start"
                        height="100%"
                        sx={{
                            position: 'absolute',
                            top: '0px',
                            left: '0px',
                        }}
                    >
                        <Grid
                            item
                            lg={6}
                            sm={12}
                            container
                            direction="row"
                            justifyContent="flex-start"
                            alignItems="flex-start"
                            sx={{
                                backgroundColor: 'rgba(242, 242, 242, 0.95)',
                                padding: '1em',
                                margin: '1em',
                                maxWidth: '90%',
                            }}
                            m={{ lg: '3em 5em 0 3em', md: '3em', sm: '1em' }}
                            rowSpacing={2}
                        >
                            <Grid item xs={12}>
                                <MetHeader1>Environmental Assessment Office</MetHeader1>
                            </Grid>
                            <Grid item xs={12}>
                                <MetParagraph>Something about the EAO and public engagements….</MetParagraph>
                            </Grid>
                        </Grid>
                    </Grid>
                </Banner>
            </Grid>
            <Grid
                container
                item
                xs={12}
                direction="row"
                justifyContent={'flex-start'}
                alignItems="flex-start"
                m={{ md: '2em', xs: '2em', lg: '2em 5em' }}
                spacing={3}
            >
                <Grid
                    container
                    item
                    xs={12}
                    justifyContent={'flex-start'}
                    alignItems="flex-start"
                    columnSpacing={2}
                    rowSpacing={4}
                >
                    <Grid item xs={12} sm={6} md={4} lg={3}>
                        <MetLabel sx={{ marginBottom: '2px', display: 'flex' }}>Engagment name</MetLabel>
                        <Autocomplete
                            options={engagementOptions || []}
                            onInputChange={(_event, newInputValue) => {
                                debounceLoadEngagments(newInputValue);
                            }}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    fullWidth
                                    placeholder="Type engagement's name..."
                                    InputLabelProps={{
                                        shrink: false,
                                    }}
                                    InputProps={{
                                        ...params.InputProps,
                                        endAdornment: (
                                            <>
                                                {engagementOptionsLoading ? (
                                                    <CircularProgress
                                                        color="primary"
                                                        size={20}
                                                        sx={{ marginRight: '2em' }}
                                                    />
                                                ) : null}
                                                {params.InputProps.endAdornment}
                                            </>
                                        ),
                                    }}
                                />
                            )}
                            onChange={(_, engagement) => {
                                setSearchFilters({
                                    ...searchFilters,
                                    name: engagement?.name || '',
                                });
                            }}
                            getOptionLabel={(engagement: Engagement) => engagement.name}
                            loading={false}
                            size="small"
                            sx={{ maxWidth: 345 }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} lg={3}>
                        <MetLabel>Status</MetLabel>
                        <TextField
                            id="status"
                            name="status"
                            variant="outlined"
                            label=" "
                            defaultValue=""
                            value={searchFilters.status}
                            fullWidth
                            size="small"
                            onChange={(event) => {
                                setSearchFilters({
                                    ...searchFilters,
                                    status: event.target.value ? [Number(event.target.value)] : [],
                                });
                            }}
                            select
                            InputLabelProps={{
                                shrink: false,
                            }}
                            sx={{ maxWidth: 345 }}
                        >
                            <MenuItem value={0} sx={{ fontStyle: 'italic', height: '2em' }}>
                                {''}
                            </MenuItem>
                            <MenuItem value={EngagementStatus.Published}>Published</MenuItem>
                            <MenuItem value={EngagementStatus.Closed}>Closed</MenuItem>
                        </TextField>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} lg={3}>
                        <MetLabel>Project Type</MetLabel>
                        <TextField
                            id="project-type"
                            name="projectType"
                            variant="outlined"
                            label=" "
                            defaultValue=""
                            value={searchFilters.project_type}
                            fullWidth
                            size="small"
                            onChange={(event) => {
                                setSearchFilters({
                                    ...searchFilters,
                                    project_type: event.target.value || '',
                                });
                            }}
                            select
                            InputLabelProps={{
                                shrink: false,
                            }}
                            sx={{ maxWidth: 345 }}
                        >
                            <MenuItem value={''} sx={{ fontStyle: 'italic', height: '2em' }}>
                                {' '}
                            </MenuItem>
                            {ENGAGEMENT_PROJECT_TYPES.map((type) => {
                                return <MenuItem value={type}>{type}</MenuItem>;
                            })}
                        </TextField>
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <TileBlock />
                </Grid>
            </Grid>
        </Grid>
    );
};

export default LandingComponent;
