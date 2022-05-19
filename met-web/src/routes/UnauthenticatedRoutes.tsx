import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import Login from '../components/Login';

const UnauthenticatedRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<></>} />
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
};

export default UnauthenticatedRoutes;
