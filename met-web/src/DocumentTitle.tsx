import React from 'react';
import { Helmet } from 'react-helmet-async';
const DocumentTitle = () => {
    return (
        <Helmet>
            {/* TODO: LANG-BACKEND - Change the value to show tenant specific */}
            <title>Modern Engagement</title>
        </Helmet>
    );
};

export default DocumentTitle;
