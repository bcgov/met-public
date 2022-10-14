import React, { createContext, useState, useEffect } from 'react';
import { postEngagement, getEngagement, patchEngagement } from '../../../services/engagementService';
import { useNavigate, useParams } from 'react-router-dom';
import { EngagementContext, EngagementForm, EngagementFormUpdate, EngagementParams } from './types';
import { createDefaultEngagement, Engagement } from '../../../models/engagement';
import { saveDocument } from 'services/objectStorageService';
import { openNotification } from 'services/notificationService/notificationSlice';
import { useAppDispatch } from 'hooks';
import { getErrorMessage } from 'utils';
import { updatedDiff } from 'deep-object-diff';
import { PatchEngagementRequest } from 'services/engagementService/types';
import { WidgetsList } from 'models/widget';
import { getWidgets } from 'services/widgetService';

export const ActionContext = createContext<EngagementContext>({
    handleCreateEngagementRequest: (_engagement: EngagementForm): Promise<Engagement> => {
        return Promise.reject();
    },
    handleUpdateEngagementRequest: (_engagement: EngagementFormUpdate): Promise<Engagement> => {
        return Promise.reject();
    },
    isSaving: false,
    savedEngagement: createDefaultEngagement(),
    engagementId: 'create',
    loadingSavedEngagement: true,
    handleAddBannerImage: (_files: File[]) => {
        /* empty default method  */
    },
    fetchEngagement: () => {
        /* empty default method  */
    },
    widgets: [
        {
            widget_type_id: 0,
            items: [
                {
                    id: 0,
                    widget_type: 0,
                    engagement_id: 0,
                    data: {},
                },
            ],
        },
    ],
    isWidgetsLoading: false,
    widgetDrawerOpen: false,
    handleWidgetDrawerOpen: (_open: boolean) => {
        /* empty default method  */
    },
    addContactDrawerOpen: false,
    handleAddContactDrawerOpen: (_open: boolean) => {
        /* empty default method  */
    },
    widgetDrawerTabValue: 'widgetOptions',
    handleWidgetDrawerTabValueChange: (_tabValue: string) => {
        /* empty default method  */
    },
});

export const ActionProvider = ({ children }: { children: JSX.Element }) => {
    const { engagementId } = useParams<EngagementParams>();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const [isSaving, setSaving] = useState(false);
    const [loadingSavedEngagement, setLoadingSavedEngagement] = useState(true);

    const [savedEngagement, setSavedEngagement] = useState<Engagement>(createDefaultEngagement());

    const [bannerImage, setBannerImage] = useState<File | null>();
    const [savedBannerImageFileName, setSavedBannerImageFileName] = useState('');

    const [widgets, setWidgets] = useState<WidgetsList[]>([]);
    const [isWidgetsLoading, setIsWidgetsLoading] = useState(false);
    const [widgetDrawerOpen, setWidgetDrawerOpen] = useState(false);
    const [widgetDrawerTabValue, setWidgetDrawerTabValue] = React.useState('widgetOptions');

    const [addContactDrawerOpen, setAddContactDrawerOpen] = useState(false);

    useEffect(() => {
        loadWidgets();
    }, [savedEngagement]);

    const loadWidgets = async () => {
        if (!savedEngagement.id) {
            return;
        }

        try {
            setIsWidgetsLoading(true);
            const widgetsList = await getWidgets(savedEngagement.id);
            setWidgets(widgetsList);
            setIsWidgetsLoading(false);
        } catch (err) {
            console.log(err);
            setIsWidgetsLoading(false);
            dispatch(openNotification({ severity: 'error', text: 'Error fetching engagement widgets' }));
        }
    };

    const handleWidgetDrawerOpen = (open: boolean) => {
        setWidgetDrawerOpen(open);
    };

    const handleAddContactDrawerOpen = (open: boolean) => {
        setAddContactDrawerOpen(open);
    };

    const handleWidgetDrawerTabValueChange = (tabValue: string) => {
        setWidgetDrawerTabValue(tabValue);
    };

    const handleAddBannerImage = (files: File[]) => {
        if (files.length > 0) {
            setBannerImage(files[0]);
            return;
        }

        setBannerImage(null);
        setSavedBannerImageFileName('');
    };

    const fetchEngagement = async () => {
        if (engagementId !== 'create' && isNaN(Number(engagementId))) {
            navigate('/engagements/create/form');
        }

        if (engagementId === 'create') {
            setLoadingSavedEngagement(false);
            return;
        }

        try {
            const engagement = await getEngagement(Number(engagementId));
            setEngagement(engagement);
        } catch (err) {
            console.log(err);
            dispatch(openNotification({ severity: 'error', text: 'Error Fetching Engagement' }));
        }
    };

    const setEngagement = (engagement: Engagement) => {
        setSavedEngagement({ ...engagement });
        setSavedBannerImageFileName(engagement.banner_filename);
        setLoadingSavedEngagement(false);
        if (bannerImage) setBannerImage(null);
    };

    useEffect(() => {
        fetchEngagement();
    }, [engagementId]);

    const handleCreateEngagementRequest = async (engagement: EngagementForm): Promise<Engagement> => {
        setSaving(true);
        try {
            const uploadedBannerImageFileName = await handleUploadBannerImage();
            const result = await postEngagement({
                ...engagement,
                banner_filename: uploadedBannerImageFileName,
            });

            dispatch(openNotification({ severity: 'success', text: 'Engagement Created Successfully' }));
            setSaving(false);
            return Promise.resolve(result);
        } catch (error) {
            dispatch(
                openNotification({ severity: 'error', text: getErrorMessage(error) || 'Error Creating Engagement' }),
            );
            setSaving(false);
            console.log(error);
            return Promise.reject(error);
        }
    };

    const handleUploadBannerImage = async () => {
        if (!bannerImage) {
            return savedBannerImageFileName;
        }
        try {
            const savedDocumentDetails = await saveDocument(bannerImage, { filename: bannerImage.name });
            return savedDocumentDetails?.uniquefilename || '';
        } catch (error) {
            console.log(error);
            throw new Error('Error occurred during banner image upload');
        }
    };

    const handleUpdateEngagementRequest = async (engagement: EngagementFormUpdate): Promise<Engagement> => {
        setSaving(true);
        try {
            const uploadedBannerImageFileName = await handleUploadBannerImage();
            const engagementEditsToPatch = updatedDiff(savedEngagement, {
                ...engagement,
                banner_filename: uploadedBannerImageFileName,
            }) as PatchEngagementRequest;

            const updatedEngagement = await patchEngagement({
                ...engagementEditsToPatch,
                id: Number(engagementId),
            });
            setEngagement(updatedEngagement);
            dispatch(openNotification({ severity: 'success', text: 'Engagement Updated Successfully' }));
            setSaving(false);
            return Promise.resolve(updatedEngagement);
        } catch (error) {
            dispatch(openNotification({ severity: 'error', text: 'Error Updating Engagement' }));
            setSaving(false);
            console.log(error);
            return Promise.reject(error);
        }
    };

    return (
        <ActionContext.Provider
            value={{
                handleCreateEngagementRequest,
                handleUpdateEngagementRequest,
                isSaving,
                savedEngagement,
                engagementId,
                loadingSavedEngagement,
                handleAddBannerImage,
                fetchEngagement,
                widgets,
                widgetDrawerOpen,
                handleWidgetDrawerOpen,
                widgetDrawerTabValue,
                handleWidgetDrawerTabValueChange,
                addContactDrawerOpen,
                handleAddContactDrawerOpen,
                isWidgetsLoading,
            }}
        >
            {children}
        </ActionContext.Provider>
    );
};
