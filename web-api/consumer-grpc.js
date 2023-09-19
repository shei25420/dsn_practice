const util = require('util');
const server = require('fastify')({
    logger: false
});
const grpc = require('@grpc/grpc-js');
const loader = require('@grpc/proto-loader');
const pkg_def = loader.loadSync(__dirname + '/../shared/grpc-recipe.proto');

const recipe = grpc.loadPackageDefinition(pkg_def).recipe;
const HOST = process.env.HOST || '127.0.0.1';
const PORT = process.env.PORT || 3000;
const TARGET = "localhost:4000";

const client = new recipe.RecipeService(TARGET, grpc.credentials.createInsecure());
const getMetaData = util.promisify(client.getMetaData.bind(client));
const getRecipe = util.promisify(client.getRecipe.bind(client));

server.get('/', async (req, reply) => {
    const [meta, recipe] = await Promise.all([
        getMetaData({}),
        getRecipe({id: 42})
    ]);

    return {
        consumer_pid: process.pid,
        meta,
        recipe
    }
});

const start = async () => {
    try {
        await server.listen({
            host: HOST,
            port: PORT
        });
        
        // console.log(`GRPC Consumer running at http://${HOST}:${PORT}/`);
    } catch (error) {
        server.log.error(error);
        process.exit(1);
    }
};

start();