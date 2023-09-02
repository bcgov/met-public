import React, { useContext, useState } from 'react';
import { Checkbox, FormControlLabel, FormGroup, Grid, Link } from '@mui/material';
import { MetLabel, MetParagraph, PrimaryButton } from 'components/common';
import { useAppDispatch, useAppTranslation } from 'hooks';
import { FormContext } from './FormContext';
import { TAB_TWO } from './constants';
import { openNotification } from 'services/notificationService/notificationSlice';

export const FirstTab = () => {
    const { t: translate } = useAppTranslation();
    const { setTabValue, setFormSubmission } = useContext(FormContext);
    const dispatch = useAppDispatch();

    const [informationForm, setInformationForm] = useState({
        understand: false,
        termsOfReference: false,
    });

    const handleNextClick = () => {
        if (Object.values(informationForm).some((value) => !value)) {
            dispatch(
                openNotification({
                    text: 'Cannot proceed without checking all the boxes.',
                    severity: 'error',
                }),
            );
            return;
        }
        setFormSubmission((prev) => ({ ...prev, ...informationForm }));
        setTabValue(TAB_TWO);
    };

    const handleCheckBoxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = event.target;
        setInformationForm({ ...informationForm, [name]: checked });
    };

    const contactEmail = translate('cacForm.contactEmail');
    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <MetLabel>What is a Community Advisory Committee (CAC)?</MetLabel>
                <MetParagraph>
                    A Community Advisory Committee provides a venue for interested members of the public who have
                    information on the potential effects of a project on a community to stay up to date on the progress
                    of the environmental assessment and to be informed of opportunities to provide their input and
                    advice. Community Advisory Committee members could, for example, provide local knowledge of the
                    community, the environment or the use of the proposed project area.
                </MetParagraph>
            </Grid>
            <Grid item xs={12}>
                <MetParagraph>
                    The format and structure will depend on the potential effects of a project and community interest in
                    a project, amongst other considerations. The starting point for a community advisory committee in
                    every assessment (with sufficient community interest) will be an email subscription list.
                </MetParagraph>
            </Grid>

            <Grid item xs={12}>
                <MetLabel>What can I expect as a Community Advisory Committee Member?</MetLabel>
                {/* TODO: Get this from the eao.json */}
                <MetParagraph>
                    The Environmental Assessment Office will provide subscribed Community Advisory Committee members
                    information on the environmental assessment process and the proposed project, including
                    notifications of process milestones, when and where key documents are posted, information on public
                    comment periods and any other engagement opportunities. Members will be invited to provide their
                    input through the public comment periods held throughout the environmental assessment and, depending
                    on the overall interest of Community Advisory Committee members, the Environmental Assessment Office
                    may directly seek the advice of Community Advisory Committee members and establish other engagement
                    opportunities. See the Community Advisory Committee Guideline for further information.
                </MetParagraph>
            </Grid>

            <Grid item xs={12}>
                <MetLabel>I understand that...</MetLabel>
            </Grid>
            <Grid item xs={12}>
                Personal information is collected under Section 26(c) of the Freedom of Information and Protection of
                Privacy Act, for the purpose of participating in the Community Advisory Committee conducted by the
                Environmental Assessment Office. If you have any questions about the collection, use and disclosure of
                your personal information, please contact {translate('cacForm.contactTitle')} at{' '}
                <Link href={`mailto:${contactEmail}`}>{contactEmail}</Link>.
            </Grid>

            <Grid item xs={12}>
                <FormGroup>
                    <FormControlLabel
                        control={
                            <Checkbox
                                name="understand"
                                checked={informationForm.understand}
                                onChange={handleCheckBoxChange}
                            />
                        }
                        label={
                            <MetLabel>By checking this box, I acknowledge that I understand the above text.</MetLabel>
                        }
                    />
                    <FormControlLabel
                        control={
                            <Checkbox
                                name="termsOfReference"
                                checked={informationForm.termsOfReference}
                                onChange={handleCheckBoxChange}
                            />
                        }
                        label={
                            <MetLabel>
                                By checking this box, I acknowledge that I have read, understood, and will abide by the{' '}
                                <Link href="https://www2.gov.bc.ca/assets/gov/environment/natural-resource-stewardship/environmental-assessments/guidance-documents/2018-act/community_advisory_committee_guideline_v1.pdf">
                                    Community Advisory Committee Terms of Reference.
                                </Link>
                            </MetLabel>
                        }
                    />
                </FormGroup>
            </Grid>

            <Grid item xs={12}>
                <PrimaryButton onClick={handleNextClick}>Next</PrimaryButton>
            </Grid>
        </Grid>
    );
};
