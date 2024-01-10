import './ActionButton.scss';

interface ActionButtonProps {
    label: string;
    onClick?: () => void;
}

export function ActionButton({ label, onClick }: ActionButtonProps) {
    return (
        <button className="actionButton" onClick={onClick}>
            {label}
        </button>
    );
};
