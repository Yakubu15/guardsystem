'use strict';

const path = require('path');
const express = require('express');

const PUBLIC_DIR = path.join(__dirname, 'public');
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '0.0.0.0';

function createApp() {
    const app = express();

    // Serve index.html and any other static assets from public/
    app.use(express.static(PUBLIC_DIR));

    app.use((req, res) => {
        if (req.path.startsWith('/api/')) {
            return res.status(404).json({ error: 'Endpoint not found' });
        }
        // Unknown page route -> fall back to the app shell
        res.status(404).sendFile(path.join(PUBLIC_DIR, 'index.html'));
    });

    return app;
}

function startServer() {
    const app = createApp();
    const server = app.listen(PORT, HOST, () => {
        console.log(`Server is up and running! -> http://localhost:${PORT}`);
    });

    server.on('error', (err) => {
        if (err.code === 'EADDRINUSE') {
            console.error(`Port ${PORT} is already in use. Set a different PORT and try again.`);
        } else {
            console.error('Server failed to start:', err);
        }
        process.exit(1);
    });

    for (const signal of ['SIGINT', 'SIGTERM']) {
        process.on(signal, () => {
            server.close(() => process.exit(0));
        });
    }

    return server;
}

// Only listen when executed directly, so tests can import createApp() freely
if (require.main === module) {
    startServer();
}

module.exports = { createApp, startServer, PUBLIC_DIR };
