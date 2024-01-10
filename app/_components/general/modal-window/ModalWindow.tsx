import { MouseEventHandler, useCallback } from 'react';
import './ModalWindow.scss';

export interface ModalWindowProps {
    closeHandler?: () => void;
    children: React.ReactNode;
}

export function ModalWindow({ closeHandler, children }: ModalWindowProps) {

    const innerCloseHandler: MouseEventHandler = useCallback((e) => {
        if (e.button === 0 && e.target === e.currentTarget) {
            closeHandler?.();
        }
    }, [closeHandler]);

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