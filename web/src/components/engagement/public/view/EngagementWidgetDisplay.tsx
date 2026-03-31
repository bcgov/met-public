import React, { Suspense } from 'react';
import { Grid2 as Grid, Skeleton } from '@mui/material';
import { Await } from 'react-router';
import { Widget, WidgetLocation } from 'models/widget';
import { WidgetSwitch } from 'components/engagement/widgets/WidgetSwitch';
import { useEngagementLoaderData } from 'components/engagement/preview/PreviewLoaderDataContext';
import { usePreview } from 'components/engagement/preview/PreviewContext';
import WidgetPlaceholder from 'components/engagement/preview/placeholders/WidgetPlaceholder';

export interface EngagementWidgetDisplayProps {
    location: WidgetLocation;
    detailsTabId?: number;
    tabIndex?: number;
}

export const EngagementWidgetSkeleton = () => (
    <Grid
        sx={{
            width: { xs: '100%', md: '47.5%' },
            display: 'flex',
            minHeight: '360px',
        }}
    >
        <Skeleton variant="rectangular" sx={{ width: '100%', height: '360px' }} />
    </Grid>
);

export const EngagementWidgetDisplay = ({ location, detailsTabId, tabIndex }: EngagementWidgetDisplayProps) => {
    const { widgets } = useEngagementLoaderData();
    const { isPreviewMode } = usePreview();

    const getPlaceholderLabel = () => {
        if (location === WidgetLocation.Details && tabIndex && tabIndex > 0) {
            return `Tab ${tabIndex} Supporting Content Area (Optional)`;
        }

        return 'Supporting Content Area (Optional)';
    };

    return (
        <Suspense fallback={<EngagementWidgetSkeleton />}>
            <Await resolve={widgets}>
                {(resolvedWidgets: Widget[]) => {
                    const widget = resolvedWidgets.find(
                        (w) =>
                            w.location === location &&
                            (location !== WidgetLocation.Details ||
                                (w.engagement_details_tab_id ?? null) === (detailsTabId ?? null)),
                    );
                    if (widget)
                        return (
                            <Grid container size={12}>
                                <WidgetSwitch widget={widget} />
                            </Grid>
                        );

                    if (isPreviewMode) {
                        return (
                            <Grid container size={12} minHeight="360px">
                                <WidgetPlaceholder title={getPlaceholderLabel()} minHeight="360px" />
                            </Grid>
                        );
                    }

                    return null;
                }}
            </Await>
        </Suspense>
    );
};
