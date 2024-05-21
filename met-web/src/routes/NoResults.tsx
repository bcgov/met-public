import { Grid, Toolbar, Box } from '@mui/material';
import { MetParagraphOld, HeaderTitleOld, SubHeaderOld, ListItem } from 'components/common';
import React from 'react';
import { useAppTranslation } from 'hooks';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCirclePhone } from '@fortawesome/pro-solid-svg-icons/faCirclePhone';
import { faCircleEnvelope } from '@fortawesome/pro-solid-svg-icons/faCircleEnvelope';

const marginStyle = { mr: 2 };

const SuggestionsList = ({ translate }: { translate: (key: string) => string }) => (
    <Box>
        <SubHeaderOld>{translate('NoResults.paragraph')}</SubHeaderOld>
        <ul>
            <li>
                <ListItem>{translate('NoResults.list.0')}</ListItem>
            </li>
            <li>
                <ListItem>{translate('NoResults.list.1')}</ListItem>
            </li>
            <li>
                <ListItem>{translate('NoResults.list.2')}</ListItem>
            </li>
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
                <Grid item sx={{ ...marginStyle, marginBottom: 3 }}>
                    <HeaderTitleOld data-testid="NoResultsHeader">{translate('NoResults.header')}</HeaderTitleOld>
                </Grid>
                <Grid item xs={6} justifyContent={'left'} sx={{ ...marginStyle, marginBottom: 3 }}>
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
                        bgcolor="#12508F"
                        borderRadius="8px 8px 0px 0px"
                    >
                        <Grid item>
                            <MetParagraphOld style={{ color: '#FFFFFF', fontSize: '20px' }}>
                                {translate('NoResults.contact.header')}
                            </MetParagraphOld>
                        </Grid>
                    </Grid>
                    <Grid container justifyContent="space-between" padding="12px 24px" gap={24}>
                        <Grid item>
                            <MetParagraphOld>{translate('NoResults.contact.paragraph')}</MetParagraphOld>
                        </Grid>
                    </Grid>
                    <Grid container justifyContent="space-between" padding="12px 24px">
                        {/* Telephone section */}
                        <Grid container spacing={2} item xs={12} sm={12} md={6} padding="12px 0px">
                            <Grid item xs={12} sm={12} md={12} display="flex" alignItems="center">
                                <FontAwesomeIcon icon={faCirclePhone} style={{ fontSize: '32px', color: '#12508F' }} />
                                <div style={{ marginLeft: '12px' }}>
                                    <MetParagraphOld sx={{ fontWeight: 'bold' }}>
                                        {translate('NoResults.contact.telephone.text')}
                                    </MetParagraphOld>
                                    <MetParagraphOld sx={{ color: '#12508F', textDecoration: 'underline' }}>
                                        {translate('NoResults.contact.telephone.number')}
                                    </MetParagraphOld>
                                </div>
                            </Grid>
                        </Grid>

                        {/* Email section */}
                        <Grid container spacing={2} item xs={12} sm={12} md={6} padding="12px 0px">
                            <Grid item xs={12} sm={12} md={12} display="flex" alignItems="center">
                                <FontAwesomeIcon
                                    icon={faCircleEnvelope}
                                    style={{ fontSize: '32px', color: '#12508F' }}
                                />
                                <div style={{ marginLeft: '12px' }}>
                                    <MetParagraphOld sx={{ fontWeight: 'bold' }}>
                                        {translate('NoResults.contact.email.text')}
                                    </MetParagraphOld>
                                    <MetParagraphOld sx={{ color: '#12508F', textDecoration: 'underline' }}>
                                        {translate('NoResults.contact.email.address')}
                                    </MetParagraphOld>
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
