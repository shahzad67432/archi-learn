import type { HowItWorksStep, HardPartsChapter, QuizQuestion } from '../sceneRegistry'

export const REDIS_HOOK_PARAGRAPH = `Every request touches the database. Reads, writes, joins — all of it hits disk. When traffic spikes, the database is the bottleneck. Redis sits in front — an in-memory cache that serves data in under a millisecond. It doesn't replace your database. It protects it.`

export const REDIS_HOOK_PROPERTIES = [
  {
    label: 'In-memory speed',
    sub: 'Sub-millisecond reads and writes — no disk I/O for cache hits',
  },
  {
    label: 'Rich data structures',
    sub: 'Strings, hashes, lists, sets, sorted sets — not just key-value',
  },
  {
    label: 'Built-in Pub/Sub',
    sub: 'Lightweight message broker so services can broadcast without a queue',
  },
]

export const REDIS_HOW_IT_WORKS_STEPS: HowItWorksStep[] = [
  {
    id: 0,
    title: 'The Event Loop',
    subtitle: 'Redis runs on a single thread. No locks, no race conditions.',
    body: 'Most databases use multiple threads and need locks to prevent data corruption when two threads write at once. Redis does not. A single event loop processes every command one at a time. No thread can interrupt another. No mutex needed. This is why Redis can serve millions of operations per second on a single core.',
    tag: 'SINGLE THREAD',
  },
  {
    id: 1,
    title: 'Cache-Aside Pattern',
    subtitle: 'Check Redis. Cache hit or miss. Populate or serve.',
    body: 'When your app needs data, it checks Redis first. If the key exists (hit), Redis returns it in under a millisecond. No database query. If the key does not exist (miss), your app queries the database, writes the result into Redis with a TTL, and the next request is a hit. This is the cache-aside pattern — the most common Redis caching strategy.',
    tag: 'CACHE-ASIDE',
  },
  {
    id: 2,
    title: 'Pub/Sub Messaging',
    subtitle: 'Broadcast messages to every subscriber through a channel.',
    body: 'Redis is not just a cache. Its Pub/Sub feature lets any service publish a message to a channel. Every other service subscribed to that channel receives the message instantly. No polling, no queue management, no broker setup. This is how real-time features like live comments, typing indicators, and broadcast notifications work across multiple server pods.',
    tag: 'PUB/SUB',
  },
]

