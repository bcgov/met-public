import React, { useContext, useState } from 'react';
import { Grid, Divider } from '@mui/material';
import { MetHeader3, PrimaryButton, SecondaryButton } from 'components/common';
import { useAppDispatch } from 'hooks';
import { openNotification } from 'services/notificationService/notificationSlice';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import { WidgetDrawerContext } from '../WidgetDrawerContext';
import { DocumentsContext } from './DocumentsContext';

const DocumentForm = () => {
    const { handleWidgetDrawerOpen } = useContext(WidgetDrawerContext);
    const { handleAddDocumentDrawerOpen } = useContext(DocumentsContext);

    const dispatch = useAppDispatch();
    const [savingWidgetItems, setSavingWidgetItems] = useState(false);

    const saveWidgetItems = async () => {
        try {
            dispatch(openNotification({ severity: 'success', text: 'Widgets successfully added' }));
            handleWidgetDrawerOpen(false);
            setSavingWidgetItems(false);
        } catch (error) {
            console.log(error);
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
                    <MetHeader3>Documents</MetHeader3>
                    <Divider sx={{ marginTop: '1em' }} />
                </Grid>
                <Grid item xs={12} container direction="row" spacing={1} justifyContent={'flex-start'} marginTop="8em">
                    <Grid item>
                        <PrimaryButton
                            loading={savingWidgetItems}
                            onClick={() => saveWidgetItems()}
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

export default DocumentForm;
