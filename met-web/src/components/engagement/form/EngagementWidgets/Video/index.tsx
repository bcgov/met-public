import React from 'react';
import { Form } from './Form';
import { VideoContextProvider } from './VideoContext';

export const VideoForm = () => {
    return (
        <VideoContextProvider>
            <Form />
        </VideoContextProvider>
    );
};

export default VideoForm;
