import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0); // Scroll to the top of the page on route change
        const formioModal = document.querySelector('.formio-dialog');
        if (formioModal) {
            formioModal.remove();
        }
    }, [pathname]);

    return null;
};

export default ScrollToTop;
