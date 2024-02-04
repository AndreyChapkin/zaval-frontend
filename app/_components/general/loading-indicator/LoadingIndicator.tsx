import React from 'react';

import './LoadingIndicator.scss';

const LoadingIndicator: React.FC = () => {
    return (
        <div className="loadingIndicator">
            <div className="ball" />
        </div>
    );
};

export default LoadingIndicator;