const Queue = require('bull')
const Redis = require('ioredis')

const clusterQueue = new Queue('Superhero', {
	prefix: '{clusterQueue}',
	createClient: () =>
		new Redis.Cluster([
			{ host: '127.0.0.1', port: 6379 },
			{ host: '127.0.0.1', port: 6380 },
			{ host: '127.0.0.1', port: 6381 }
		])
})

clusterQueue.add({ heroe: 'superman' })

clusterQueue.process((job, done) => {
	console.log(job.data)
	done()
})

clusterQueue.on('waiting', () => console.log('job is waiting'))
clusterQueue.on('completed', () => console.log('job is completed'))
clusterQueue.on('failed', () => console.log('job is failed'))
clusterQueue.on('error', () => console.log('job is error'))
