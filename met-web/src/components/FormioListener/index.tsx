import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const FormioListener = () => {
    const { pathname } = useLocation();

    useEffect(() => {
        const formioModal = document.querySelector('.formio-dialog');
        if (formioModal) {
            formioModal.remove();
        }
    }, [pathname]);

    return null;
};

export default FormioListener;
