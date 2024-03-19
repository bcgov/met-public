import { Grid, Toolbar, SvgIcon, Box } from '@mui/material';
import { MetHeader1, MetHeader4 } from 'components/common';
import React from 'react';
import { ReactComponent as ErrorSvg } from 'assets/images/404.svg';
import { Link } from 'react-router-dom';
import { useAppTranslation } from 'hooks';

const listItemStyle = { marginBottom: 1 };
const marginStyle = { mr: 2 };

const tenantId = sessionStorage.getItem('tenantId');
const LanguageId = sessionStorage.getItem('languageId');

const SuggestionsList = ({ translate }: { translate: (key: string) => string }) => (
    <Box>
        <p style={{ ...listItemStyle, fontWeight: 'bold' }}>{translate('notFound.paragraph')}</p>
        <ul>
            <li style={listItemStyle}>{translate('notFound.list.0')}</li>
            <li style={listItemStyle}>
                {translate('notFound.list.1')}{' '}
                <Link target="_blank" to={`/${tenantId}/${LanguageId}`}>
                    {translate('notFound.list.2')}
                </Link>{' '}
                {translate('notFound.list.3')}
            </li>
            <li style={listItemStyle}>{translate('notFound.list.4')}</li>
            <li style={listItemStyle}>{translate('notFound.list.5')}</li>
        </ul>
    </Box>
);

const NotFound = () => {
    const { t: translate } = useAppTranslation();

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
                <Grid item sx={{ ...marginStyle, marginBottom: 3 }}>
                    <MetHeader1 bold sx={{ fontSize: '2em' }}>
                        {translate('notFound.header.0')}
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
                        {translate('notFound.header.1')}
                    </MetHeader4>
                </Grid>
                <Grid item xs={6} justifyContent={'left'}>
                    <SuggestionsList translate={translate} />
                </Grid>
            </Grid>
        </>
    );
};

export default NotFound;
