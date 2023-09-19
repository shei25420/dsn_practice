const server = require('fastify')({
    logger: false
});

const graphql = require('fastify-gql');
const fs = require('fs');

const schema = fs.readFileSync(__dirname + "/../shared/graphql-schema.gql").toString();

const HOST = process.env.HOST || "127.0.0.1";
const PORT = process.env.PORT || 4000;

const resolvers = {
    Query: {
        pid: () => process.pid,
        recipe: async (_obj, { id }) => {
            if (id != 42) throw new Error(`recipe ${id} not found`);
            return {
                id,
                name: 'Chicken Tikka',
                steps: 'Throw in pot mofo',
            }
        },
    },
    Recipe: {
        ingredients: async (obj) => {
            return (obj.id != 42) ? [] : [
                { id: 1, name: "Bucket of shit", quantity: '1 lb' },
                { id: 2, name: "Bucket of piss", quantity: '5 Ltr' }
            ]
        }
    }
};

const start = async () => {
    try {
        await server.register(graphql, { schema, resolvers})
        .listen({
            port: PORT,
            host: HOST
        });
        // console.log(`Producer graphql running on http://${HOST}:${PORT}/graphql`);   
    } catch (error) {
        server.log.error(error);
    }
};

start();