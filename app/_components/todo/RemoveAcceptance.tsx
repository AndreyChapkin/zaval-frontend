import { useEffect, useRef } from "react";
import { ModalWindow } from "../general/modal-window/ModalWindow";

export interface RemoveAcceptanceProps {
    acceptHandler: () => void;
    cancelHandler: () => void;
}

export function RemoveAcceptance({ acceptHandler, cancelHandler }: RemoveAcceptanceProps) {

    const buttonRef = useRef(null as HTMLButtonElement | null);

    useEffect(() => {
        if (buttonRef.current) {
            buttonRef.current.focus();
        }
    }, []);

    return (
        <ModalWindow closeHandler={cancelHandler}>
            <div className="remove-acceptance">
                <div className="message">Really want to remove?</div>
                <button tabIndex={0} ref={buttonRef} onClick={acceptHandler}>
                    Yes
                </button>
            </div>
        </ModalWindow>
    );
}