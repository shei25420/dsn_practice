const cluster = require('cluster');
console.log(`Master runnging at id = ${process.pid}`);

cluster.setupMaster({
    exec: __dirname + "/cluster-fibonnacci"
});

cluster.fork();
cluster.fork();

cluster.on('disconnect', (worker) => {
    console.log(`Disconnect`, worker.id);
}).on('exit', (worker, code, signal) => {
    console.log(`Exit`, worker.id, code, signal);
}).on('listening', (worker, { address, port }) => {
    console.log('listening', worker.id, `${address}:${port}`);
});