export const REDIS_HARD_PARTS_CHAPTERS: HardPartsChapter[] = [
  {
    id: 0,
    title: 'Write-Delete Pattern',
    subtitle: 'Why you delete the cache, not update it',
    explanations: [
      {
        title: 'The Wrong Way — Update Cache Directly',
        body: 'Two users update the same record simultaneously. App A reads the DB, gets value X, writes X to cache. App B reads the DB a millisecond later, gets value Y, writes Y to cache. But App A finishes its write last — now the cache has X and the DB has Y. They are permanently out of sync. This is a race condition caused by writing to the cache directly.',
      },
      {
        title: 'The Right Way — Delete on Write',
        body: 'When data changes, write to the database and delete the cache key. Do not update the cache with the new value. The next read will miss the cache, fetch the fresh value from the database, and repopulate the cache cleanly. No race condition possible because only one process writes to the DB at a time.',
      },
      {
        title: 'Why Delete Beats Update',
        body: 'Deleting is idempotent — deleting a key that is already deleted does nothing. Updating creates a race window where two writers can interleave. The delete pattern guarantees consistency because the next read always gets the latest DB state. It is the simplest safe caching strategy.',
      },
    ],
    codeBlock: `// RIGHT — write to DB, delete cache
async function updateUser(id, data) {
  await db.query(
    'UPDATE users SET name = $1 WHERE id = $2',
    [data.name, id]
  )
  await redis.del(\`user:\${id}\`)
  // Next read will miss, fetch fresh, re-cache
}

// RIGHT — read path (cache-aside)
async function getUser(id) {
  const cached = await redis.get(\`user:\${id}\`)
  if (cached) return JSON.parse(cached)

  const user = await db.query(
    'SELECT * FROM users WHERE id = $1', [id]
  )
  await redis.setex(
    \`user:\${id}\`, 300, JSON.stringify(user)
  )
  return user
}`,
  },
  {
    id: 1,
    title: 'Cache Stampede',
    subtitle: 'When a popular key expires and everyone hits the database',
    explanations: [
      {
        title: 'The Thundering Herd',
        body: 'A popular product page is cached with a 60-second TTL. The key expires. Suddenly, 500 requests come in simultaneously — all miss the cache, all hit the database at once. The database spikes to 100% CPU, queries slow down, and cascading failures begin.',
      },
      {
        title: 'Why It Happens',
        body: 'The cache does not coordinate. Each request independently checks the cache, gets nothing, and goes to the database. They arrive in the same second because they were all triggered by the same user action or the same TTL boundary.',
      },
      {
        title: 'The Fix — Mutex + Early Expiration',
        body: 'Option 1: a mutex lock around the cache miss — only one request queries the database, others wait for it. Option 2: probabilistic early expiration — regenerate the cache before it expires based on access patterns. Option 3: set a longer TTL and refresh on read.',
      },
    ],
    codeBlock: `// Mutex-based stampede prevention
async function getOrCompute(key, ttl, fetch) {
  const cached = await redis.get(key)
  if (cached) return JSON.parse(cached)

  const lockAcquired = await redis.setnx(
    \`lock:\${key}\`, '1', 5
  )
  if (!lockAcquired) {
    await new Promise(r => setTimeout(r, 50))
    return getOrCompute(key, ttl, fetch)
  }

  try {
    const data = await fetch()
    await redis.setex(key, ttl, JSON.stringify(data))
    return data
  } finally {
    await redis.del(\`lock:\${key}\`)
  }
}`,
  },
  {
    id: 2,
    title: 'TTL Mental Model',
    subtitle: 'Every cached key has a shelf life',
    explanations: [
      {
        title: 'Born With a Timer',
        body: 'Every key you SET into Redis with EX (expiry) has a built-in countdown. The timer starts the moment the key is created. Redis tracks it in memory and checks expired keys periodically. When the timer hits zero, the key is evicted — it stops existing, like it was never there.',
      },
      {
        title: 'Why TTL Exists',
        body: 'Without TTL, stale data lives forever in the cache. The database could change and Redis would never know. TTL guarantees that even if you forget to invalidate, the cache will eventually clear itself. It is a safety net against stale data, not a replacement for proper invalidation.',
      },
      {
        title: 'Choosing the Right TTL',
        body: 'Short TTL (60s) for volatile data like trending topics — ensures freshness. Long TTL (3600s) for stable data like product descriptions — reduces database load. No TTL for reference data that never changes. Every second of TTL is a tradeoff between cache hit rate and data freshness.',
      },
    ],
    codeBlock: `# Common TTL patterns

# Session data — expire when user logs out
SETEX session:abc123 86400 "user_data"

# Trending feed — refresh every 5 minutes
SETEX trending:global 300 [...]

# Product catalog — stable, cache for 1 hour
SETEX product:42 3600 {...}

# Reference data — no expiry, manually invalidated
SET country_codes:us "United States"

# Check remaining TTL
TTL product:42
# → 2437  (seconds left)

# Remove TTL entirely (make it persist)
PERSIST product:42`,
  },
  {
    id: 3,
    title: 'High Availability',
    subtitle: 'Sentinel, Cluster, replication',
    explanations: [
      {
        title: 'Redis Sentinel',
        body: 'Sentinel provides automatic failover. A sentinel process monitors the Redis master. If the master goes down, Sentinel promotes a replica to master and updates the configuration. Clients discover the new master via Sentinel queries.',
      },
      {
        title: 'Redis Cluster',
        body: 'Cluster shards data across multiple nodes. Each node owns a subset of keys (hash slots). If a node fails, its replicas take over. Cluster also handles resharding — moving hash slots between nodes without downtime.',
      },
      {
        title: 'Replication Lag',
        body: 'Replicas are asynchronous. A write to the master propagates to replicas eventually. If the master fails before a replica receives the write, that write is lost. Trade durability for performance — same as every distributed system.',
      },
    ],
    codeBlock: `# Sentinel configuration
sentinel monitor mymaster 127.0.0.1 6379 2
sentinel down-after-milliseconds mymaster 5000
sentinel failover-timeout mymaster 60000
sentinel parallel-syncs mymaster 1

# Client Redis connection with Sentinel
from redis.sentinel import Sentinel

sentinel = Sentinel([
    ('sentinel1', 26379),
    ('sentinel2', 26379),
], socket_timeout=0.1)

# Get the current master
master = sentinel.master_for('mymaster')
replica = sentinel.slave_for('mymaster')

# Master handles writes, replicas handle reads
master.set('key', 'value')
result = replica.get('key')`,
  },
  {
    id: 4,
    title: 'Data Structures',
    subtitle: 'Five types that cover almost every use case',
    explanations: [
      {
        title: 'Strings — The Foundation',
        body: 'The simplest Redis type. A key maps to a single value — a string, a number, a JSON blob, or even binary data. Strings are the backbone of caching (cache-aside), session storage, and counters. The SET/GET commands you already know handle strings.',
      },
      {
        title: 'Hashes — Objects Made Easy',
        body: 'A hash maps field names to values inside a single key. Think of it as a Redis object — one key for "user:123" with fields "name", "email", "avatar". No need to serialize the whole object or fetch fields you do not need. Hashes are the most memory-efficient way to store structured data.',
      },
      {
        title: 'Lists, Sets, Sorted Sets — Collections',
        body: 'Lists are ordered sequences — great for message queues and timelines. Sets are unordered unique collections — perfect for tracking likes, readers, or tags. Sorted sets are sets with a score — every member has a number, and Redis keeps them sorted. This is how leaderboards, trending feeds, and rate limiters work.',
      },
    ],
    codeBlock: `# String — cache a user session
SETEX session:abc123 86400 '{"uid":42,"role":"admin"}'

# Hash — store a user profile
HSET user:42 name "Alice" email "alice@ex.com" avatar "a.png"
HGET user:42 name   # → "Alice"
HGETALL user:42     # → all fields

# List — message queue
LPUSH notifications:user42 "You have 1 new message"
RPOP notifications:user42

# Set — unique readers of an article
SADD readers:article:77 "user:42"
SADD readers:article:77 "user:17"
SCARD readers:article:77  # → 2

# Sorted Set — leaderboard
ZADD leaderboard:global 1850 "user:42"
ZADD leaderboard:global 2100 "user:17"
ZADD leaderboard:global 1630 "user:99"
ZREVRANGE leaderboard:global 0 2 WITHSCORES
# → 1) user:17 (2100)  2) user:42 (1850)  3) user:99 (1630)`,
  },
]

