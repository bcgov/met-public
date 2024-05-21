import React, { ReactNode } from 'react';
import { Grid } from '@mui/material';
import { MetParagraphOld } from 'components/common';

export enum EngagementPhases {
    Standalone = 0,
    EarlyEngagement = 1,
    ReadinessDecision = 2,
    ProcessPlanning = 3,
    ApplicationDevelopmentReview = 4,
    EffectsAssessmentRecommendation = 5,
    Decision = 6,
    PostCertificate = 7,
}

export interface ProcessStageProps {
    phaseId: number;
    backgroundColor: string;
    learnMoreBackgroundColor: string;
    title: string;
    learnMoreText: ReactNode;
    popOverText?: string;
    accordionBackground?: string;
}

export const INFO_ARROW = {
    backgroundColor: '#54858D',
};

export const PAST_PHASE = {
    backgroundColor: '#7B8283',
    borderColor: '#565656',
    learnMoreBackgroundColor: '#f2f2f2',
};

export const CURRENT_PHASE = {
    iconColor: '#D8292F',
};

export const ENGAGEMENT_PHASES = {
    EarlyEngagement: {
        phaseId: EngagementPhases.EarlyEngagement,
        title: 'Early Engagement',
        backgroundColor: '#54858D',
        accordionBackground: '#EFFBFD',
        learnMoreBackgroundColor: '#EFFBFD',
        learnMoreText: (
            <Grid item xs={12}>
                <MetParagraphOld>
                    Engage with Indigenous nations, stakeholders, technical experts and the public to identify potential
                    key issues early in the process, and ways they could be addressed.
                </MetParagraphOld>
            </Grid>
        ),
        popOverText:
            'Tell us about your interests, issues and concerns about the initial proposal for the project. How would the project as proposed personally affect you, your family, or your community? Tell us how you want to provide feedback and be involved in the rest of the assessment process.',
    },
    ReadinessDecision: {
        phaseId: EngagementPhases.ReadinessDecision,
        title: 'Readiness Decision',
        backgroundColor: '#DA6D65',
        learnMoreBackgroundColor: '#F2DEDE',
        accordionBackground: '#F2DEDE',
        learnMoreText: (
            <Grid item xs={12}>
                <MetParagraphOld>
                    Review detailed project description, and input from early engagement and technical advisors, to
                    determine whether to proceed to environmental assessment. Consensus with Indigenous nations sought.
                </MetParagraphOld>
            </Grid>
        ),
    },
    ProcessPlanning: {
        phaseId: EngagementPhases.ProcessPlanning,
        title: 'Process Planning',
        backgroundColor: '#043673',
        accordionBackground: '#ECF3FC',
        learnMoreBackgroundColor: '#ECF3FC',
        learnMoreText: (
            <Grid item xs={12}>
                <MetParagraphOld>
                    Engage with Indigenous nations, stakeholders, technical experts to establish how the environmental
                    assessment will be conducted, including scope, procedures and methods, and how provincial and
                    Indigenous processes and decision-making will align. Consensus with Indigenous nations sought.
                </MetParagraphOld>
            </Grid>
        ),
        popOverText:
            'Tell us what you think of the draft process order and assessment plan. Have we captured everything that should be assessed and the information required? Are the timelines and assessment methods appropriate? What do you think of how we plan to collect feedback from the public?',
    },
    AppDevReview: {
        phaseId: EngagementPhases.ApplicationDevelopmentReview,
        title: 'Application Development & Review',
        backgroundColor: '#4D95D0',
        accordionBackground: '#DDF0FE',
        learnMoreBackgroundColor: '#DDF0FE',
        learnMoreText: (
            <>
                <Grid item xs={12}>
                    <MetParagraphOld>
                        Proponent consults and does technical studies, then develops the initial application. EAO then
                        seeks feedback on it from Indigenous nations, stakeholders, technical experts and the public.
                    </MetParagraphOld>
                </Grid>
                <Grid item xs={12}>
                    <MetParagraphOld>
                        Proponent revises application, and submits to EAO for review. Consensus with Indigenous nations
                        sought.
                    </MetParagraphOld>
                </Grid>
                <Grid item xs={12}>
                    <MetParagraphOld sx={{ fontStyle: 'italic' }}>
                        Decision point: accept revised application or require further revisions.
                    </MetParagraphOld>
                </Grid>
            </>
        ),
        popOverText:
            'Tell us what you think about the proponent’s application. Are there effects that haven’t been fully considered? Now that you have the proponent’s full assessment, is there anything new or is still raising concerns for you ? Do you think something has been assessed inaccurately?',
    },
    Recommendation: {
        phaseId: EngagementPhases.EffectsAssessmentRecommendation,
        title: 'Effects Assessment & Recommendation',
        backgroundColor: '#E7A913',
        accordionBackground: '#FFEFCB',
        learnMoreBackgroundColor: '#FFEFCB',
        learnMoreText: (
            <>
                <Grid item xs={12}>
                    <MetParagraphOld>
                        Assess potential effects of the project. Develop assessment report and draft conditions to
                        address potential adverse effects, in consultation with technical experts and Indigenous
                        nations. Seek and incorporate feedback from Indigenous nations, stakeholders, technical experts
                        and the public. Consensus with Indigenous nations sought.
                    </MetParagraphOld>
                </Grid>
                <Grid item xs={12}>
                    <MetParagraphOld sx={{ fontStyle: 'italic' }}>
                        Decision point: recommend to ministers whether or not to issue an Environmental Assessment
                        Certificate.
                    </MetParagraphOld>
                </Grid>
            </>
        ),
        popOverText:
            ' Tell us what you think about the package of draft decision materials that will be provided to Ministers, who will decide whether or not to issue an environmental assessment certificate. Is anything missing? Has something been assessed incorrectly? What should the ministers consider that isn’t already included?',
    },
    Decision: {
        phaseId: EngagementPhases.Decision,
        title: 'Decision',
        backgroundColor: '#6A54A3',
        accordionBackground: '#F3EFFF',
        learnMoreBackgroundColor: '#F3EFFF',
        learnMoreText: (
            <Grid item xs={12}>
                <MetParagraphOld sx={{ fontStyle: 'italic' }}>
                    Decision point: Ministers determine whether or not project will receive an Environmental Assessment
                    Certificate, and if so, what conditions will be required to address potential adverse effects.
                </MetParagraphOld>
            </Grid>
        ),
    },
    PostCertificate: {
        phaseId: EngagementPhases.PostCertificate,
        title: 'Post-Certificate',
        backgroundColor: '#A6BB2E',
        accordionBackground: '#F4F7E2',
        learnMoreBackgroundColor: '#F4F7E2',
        learnMoreText: (
            <>
                <Grid item xs={12}>
                    <MetParagraphOld>
                        Monitor project to make sure requirements are being followed. Projects not in compliance are
                        subject to enforcement measures, including fines.
                    </MetParagraphOld>
                </Grid>
                <Grid item xs={12}>
                    <MetParagraphOld>
                        Proponents may also seek amendments to the Certificate as permitting and construction proceeds
                        and operations get underway.
                    </MetParagraphOld>
                </Grid>
            </>
        ),
    },
};
