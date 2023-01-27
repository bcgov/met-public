import React, { useState } from 'react';
import Grid from '@mui/material/Grid';
import { MetBody, MetLabel } from 'components/common';
import { Accordion, AccordionDetails, AccordionSummary } from '@mui/material';
import { AppConfig } from 'config';
import { Engagement } from 'models/engagement';
import { When } from 'react-if';

const EngagementsAccordion = ({
    engagements,
    bgColor,
    borderColor,
}: {
    engagements: Engagement[];
    bgColor: string;
    borderColor: string;
}) => {
    const urlpath = AppConfig.redashDashboardUrl;
    const [openedEngagements, setOpenedEngagements] = useState<number[]>([]);
    if (engagements.length == 0) {
        return (
            <Grid item xs={12}>
                <MetLabel>No Engagements Found</MetLabel>
            </Grid>
        );
    }

    const handleChange = (engagementId: number) => {
        if (!openedEngagements.some((id) => id == engagementId)) {
            setOpenedEngagements([...openedEngagements, engagementId]);
        }
    };

    return (
        <>
            {engagements.map((engagement) => {
                return (
                    <Accordion
                        onChange={() => {
                            handleChange(engagement.id);
                        }}
                        key={engagement.id}
                        sx={{
                            mt: 1,
                            borderStyle: 'solid',
                            borderColor: borderColor,
                            boxShadow: 'none',
                        }}
                    >
                        <AccordionSummary
                            sx={{
                                backgroundColor: bgColor,
                                borderBottom: `solid 1px ${borderColor}`,
                            }}
                        >
                            <Grid item xs={7}>
                                <MetLabel>{engagement.name}</MetLabel>
                            </Grid>
                            <Grid item xs={5} textAlign="right">
                                <MetBody>
                                    {engagement.start_date}
                                    {' - '}
                                    {engagement.end_date}
                                </MetBody>
                            </Grid>
                        </AccordionSummary>
                        <AccordionDetails>
                            <When condition={openedEngagements.some((id) => id == engagement.id)}>
                                <iframe
                                    style={{
                                        width: '100%',
                                        height: '1310px',
                                        overflow: 'scroll',
                                        border: 'none',
                                    }}
                                    src={`${urlpath}${engagement.id}`}
                                />
                            </When>
                        </AccordionDetails>
                    </Accordion>
                );
            })}
        </>
    );
};

export default EngagementsAccordion;
