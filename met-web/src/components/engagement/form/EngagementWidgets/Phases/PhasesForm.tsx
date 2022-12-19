import React, { useContext, useEffect, useState } from 'react';
import { Autocomplete, Checkbox, Divider, FormControl, FormControlLabel, Grid, TextField } from '@mui/material';
import { MetHeader3, MetLabel, PrimaryButton, SecondaryButton } from 'components/common';
import { EngagementPhases } from 'models/engagementPhases';
import { useAppDispatch } from 'hooks';
import { openNotification } from 'services/notificationService/notificationSlice';
import { postWidgetItem } from 'services/widgetService';
import { WidgetDrawerContext } from '../WidgetDrawerContext';
import { WidgetType } from 'models/widget';

interface ISelectOptions {
    id: EngagementPhases;
    label: string;
}
const PhasesForm = () => {
    const { handleWidgetDrawerOpen, widgets, loadWidgets } = useContext(WidgetDrawerContext);

    const dispatch = useAppDispatch();
    const [selectedOption, setSelectedOption] = useState<ISelectOptions | null>(null);
    const [isStandalone, setIsStandalone] = useState<boolean>(false);
    const [savingWidgetItems, setSavingWidgetItems] = useState(false);
    const widget = widgets.filter((widget) => widget.widget_type_id === WidgetType.Phases)[0] || null;

    useEffect(() => {
        if (widget && widget.items.length > 0) {
            setSelectedOption(options.find((o) => o.id === widget.items[0].widget_data_id) || null);
            setIsStandalone(widget.items[0].widget_data_id === EngagementPhases.Standalone);
        }
    }, [widget]);

    const options = [
        {
            id: EngagementPhases.EarlyEngagement,
            label: 'Early Engagement',
        },
        {
            id: EngagementPhases.ReadinessDecision,
            label: 'Readiness Decision',
        },
        {
            id: EngagementPhases.ProcessPlanning,
            label: 'Process Planning',
        },
        {
            id: EngagementPhases.ApplicationDevelopmentReview,
            label: 'Application Development & Review',
        },
        {
            id: EngagementPhases.Recommendation,
            label: 'Recommendation',
        },
        {
            id: EngagementPhases.Decision,
            label: 'Decision',
        },
        {
            id: EngagementPhases.PostCertificate,
            label: 'Post-certificate',
        },
    ];

    const saveWidgetItem = async () => {
        const widgetsToUpdate = {
            widget_id: widget.id,
            widget_data_id: selectedOption?.id || EngagementPhases.Standalone,
        };
        try {
            setSavingWidgetItems(true);
            await postWidgetItem(widget.id, widgetsToUpdate);
            await loadWidgets();
            dispatch(openNotification({ severity: 'success', text: 'Widget successfully added' }));
            handleWidgetDrawerOpen(false);
            setSavingWidgetItems(false);
        } catch (error) {
            dispatch(
                openNotification({ severity: 'error', text: 'Error occurred while attempting to add the widgets' }),
            );
            setSavingWidgetItems(false);
        }
    };

    return (
        <>
            <Grid item xs={12} container alignItems="flex-start" justifyContent={'flex-start'} spacing={3}>
                <Grid item xs={12}>
                    <MetHeader3>The EA Process</MetHeader3>
                    <Divider sx={{ marginTop: '1em' }} />
                </Grid>
                <Grid item xs={12} container direction="row" justifyContent={'flex-start'} spacing={1} marginTop="4em">
                    <Grid item xs={12}>
                        <MetLabel>Engagement Phase</MetLabel>
                        <Autocomplete
                            data-testid="engagementPhaseSelect"
                            id="option-selector"
                            options={options}
                            value={selectedOption}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label=" "
                                    InputLabelProps={{
                                        shrink: false,
                                    }}
                                />
                            )}
                            isOptionEqualToValue={(option: ISelectOptions, value: ISelectOptions) =>
                                option.id == value.id
                            }
                            getOptionLabel={(option: ISelectOptions) => option.label}
                            onChange={(_e: React.SyntheticEvent<Element, Event>, option: ISelectOptions | null) => {
                                setSelectedOption(option);
                                setIsStandalone(false);
                            }}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <FormControl component="fieldset" variant="standard">
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        data-testid="standalonePhaseCheckbox"
                                        checked={isStandalone}
                                        onChange={(event, checked) => {
                                            setSelectedOption(null);
                                            setIsStandalone(checked);
                                        }}
                                    />
                                }
                                label="This engagement is a stand-alone engagement"
                            />
                        </FormControl>
                    </Grid>
                </Grid>
                <Grid item xs={12} container direction="row" spacing={1} justifyContent={'flex-start'} marginTop="8em">
                    <Grid item>
                        <PrimaryButton
                            data-testid="savePhasesWidgetButton"
                            loading={savingWidgetItems}
                            disabled={!selectedOption?.id && !isStandalone}
                            onClick={() => saveWidgetItem()}
                        >{`Save & Close`}</PrimaryButton>
                    </Grid>
                    <Grid item>
                        <SecondaryButton onClick={() => handleWidgetDrawerOpen(false)}>{`Cancel`}</SecondaryButton>
                    </Grid>
                </Grid>
            </Grid>
        </>
    );
};

export default PhasesForm;
