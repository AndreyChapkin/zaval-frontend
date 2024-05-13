import { MouseEventHandler, useCallback, useEffect, useState } from 'react';
import { FPaper, FPaperProps } from '../paper-container/FPaper';
import './ModalWindow.scss';
import { useMobileQuery } from '@/app/_lib/utils/hooks';

export interface ModalWindowProps extends FPaperProps {
    onClose?: () => void;
    className?: string;
    children: React.ReactNode;
    width?: 20 | 40 | 50 | 60 | 80 | 85;
    height?: 20 | 40 | 50 | 60 | 80 | 85;
}

export function ModalWindow({ onClose, width = 80, height = 80, className = "", children, lightType, ...rest }: ModalWindowProps) {

    const resultLightType: FPaperProps["lightType"] = lightType || 'd-3';
    const isMobile = useMobileQuery();
    const [effectiveHeight, setEffectiveHeight] = useState(height);

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
    const heightClass = chooseHeightClass(effectiveHeight);

    // adjust to mobile
    useEffect(() => {
        if (isMobile) {
            setEffectiveHeight(80);
        } else {
            setEffectiveHeight(height);
        }
    }, [isMobile]);

    return (
        <div
            className="modalWindowBackgroud"
            onMouseDown={onCloseWrapper}
        >
            <FPaper lightType={resultLightType} className={`modalWindowBody ${className} ${widthClass} ${heightClass}`} {...rest}>
                {children}
            </FPaper>
        </div>
    );
}

function chooseWidthClass(width: number) {
    return `width-${width}`;
}

function chooseHeightClass(height: number) {
    return `height-${height}`;
}