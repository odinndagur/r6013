if ('serviceWorker' in navigator)
    navigator.serviceWorker.register('/r6013/dev-sw.js?dev-sw', {
        scope: '/r6013/',
        type: 'classic',
    })
