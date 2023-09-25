import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const FormioListener = () => {
    const { pathname } = useLocation();

    useEffect(() => {
        const formioElements = document.querySelectorAll('.formio-form');

        const observer = new MutationObserver(() => {
            formioElements.forEach((formio) => {
                const submitButton = formio.querySelector('button.btn-wizard-nav-submit');
                if (submitButton) {
                    submitButton.textContent = 'Submit';
                }
            });
        });

        formioElements.forEach((formio) => {
            observer.observe(formio, { childList: true, subtree: true });
        });

        // Disconnect observer on component unmount to avoid memory leaks
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        const formioModal = document.querySelector('.formio-dialog');
        if (formioModal) {
            formioModal.remove();
        }
    }, [pathname]);

    return null;
};

export default FormioListener;
