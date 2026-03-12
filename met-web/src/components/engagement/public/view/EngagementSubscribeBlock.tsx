import React, { Suspense } from 'react';
import { EngagementViewSections } from 'engagements/public/view';
import { useEngagementLoaderData } from 'engagements/preview/PreviewLoaderDataContext';
import PreviewSwitch, { PreviewRender } from 'engagements/preview/PreviewSwitch';
import { Header2, BodyText } from 'components/common/Typography';
import { EngagementPreviewTag } from './EngagementPreviewTag';
import { Await } from 'react-router';
import TextPlaceholder from 'engagements/preview/placeholders/TextPlaceholder';
import Grid from '@mui/material/Grid2';
import { usePreview } from 'engagements/preview/PreviewContext';
import { Box, Checkbox, FormControlLabel, Paper } from '@mui/material';
import { Button, CustomTextField } from 'components/common/Input';
import { RichTextArea } from 'components/common/Input/RichTextArea';
import { getEditorStateFromRaw } from 'components/common/RichTextEditor/utils';

const previewSubscribeSummary = (
    <Grid container gap={0} direction="column">
        <BodyText mb="24px" lineHeight="28px">
            <TextPlaceholder text="Stay informed by subscribing to email updates on public engagements." />
        </BodyText>
        <BodyText lineHeight="28px">
            <TextPlaceholder text="Nam at lectus urna duis convallis convallis tellus id interdum. Enim ut tellus elementum sagittis vitae et. Feugiat scelerisque." />
        </BodyText>
    </Grid>
);

const defaultConsentMessage =
    'Personal information collected by the Ministry of Citizens’ Services is under the authority of section 26(c) and 26(e) of the Freedom of Information and Protection of Privacy Act for the purpose of informing this engagement.';

export const EngagementSubscribeBlock = () => {
    const { engagement } = useEngagementLoaderData();
    const { isPreviewMode } = usePreview();
    return (
        <Suspense>
            <Await resolve={engagement}>
                {(resolvedEngagement) => {
                    const subscribeDescriptionEditorState = getEditorStateFromRaw(
                        resolvedEngagement.subscribe_section_description || '',
                    );
                    const hasSubscribeDescription =
                        subscribeDescriptionEditorState?.getCurrentContent()?.hasText?.() ?? false;
                    const consentMessageEditorState = getEditorStateFromRaw(
                        resolvedEngagement.subscribe_consent_message || resolvedEngagement.consent_message || '',
                    );
                    const hasConsentMessage = consentMessageEditorState?.getCurrentContent()?.hasText?.() ?? false;

                    if (!resolvedEngagement.subscribe_section_shown && !isPreviewMode) {
                        return null;
                    }
                    return (
                        <section id={EngagementViewSections.SUBSCRIBE} aria-label="Subscribe Section">
                            <EngagementPreviewTag>Subscribe Section (Optional)</EngagementPreviewTag>
                            <Grid
                                container
                                direction="row"
                                justifyContent="space-between"
                                size={12}
                                columns={12}
                                width="100%"
                                bgcolor="blue.10"
                                gap={{ xs: '12px', md: '24px', lg: '48px' }}
                                padding={{
                                    xs: '3em 16px',
                                    md: '4em 5vw',
                                    lg: '4.5em 10em',
                                }}
                            >
                                <Grid size={{ xs: 12, lg: 3.5 }}>
                                    <Header2 weight="thin" decorated sx={{ mb: '24px' }}>
                                        <PreviewSwitch
                                            hasValue={!!resolvedEngagement.subscribe_section_heading}
                                            value={resolvedEngagement.subscribe_section_heading}
                                            previewFallback={<TextPlaceholder text="Subscribe Section" />}
                                            fallback="Subscribe Section"
                                        />
                                    </Header2>

                                    <PreviewRender
                                        hasValue={hasSubscribeDescription}
                                        value={
                                            <RichTextArea
                                                toolbarHidden
                                                readOnly
                                                editorState={subscribeDescriptionEditorState}
                                            />
                                        }
                                        previewFallback={previewSubscribeSummary}
                                        fallback={null}
                                    >
                                        {(content) => content}
                                    </PreviewRender>
                                </Grid>

                                <Grid size={{ xs: 12, lg: 7.5 }}>
                                    <Paper
                                        elevation={0}
                                        sx={{
                                            p: { xs: '24px 16px', md: '32px 24px' },
                                            borderRadius: '16px',
                                            backgroundColor: 'gray.10',
                                        }}
                                    >
                                        <BodyText bold color="text.secondary" mb="12px">
                                            Your Privacy
                                        </BodyText>

                                        <PreviewRender
                                            hasValue={hasConsentMessage}
                                            value={
                                                <RichTextArea
                                                    toolbarHidden
                                                    readOnly
                                                    editorState={consentMessageEditorState}
                                                />
                                            }
                                            previewFallback={
                                                <BodyText>
                                                    <TextPlaceholder text={defaultConsentMessage} />
                                                </BodyText>
                                            }
                                            fallback={<BodyText>{defaultConsentMessage}</BodyText>}
                                        >
                                            {(content) => <Box sx={{ mb: '24px' }}>{content}</Box>}
                                        </PreviewRender>

                                        <Box sx={{ mb: '20px' }}>
                                            <FormControlLabel
                                                control={<Checkbox />}
                                                label={
                                                    <BodyText bold size="small" color="text.secondary">
                                                        I agree to the terms and conditions above.
                                                    </BodyText>
                                                }
                                            />
                                        </Box>

                                        <BodyText sx={{ mb: '8px' }}>Email</BodyText>
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                flexDirection: { xs: 'column', sm: 'row' },
                                                gap: '12px',
                                                alignItems: { xs: 'stretch', sm: 'center' },
                                            }}
                                        >
                                            <CustomTextField
                                                label=" "
                                                InputLabelProps={{ shrink: false }}
                                                fullWidth
                                                sx={{
                                                    '& .MuiOutlinedInput-root': {
                                                        borderRadius: '8px',
                                                    },
                                                }}
                                            />
                                            <Button
                                                type="button"
                                                variant="primary"
                                                size="small"
                                                sx={{ minWidth: '96px', height: '44px' }}
                                                onClick={() => {
                                                    /* TODO: Handle subscribe action */
                                                }}
                                            >
                                                Subscribe
                                            </Button>
                                        </Box>
                                    </Paper>
                                </Grid>
                            </Grid>
                        </section>
                    );
                }}
            </Await>
        </Suspense>
    );
};

export default EngagementSubscribeBlock;
