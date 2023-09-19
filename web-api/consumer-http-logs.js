const server = require('fastify')();
const HOST = process.env.HOST || "127.0.0.1";
const PORT = process.env.PORT || 3000;
const TARGET = process.env.TARGET || "localhost:4000";

const log = require('./logstash');

(async () => {
    await server.register(require('@fastify/middie'));
    server.use((req, res, next) => {
        log('info', 'request-incoming', {
            path: req.url,
            method: req.method,
            ip: req.ip,
            ua: req.headers['user-agent'] || null
        });
        next();
    });

    server.setErrorHandler(async (err, req) => {
        log('error', 'request-failure', {
            stack: err.stack,
            path: req.url,
            method: req.method
        });
        return { error: err.message };
    });

    server.get('/', async () => {
        const url = `http://${TARGET}/recipes/42`;
        log('info', 'request-outgoing', {
            url,
            svc: 'recipe-api'
        });

        const req = await fetch(url);
        const producer_data = await req.json();

        return { 
            consumer_pid: process.pid,
            producer_data
        };
    });

    server.get('/error', async () => {
        throw new Error('Oh no!!');
    });

    try {
        server.listen({
            port: PORT,
            host: HOST
        });
        
        log('verbose', 'server-listen', {
            host: HOST,
            port: PORT
        })
    } catch (error) {
        log('error', 'server-listen', {
            stack: error.stack,
            host: HOST,
            port: PORT, 
            
        });
    }
})();