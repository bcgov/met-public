import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const PageViewTracker = () => {
    const location = useLocation();
    useEffect(() => {
        try {
            window.snowplow('trackPageView');
        } catch (error) {
            console.log(error);
        }
    }, [location]);

    return null;
};

export default PageViewTracker;
