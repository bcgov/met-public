import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const PageViewTracker = () => {
    const location = useLocation();
    useEffect(() => {
        window.snowplow('trackPageView');
    }, [location]);

    return null;
};

export default PageViewTracker;
