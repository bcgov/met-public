import React, { createContext, useState, useEffect } from 'react';
import { postEngagement, putEngagement, getEngagement } from '../../../services/engagementService';
import { useNavigate, useParams } from 'react-router-dom';
import { EngagementContext, EngagementForm, EngagementParams } from './types';
import { Engagement } from '../../../models/engagement';
import { saveDocument } from 'services/objectStorageService';
import { openNotification } from 'services/notificationService/notificationSlice';
import { useAppDispatch } from 'hooks';

export const ActionContext = createContext<EngagementContext>({
    handleCreateEngagementRequest: (_engagement: EngagementForm) => {
        /* empty default method  */
    },
    handleUpdateEngagementRequest: (_engagement: EngagementForm) => {
        /* empty default method  */
    },
    saving: false,
    savedEngagement: {
        id: 0,
        name: '',
        description: '',
        rich_description: '',
        status_id: 0,
        start_date: '',
        end_date: '',
        published_date: '',
        user_id: '',
        created_date: '',
        updated_date: '',
        banner_url: '',
        banner_filename: '',
        content: '',
        rich_content: '',
        status: { status_name: '' },
    },
    engagementId: 'create',
    loadingSavedEngagement: true,
    handleAddBannerImage: (_files: File[]) => {
        /* empty default method  */
    },
});

export const ActionProvider = ({ children }: { children: JSX.Element }) => {
    const { engagementId } = useParams<EngagementParams>();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const [saving, setSaving] = useState(false);
    const [loadingSavedEngagement, setLoadingSavedEngagement] = useState(true);

    const [savedEngagement, setSavedEngagement] = useState<Engagement>({
        id: 0,
        name: '',
        description: '',
        rich_description: '',
        status_id: 0,
        start_date: '',
        end_date: '',
        published_date: '',
        user_id: '',
        created_date: '',
        updated_date: '',
        banner_url: '',
        banner_filename: '',
        content: '',
        rich_content: '',
        status: { status_name: '' },
    });

    const [bannerImage, setBannerImage] = useState<File | null>();
    const [savedBannerImageFileName, setSavedBannerImageFileName] = useState('');

    const handleAddBannerImage = (files: File[]) => {
        if (files.length > 0) {
            setBannerImage(files[0]);
            return;
        }

        setBannerImage(null);
        setSavedBannerImageFileName('');
    };
    useEffect(() => {
        if (engagementId !== 'create' && isNaN(Number(engagementId))) {
            navigate('/engagement/create');
        }

        if (engagementId !== 'create') {
            setLoadingSavedEngagement(true);
            getEngagement(
                Number(engagementId),
                (result: Engagement) => {
                    setSavedEngagement({ ...result });
                    setSavedBannerImageFileName(result.banner_filename);
                    setLoadingSavedEngagement(false);
                },
                (errorMessage: string) => {
                    console.log(errorMessage);
                    dispatch(openNotification({ open: true, severity: 'error', text: 'Error Fetching Engagement' }));
                    navigate('/');
                },
            );
        } else {
            setLoadingSavedEngagement(false);
        }
    }, [engagementId]);

    const handleCreateEngagementRequest = async (engagement: EngagementForm) => {
        setSaving(true);
        const uploadedBannerImageFileName = await handleUploadBannerImage();
        postEngagement(
            {
                name: engagement.name,
                start_date: engagement.fromDate,
                status_id: engagement.status_id,
                end_date: engagement.toDate,
                description: engagement.description,
                rich_description: engagement.richDescription,
                content: engagement.content,
                rich_content: engagement.richContent,
                banner_filename: uploadedBannerImageFileName,
            },
            () => {
                //TODO engagement created success message in notification module
                dispatch(
                    openNotification({ open: true, severity: 'success', text: 'Engagement Created Successfully' }),
                );
                setSaving(false);
            },
            (errorMessage: string) => {
                //TODO:engagement create error message in notification module
                dispatch(openNotification({ open: true, severity: 'error', text: 'Error Creating Engagement' }));
                setSaving(false);
                console.log(errorMessage);
            },
        );
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
        }
    };

    const handleUpdateEngagementRequest = async (engagement: EngagementForm) => {
        setSaving(true);
        const uploadedBannerImageFileName = await handleUploadBannerImage();
        putEngagement(
            {
                id: Number(engagementId),
                name: engagement.name,
                start_date: engagement.fromDate,
                status_id: engagement.status_id,
                end_date: engagement.toDate,
                description: engagement.description,
                rich_description: engagement.richDescription,
                content: engagement.content,
                rich_content: engagement.richContent,
                banner_filename: uploadedBannerImageFileName,
            },
            () => {
                //TODO engagement update success message in notification module
                dispatch(
                    openNotification({ open: true, severity: 'success', text: 'Engagement Updated Successfully' }),
                );
                setSaving(false);
            },
            (errorMessage: string) => {
                //TODO: engagement update error message in notification module
                dispatch(openNotification({ open: true, severity: 'error', text: 'Error Updating Engagement' }));
                setSaving(false);
                console.log(errorMessage);
            },
        );
    };

    return (
        <ActionContext.Provider
            value={{
                handleCreateEngagementRequest,
                handleUpdateEngagementRequest,
                saving,
                savedEngagement,
                engagementId,
                loadingSavedEngagement,
                handleAddBannerImage,
            }}
        >
            {children}
        </ActionContext.Provider>
    );
};
