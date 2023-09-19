const server = require('fastify')({
    logger: false
});
const HOST = process.env.HOST || "127.0.0.1";
const PORT = process.env.PORT || 3000;
const TARGET = 'localhost:4000';

const complex_query = `query kitchenSink ($id: ID) {
    recipe (id: $id) {
        id name 
        ingredients {
            name qty
        }
    }
    pid
}`;

server.get('/', async () => {
    const req = await fetch(`http://${TARGET}/graphql`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            query: complex_query,
            variables: { id: 42 }
        })
    });

    return {
        consumer_pid: process.pid,
        producer_data: await req.json()
    }
});

const start = async () => {
    try {
        await server.listen({
            port: PORT,
            host: HOST
        });

        // console.log(`Graphql consumer running at http://${HOST}:${PORT}/`);
    } catch (error) {
        server.log.error(error);
    }
};

start();