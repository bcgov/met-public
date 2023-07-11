import React from 'react';
import { VideoContextProvider } from './VideoContext';
import Form from './Form';

export const VideoForm = () => {
    return (
        <VideoContextProvider>
            <Form />
        </VideoContextProvider>
    );
};

export default VideoForm;
