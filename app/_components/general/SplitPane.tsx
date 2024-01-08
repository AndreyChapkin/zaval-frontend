import { MouseEventHandler, ReactNode, useEffect, useRef, useState } from "react";

export interface SplitPaneProps {
    type?: 'horizontal' | 'vertical';
    contextName: string;
    initialFirstPercentSize?: number;
    initialSecondPercentSize?: number;
    children: ReactNode[];
}

const MIN_PERCENT_SIZE = 15;
const ADJUST_SIZE = 3;

export function SplitPane({
    type = 'horizontal',
    contextName,
    initialFirstPercentSize,
    initialSecondPercentSize,
    children,
}: SplitPaneProps) {

    const FIRST_AREA_SIZE_KEY = `${contextName}_firstAreaSize`;
    const SECOND_AREA_SIZE_KEY = `${contextName}_secondAreaSize`;

    const [firstPercentSize, setFirstPercentSize] = useState(initialFirstPercentSize || Number(
        localStorage.getItem(FIRST_AREA_SIZE_KEY) ?? MIN_PERCENT_SIZE
    ));
    const [secondPercentSize, setSecondPercentSize] = useState(initialSecondPercentSize || Number(
        localStorage.getItem(SECOND_AREA_SIZE_KEY) ?? MIN_PERCENT_SIZE
    ));
    const [areNotSelectable, setAreNotSelectable] = useState(false);

    const splitContainerRef = useRef<HTMLDivElement>(null);
    const splitContainerSizeRef = useRef(0);

    // calculate initial container size and on window resize
    useEffect(() => {
        const handleResize = () => {
            if (splitContainerRef.current) {
                const currentSize = type === 'horizontal' ?
                    splitContainerRef.current.offsetWidth
                    : splitContainerRef.current.offsetHeight;
                splitContainerSizeRef.current = currentSize - ADJUST_SIZE;
            }
        };

        handleResize(); // initialization

        window.addEventListener('resize', handleResize);
        handleResize();

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const createSeparatorMouseDownHandler: (n: number) => MouseEventHandler = (separatorNumber) => (e) => {

        const firstPercentSizeWhenMouseDown = firstPercentSize;
        const secondPercentSizeWhenMouseDown = secondPercentSize;
        let mouseDownCoordinate = 'horizontal' ? e.clientX : e.clientY;

        const documentMouseMoveHandler: MouseEventHandler = (event) => {
            const mouseMoveCoordinate = type === 'horizontal' ? event.clientX : event.clientY;
            const delta = mouseMoveCoordinate - mouseDownCoordinate;
            const deltaPercent = (delta / splitContainerSizeRef.current) * 100;

            if (separatorNumber === 1) {
                let doResizing = true;
                let newFirstPercentSize = Math.max(firstPercentSizeWhenMouseDown + deltaPercent, MIN_PERCENT_SIZE);
                if (newFirstPercentSize <= MIN_PERCENT_SIZE) {
                    doResizing = false;
                }
                let residualPercentSize = 0;
                // two ways to calculate residualPercentSize - if there is third column and not.
                let newSecondPercentSize: number | null = null;
                if (children.length === 2) {
                    residualPercentSize = 100 - newFirstPercentSize;
                } else if (children.length === 3) {
                    newSecondPercentSize = Math.max(secondPercentSizeWhenMouseDown - deltaPercent, MIN_PERCENT_SIZE);
                    residualPercentSize = 100 - newFirstPercentSize - newSecondPercentSize;
                }
                // first column should not be to wide
                if (residualPercentSize >= MIN_PERCENT_SIZE && doResizing) {
                    setFirstPercentSize(newFirstPercentSize);
                }
                // set manually second size if there is third child
                if (newSecondPercentSize !== null) {
                    setSecondPercentSize(newSecondPercentSize);
                }
            } else if (separatorNumber === 2) {
                let newSecondPercentSize = Math.max(
                    secondPercentSizeWhenMouseDown + deltaPercent,
                    MIN_PERCENT_SIZE
                );
                let residualPercentSize = 100 - firstPercentSize - newSecondPercentSize;
                if (residualPercentSize >= MIN_PERCENT_SIZE) {
                    setSecondPercentSize(newSecondPercentSize);
                }
            }
        };

        const documentMouseUpHandler: MouseEventHandler = (e) => {
            setAreNotSelectable(false);
            if (separatorNumber === 1) {
                localStorage.setItem(FIRST_AREA_SIZE_KEY, String(firstPercentSize));
                if (children.length === 3) {
                    localStorage.setItem(SECOND_AREA_SIZE_KEY, String(secondPercentSize));
                }
            } else if (separatorNumber === 2) {
                localStorage.setItem(SECOND_AREA_SIZE_KEY, String(secondPercentSize));
            }
            document.removeEventListener('mousemove', documentMouseMoveHandler as any);
            document.removeEventListener('mouseup', documentMouseUpHandler as any);
            document.body.style['cursor'] = '';
            // otherwise there is unintentional text selection
            window.getSelection()?.removeAllRanges();
        };
        
        return (e: MouseEvent) => {
            // bad behaviour if there is any selected text
            window.getSelection()?.removeAllRanges();
            setAreNotSelectable(true);
            mouseDownCoordinate = type === 'horizontal' ? e.clientX : e.clientY;
            document.addEventListener('mousemove', documentMouseMoveHandler as any);
            document.addEventListener('mouseup', documentMouseUpHandler as any);
            document.body.style['cursor'] = type === 'horizontal' ? 'col-resize' : 'row-resize';
        };
    };

    return (
        <div
            ref={splitContainerRef}
            className={`split-pane ${type === 'horizontal' ? 'horizontal' : 'vertical'}`}
        >
            <div
			className="split-area"
			class:not-selectable={areNotSelectable}
			style={children.length > 1
				? {[type === 'horizontal' ? 'width' : 'height']: `${firstPercentSize}%`}
				: {flex: 1}}
		>
			{children[0]}
		</div>
        { children.length > 1 &&
            <>
                <div
                    className="split-separator"
                    onMouseDown={createSeparatorMouseDownHandler(1)}
                />
                <div
                className="split-area"
                class:not-selectable={areNotSelectable}
                style={children.length > 2
                    ? {[type === 'horizontal' ? 'width' : 'height']: `${secondPercentSize}%`}
                    : {flex: 1}}
                >
                    {children[1]}
                </div>
            </>
        }
        { children.length > 2 &&
            <>
                <div
                    className="split-separator"
                    onMouseDown={createSeparatorMouseDownHandler(2)}
                />
                <div
                    className="split-area"
                    class:not-selectable={areNotSelectable}
                    style={{flex: 1}}
                >
                    {children[2]}
                </div>
            </>
        }
        </div>
    );
};