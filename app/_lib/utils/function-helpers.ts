/**
 * @timeLimit - in milliseconds
*/
export function decreaseNumberOfCalls<T extends Function>(f: T, timeLimit: number): T {
    let actualArgs: any = null;
    let timerId: number | undefined;
    const executor = () => f(actualArgs);
    const wrapper = (args: any) => {
        actualArgs = args;
        clearTimeout(timerId);
        timerId = setTimeout(executor, timeLimit) as any as number;
    };
    return wrapper as unknown as T;
}

export function writeToClipboard(content: string, format: 'text/html' | 'text/plain' = 'text/plain') {
    const blobInput = new Blob([content], { type: 'text/html' });
    const clipboardItemInput = new ClipboardItem({ 'text/html': blobInput });
    navigator.clipboard.write([clipboardItemInput]);
}

export async function readFromClipboard(format: 'text/html' | 'text/plain' = 'text/plain'): Promise<HTMLElement[] | string> {
    const clipboardContents = await navigator.clipboard.read();
    if (format === 'text/html') {
        const clipboardContents = await navigator.clipboard.read();
        const blob = await clipboardContents[0].getType('text/html');
        const text = await blob.text();
        const tempDom = new DOMParser().parseFromString(text, 'text/html');
        return Array.from(tempDom.body.childNodes) as HTMLElement[];
    }
    const blob = await clipboardContents[0].getType('text/plain');
    return blob.text();
}