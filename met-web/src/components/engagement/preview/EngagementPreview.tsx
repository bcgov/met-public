import React, { Suspense, useEffect, useState, useRef } from 'react';
import { Await, useLoaderData, useRevalidator } from 'react-router';
import { Box, CircularProgress } from '@mui/material';
import PreviewControlBar from './PreviewControlBar';
import PreviewContent from './PreviewContent';
import { SubmissionStatusTypes } from './PreviewStateTabs';
import { checkEngagementCompleteness } from './utils/checkCompleteness';
import { Engagement } from 'models/engagement';
import { EngagementLoaderPublicData } from '../public/view/EngagementLoaderPublic';
import { SubmissionStatus } from 'constants/engagementStatus';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight } from '@fortawesome/pro-regular-svg-icons';
import { PreviewLoaderDataProvider } from './PreviewLoaderDataContext';
import PublicHeader from 'components/layout/Header/PublicHeader';

const MeasurementBar: React.FC = () => {
    const [viewportWidth, setViewportWidth] = useState(globalThis.innerWidth);
    const [barVisible, setBarVisible] = useState(false);
    const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        const handleResize = () => {
            setViewportWidth(globalThis.innerWidth);
            setBarVisible(true);
            if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
            hideTimerRef.current = setTimeout(() => setBarVisible(false), 1500);
        };
        globalThis.addEventListener('resize', handleResize);
        return () => {
            globalThis.removeEventListener('resize', handleResize);
            if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
        };
    }, []);

    return (
        <Box
            sx={{
                position: 'fixed',
                top: '50%',
                transform: 'translateY(-50%)',
                left: 0,
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                padding: '8px 16px',
                boxSizing: 'border-box',
                userSelect: 'none',
                pointerEvents: 'none',
                color: (theme) => theme.palette.error.main,
                borderTop: (theme) => `1px solid color-mix(in srgb, ${theme.palette.error.dark}, transparent 80%)`,
                borderBottom: (theme) => `1px solid color-mix(in srgb, ${theme.palette.error.dark}, transparent 80%)`,
                backgroundColor: (theme) => `color-mix(in srgb, ${theme.palette.error.dark}, transparent 80%)`,
                backdropFilter: 'blur(2px)',
                opacity: barVisible ? 1 : 0,
                transition: 'opacity 0.5s ease',
                zIndex: 9999,
            }}
        >
            <Box
                sx={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    fontSize: '24px',
                    gap: 1,
                }}
            >
                <FontAwesomeIcon icon={faArrowLeft} />
                <Box
                    sx={{
                        flex: 1,
                        height: '2px',
                        backgroundImage:
                            'repeating-linear-gradient(to right, currentColor, currentColor 8px, transparent 8px, transparent 16px)',
                    }}
                />
            </Box>
            <Box
                sx={{
                    padding: '3px 16px',
                    backgroundColor: (theme) => theme.palette.error.main,
                    color: (theme) => theme.palette.error.contrastText,
                    borderRadius: '8px',
                    fontFamily: 'monospace',
                    fontWeight: 'bold',
                }}
            >
                {viewportWidth}px
            </Box>
            <Box
                sx={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    fontSize: '24px',
                    gap: 1,
                }}
            >
                <Box
                    sx={{
                        flex: 1,
                        height: '2px',
                        backgroundImage:
                            'repeating-linear-gradient(to left, currentColor, currentColor 8px, transparent 8px, transparent 16px)',
                    }}
                />
                <FontAwesomeIcon icon={faArrowRight} />
            </Box>
        </Box>
    );
};

/**
 * Preview page for viewing engagement in different states before publishing.
 * Allows switching between Upcoming/Open/Closed/Results Published states without
 * modifying the actual engagement.
 */
