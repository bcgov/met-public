import React, { useContext, useState } from 'react';
import { Grid, Skeleton, Stack } from '@mui/material';
import { MetBody, MetHeader3, MetLabel, MetPaper } from 'components/common';
import { WidgetType } from 'models/widget';
import { ActionContext } from '../../ActionContext';
import { EngagementPhase } from './EngagementPhase';
import { EngagementPhases, ENGAGEMENT_PHASES } from 'models/engagementPhases';
import { ForumIcon } from './ForumIcon';
import { InfoArrow } from './InfoArrow';
import { When } from 'react-if';

interface PhaseContextProps {
    anchorEl: HTMLButtonElement | null;
    setAnchorEl: React.Dispatch<React.SetStateAction<HTMLButtonElement | null>>;
}

export const PhaseContext = React.createContext<PhaseContextProps>({
    anchorEl: null,
    setAnchorEl: () => {
        throw new Error('Not implemented');
    },
});
export const PhasesWidget = () => {
    const { widgets, isWidgetsLoading } = useContext(ActionContext);
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
    const phases = Object.values(ENGAGEMENT_PHASES);
    const phasesWidget = widgets.find((widget) => widget.widget_type_id === WidgetType.Phases);
    const currentPhaseId = phasesWidget?.items[0]?.widget_data_id || EngagementPhases.Standalone;

    if (isWidgetsLoading) {
        return <Skeleton variant="rectangular" height={'20em'} />;
    }

    if (!phasesWidget) {
        return null;
    }

    return (
        <PhaseContext.Provider
            value={{
                anchorEl,
                setAnchorEl,
            }}
        >
            <MetPaper elevation={1} sx={{ padding: '2em' }}>
                <Grid container direction="row" justifyContent="flex-start" alignItems="flex-start">
                    <Grid item xs={12}>
                        <MetHeader3 bold>The EA Process</MetHeader3>
                    </Grid>

                    <When condition={Boolean(currentPhaseId) && currentPhaseId !== EngagementPhases.Standalone}>
                        <Grid xs={12}>
                            <MetLabel>
                                Current Phase: {phases.find((phase) => phase.phaseId === currentPhaseId)?.title || ''}
                            </MetLabel>
                        </Grid>
                    </When>
                    <Grid item xs={12}>
                        <MetBody>
                            Click on the sections below to expand them and learn more about each EA process phase. You
                            can also learn more about each engagement period by clicking the engagement icon.
                            {<ForumIcon fontSize="1.2em" sx={{ marginLeft: '0.5em' }} />}
                        </MetBody>
                    </Grid>
                    <Grid item xs={12} sx={{ maxWidth: '99%' }}>
                        <Stack direction="row" sx={{ overflowX: 'auto', overflowY: 'clip' }}>
                            {phases.map((phase) => (
                                <EngagementPhase key={phase.title} {...phase} />
                            ))}
                        </Stack>
                    </Grid>
                    <Grid item xs={12} lg={10}>
                        <InfoArrow />
                    </Grid>
                </Grid>
            </MetPaper>
        </PhaseContext.Provider>
    );
};