export const REDIS_QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1, type: 'concept',
    question: 'Where does Redis store data by default?',
    options: [
      { id: 'A', text: 'On disk in an SQLite file' },
      { id: 'B', text: 'In RAM (memory)' },
      { id: 'C', text: 'In the cloud object store' },
      { id: 'D', text: 'On the filesystem as JSON files' },
    ],
    correct: 'B',
  },
  {
    id: 2, type: 'concept',
    question: 'What does TTL do in Redis?',
    options: [
      { id: 'A', text: 'Compresses the value to save memory' },
      { id: 'B', text: 'Sets a time limit after which the key auto-deletes' },
      { id: 'C', text: 'Encrypts the value in transit' },
      { id: 'D', text: 'Creates a backup of the key on disk' },
    ],
    correct: 'B',
  },
  {
    id: 3, type: 'scenario',
    question: 'A user profile loads 300ms every time. The database is not slow. What is likely happening?',
    options: [
      { id: 'A', text: 'The CPU is throttled' },
      { id: 'B', text: 'Every request misses the cache and hits the database' },
      { id: 'C', text: 'The network interface is saturated' },
      { id: 'D', text: 'Redis has too many replicas' },
    ],
    correct: 'B',
  },
  {
    id: 4, type: 'concept',
    question: 'Which Redis data structure is ideal for a real-time leaderboard?',
    options: [
      { id: 'A', text: 'List' },
      { id: 'B', text: 'Sorted Set' },
      { id: 'C', text: 'Hash' },
      { id: 'D', text: 'Set' },
    ],
    correct: 'B',
  },
  {
    id: 5, type: 'scenario',
    question: 'A popular news article expires from the cache and 1000 readers hit the database simultaneously. The site slows to a crawl. What is this called?',
    options: [
      { id: 'A', text: 'Cache fragmentation' },
      { id: 'B', text: 'Cache stampede' },
      { id: 'C', text: 'Cache poisoning' },
      { id: 'D', text: 'Cache thrashing' },
    ],
    correct: 'B',
  },
  {
    id: 6, type: 'system-design',
    question: 'In cache-aside (lazy loading), who is responsible for populating the cache after a miss?',
    options: [
      { id: 'A', text: 'The database triggers a callback' },
      { id: 'B', text: 'Redis automatically detects the miss and fetches from DB' },
      { id: 'C', text: 'The application reads from DB and writes to Redis' },
      { id: 'D', text: 'A separate cache worker process' },
    ],
    correct: 'C',
  },
  {
    id: 7, type: 'concept',
    question: 'What does LRU eviction policy remove from Redis?',
    options: [
      { id: 'A', text: 'Keys with the shortest TTL' },
      { id: 'B', text: 'Keys that were accessed least recently' },
      { id: 'C', text: 'The largest keys by size' },
      { id: 'D', text: 'Keys that were created first' },
    ],
    correct: 'B',
  },
  {
    id: 8, type: 'scenario',
    question: 'You write data to Redis and acknowledge success to the user. Later, Redis crashes and the data is lost. What pattern caused this?',
    options: [
      { id: 'A', text: 'Write-through' },
      { id: 'B', text: 'Write-behind (write-back)' },
      { id: 'C', text: 'Cache-aside' },
      { id: 'D', text: 'Read-replica' },
    ],
    correct: 'B',
  },
  {
    id: 9, type: 'system-design',
    question: 'A Redis master node fails. What takes over writes?',
    options: [
      { id: 'A', text: 'A standby replica promoted by Sentinel' },
      { id: 'B', text: 'The load balancer redirects writes to the backup cluster' },
      { id: 'C', text: 'Redis Cluster redistributes the hash slots' },
      { id: 'D', text: 'Writes are queued until the master restarts' },
    ],
    correct: 'A',
  },
  {
    id: 10, type: 'concept',
    question: 'Which Redis Pub/Sub method publishes a message to all subscribers of a channel?',
    options: [
      { id: 'A', text: 'PUBLISH channel message' },
      { id: 'B', text: 'SEND channel message' },
      { id: 'C', text: 'BROADCAST channel message' },
      { id: 'D', text: 'EMIT channel message' },
    ],
    correct: 'A',
  },
]