export const EngagementPreview: React.FC = () => {
    const loaderData = useLoaderData() as EngagementLoaderPublicData;
    const revalidator = useRevalidator();
    const [previewState, setPreviewState] = useState<SubmissionStatusTypes>('Upcoming');
    const [isReloading, setIsReloading] = useState(false);
    const [contentVersion, setContentVersion] = useState(0);

    const getPreviewStateFromEngagement = (engagement: Engagement): SubmissionStatusTypes => {
        switch (engagement.submission_status) {
            case SubmissionStatus.Open:
                return 'Open';
            case SubmissionStatus.Upcoming:
                return 'Upcoming';
            case SubmissionStatus.Closed: {
                const viewResultsBlock = engagement.status_block?.find(
                    (block) => block.survey_status === 'ViewResults',
                );
                const hasViewResultsContent = Boolean(
                    viewResultsBlock?.button_text?.trim() ||
                    viewResultsBlock?.block_text?.trim() ||
                    viewResultsBlock?.internal_link?.trim() ||
                    viewResultsBlock?.external_link?.trim(),
                );
                return hasViewResultsContent ? 'ViewResults' : 'Closed';
            }
            default:
                return 'Upcoming';
        }
    };

    // Convert preview state to submission status ID
    const getSubmissionStatusId = (state: SubmissionStatusTypes): SubmissionStatus => {
        switch (state) {
            case 'Upcoming':
                return SubmissionStatus.Upcoming;
            case 'Open':
                return SubmissionStatus.Open;
            case 'Closed':
                return SubmissionStatus.Closed;
            case 'ViewResults':
                return SubmissionStatus.Closed; // ViewResults uses Closed status with different blocks
            default:
                return SubmissionStatus.Upcoming;
        }
    };

    const handleReload = () => {
        if (isReloading) return;
        setIsReloading(true);
        revalidator.revalidate();
    };

    useEffect(() => {
        setContentVersion((previous) => previous + 1);
    }, [loaderData.engagement, loaderData.widgets, loaderData.details, loaderData.metadata, loaderData.suggestions]);

    useEffect(() => {
        let isMounted = true;

        loaderData.engagement
            .then((engagement) => {
                if (!isMounted) return;
                setPreviewState(getPreviewStateFromEngagement(engagement));
            })
            .catch(() => {
                return;
            });

        return () => {
            isMounted = false;
        };
    }, [loaderData.engagement]);

    useEffect(() => {
        if (!isReloading) return;

        let isMounted = true;
        Promise.allSettled([
            loaderData.engagement,
            loaderData.widgets,
            loaderData.details,
            loaderData.metadata,
            loaderData.suggestions,
        ]).finally(() => {
            if (isMounted) {
                setIsReloading(false);
            }
        });

        return () => {
            isMounted = false;
        };
    }, [
        isReloading,
        loaderData.engagement,
        loaderData.widgets,
        loaderData.details,
        loaderData.metadata,
        loaderData.suggestions,
    ]);

    useEffect(() => {
        const animateScrollToElement = (targetId: string) => {
            const targetElement = document.getElementById(targetId);
            if (!targetElement) return;

            const startY = globalThis.scrollY;
            const targetY = targetElement.getBoundingClientRect().top + globalThis.scrollY;
            const distanceY = targetY - startY;
            const durationMs = 260;
            const startTime = performance.now();

            if (Math.abs(distanceY) < 2) {
                try {
                    globalThis.history.replaceState(null, '', `#${targetId}`);
                } catch {
                    return;
                }
                return;
            }

            const easeOutCubic = (progress: number) => 1 - Math.pow(1 - progress, 3);

            const animate = (currentTime: number) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / durationMs, 1);
                const easedProgress = easeOutCubic(progress);
                globalThis.scrollTo(0, Math.round(startY + distanceY * easedProgress));

                if (progress < 1) {
                    globalThis.requestAnimationFrame(animate);
                    return;
                }

                try {
                    globalThis.history.replaceState(null, '', `#${targetId}`);
                } catch {
                    return;
                }
            };

            globalThis.requestAnimationFrame(animate);
        };

        const handleWindowMessage = (event: MessageEvent) => {
            if (event.origin !== globalThis.location.origin) return;

            const message = event?.data || undefined;
            if (message?.type === 'met-preview-scroll') {
                animateScrollToElement(event?.data?.targetId);
            } else if (message?.type === 'met-preview-refresh') {
                handleReload();
            }
        };

        globalThis.addEventListener('message', handleWindowMessage);

        const scrollToHashTarget = () => {
            const targetId = globalThis.location.hash.replace('#', '');
            if (!targetId) return;
            document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        };

        const firstAttempt = globalThis.setTimeout(scrollToHashTarget, 60);
        const secondAttempt = globalThis.setTimeout(scrollToHashTarget, 220);
        const thirdAttempt = globalThis.setTimeout(scrollToHashTarget, 500);

        globalThis.addEventListener('hashchange', scrollToHashTarget);
        return () => {
            globalThis.clearTimeout(firstAttempt);
            globalThis.clearTimeout(secondAttempt);
            globalThis.clearTimeout(thirdAttempt);
            globalThis.removeEventListener('hashchange', scrollToHashTarget);
            globalThis.removeEventListener('message', handleWindowMessage);
        };
    }, [contentVersion]);

    return (
        <Suspense
            fallback={
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                    <CircularProgress />
                </Box>
            }
        >
            <Await key={contentVersion} resolve={loaderData.engagement}>
                {(engagement: Engagement) => {
                    const isComplete = checkEngagementCompleteness(engagement);

                    // Create preview engagement with selected state
                    const previewEngagement: Engagement = {
                        ...engagement,
                        submission_status: getSubmissionStatusId(previewState),
                    };

                    const previewLoaderData: EngagementLoaderPublicData = {
                        ...loaderData,
                        engagement: Promise.resolve(previewEngagement),
                    };

                    return (
                        <PreviewLoaderDataProvider loaderData={previewLoaderData}>
                            <>
                                <PreviewControlBar
                                    engagement={engagement}
                                    previewState={previewState}
                                    onStateChange={setPreviewState}
                                    onReload={handleReload}
                                    isReloading={isReloading}
                                    isComplete={isComplete}
                                />
                                <PublicHeader />
                                <PreviewContent key={contentVersion} previewStateType={previewState} />
                                <MeasurementBar />
                            </>
                        </PreviewLoaderDataProvider>
                    );
                }}
            </Await>
        </Suspense>
    );
};

export default EngagementPreview;
