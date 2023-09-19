const server = require('fastify')({
    logger: false
});

const HOST = process.env.HOST || "127.0.0.1";
const PORT = process.env.PORT || 3000;
const TARGET = process.env.TARGET || "localhost:4000";
const ZIPKIN = process.env.ZIPKIN || "localhost:9411";
const Zipkin = require('zipkin-lite');
const zipkin = new Zipkin({
    zipkinHost: ZIPKIN,
    serviceName: 'web-api',
    servicePort: PORT,
    serviceIp: HOST,
    init: 'short'
});
server.addHook('onRequest', zipkin.onRequest());
server.addHook('onResponse', zipkin.onResponse());

server.get('/', async (req, res) => {
    req.zipkin.setName('get_root');
    const url = `http://${TARGET}/recipes/42`;
    const zReq = req.zipkin.prepare();
    const recipe = await fetch(url, { headers: zReq.headers });
    zReq.complete('GET', url);
    const producer_data = await recipe.json();

    return {
        consumer_pid: process.pid,
        producer_data,
        trace: req.zipkin.trace
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