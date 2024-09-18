// src/utils/abortablePromise.ts
export function abortablePromise<T>(
    promise: Promise<T>,
    abortSignal?: AbortSignal
): Promise<T> {
    if (!abortSignal) {
        return promise;
    }

    return new Promise<T>((resolve, reject) => {
        const onAbort = () => {
            reject(new DOMException('Aborted', 'AbortError'));
        };

        if (abortSignal.aborted) {
            // If already aborted, reject immediately
            onAbort();
            return;
        }

        abortSignal.addEventListener('abort', onAbort);

        promise
            .then((value) => {
                abortSignal.removeEventListener('abort', onAbort);
                resolve(value);
            })
            .catch((error) => {
                abortSignal.removeEventListener('abort', onAbort);
                reject(error);
            });
    });
}