import { Grid } from '@mui/material';
import { MetParagraph } from 'components/common';
import React, { ReactNode } from 'react';

export enum EngagementPhases {
    Standalone = 0,
    EarlyEngagement = 1,
    ProcessPlanning = 2,
    ApplicationDevelopmentReview = 3,
    EffectsAssessmentRecomendation = 4,
}

export interface ProcessStageProps {
    mobile?: boolean;
    backgroundColor: string;
    learnMoreBackgroundColor: string;
    title: string;
    learnMoreText: ReactNode;
    popOverText?: string;
}

export const ENGAGEMENT_PHASES = {
    EarlyEngagement: {
        title: 'Early Engagement',
        backgroundColor: '#54858D',
        learnMoreBackgroundColor: '#D1D9DD',
        learnMoreText: (
            <Grid item xs={12}>
                <MetParagraph>
                    Engage with Indigenous nations, stakeholders, technical experts and the public to identify potential
                    key issues early in the process, and ways they could be addressed.
                </MetParagraph>
            </Grid>
        ),
        popOverText:
            'Tell us about your interests, issues and concerns about the initial proposal for the project. How would the project as proposed personally affect you, your family, or your community? Tell us how you want to provide feedback and be involved in the rest of the assessment process.',
    },
    ReadinessDecision: {
        title: 'Readiness Decision',
        backgroundColor: '#DA6D65',
        learnMoreBackgroundColor: '#FCE5E4',
        learnMoreText: (
            <Grid item xs={12}>
                <MetParagraph>
                    Review detailed project description, and input from early engagement and technical advisors, to
                    determine whether to proceed to environmental assessment.Consensus with Indigenous nations sought.
                </MetParagraph>
            </Grid>
        ),
        popOverText:
            'Decision point: EAO can recommend project proceed to assessment, be exempted or terminated from the process.',
    },
    ProcessPlanning: {
        title: 'Process Planning',
        backgroundColor: '#043673',
        learnMoreBackgroundColor: '#C8CAD6',
        learnMoreText: (
            <Grid item xs={12}>
                <MetParagraph>
                    'Engage with Indigenous nations, stakeholders, technical experts to establish how the environmental
                    assessment will be conducted, including scope, procedures and methods, and how provincial and
                    Indigenous processes and decision-making will align. Consensus with Indigenous nations sought.
                </MetParagraph>
            </Grid>
        ),
        popOverText:
            'Tell us what you think of the draft process order and assessment plan. Have we captured everything that should be assessed and the information required? Are the timelines and assessment methods appropriate? What do you think of how we plan to collect feedback from the public?',
    },
    AppDevReview: {
        title: 'Application Development & Review',
        backgroundColor: '#4D95D0',
        learnMoreBackgroundColor: '#D7EBF8',
        learnMoreText: (
            <>
                <Grid item xs={12}>
                    <MetParagraph>
                        Proponent consults and does technical studies, then develops Initial application. EAO then seeks
                        feedback on it from Indigenous nations, stakeholders, technical experts and the public.
                    </MetParagraph>
                </Grid>
                <Grid item xs={12}>
                    <MetParagraph>
                        Proponent revises application, and submits to EAO for review. Consensus with Indigenous nations
                        sought.
                    </MetParagraph>
                </Grid>
                <Grid item xs={12}>
                    <MetParagraph sx={{ fontStyle: 'italic' }}>
                        Decision point: accept revised application or require further revisions.
                    </MetParagraph>
                </Grid>
            </>
        ),
        popOverText:
            'Tell us what you think about the proponent’s application. Are there effects that haven’t been fully considered? Now that you have the proponent’s full assessment, is there anything new or is still raising concerns for you ? Do you think something has been assessed inaccurately?',
    },
    EffectAssessmentReview: {
        title: 'Effect Assessment & Review',
        backgroundColor: '#E7A913',
        learnMoreBackgroundColor: '#FAEACC',
        learnMoreText: (
            <>
                <Grid item xs={12}>
                    <MetParagraph>
                        Assess potential effects of the project. Develop assessment report and draft conditions to
                        address potential adverse effects, in consultation with technical experts and Indigenous
                        nations. Seek and incorporate feedback from Indigenous nations, stakeholders, technical experts
                        and the public. Consensus with Indigenous nations sought.
                    </MetParagraph>
                </Grid>
                <Grid item xs={12}>
                    <MetParagraph sx={{ fontStyle: 'italic' }}>
                        Decision point: recommend to ministers whether or not to issue an Environmental Assessment
                        Certificate.
                    </MetParagraph>
                </Grid>
            </>
        ),
        popOverText:
            ' Tell us what you think about the package of draft decision materials that will be provided to Ministers, who will decide whether or not to issue an environmental assessment certificate. Is anything missing? Has something been assessed incorrectly? What should the ministers consider that isn’t already included?',
    },
    Decision: {
        title: 'Decision',
        backgroundColor: '#6A54A3"',
        learnMoreBackgroundColor: '#D6D1E7',
        learnMoreText: (
            <Grid item xs={12}>
                <MetParagraph sx={{ fontStyle: 'italic' }}>
                    Decision point: Ministers determine whether or not project will receive an Environmental Assessment
                    Certificate, and if so, what conditions will be required to address potential adverse effects.
                </MetParagraph>
            </Grid>
        ),
    },
    PostCertificate: {
        title: 'Post-Certificate',
        backgroundColor: '#A6BB2E"',
        learnMoreBackgroundColor: '#EDF2D4',
        learnMoreText: (
            <>
                <Grid item xs={12}>
                    <MetParagraph>
                        Monitor project to make sure requirements are being followed. Projects not in compliance are
                        subject to enforcement measures, including fines.
                    </MetParagraph>
                </Grid>
                <Grid item xs={12}>
                    <MetParagraph>
                        Proponents may also seek amendments to the Certificate as permitting and construction proceeds
                        and operations get underway.
                    </MetParagraph>
                </Grid>
            </>
        ),
    },
};
