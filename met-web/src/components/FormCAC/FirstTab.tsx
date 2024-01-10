import React, { useContext } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Checkbox, FormControlLabel, FormGroup, FormHelperText, Grid, Link } from '@mui/material';
import { MetLabel, MetParagraph, PrimaryButton } from 'components/common';
import { useAppTranslation } from 'hooks';
import { FormContext } from './FormContext';
import { TAB_TWO } from './constants';
import { When } from 'react-if';
import { Editor } from 'react-draft-wysiwyg';
import { getEditorStateFromRaw } from 'components/common/RichTextEditor/utils';

// Define the Yup schema for validation
const schema = yup.object({
    understand: yup.boolean().oneOf([true], 'You must acknowledge this.'),
    termsOfReference: yup.boolean().oneOf([true], 'You must acknowledge this.'),
});

interface FormData {
    understand: boolean;
    termsOfReference: boolean;
}

export const FirstTab: React.FC = () => {
    const { t: translate } = useAppTranslation();
    const { consentMessage, setTabValue, setFormSubmission } = useContext(FormContext);

    // Initialize form state and validation using react-hook-form
    const {
        handleSubmit,
        control,
        formState: { errors },
        trigger,
    } = useForm<FormData>({
        resolver: yupResolver(schema),
        defaultValues: {
            understand: false,
            termsOfReference: false,
        },
    });

    // Function to handle form submission
    const handleNextClick = async (data: FormData) => {
        trigger();

        setFormSubmission((prev) => ({ ...prev, ...data }));
        setTabValue(TAB_TWO);
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
                <Editor editorState={getEditorStateFromRaw(consentMessage)} readOnly={true} toolbarHidden />
            </Grid>

            <Grid item xs={12}>
                <FormGroup>
                    <FormControlLabel
                        control={
                            <Controller
                                name="understand"
                                control={control}
                                render={({ field }) => <Checkbox {...field} />}
                            />
                        }
                        label={
                            <MetLabel>By checking this box, I acknowledge that I understand the above text.</MetLabel>
                        }
                    />
                    <When condition={Boolean(errors.understand)}>
                        <FormHelperText
                            sx={{
                                marginLeft: '2.5em',
                                marginTop: '-1em',
                            }}
                            error
                        >
                            {String(errors.understand?.message)}
                        </FormHelperText>
                    </When>
                    <FormControlLabel
                        control={
                            <Controller
                                name="termsOfReference"
                                control={control}
                                render={({ field }) => <Checkbox {...field} />}
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
                    <When condition={Boolean(errors.termsOfReference)}>
                        <FormHelperText
                            sx={{
                                marginLeft: '2.5em',
                                marginTop: '-1em',
                            }}
                            error
                        >
                            {String(errors.termsOfReference?.message)}
                        </FormHelperText>
                    </When>
                </FormGroup>
            </Grid>

            <Grid item xs={12}>
                <PrimaryButton onClick={handleSubmit(handleNextClick)}>Next</PrimaryButton>
            </Grid>
        </Grid>
    );
};
