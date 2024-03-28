import React from "react";

export function useMobileQuery(): boolean {
    const [isMobile, setIsMobile] = React.useState(window.innerWidth < 800);

    React.useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 800);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return isMobile;
}

export function useWindowMessage<T = any>(type: string): T | null {

    const [data, setData] = React.useState<T | null>(null);

    React.useEffect(() => {
        // TODO: look for appropriate source origin
        if (!window.parent) {
            return;
        }
        const handleMessage = (event: MessageEvent) => {
            const action = event.data as { type: string, payload: T };
            if (action.type === type) {
                setData(action.payload);
            }
        };
        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, []);

    return data;
}

export function useParentSender<R = any>(type: string): (data: R) => void {
    const sender = React.useCallback((sendData: R) => {
        if (window.parent === null || window.parent === window) {
            return;
        }
        window.parent.postMessage({ type, payload: sendData }, '*')
    }, []);

    return sender;
}
