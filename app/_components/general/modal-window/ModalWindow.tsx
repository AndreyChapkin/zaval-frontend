import { MouseEventHandler, useCallback, useEffect } from 'react';
import './ModalWindow.scss';

export interface ModalWindowProps {
    onClose?: () => void;
    children: React.ReactNode;
}

export function ModalWindow({ onClose, children }: ModalWindowProps) {

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

    return (
        <div
            className={"modalWindowBackgroud"}
            onMouseDown={onCloseWrapper}
        >
            <div className={"modalWindowBody"}>
                {children}
            </div>
        </div>
    );
}