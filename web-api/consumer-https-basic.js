process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"; //Dangerous

const fs = require('fs');
const https = require('https');
const server = require('fastify')({
    logger: true
});

const HOST = process.env.HOST || "127.0.0.1";
const PORT = process.env.PORT || 3000;
const TARGET = "localhost:4000";


server.get('/', async () => {
    const req = await fetch(`https://${TARGET}/recipes/42`, {
        agent: new https.Agent({
            ca: fs.readFileSync(__dirname + '/../shared/tls/ca-certificate.cert')
        })
    });
    const producer_data = await req.json();
    return {
        consumer_pid: process.pid,
        producer_data
    }
});

const start = async () => {
    try {
        server.listen({
            port: PORT,
            host: HOST
        });
    } catch (error) {
        server.log.error(error);
        process.exit(1);
    }
}

start();