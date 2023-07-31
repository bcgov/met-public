import { Grid, Toolbar, Typography } from '@mui/material';
import { MetHeader1, MetHeader4 } from 'components/common';
import React from 'react';
import { IProps } from './types';
import { SvgIcon } from '@mui/material';
import { ReactComponent as ErrorSvg } from 'assets/images/404.svg';
import { Link } from 'react-router-dom';

const NotFound = React.memo(
    ({
        errorMessage = `We couldn't find the page you were looking for. Perhaps you entered the wrong URL? Please verify that the spelling/ capitalization are correct and try reloading the page.`,
        errorCode = '404',
    }: IProps) => {
        const errorText = [
            'Check that the web URL has been entered correctly',
            <>
                Go to our <Link to="/">homepage</Link> and browse through our past and current public engagements
            </>,
            'Use the Search function at the top of this page',
            'Telephone Device for the Deaf (TDD) across B.C.: 711',
            'If you would like to email us, please contact *********@gov.bc.ca',
        ];

        return (
            <>
                <Toolbar />
                <Grid
                    container
                    direction={'column'}
                    justifyContent="center"
                    alignItems="center"
                    spacing={1}
                    padding={'2em 2em 1em 2em'}
                >
                    <Grid item sx={{ mr: 2, mb: 2 }}>
                        <MetHeader1 bold sx={{ fontSize: '2em' }}>
                            The page you're looking for cannot be found.
                        </MetHeader1>
                    </Grid>
                    <Grid
                        item
                        sx={{
                            mr: 2,
                        }}
                    >
                        <SvgIcon
                            fontSize="inherit"
                            component={ErrorSvg}
                            viewBox="0 0 404 320"
                            sx={{
                                width: '25em', // adjust these values as per your needs
                                height: '15em',
                                marginX: 1,
                                boxSizing: 'border-box',
                                padding: '0px',
                            }}
                        />
                    </Grid>
                    <Grid item xs={6} justifyContent="center" mb={4}>
                        <MetHeader4 align="flex-start" bold>
                            The page you're looking for might have been removed, move or is temporarily unavailable.
                        </MetHeader4>
                    </Grid>
                    <Grid item xs={6} justifyContent={'left'}>
                        <Typography component="div">
                            <Typography component="p" sx={{ fontWeight: 'bold' }}>
                                Suggestions to help find what you're looking for:
                            </Typography>
                            <ul>
                                {errorText.map((error, index) => (
                                    <Typography component="li" key={index} mb={1}>
                                        {error}
                                    </Typography>
                                ))}
                            </ul>
                        </Typography>
                    </Grid>
                </Grid>
            </>
        );
    },
);

export default NotFound;
