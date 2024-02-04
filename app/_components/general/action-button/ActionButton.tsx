import './ActionButton.scss';

interface ActionButtonProps {
    label: string;
    type?: 'action' | 'standard';
    className?: string;
    onClick?: () => void;
    tabIndex?: number;
}

export function ActionButton({ label, type = 'action', className, tabIndex, onClick }: ActionButtonProps) {

    let buttonClass = 'actionButton';
    if (type === 'standard') {
        buttonClass = 'standardButton';
    }

    return (
        <button
            className={`${buttonClass} ${className}`}
            tabIndex={tabIndex}
            onClick={onClick}
        >
            {label}
        </button>
    );
};
