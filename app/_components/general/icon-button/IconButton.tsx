import React from 'react';

import './IconButton.scss';

interface IconButtonProps {
    iconUrl: string;
    className?: string;
    size?: "small" | "medium" | "large";
    onClick?: () => void;
}

export const IconButton: React.FC<IconButtonProps> = ({
    iconUrl,
    size = "medium",
    className = "",
    onClick
}) => {

    let sizeClass = 'mediumSized';
    switch (size) {
        case "small":
            sizeClass = 'smallSized';
            break;
        case "large":
            sizeClass = 'largeSized';
            break;
    }

    return (
        <div className={`iconButton ${sizeClass} ${className}`} onClick={onClick}>
            <img src={iconUrl} alt="icon" />
        </div>
    );
};
