
export interface ModalWindowProps {
    closeHandler?: () => void;
    children: React.ReactNode;
}

export function ModalWindow({ closeHandler, children }: ModalWindowProps) {

    return (
        <div
            className="modalWindow background"
            onMouseDown={closeHandler}
        >
            <div className="modalWindowBody">
                {children}
            </div>
        </div>
    );
}