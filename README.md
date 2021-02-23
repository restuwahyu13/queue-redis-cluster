## Redis Cluster Using Bull And BullMQ

### Install Package

```sh
 npm i bull bullmq ioredis && npm audit fix
```

### Command

```sh
 npm run bull or npm run bullmq
```

### Custom Queue

follow this link for custom [Queue](https://github.com/restuwahyu13/express-todo-bullmq) for `bull` or `bullmq`

### Bull

```javascript
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
```

### BullMQ

```javascript
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
```