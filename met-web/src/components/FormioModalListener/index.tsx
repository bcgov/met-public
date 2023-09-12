import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const FormioModalListener = () => {
    const { pathname } = useLocation();

    useEffect(() => {
        const formioModal = document.querySelector('.formio-dialog');
        if (formioModal) {
            formioModal.remove();
        }
    }, [pathname]);

    return null;
};

export default FormioModalListener;
