interface absurdSqlPromiseWorker {}

interface absurdSqlPromiseWorkerMessage {
    type: 'sql' | 'exec' | 'export' | 'listCollections'
    query: string | object
}
