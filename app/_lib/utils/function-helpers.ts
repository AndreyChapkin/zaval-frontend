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