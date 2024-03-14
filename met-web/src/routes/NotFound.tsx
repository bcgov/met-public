import { Grid, Toolbar, SvgIcon, Box } from '@mui/material';
import { MetHeader1, MetHeader4 } from 'components/common';
import React from 'react';
import { ReactComponent as ErrorSvg } from 'assets/images/404.svg';
import { Link } from 'react-router-dom';

const listItemStyle = { marginBottom: 1 };
const marginStyle = { mr: 2 };

const tenantId = sessionStorage.getItem('tenantId');
const LanguageId = sessionStorage.getItem('languageId');

const SuggestionsList = () => (
    <Box>
        <p style={{ ...listItemStyle, fontWeight: 'bold' }}>Suggestions to help you find what you're looking for:</p>
        <ul>
            <li style={listItemStyle}>Check that the web URL has been entered correctly</li>
            <li style={listItemStyle}>
                Go to our{' '}
                <Link target="_blank" to={`/${tenantId}/${LanguageId}`}>
                    homepage
                </Link>{' '}
                and browse through our past and current engagements
            </li>
            <li style={listItemStyle}>Telephone Device for the Deaf (TDD) across B.C.: 711</li>
            <li style={listItemStyle}>If you would like to email us, please contact *********@gov.bc.ca.</li>
        </ul>
    </Box>
);

const NotFound = () => (
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
            <Grid item sx={{ ...marginStyle, marginBottom: 3 }}>
                <MetHeader1 bold sx={{ fontSize: '2em' }}>
                    The page you're looking for cannot be found.
                </MetHeader1>
            </Grid>
            <Grid item sx={{ marginStyle, marginBottom: 2 }}>
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
                    The page you're looking for might have been removed, moved or is temporarily unavailable.
                </MetHeader4>
            </Grid>
            <Grid item xs={6} justifyContent={'left'}>
                <SuggestionsList />
            </Grid>
        </Grid>
    </>
);

export default NotFound;
