import React, { useContext, useState, useEffect } from 'react';
import { Grid, Divider } from '@mui/material';
import { MetHeader3, PrimaryButton, SecondaryButton, GreyButton } from 'components/common';
import { Document } from 'models/document';
import { useAppDispatch } from 'hooks';
import { openNotification } from 'services/notificationService/notificationSlice';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import { WidgetDrawerContext } from '../WidgetDrawerContext';
import { WidgetType } from 'models/widget';
import { DocumentsContext } from './DocumentsContext';

const DocumentForm = () => {
    const { handleWidgetDrawerOpen, widgets } = useContext(WidgetDrawerContext);
    const { handleAddDocumentDrawerOpen, documents } = useContext(DocumentsContext);

    const dispatch = useAppDispatch();
    const [addedDocuments, setAddedDocuments] = useState<Document[]>([]);
    const [savingWidgetItems, setSavingWidgetItems] = useState(false);

    const widget = widgets.filter((widget) => widget.widget_type_id === WidgetType.Document)[0] || null;
    useEffect(() => {
        setAddedDocuments([]);
    }, [documents, widget]);

    const addDocument = async () => {
        setAddedDocuments([]);
    };

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
                <Grid item xs={12} container direction="row" justifyContent={'flex-start'} spacing={1}>
                    <Grid item xs={12}>
                        <Grid container item xs={12}>
                            <MetHeader3 bold={true} sx={{ mb: 2, mr: 1, color: '#323232' }}>
                                Documents
                            </MetHeader3>
                            <BorderColorIcon />
                        </Grid>
                        <Grid item xs={12}>
                            <Divider variant="middle" />
                        </Grid>
                    </Grid>
                    <Grid item sx={{ mt: 3 }}>
                        <GreyButton onClick={() => addDocument()} sx={{ height: '100%' }} fullWidth>
                            Create Folder
                        </GreyButton>
                    </Grid>
                    <Grid item sx={{ mt: 3 }}>
                        <GreyButton sx={{ height: '100%' }} fullWidth onClick={() => handleAddDocumentDrawerOpen(true)}>
                            Add Document
                        </GreyButton>
                    </Grid>
                </Grid>
                <Grid item xs={12} container direction="row" spacing={1} justifyContent={'flex-start'} marginTop="8em">
                    <Grid item>
                        <PrimaryButton
                            disabled={addedDocuments.length === 0}
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
