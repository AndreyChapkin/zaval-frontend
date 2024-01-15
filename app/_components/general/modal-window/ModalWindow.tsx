import { MouseEventHandler, useCallback } from 'react';
import './ModalWindow.scss';

export interface ModalWindowProps {
    onClose?: () => void;
    children: React.ReactNode;
}

export function ModalWindow({ onClose, children }: ModalWindowProps) {

    const innerCloseHandler: MouseEventHandler = useCallback((e) => {
        if (e.button === 0 && e.target === e.currentTarget) {
            onClose?.();
        }
    }, [onClose]);

    return (
        <div
            className={"modalWindowBackgroud"}
            onMouseDown={innerCloseHandler}
        >
            <div className={"modalWindowBody"}>
                {children}
            </div>
        </div>
    );
}