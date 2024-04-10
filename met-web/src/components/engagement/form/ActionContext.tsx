import React, { createContext, useState, useEffect, useMemo } from 'react';
import { postEngagement, getEngagement, patchEngagement } from '../../../services/engagementService';
import { getEngagementMetadata, getMetadataTaxa } from '../../../services/engagementMetadataService';
import { useNavigate, useParams } from 'react-router-dom';
import { EngagementContext, EngagementForm, EngagementFormUpdate, EngagementParams } from './types';
import { createDefaultEngagement, Engagement, EngagementMetadata, MetadataTaxon } from '../../../models/engagement';
import { saveObject } from 'services/objectStorageService';
import { openNotification } from 'services/notificationService/notificationSlice';
import { useAppDispatch, useAppSelector } from 'hooks';
import { getErrorMessage } from 'utils';
import { updatedDiff } from 'deep-object-diff';
import { PatchEngagementRequest } from 'services/engagementService/types';
import { USER_ROLES } from 'services/userService/constants';
import { EngagementStatus } from 'constants/engagementStatus';
import { EngagementContent, createDefaultEngagementContent } from 'models/engagementContent';
import { getEngagementContent } from 'services/engagementContentService';

const CREATE = 'create';
export const ActionContext = createContext<EngagementContext>({
    handleCreateEngagementRequest: (_engagement: EngagementForm): Promise<Engagement> => {
        return Promise.reject();
    },
    handleUpdateEngagementRequest: (_engagement: EngagementFormUpdate): Promise<Engagement> => {
        return Promise.reject();
    },
    tenantTaxa: [],
    setTenantTaxa: () => {
        throw new Error('setTenantTaxa is unimplemented');
    },
    setEngagementMetadata() {
        return Promise.reject();
    },
    taxonMetadata: new Map(),
    isSaving: false,
    setSaving: () => {
        /* empty default method  */
    },
    savedEngagement: createDefaultEngagement(),
    engagementMetadata: [],
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
    isNewEngagement: true,
    setIsNewEngagement: () => {
        /* empty default method  */
    },
    contentTabs: [createDefaultEngagementContent()],
    setContentTabs: () => {
        return;
    },
    fetchEngagementContents: async () => {
        /* empty default method  */
    },
});

export const ActionProvider = ({ children }: { children: JSX.Element }) => {
    const { engagementId } = useParams<EngagementParams>();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const { roles, assignedEngagements } = useAppSelector((state) => state.user);

    const [isSaving, setSaving] = useState(false);
    const [loadingSavedEngagement, setLoadingSavedEngagement] = useState(true);
    const [loadingAuthorization, setLoadingAuthorization] = useState(true);

    const [tenantTaxa, setTenantTaxa] = useState<MetadataTaxon[]>([]);
    const [savedEngagement, setSavedEngagement] = useState<Engagement>(createDefaultEngagement());
    const [isNewEngagement, setIsNewEngagement] = useState(!savedEngagement.id);
    const [engagementMetadata, setEngagementMetadata] = useState<EngagementMetadata[]>([]);
    const [bannerImage, setBannerImage] = useState<File | null>();
    const [savedBannerImageFileName, setSavedBannerImageFileName] = useState('');
    const [contentTabs, setContentTabs] = useState<EngagementContent[]>([createDefaultEngagementContent()]);
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
            const taxaData = await getMetadataTaxa();
            engagementMetadata.forEach((metadata) => {
                const taxon = taxaData[metadata.taxon_id];
                if (taxon) {
                    if (taxon.entries === undefined) {
                        taxon.entries = [];
                    }
                    taxon.entries.push(metadata);
                }
            });
            setTenantTaxa(Object.values(taxaData));
        } catch (err) {
            console.log(err);
            dispatch(openNotification({ severity: 'error', text: 'Error Fetching Engagement Metadata' }));
        }
    };

    const taxonMetadata = useMemo(() => {
        const taxonMetadataMap = new Map<number, string[]>();
        engagementMetadata.forEach((metadata) => {
            if (!taxonMetadataMap.has(metadata.taxon_id)) {
                taxonMetadataMap.set(metadata.taxon_id, []);
            }
            taxonMetadataMap.get(metadata.taxon_id)?.push(metadata.value);
        });
        return taxonMetadataMap;
    }, [engagementMetadata]);

    const fetchEngagementContents = async () => {
        if (isCreate) {
            return;
        }

        try {
            const engagementContents = await getEngagementContent(Number(engagementId));
            setContentTabs(engagementContents);
        } catch (err) {
            console.log(err);
            dispatch(openNotification({ severity: 'error', text: 'Error Fetching Engagement Contents' }));
        }
    };

    const setEngagement = (engagement: Engagement) => {
        setSavedEngagement({ ...engagement });
        setIsNewEngagement(!savedEngagement.id);
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
        await fetchEngagementContents();
        setLoadingSavedEngagement(false);
    };

    useEffect(() => {
        loadData();
    }, [engagementId]);

    useEffect(() => {
        verifyUserCanEdit();
    }, [savedEngagement, engagementId]);

    const handleCreateEngagementRequest = async (engagement: EngagementForm): Promise<Engagement> => {
        setSaving(true);
        try {
            const uploadedBannerImageFileName = await handleUploadBannerImage();
            const result = await postEngagement({
                ...engagement,
                banner_filename: uploadedBannerImageFileName,
            });

            setEngagement(result);
            const engagementContents = await getEngagementContent(Number(result.id));
            setContentTabs(engagementContents);
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
                id: Number(savedEngagement.id),
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

    return (
        <ActionContext.Provider
            value={{
                handleCreateEngagementRequest,
                handleUpdateEngagementRequest,
                tenantTaxa,
                setTenantTaxa,
                isSaving,
                setSaving,
                savedEngagement,
                engagementMetadata,
                engagementId,
                loadingSavedEngagement,
                handleAddBannerImage,
                fetchEngagement,
                fetchEngagementMetadata,
                setEngagementMetadata,
                taxonMetadata,
                loadingAuthorization,
                isNewEngagement,
                setIsNewEngagement,
                contentTabs,
                setContentTabs,
                fetchEngagementContents,
            }}
        >
            {children}
        </ActionContext.Provider>
    );
};
