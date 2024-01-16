import React, { createContext, useState, useEffect } from 'react';
import { postEngagement, getEngagement, patchEngagement } from '../../../services/engagementService';
import {
    postEngagementMetadata,
    getEngagementMetadata,
    patchEngagementMetadata,
} from '../../../services/engagementMetadataService';
import { useNavigate, useParams } from 'react-router-dom';
import { EngagementContext, EngagementForm, EngagementFormUpdate, EngagementParams } from './types';
import {
    createDefaultEngagement,
    createDefaultEngagementMetadata,
    Engagement,
    EngagementMetadata,
} from '../../../models/engagement';
import { saveObject } from 'services/objectStorageService';
import { openNotification } from 'services/notificationService/notificationSlice';
import { useAppDispatch, useAppSelector } from 'hooks';
import { getErrorMessage } from 'utils';
import { updatedDiff, diff } from 'deep-object-diff';
import { PatchEngagementRequest } from 'services/engagementService/types';
import { USER_ROLES } from 'services/userService/constants';
import { EngagementStatus } from 'constants/engagementStatus';

const CREATE = 'create';
export const ActionContext = createContext<EngagementContext>({
    handleCreateEngagementRequest: (_engagement: EngagementForm): Promise<Engagement> => {
        return Promise.reject();
    },
    handleUpdateEngagementRequest: (_engagement: EngagementFormUpdate): Promise<Engagement> => {
        return Promise.reject();
    },
    handleCreateEngagementMetadataRequest: (_engagement: EngagementMetadata): Promise<EngagementMetadata> => {
        return Promise.reject();
    },
    handleUpdateEngagementMetadataRequest: (_engagement: EngagementMetadata): Promise<EngagementMetadata> => {
        return Promise.reject();
    },
    isSaving: false,
    savedEngagement: createDefaultEngagement(),
    engagementMetadata: createDefaultEngagementMetadata(),
    engagementId: CREATE,
    loadingSavedEngagement: true,
    handleAddBannerImage: (_files: File[]) => {
        /* empty default method  */
    },
    fetchEngagement: () => {
        /* empty default method  */
    },
    fetchEngagementMetadata: () => {
        /* empty default method  */
    },
    loadingAuthorization: true,
});

