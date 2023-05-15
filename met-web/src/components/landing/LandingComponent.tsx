import React, { useContext, useEffect, useRef, useState } from 'react';
import { Autocomplete, CircularProgress, Grid, MenuItem, TextField } from '@mui/material';
import { Banner } from 'components/banner/Banner';
import { MetHeader1, MetLabel, MetParagraph } from 'components/common';
import TileBlock from './TileBlock';
import { Engagement } from 'models/engagement';
import { debounce } from 'lodash';
import { getEngagements } from 'services/engagementService';
import { EngagementDisplayStatus } from 'constants/engagementStatus';
import { LandingContext } from './LandingContext';
import { Container } from '@mui/system';
import { AppConfig } from 'config';

const LandingComponent = () => {
    const { searchFilters, setSearchFilters, setPage, page } = useContext(LandingContext);
    const [engagementOptionsLoading, setEngagementOptionsLoading] = useState(false);
    const [engagementOptions, setEngagementOptions] = useState<Engagement[]>([]);
    const [didMount, setDidMount] = useState(false);

    const { engagementProjectTypes } = AppConfig.constants;

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

    const debounceLoadEngagements = useRef(
        debounce((searchText: string) => {
            loadEngagementOptions(searchText);
        }, 1000),
    ).current;

    const tileBlockRef = useRef<HTMLDivElement>(null);

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

    return (
        <Grid container direction="row" justifyContent={'center'} alignItems="center">
            <Grid item xs={12}>
                <Banner
                    height={'330px'}
                    imageUrl="https://camo.githubusercontent.com/a7020c70c0063ae49f9429f742b367a8f72f0e3430985cd1127bda4a00d4c516/68747470733a2f2f696d616765732e7a656e68756275736572636f6e74656e742e636f6d2f3632363162633161303463366139346332656461646464642f64346137383138652d346131392d346433382d613163632d373334316335366630386536"
                >
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

            <Container maxWidth={false} sx={{ maxWidth: '1700px' }}>
                <Grid
                    container
                    item
                    xs={12}
                    direction="row"
                    justifyContent={'center'}
                    alignItems="center"
                    rowSpacing={3}
                >
                    <Grid
                        container
                        item
                        xs={10}
                        justifyContent={'flex-start'}
                        alignItems="flex-start"
                        columnSpacing={2}
                        rowSpacing={4}
                        marginTop={'2em'}
                        ref={tileBlockRef}
                    >
                        <Grid item xs={12} sm={6} md={4} lg={4}>
                            <MetLabel sx={{ marginBottom: '2px', display: 'flex' }}>Engagement name</MetLabel>
                            <Autocomplete
                                options={engagementOptions || []}
                                onInputChange={(_event, newInputValue) => {
                                    debounceLoadEngagements(newInputValue);
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
                                    setPage(1);
                                }}
                                getOptionLabel={(engagement: Engagement) => engagement.name}
                                loading={false}
                                size="small"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={4} lg={4}>
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
                                    setPage(1);
                                }}
                                select
                                InputLabelProps={{
                                    shrink: false,
                                }}
                            >
                                <MenuItem value={0} sx={{ fontStyle: 'italic', height: '2em' }}>
                                    {''}
                                </MenuItem>
                                <MenuItem value={EngagementDisplayStatus.Open}>Open</MenuItem>
                                <MenuItem value={EngagementDisplayStatus.Upcoming}>Upcoming</MenuItem>
                                <MenuItem value={EngagementDisplayStatus.Closed}>Closed</MenuItem>
                            </TextField>
                        </Grid>
                        <Grid item xs={12} sm={6} md={4} lg={4}>
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
                                    setPage(1);
                                }}
                                select
                                InputLabelProps={{
                                    shrink: false,
                                }}
                            >
                                <MenuItem value={''} sx={{ fontStyle: 'italic', height: '2em' }}>
                                    {' '}
                                </MenuItem>
                                {engagementProjectTypes.map((type: string) => {
                                    return (
                                        <MenuItem key={type} value={type}>
                                            {type}
                                        </MenuItem>
                                    );
                                })}
                            </TextField>
                        </Grid>
                    </Grid>
                    <Grid item xs={10} container justifyContent={'center'} alignItems="center">
                        <TileBlock />
                    </Grid>
                </Grid>
            </Container>
        </Grid>
    );
};

export default LandingComponent;
