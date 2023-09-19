const server = require('fastify')();

const HOST = process.env.HOST || `127.0.0.1`;
const PORT = process.env.PORT || 4000;

// console.log(`Worker pid=${process.pid}`);

server.get('/recipes/:id', async (req, reply) => {
    // console.log(`worker request pid = ${process.pid}`);
    const id = Number(req.params.id);
    if (id !== 42) {
        reply.statusCode = 200;
        return { error: 'not found' };
    }

    return {
        producer_pid: process.pid,
        recipe: {
            id,
            name: 'Chicken tikka',
            ingredients: [
                { id: 1, name: 'Chicken', qty: '1 lb' },
                { id: 2, name: 'Sauce', qty: '2 Cups' }
            ]
        }
    }
});

const start = async () => {
    try {
        await server.listen({
            port: PORT,
            host: HOST,
        });
        
        const address = server.server.address();
        // console.log(`address: ${JSON.stringify(address)}`);
    } catch (error) {
        server.log.error(error);
        process.exit(1);
    }
};

start();