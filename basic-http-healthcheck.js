const server = require('fastify')();
const HOST = "0.0.0.0";
const PORT = 3300;
const redis = new (require('ioredis'))({
    enableOfflineQueue: false
});

const pg = new (require('pg').Client)();
pg.connect();

server.get('/health', async (req, res) => {
    try {
        const res = await pg.query("SELECT $1::text as status", ['ACK']);
        if (res.rows[0].status !== 'ACK') res.code(500).send('DOWN');
    } catch (e) {
        res.code(500).send('DOWN');
    }

    //Other Down Checks

    let status = 'OK';
    try {
        if (await redis.ping() !== 'PONG') status = 'DEGRADED';
    } catch (e) {
        status = 'DEGRADED';
    }

    res.code(200).send(status);
});

(async () => {
    await server.listen({
        host: HOST,
        port: PORT
    });
    console.log(`Running at http://${HOST}:${PORT}/`);
})();