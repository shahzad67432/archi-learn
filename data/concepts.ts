export type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced'
export type Category = 'scale' | 'store' | 'net' | 'rel' | 'msg'

export interface Concept {
  slug: string
  number: number
  title: string
  tagline: string
  problem?: string
  difficulty: Difficulty
  category: Category
  xpReward: number
  tags: string[]
  illustration: string
  color: { bg: string; border: string; accent: string }
  published: boolean
  readTime: number
  rating: number
  detailSections: { title: string; items: string[] }[]
  callout: { text: string; strong?: string }
}

export const concepts: Concept[] = [
  {
    slug: 'websockets',
    number: 1,
    title: 'WebSockets',
    tagline: 'Real-time, full-duplex communication over a single connection',
    problem: "HTTP is request-response only — the server can never speak first. Building live features means your client must constantly ask 'anything new?' thousands of times per minute. 99% of those requests return nothing. WebSockets solve this permanently.",
    difficulty: 'Beginner',
    category: 'net',
    xpReward: 50,
    tags: ['Networking', 'Real-time', 'Protocol'],
    illustration: '/illustrations/ws1.svg',
    color: { bg: '#F0FDF4', border: '#86EFAC', accent: '#16A34A' },
    published: true,
    readTime: 25,
    rating: 4.8,
    detailSections: [
      {
        title: 'How it works',
        items: [
          'Client sends an HTTP upgrade request to switch protocols.',
          'Server responds with 101 Switching Protocols — connection upgraded.',
          'Persistent TCP connection stays open for bidirectional messages.',
          'Frames (text or binary) flow in both directions without HTTP overhead.',
          'Either side can close the connection with a close frame.',
        ],
      },
      {
        title: 'Why it matters',
        items: [
          'Eliminates polling — no more "anything new?" requests every second.',
          'Reduces latency from hundreds of milliseconds to single digits.',
          'Cuts bandwidth dramatically — headers are ~2 bytes instead of ~800.',
          'Enables real-time features that HTTP simply cannot support.',
        ],
      },
    ],
    callout: { strong: 'WebSocket vs SSE', text: 'Server-Sent Events are one-directional (server to client) over HTTP. WebSockets are full-duplex. Use SSE when you only need server pushes; use WebSockets when the client also talks back.' },
  },
  {
    slug: 'load-balancing',
    number: 2,
    title: 'Load Balancing',
    tagline: 'Distributing traffic so no single server drowns',
    difficulty: 'Beginner',
    category: 'scale',
    xpReward: 50,
    tags: ['Scalability', 'Availability', 'Traffic'],
    illustration: '/illustrations/load-balancing.svg',
    color: { bg: '#FFF7ED', border: '#FDBA74', accent: '#C05400' },
    published: false,
    readTime: 8,
    rating: 4.9,
    detailSections: [
      {
        title: 'Algorithms',
        items: [
          'Round Robin — requests rotate across servers in order.',
          'Least Connections — route to the server with fewest active connections.',
          'IP Hash — same client always hits the same server (sticky sessions).',
          'Weighted — more powerful servers receive proportionally more traffic.',
        ],
      },
    ],
    callout: { strong: 'L4 vs L7', text: 'L4 load balancers route on TCP/IP. L7 (like NGINX) can inspect HTTP headers, route by URL path, and do SSL termination.' },
  },
  {
    slug: 'caching',
    number: 3,
    title: 'Caching',
    tagline: 'Store frequently accessed data closer to where it is needed',
    difficulty: 'Beginner',
    category: 'store',
    xpReward: 50,
    tags: ['Performance', 'Memory', 'Speed'],
    illustration: '/illustrations/caching.svg',
    color: { bg: '#FEFCE8', border: '#FDE047', accent: '#A16207' },
    published: false,
    readTime: 14,
    rating: 4.9,
    detailSections: [
      {
        title: 'Patterns',
        items: [
          'Cache-aside (lazy loading) — app checks cache first; on miss, loads from DB and populates cache.',
          'Write-through — write to cache and DB simultaneously. Consistent but slower writes.',
          'Write-back — write to cache first, flush to DB asynchronously. Fast but risks data loss.',
        ],
      },
      {
        title: 'Eviction policies',
        items: [
          'LRU — evict least recently used entries.',
          'LFU — evict least frequently used entries.',
          'TTL — expire entries after a fixed time window.',
        ],
      },
    ],
    callout: { strong: 'Cache stampede', text: 'When a popular key expires and every request tries to regenerate it simultaneously. Solve with probabilistic early expiration or mutex locks around cache regeneration.' },
  },
  {
    slug: 'databases',
    number: 4,
    title: 'Databases',
    tagline: 'SQL vs NoSQL — choosing the right data store',
    difficulty: 'Intermediate',
    category: 'store',
    xpReward: 75,
    tags: ['Storage', 'SQL', 'NoSQL'],
    illustration: '/illustrations/databases.svg',
    color: { bg: '#F5F3FF', border: '#C4B5FD', accent: '#6D28D9' },
    published: false,
    readTime: 20,
    rating: 4.7,
    detailSections: [
      {
        title: 'SQL databases',
        items: [
          'Structured schema with tables, rows, and relations (JOINs).',
          'ACID transactions — Atomicity, Consistency, Isolation, Durability.',
          'Strong consistency guarantees. Good for financial data, inventory.',
        ],
      },
      {
        title: 'NoSQL databases',
        items: [
          'Document stores (MongoDB) — JSON-like documents, flexible schema.',
          'Key-value stores (Redis) — simple get/set, extremely fast.',
          'Wide-column stores (Cassandra) — scales horizontally, eventual consistency.',
          'Graph databases (Neo4j) — relationships as first-class citizens.',
        ],
      },
    ],
    callout: { strong: 'Polyglot persistence', text: 'Use the right database for each job — PostgreSQL for transactions, Redis for caching, Elasticsearch for search. A single monolithic database rarely fits all needs.' },
  },
  {
    slug: 'cap-theorem',
    number: 5,
    title: 'CAP Theorem',
    tagline: 'Consistency, Availability, Partition tolerance — pick two',
    difficulty: 'Intermediate',
    category: 'rel',
    xpReward: 75,
    tags: ['Distributed', 'Theory', 'Tradeoffs'],
    illustration: '/illustrations/cap-theorem.svg',
    color: { bg: '#ECFEFF', border: '#67E8F9', accent: '#0E7490' },
    published: false,
    readTime: 20,
    rating: 4.9,
    detailSections: [
      {
        title: 'The real tradeoff',
        items: [
          'CP systems (e.g. HBase, ZooKeeper) — return an error rather than stale data during a partition.',
          'AP systems (e.g. DynamoDB, Cassandra) — remain available and accept writes, reconciling later.',
          'CA systems — only possible when there is no network partition (single-node).',
        ],
      },
    ],
    callout: { strong: 'PACELC', text: 'Extends CAP: even when the system is running normally (no partition), you still trade latency for consistency. Most production systems choose consistency within a datacenter and eventual consistency across regions.' },
  },
  {
    slug: 'sharding',
    number: 6,
    title: 'Database Sharding',
    tagline: 'Splitting data across multiple databases for scale',
    difficulty: 'Intermediate',
    category: 'store',
    xpReward: 75,
    tags: ['Scalability', 'Database', 'Partitioning'],
    illustration: '/illustrations/sharding.svg',
    color: { bg: '#FFF1F2', border: '#FDA4AF', accent: '#BE123C' },
    published: false,
    readTime: 18,
    rating: 4.6,
    detailSections: [
      {
        title: 'Shard key strategies',
        items: [
          'Range-based — shard by value ranges (users A–M, N–Z). Simple, but creates hot shards.',
          'Hash-based — apply a hash to the shard key. Distributes evenly but makes range queries hard.',
          'Directory-based — a lookup table maps keys to shards. Flexible but the directory is a bottleneck.',
        ],
      },
    ],
    callout: { strong: 'Cross-shard queries', text: 'Are expensive. Design your shard key so the most common query patterns touch only one shard. When you need cross-shard, use scatter-gather or a secondary index.' },
  },
  {
    slug: 'message-queues',
    number: 7,
    title: 'Message Queues',
    tagline: 'Async communication between services that decouples systems',
    difficulty: 'Intermediate',
    category: 'msg',
    xpReward: 75,
    tags: ['Async', 'Decoupling', 'Reliability'],
    illustration: '/illustrations/message-queues.svg',
    color: { bg: '#F0FDFA', border: '#99F6E4', accent: '#0F766E' },
    published: false,
    readTime: 15,
    rating: 4.8,
    detailSections: [
      {
        title: 'Queue vs Pub/Sub',
        items: [
          'Queue — each message consumed by exactly one consumer. Good for task distribution (job queues).',
          'Pub/Sub — each message broadcast to all subscribers. Good for event streaming and fan-out.',
        ],
      },
    ],
    callout: { strong: 'Backpressure', text: 'When consumers are slow, messages accumulate. Design your queue depth and consumer scaling policy before launch, not after an incident.' },
  },
  {
    slug: 'rate-limiting',
    number: 8,
    title: 'Rate Limiting',
    tagline: 'Protecting your system from being overwhelmed by requests',
    difficulty: 'Intermediate',
    category: 'scale',
    xpReward: 75,
    tags: ['API', 'Security', 'Stability'],
    illustration: '/illustrations/rate-limiting.svg',
    color: { bg: '#FFF7ED', border: '#FED7AA', accent: '#EA580C' },
    published: false,
    readTime: 12,
    rating: 4.5,
    detailSections: [
      {
        title: 'Algorithms',
        items: [
          'Token Bucket — tokens refill at a fixed rate; each request consumes one. Allows bursts.',
          'Leaky Bucket — requests drip out at a constant rate. Smooths traffic perfectly.',
          'Sliding Window — counts requests in a rolling time window. More accurate than fixed window.',
          'Fixed Window — reset counter every N seconds. Simple but allows edge bursts.',
        ],
      },
    ],
    callout: { strong: 'Distributed rate limiting', text: 'Use Redis with atomic INCR + EXPIRE, or a centralized counter service. Be careful with clock skew when using sliding window across multiple nodes.' },
  },
  {
    slug: 'consistent-hashing',
    number: 9,
    title: 'Consistent Hashing',
    tagline: 'Distributing keys across nodes with minimal reshuffling',
    difficulty: 'Advanced',
    category: 'scale',
    xpReward: 100,
    tags: ['Distributed', 'Routing', 'Algorithms'],
    illustration: '/illustrations/consistent-hashing.svg',
    color: { bg: '#F0F9FF', border: '#7DD3FC', accent: '#0369A1' },
    published: false,
    readTime: 12,
    rating: 4.8,
    detailSections: [
      {
        title: 'How it works',
        items: [
          'Arrange all nodes on a circle (the hash ring).',
          'Each key is hashed to a point on the ring and assigned to the nearest node clockwise.',
          'When a node is added or removed, only its immediate neighbours\' keys need to move.',
        ],
      },
      {
        title: 'Why it matters',
        items: [
          'With naive modular hashing, adding 1 node to a 10-node cluster remaps ~90% of keys.',
          'Consistent hashing reduces that to K/N remaps (K keys, N nodes).',
          'Used by DynamoDB, Cassandra, and most distributed caches.',
        ],
      },
    ],
    callout: { strong: 'Virtual nodes', text: 'Each physical node gets multiple positions on the ring, improving load distribution without changing the algorithm.' },
  },
  {
    slug: 'replication',
    number: 10,
    title: 'Replication',
    tagline: 'Copying data across multiple nodes for reliability and speed',
    difficulty: 'Advanced',
    category: 'rel',
    xpReward: 100,
    tags: ['Reliability', 'Database', 'Consistency'],
    illustration: '/illustrations/replication.svg',
    color: { bg: '#FDF4FF', border: '#E879F9', accent: '#A21CAF' },
    published: false,
    readTime: 16,
    rating: 4.8,
    detailSections: [
      {
        title: 'Sync vs Async replication',
        items: [
          'Synchronous — write acknowledged only after all replicas confirm. No data loss, but higher write latency.',
          'Asynchronous — write acknowledged after primary write. Low latency, but replicas may lag behind.',
          'Quorum-based — write to majority of nodes (e.g. 3 of 5). Balances safety and speed.',
        ],
      },
    ],
    callout: { strong: 'Read replicas', text: 'Offload read traffic from the primary. Route SELECT queries to replicas and keep write traffic on the primary.' },
  },
  {
    slug: 'microservices',
    number: 11,
    title: 'Microservices',
    tagline: 'Breaking a monolith into small independently deployable services',
    difficulty: 'Advanced',
    category: 'scale',
    xpReward: 100,
    tags: ['Architecture', 'Scalability', 'Design'],
    illustration: '/illustrations/microservices.svg',
    color: { bg: '#F8FAFC', border: '#CBD5E1', accent: '#334155' },
    published: false,
    readTime: 22,
    rating: 4.6,
    detailSections: [
      {
        title: 'When to use microservices',
        items: [
          'Your team has grown beyond 10–15 engineers — coordination cost on a monolith becomes painful.',
          'Different parts of the system need different scaling characteristics.',
          'You need to deploy independently — one team should not block another.',
        ],
      },
      {
        title: 'The hidden costs',
        items: [
          'Network latency between services — every call is now a remote procedure call.',
          'Distributed debugging — tracing a single user request across 10+ services.',
          'Data consistency — no more ACID joins across service boundaries.',
          'Operational complexity — monitoring, deploying, and orchestrating many services.',
        ],
      },
    ],
    callout: { strong: 'Start with a monolith', text: 'Almost every microservices horror story starts with a team that decomposed too early. Extract services only when you have clear boundaries and pain.' },
  },
  {
    slug: 'horizontal-scaling',
    number: 12,
    title: 'Horizontal Scaling',
    tagline: 'Add more machines instead of upgrading one — scale out, not up',
    difficulty: 'Intermediate',
    category: 'scale',
    xpReward: 75,
    tags: ['Scale-out', 'Stateless', 'Cloud'],
    illustration: '/illustrations/load-balancing.svg',
    color: { bg: '#F0F9FF', border: '#7DD3FC', accent: '#0EA5E9' },
    published: false,
    readTime: 7,
    rating: 4.7,
    detailSections: [
      {
        title: 'Horizontal vs Vertical',
        items: [
          'Vertical (scale up) — bigger CPU, more RAM. Has a hard ceiling and a single point of failure.',
          'Horizontal (scale out) — add commodity machines. Theoretically unlimited, but requires stateless services.',
        ],
      },
    ],
    callout: { strong: 'Stateless design', text: 'Is the prerequisite. If session data lives on a single server, you cannot route users to any machine freely. Move state to a shared cache or database first.' },
  },
  {
    slug: 'cdn',
    number: 13,
    title: 'CDN',
    tagline: 'Content Delivery Networks cache static assets at edge servers close to users',
    difficulty: 'Beginner',
    category: 'net',
    xpReward: 50,
    tags: ['Edge', 'Static-assets', 'Latency'],
    illustration: '/illustrations/dns-cdn.svg',
    color: { bg: '#FFF7ED', border: '#FDBA74', accent: '#F59E0B' },
    published: false,
    readTime: 9,
    rating: 4.7,
    detailSections: [
      {
        title: 'Push vs Pull CDN',
        items: [
          'Pull — edge servers fetch from origin on first request, then cache. Zero setup, slightly slower first hit.',
          'Push — you proactively upload assets to edge nodes. Fast everywhere, but requires cache invalidation on update.',
        ],
      },
    ],
    callout: { strong: 'DDoS protection', text: 'CDNs also absorb DDoS traffic — a 100 Gbps attack gets spread across hundreds of edge nodes instead of hitting your origin.' },
  },
]
