import { Grid, Link, Stack } from '@mui/material';
import { MetBody, MetHeader3, MetHeader4, MetPaper, MetSmallText } from 'components/common';
import { EngagementPhases } from 'models/engagementPhases';
import { WidgetType } from 'models/widget';
import React, { useContext } from 'react';
import { ActionContext } from '../../ActionContext';
import { PhaseBox } from './PhaseBox';

export const PhaseContext = React.createContext({});
export const PhasesWidget = () => {
    const { widgets } = useContext(ActionContext);

    const phasesWidget = widgets.find((widget) => widget.widget_type_id === WidgetType.Phases);
    const currentPhase = phasesWidget?.items[0]?.widget_data_id || EngagementPhases.Standalone;

    if (!phasesWidget) {
        return null;
    }

    return (
        <PhaseContext.Provider value={{}}>
            <MetPaper elevation={1} sx={{ padding: '2em' }}>
                <Grid container direction="row" justifyContent="flex-start" alignItems="flex-start" rowSpacing={2}>
                    <Grid item xs={12}>
                        <MetHeader3 bold>The EA Process</MetHeader3>
                    </Grid>
                    <Grid item xs={12}>
                        <MetBody>
                            Click on the sections below to expand them and learn more about each EA process phase. You
                            can also learn more about each engagement period by clicking the engagement icon.
                        </MetBody>
                    </Grid>
                    <Grid item xs={12} sx={{ maxWidth: '99%' }}>
                        <Stack direction="row" sx={{ overflowX: 'auto' }}>
                            <PhaseBox key={1} title="Early Engagement" backgroundColor="#54858D" />
                            <PhaseBox key={2} title="Readiness Decision" backgroundColor="#DA6D65" />
                            <PhaseBox key={3} title="Process Planning" backgroundColor="#043673" />
                            <PhaseBox key={4} title="Application Development & Review" backgroundColor="#4D95D0" />
                            <PhaseBox key={5} title="Effect Assessment & Recommendation" backgroundColor="#E7A913" />
                            <PhaseBox key={6} title="Decision" backgroundColor="#6A54A3" />
                            <PhaseBox key={7} title="Post-Certificate" backgroundColor="#A6BB2E" />
                        </Stack>
                    </Grid>
                </Grid>
            </MetPaper>
        </PhaseContext.Provider>
    );
};
