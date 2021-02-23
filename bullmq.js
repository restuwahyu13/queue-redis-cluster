const { Queue, Worker } = require('bullmq')
const Redis = require('ioredis')

const clusterQueue = new Queue('Superhero', {
	prefix: '{bullMQ}',
	connection: new Redis.Cluster([
		{ host: '127.0.0.1', port: 6379 },
		{ host: '127.0.0.1', port: 6380 },
		{ host: '127.0.0.1', port: 6381 }
	])
})

async function renderQueue() {
	await clusterQueue.add('name:speaker', 'batman')
}

renderQueue()

const WorkerQueue = new Worker('Superhero', async (job) => console.log(job.data), {
	connection: new Redis.Cluster([
		{ host: '127.0.0.1', port: 6379 },
		{ host: '127.0.0.1', port: 6380 },
		{ host: '127.0.0.1', port: 6381 }
	]),
	prefix: '{bullMQ}'
})

WorkerQueue.on('waiting', () => console.log('waiting completed'))
WorkerQueue.on('completed', () => console.log('jobs completed'))
WorkerQueue.on('failed', () => console.log('failed completed'))
