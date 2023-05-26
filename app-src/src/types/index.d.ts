export {}

declare global {
    interface Window {
        promiseWorker: any
        worker: any
        setActiveStyleSheet: any
    }
}
