import React from 'react';

import './IconButton.scss';

interface IconButtonProps {
    iconUrl: string;
    onClick?: () => void;
}

export const IconButton: React.FC<IconButtonProps> = ({ iconUrl, onClick }) => {
    return (
        <div className='iconButton' onClick={onClick}>
            <img src={iconUrl} alt="icon" />
        </div>
    );
};
