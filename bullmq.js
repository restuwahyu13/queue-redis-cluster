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

WorkerQueue.on('waiting', () => console.log('job is waiting'))
WorkerQueue.on('completed', () => console.log('job is completed'))
WorkerQueue.on('failed', () => console.log('job is failed'))
WorkerQueue.on('error', () => console.log('job is error'))
