import { Grid2 as Grid, Toolbar, Box } from '@mui/material';

import React from 'react';
import { useAppTranslation } from 'hooks';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCirclePhone } from '@fortawesome/pro-solid-svg-icons/faCirclePhone';
import { faCircleEnvelope } from '@fortawesome/pro-solid-svg-icons/faCircleEnvelope';
import { BodyText, Header1, Header2 } from 'components/common/Typography';

const marginStyle = { mr: 2 };

const SuggestionsList = ({ translate }: { translate: (key: string) => string }) => (
    <Box>
        <Header2>{translate('NoResults.paragraph')}</Header2>
        <ul>
            <BodyText component="li" size="small">
                {translate('NoResults.list.0')}
            </BodyText>
            <BodyText component="li" size="small">
                {translate('NoResults.list.1')}
            </BodyText>
            <BodyText component="li" size="small">
                {translate('NoResults.list.2')}
            </BodyText>
        </ul>
    </Box>
);

const NoResults = () => {
    const { t: translate } = useAppTranslation();

    return (
        <>
            <Toolbar />
            <Grid
                container
                direction={'column'}
                justifyContent="left"
                alignItems="left"
                spacing={1}
                padding={'2em 2em 1em 1em'}
            >
                <Grid sx={{ ...marginStyle, marginBottom: 3 }}>
                    <Header1 data-testid="NoResultsHeader">{translate('NoResults.header')}</Header1>
                </Grid>
                <Grid size={6} justifyContent={'left'} sx={{ ...marginStyle, marginBottom: 3 }}>
                    <SuggestionsList translate={translate} />
                </Grid>
                <Grid
                    container
                    direction="column"
                    alignItems="center"
                    padding={0}
                    width="100%"
                    maxWidth="1120px"
                    height="auto"
                    border="1px solid #FAF9F8"
                    boxShadow="0px 0.6px 1.8px rgba(0, 0, 0, 0.1), 0px 3.2px 7.2px rgba(0, 0, 0, 0.13)"
                    borderRadius="8px"
                    display={'none'} // TODO: remove this once contact information is decided
                >
                    <Grid
                        container
                        alignItems="flex-start"
                        justifyContent="space-between"
                        padding="12px 24px"
                        bgcolor="primary.main"
                        borderRadius="8px 8px 0px 0px"
                    >
                        <Grid>
                            <BodyText style={{ color: 'primary.contrastText', fontSize: '20px' }}>
                                {translate('NoResults.contact.header')}
                            </BodyText>
                        </Grid>
                    </Grid>
                    <Grid container justifyContent="space-between" padding="12px 24px" gap={24}>
                        <Grid>
                            <BodyText>{translate('NoResults.contact.paragraph')}</BodyText>
                        </Grid>
                    </Grid>
                    <Grid container justifyContent="space-between" padding="12px 24px">
                        {/* Telephone section */}
                        <Grid container spacing={2} size={{ xs: 12, sm: 12, md: 6 }} padding="12px 0px">
                            <Grid size={{ xs: 12, sm: 12, md: 12 }} display="flex" alignItems="center">
                                <FontAwesomeIcon icon={faCirclePhone} style={{ fontSize: '32px', color: '#12508F' }} />
                                <div style={{ marginLeft: '12px' }}>
                                    <BodyText bold>{translate('NoResults.contact.telephone.text')}</BodyText>
                                    <BodyText color="primary.main" sx={{ textDecoration: 'underline' }}>
                                        {translate('NoResults.contact.telephone.number')}
                                    </BodyText>
                                </div>
                            </Grid>
                        </Grid>

                        {/* Email section */}
                        <Grid container spacing={2} size={{ xs: 12, sm: 12, md: 6 }} padding="12px 0px">
                            <Grid size={{ xs: 12, sm: 12, md: 12 }} display="flex" alignItems="center">
                                <FontAwesomeIcon
                                    icon={faCircleEnvelope}
                                    style={{ fontSize: '32px', color: '#12508F' }}
                                />
                                <div style={{ marginLeft: '12px' }}>
                                    <BodyText bold>{translate('NoResults.contact.email.text')}</BodyText>
                                    <BodyText color="primary.main" sx={{ textDecoration: 'underline' }}>
                                        {translate('NoResults.contact.email.address')}
                                    </BodyText>
                                </div>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </>
    );
};

export default NoResults;
