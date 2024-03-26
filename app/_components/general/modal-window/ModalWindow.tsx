import { MouseEventHandler, useCallback, useEffect } from 'react';
import './ModalWindow.scss';
import FCol from '../flex-line/FCol';

export interface ModalWindowProps {
    onClose?: () => void;
    className?: string;
    children: React.ReactNode;
    width?: 20 | 40 | 50 | 60 | 80;
    height?: 20 | 40 | 50 | 60 | 80;
}

export function ModalWindow({ onClose, width = 50, height = 50, className = "", children }: ModalWindowProps) {

    const onCloseWrapper: MouseEventHandler = useCallback((e) => {
        if (e.button === 0 && e.target === e.currentTarget) {
            onClose?.();
        }
    }, [onClose]);

    useEffect(() => {
        const escapeHandler = (e: KeyboardEvent) => {
            if (e.code === 'Escape') {
                onClose?.();
            }
        };
        window.document.addEventListener('keyup', escapeHandler);
        return () => {
            window.document.removeEventListener('keyup', escapeHandler);
        };
    }, []);

    const widthClass = chooseWidthClass(width);
    const heightClass = chooseHeightClass(height);

    return (
        <div
            className="modalWindowBackgroud"
            onMouseDown={onCloseWrapper}
        >
            <FCol alignItems='stretch' hasScrollable className={`modalWindowBody ${className} ${widthClass} ${heightClass}`}>
                {children}
            </FCol>
        </div>
    );
}

function chooseWidthClass(width: number) {
    switch (width) {
        case 20:
            return 'width-20';
        case 40:
            return 'width-40';
        case 50:
            return 'width-50';
        case 60:
            return 'width-60';
        case 80:
            return 'width-80';
        default:
            return 'width-50';
    }
}

function chooseHeightClass(height: number) {
    switch (height) {
        case 20:
            return 'height-20';
        case 40:
            return 'height-40';
        case 50:
            return 'height-50';
        case 60:
            return 'height-60';
        case 80:
            return 'height-80';
        default:
            return 'height-50';
    }
}