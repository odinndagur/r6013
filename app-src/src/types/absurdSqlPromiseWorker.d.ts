interface absurdSqlPromiseWorker {}

interface absurdSqlPromiseWorkerMessage {
    type:
        | 'sql'
        | 'exec'
    query: string | object
}
