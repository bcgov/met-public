import React, { createContext, useContext, useState } from 'react';
import { SubmissionStatusTypes, SUBMISSION_STATUS } from 'constants/engagementStatus';
import { User } from 'models/user';
import { EngagementTeamMember } from 'models/engagementTeamMember';
import { getTeamMembers } from 'services/membershipService';
import { openNotification } from 'services/notificationService/notificationSlice';
import { useAppDispatch } from 'hooks';


export interface ImageUploadContextState {
    cropModalOpen: boolean;
    setCropModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    handleAddFile: (_files: File[]) => void;
    savedImageUrl: string;
    objectUrl: string;
    setObjectUrl: React.Dispatch<React.SetStateAction<string>>;
    existingImageUrl: string;
    setExistingImageURL: React.Dispatch<React.SetStateAction<string>>;
    imgAfterCrop: string;
    setImgAfterCrop: React.Dispatch<React.SetStateAction<string>>;
}

export const ImageUploadContext = createContext<ImageUploadContextState>({
    cropModalOpen: false,
    setCropModalOpen: () => {
        throw new Error('setCropModalOpen not implemented');
    },
    handleAddFile: () => {
        throw new Error('handleAddFile not implemented');
    },
    savedImageUrl: '',
    objectUrl: '',
    setObjectUrl: () => {
        throw new Error('setObjectUrl not implemented');
    },
    existingImageUrl: '',
    setExistingImageURL: () => {
        throw new Error('setExistingImageURL not implemented');
    },
    imgAfterCrop: '',
    setImgAfterCrop: () => {
        throw new Error('setExistingImageURL not implemented');
    },
});

interface ImageUploadContextProviderProps {
    handleAddFile: (_files: File[]) => void;
    children: React.ReactNode;
    savedImageUrl: string;
}
export const ImageUploadContextProvider = ({ children, handleAddFile, savedImageUrl }: ImageUploadContextProviderProps) => {
    // const { savedEngagement } = useContext(ActionContext);
    const dispatch = useAppDispatch();
    const [cropModalOpen, setCropModalOpen] = useState(false);
    const [objectUrl, setObjectUrl] = useState('');
    const [existingImageUrl, setExistingImageURL] = useState(savedImageUrl);
    const [imgAfterCrop, setImgAfterCrop] = useState('');

    return (
        <ImageUploadContext.Provider
            value={{
                cropModalOpen,
                setCropModalOpen,
                handleAddFile,
                savedImageUrl,
                objectUrl,
                setObjectUrl,
                existingImageUrl,
                setExistingImageURL,
                imgAfterCrop,
                setImgAfterCrop,
            }}
        >
            {children}
        </ImageUploadContext.Provider>
    );
};
