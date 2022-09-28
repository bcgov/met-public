import React, { createContext, useState, useEffect } from 'react';
import { postEngagement, getEngagement, patchEngagement } from '../../../services/engagementService';
import { useNavigate, useParams } from 'react-router-dom';
import {
    EngagementContext,
    IEngagementForm,
    EngagementFormModalState,
    EngagementFormUpdate,
    EngagementParams,
    OpenModalProps,
} from './types';
import { createDefaultEngagement, Engagement } from '../../../models/engagement';
import { saveDocument } from 'services/objectStorageService';
import { openNotification } from 'services/notificationService/notificationSlice';
import { useAppDispatch } from 'hooks';
import { getErrorMessage } from 'utils';

export const ActionContext = createContext<EngagementContext>({
    handleCreateEngagementRequest: (_engagement: IEngagementForm): Promise<Engagement> => {
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
    modalState: {
        modalOpen: false,
    },
    handleOpenModal: (_props: OpenModalProps) => {
        /* empty default method  */
    },
    handleCloseModal: () => {
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
    const [modalState, setModalState] = useState<EngagementFormModalState>({
        modalOpen: false,
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
            setSavedEngagement({ ...engagement });
            setSavedBannerImageFileName(engagement.banner_filename);
            setLoadingSavedEngagement(false);
        } catch (err) {
            console.log(err);
            dispatch(openNotification({ severity: 'error', text: 'Error Fetching Engagement' }));
        }
    };

    useEffect(() => {
        fetchEngagement();
    }, [engagementId]);

    const handleCreateEngagementRequest = async (engagement: IEngagementForm): Promise<Engagement> => {
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
            const engagementEditsToPatch = {
                id: Number(engagementId),
                ...engagement,
                banner_filename: uploadedBannerImageFileName,
            };
            const result = await patchEngagement(engagementEditsToPatch);

            dispatch(openNotification({ severity: 'success', text: 'Engagement Updated Successfully' }));
            setSaving(false);
            return Promise.resolve(result);
        } catch (error) {
            dispatch(openNotification({ severity: 'error', text: 'Error Updating Engagement' }));
            setSaving(false);
            console.log(error);
            return Promise.reject(error);
        }
    };

    const handleOpenModal = ({
        handleConfirm = () => {
            /*
                default empty function
            */
        },
    }: OpenModalProps) => {
        setModalState({ modalOpen: true, handleConfirm });
    };

    const handleCloseModal = () => {
        setModalState({ modalOpen: false });
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
                modalState,
                handleOpenModal,
                handleCloseModal,
            }}
        >
            {children}
        </ActionContext.Provider>
    );
};
