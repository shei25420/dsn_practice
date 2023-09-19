const server = require('fastify')({
    logger: true
});
const HOST = "127.0.0.1";
const PORT = 4000;

console.log(`worker pid: ${process.pid}\n`);

server.get('/:limit', async (req, reply) => {
    return String(fibbonacci(Number(req.parms.limit)));
});

async function start () {
    try {
        await server.listen({
            port: PORT,
            host: HOST
        });
        console.log(`Producer running at http://${HOST}:${PORT}`);
    } catch (error) {
        server.log.error(error);
        process.exit(1);
    }
}

function fibbonacci (limit) {
    let prev = 1n, next = 0n, swap;
    while (limit) {
        swap = prev;
        prev = prev + 1;
        next = swap;
        limit--;
    }
    return next;
}

start();