export const ActionProvider = ({ children }: { children: JSX.Element }) => {
    const { engagementId } = useParams<EngagementParams>();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const { roles, assignedEngagements } = useAppSelector((state) => state.user);

    const [isSaving, setSaving] = useState(false);
    const [loadingSavedEngagement, setLoadingSavedEngagement] = useState(true);
    const [loadingAuthorization, setLoadingAuthorization] = useState(true);

    const [savedEngagement, setSavedEngagement] = useState<Engagement>(createDefaultEngagement());
    const [engagementMetadata, setEngagementMetadata] = useState<EngagementMetadata>({
        ...createDefaultEngagementMetadata(),
    });
    const [bannerImage, setBannerImage] = useState<File | null>();
    const [savedBannerImageFileName, setSavedBannerImageFileName] = useState('');
    const isCreate = window.location.pathname.includes(CREATE);

    const handleAddBannerImage = (files: File[]) => {
        if (files.length > 0) {
            setBannerImage(files[0]);
            return;
        }

        setBannerImage(null);
        setSavedBannerImageFileName('');
    };

    const fetchEngagement = async () => {
        if (!isCreate && isNaN(Number(engagementId))) {
            navigate('/');
        }

        if (isCreate) {
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

    const fetchEngagementMetadata = async () => {
        if (isCreate) {
            return;
        }

        try {
            const engagementMetaData = await getEngagementMetadata(Number(engagementId));
            setEngagementMetadata(engagementMetaData);
        } catch (err) {
            console.log(err);
            dispatch(openNotification({ severity: 'error', text: 'Error Fetching Engagement Metadata' }));
        }
    };
    const setEngagement = (engagement: Engagement) => {
        setSavedEngagement({ ...engagement });
        setSavedBannerImageFileName(engagement.banner_filename);

        if (bannerImage) setBannerImage(null);
    };

    const verifyUserCanEdit = () => {
        const canViewPrivateEngagements = roles.includes(USER_ROLES.VIEW_PRIVATE_ENGAGEMENTS);
        if (canViewPrivateEngagements) {
            setLoadingAuthorization(false);
            return;
        }

        if (isCreate) {
            setLoadingAuthorization(false);
            return;
        }

        if (!savedEngagement.id) {
            return;
        }

        const engagementInDraft = savedEngagement.engagement_status.id === EngagementStatus.Draft;
        const isAssignedToEngagement = assignedEngagements.includes(Number(savedEngagement.id));
        if (!engagementInDraft || !isAssignedToEngagement) {
            navigate('/unauthorized');
            return;
        }
        setLoadingAuthorization(false);
    };

    const loadData = async () => {
        await fetchEngagement();
        await fetchEngagementMetadata();
        setLoadingSavedEngagement(false);
    };

    useEffect(() => {
        loadData();
    }, [engagementId]);

    useEffect(() => {
        verifyUserCanEdit();
    }, [savedEngagement, engagementId]);

    const handleCreateEngagementMetadataRequest = async (
        engagement: EngagementMetadata,
    ): Promise<EngagementMetadata> => {
        setSaving(true);
        try {
            const result = await postEngagementMetadata(engagement);
            setSaving(false);
            return Promise.resolve(result);
        } catch (error) {
            dispatch(
                openNotification({
                    severity: 'error',
                    text: getErrorMessage(error) || 'Error Creating Engagement Metadata',
                }),
            );
            setSaving(false);
            console.log(error);
            return Promise.reject(error);
        }
    };

    const handleCreateEngagementRequest = async (engagement: EngagementForm): Promise<Engagement> => {
        setSaving(true);
        try {
            const uploadedBannerImageFileName = await handleUploadBannerImage();
            const result = await postEngagement({
                ...engagement,
                banner_filename: uploadedBannerImageFileName,
            });

            dispatch(openNotification({ severity: 'success', text: 'Engagement has been created' }));
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
            const savedDocumentDetails = await saveObject(bannerImage, { filename: bannerImage.name });
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

            if (Object.keys(engagementEditsToPatch).length === 0) {
                setSaving(false);
                return savedEngagement;
            }

            const updatedEngagement = await patchEngagement({
                ...engagementEditsToPatch,
                id: Number(engagementId),
                status_block: engagement.status_block?.filter((_, index) => {
                    return engagementEditsToPatch.status_block?.[index];
                }),
            });
            setEngagement(updatedEngagement);
            dispatch(openNotification({ severity: 'success', text: 'Engagement has been saved' }));
            setSaving(false);
            return Promise.resolve(updatedEngagement);
        } catch (error) {
            dispatch(openNotification({ severity: 'error', text: 'Error Updating Engagement' }));
            setSaving(false);
            console.log(error);
            return Promise.reject(error);
        }
    };

    const handleUpdateEngagementMetadataRequest = async (): Promise<EngagementMetadata> => {
        try {
            if (!savedEngagement.id) {
                dispatch(
                    openNotification({ severity: 'error', text: 'Please save the engagement before adding metadata' }),
                );
                return engagementMetadata;
            }
            const state = { ...engagementMetadata };
            const engagementMetadataToUpdate: EngagementMetadata = {
                engagement_id: Number(engagementId),
            };
            const metadataDiff = diff(state, engagementMetadataToUpdate) as EngagementMetadata;

            if (Object.keys(metadataDiff).length === 0) {
                return engagementMetadata;
            }

            const updatedEngagementMetadata = await patchEngagementMetadata({
                ...metadataDiff,
                engagement_id: Number(engagementId),
            });
            setEngagementMetadata(updatedEngagementMetadata);
            return Promise.resolve(updatedEngagementMetadata);
        } catch (error) {
            dispatch(openNotification({ severity: 'error', text: 'Error saving engagement metadata' }));
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
                handleCreateEngagementMetadataRequest,
                handleUpdateEngagementMetadataRequest,
                isSaving,
                savedEngagement,
                engagementMetadata,
                engagementId,
                loadingSavedEngagement,
                handleAddBannerImage,
                fetchEngagement,
                fetchEngagementMetadata,
                loadingAuthorization,
            }}
        >
            {children}
        </ActionContext.Provider>
    );
};
