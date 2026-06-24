import type { HowItWorksStep, HardPartsChapter, QuizQuestion } from '../sceneRegistry'

export const WS_HOOK_PARAGRAPH = `HTTP spoils you. A request comes in, a response goes out, the connection closes. Clean. Automatic. You never think about it. WebSocket is a tunnel that stays open — indefinitely. Both sides talk whenever they want, without asking permission first.`

export const WS_HOOK_PROPERTIES = [
  {
    label: 'Full-duplex communication',
    sub: 'Both sides send simultaneously — like a phone call, not walkie-talkies',
  },
  {
    label: 'Single TCP connection',
    sub: 'One handshake, then the tunnel stays open for the entire session',
  },
  {
    label: '2–14 bytes overhead per message',
    sub: 'HTTP sends 200–800 bytes of headers every single time',
  },
]

export const WS_HOW_IT_WORKS_STEPS: HowItWorksStep[] = [
  {
    id: 0,
    title: 'TCP Handshake',
    subtitle: 'Before anything else, a raw connection is established.',
    body: 'Three packets travel between client and server — SYN, SYN-ACK, ACK. This is pure TCP. Nothing WebSocket-specific yet. Just two machines agreeing to talk.',
    tag: 'FOUNDATION',
  },
  {
    id: 1,
    title: 'TLS Encryption',
    subtitle: 'The channel is secured before any data flows.',
    body: 'Because you use wss:// the connection is encrypted. A TLS handshake adds 30-200ms — but only once. Every message after this is encrypted automatically.',
    tag: 'SECURITY',
  },
  {
    id: 2,
    title: 'HTTP Upgrade Request',
    subtitle: 'WebSocket disguises itself as HTTP to get past firewalls.',
    body: 'The client sends a normal HTTP GET with two special headers: Upgrade: websocket and Connection: Upgrade. Firewalls see HTTP on port 443. They let it through.',
    tag: 'THE TRICK',
  },
  {
    id: 3,
    title: '101 Switching Protocols',
    subtitle: 'The server agrees. This is the last HTTP message ever.',
    body: 'Server responds with HTTP 101. After this single response, the HTTP protocol is completely gone from this socket. Both sides switch to WebSocket framing.',
    tag: 'THE SWITCH',
  },
  {
    id: 4,
    title: 'HTTP Dies',
    subtitle: 'No more headers. No more request-response.',
    body: 'The HTTP layer disappears permanently. What remains is a raw TCP socket speaking WebSocket frames — 2 to 14 bytes of overhead instead of 800.',
    tag: 'THE DEATH',
  },
  {
    id: 5,
    title: 'Tunnel Opens',
    subtitle: 'The persistent connection is now live.',
    body: 'A full-duplex channel exists between client and server. It will stay open until someone explicitly closes it or a network failure occurs. The server can now speak first.',
    tag: 'ALIVE',
  },
  {
    id: 6,
    title: 'Free Flow',
    subtitle: 'Both sides talk whenever they want.',
    body: 'Messages travel in both directions simultaneously without permission. Comments, typing indicators, notifications — all pushed instantly. This is what you came for.',
    tag: 'REAL-TIME',
  },
]

export const WS_HARD_PARTS_CHAPTERS: HardPartsChapter[] = [
  {
    id: 0,
    title: 'Zombie Connections',
    subtitle: 'Heartbeat, ping/pong, memory leaks',
    explanations: [
      {
        title: 'The Zombie Problem',
        body: 'This is the #1 real-world WebSocket bug. A user\'s phone loses signal. Their TCP connection doesn\'t cleanly close — it just goes silent. Your server still thinks they\'re connected. That "zombie" connection holds memory, a file descriptor, and a Redis Pub/Sub subscription — all for a user who left 20 minutes ago.',
      },
      {
        title: 'Silent Resource Drain',
        body: 'Dead connections silently consume memory and file descriptors. Without heartbeats, you will eventually crash under load. Every production server needs heartbeat implementation to detect and clean up dead peers.',
      },
      {
        title: 'The Fix — Ping/Pong',
        body: 'The fix is embarrassingly simple once you know it exists. Send a ping every 30 seconds. If they don\'t pong back, they\'re gone. Clean it up. The WebSocket protocol has ping/pong frames built in for exactly this reason — most tutorials never mention them.',
      },
    ],
    codeBlock: `async def heartbeat(websocket: WebSocket):
    while True:
        await asyncio.sleep(30)
        try:
            await websocket.send_text('{"type":"ping"}')
        except:
            break

@app.websocket("/ws/discussion/{thread_id}")
async def discussion_ws(websocket, thread_id):
    await websocket.accept()
    hb_task = asyncio.create_task(heartbeat(websocket))
    try:
        while True:
            data = await websocket.receive_text()
            msg = json.loads(data)
            if msg["type"] == "pong":
                pass
            elif msg["type"] == "comment":
                await handle_comment(msg, thread_id)
    except WebSocketDisconnect:
        hb_task.cancel()
        await manager.disconnect(websocket, thread_id)`,
  },
  {
    id: 1,
    title: 'Auth at Handshake',
    subtitle: 'JWT validation at connection time',
    explanations: [
      {
        title: 'One Chance to Auth',
        body: 'HTTP requests carry auth in every header. WebSocket only has one chance — the handshake. Once the tunnel opens, there are no more headers, no more auth checks. This changes how you think about authentication entirely.',
      },
      {
        title: 'Auth at Connection Time',
        body: 'Auth happens once. At the handshake. Not on every message like REST. You validate the JWT when the connection opens and that connection becomes the proof of identity for its entire lifetime. Miss this and anyone can send messages as anyone.',
      },
      {
        title: 'The Senior Rule',
        body: 'Senior rule: authenticate at handshake time, not on every message. The user is verified once when they connect. After that, the connection itself is the proof of identity. This is why WebSocket auth mistakes are so dangerous — there\'s no second chance to check.',
      },
    ],
    codeBlock: `async def get_ws_user(websocket: WebSocket):
    token = websocket.headers.get(
        "Authorization", ""
    ).replace("Bearer ", "")

    if not token:
        await websocket.close(code=4001)
        return None

    user = decode_jwt(token)
    if not user:
        await websocket.close(code=4001)
        return None
    return user

@app.websocket("/ws/discussion/{thread_id}")
async def discussion_ws(websocket, thread_id):
    user = await get_ws_user(websocket)
    if not user:
        return
    await websocket.accept()
    # connection is now proof of identity`,
  },
  {
    id: 2,
    title: 'Multi-Pod & Redis',
    subtitle: 'Sticky sessions, Redis Pub/Sub',
    explanations: [
      {
        title: 'The Multi-Pod Trap',
        body: 'Pod 1 only knows its own connections. Has no idea Pod 2 exists. Broadcasts to its users. Pod 2\'s users get nothing. This is where most junior engineers make a critical mistake — they assume all pods are one shared system.',
      },
      {
        title: 'Redis Pub/Sub Fix',
        body: 'Fix is Redis Pub/Sub. Every pod subscribes to the same channel. One pod publishes, all pods receive, all users see it. 6 lines of code that make realtime actually work across servers. Discord figured this out early. So did Slack.',
      },
      {
        title: 'Stateless Architecture',
        body: 'Combined with Redis Pub/Sub, you get a fully stateless WS layer. Don\'t store state in pod memory at all. Every WS connection state goes into Redis. Any pod can serve any user because all state is external. Sticky sessions become optional.',
      },
    ],
    codeBlock: `# WRONG — state in pod memory
local_connections = {}  # dies when pod restarts

# RIGHT — state in Redis
async def register_connection(
    user_id: str, thread_id: str, pod_id: str
):
    await redis.hset(
        f"ws:connections:{thread_id}",
        user_id, pod_id
    )
    await redis.expire(
        f"ws:connections:{thread_id}", 3600
    )

# Broadcast via Pub/Sub
await redis.publish(
    f"discussion:{thread_id}",
    json.dumps(message)
)`,
  },
  {
    id: 3,
    title: 'Reconnection',
    subtitle: 'Exponential backoff, thundering herd',
    explanations: [
      {
        title: 'The Thundering Herd',
        body: 'When a server restarts or a network blip occurs, all connected clients disconnect simultaneously. If they all reconnect at once, the TLS handshake and WebSocket upgrade overhead can overwhelm the server before a single message is exchanged.',
      },
      {
        title: 'Jittered Reconnection',
        body: 'The fix is jittered reconnection on the client side combined with server-side connection rate limiting. Exponential backoff spreads retries: 1s, 2s, 4s, 8s, 16s — each attempt doubles the wait time.',
      },
      {
        title: 'Why Jitter Matters',
        body: 'Without jitter, 5,000 clients all wait exactly 2 seconds and hit the server simultaneously. With jitter (±30% randomness), they spread across a 2–6 second window. The server recovers gracefully instead of collapsing under the reconnect storm.',
      },
    ],
    codeBlock: `class WSManager {
    constructor() {
        this.ws = null;
        this.reconnectAttempts = 0;
        this.maxAttempts = 10;
    }

    scheduleReconnect(threadId) {
        if (this.reconnectAttempts >= this.maxAttempts)
            return;

        const base = Math.min(30000,
            1000 * 2 ** this.reconnectAttempts
        );
        const jitter = base * 0.3 * Math.random();
        const delay = base + jitter;

        this.reconnectAttempts++;
        setTimeout(
            () => this.connect(threadId), delay
        );
    }

    connect(threadId) { /* ... */ }
}`,
  },
]

export const WS_QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1, type: 'concept',
    question: 'What HTTP header pair does a client send to initiate a WebSocket upgrade?',
    options: [
      { id: 'A', text: 'Connection: Upgrade + Upgrade: websocket' },
      { id: 'B', text: 'Content-Type: application/json' },
      { id: 'C', text: 'Accept: text/html' },
      { id: 'D', text: 'Transfer-Encoding: chunked' },
    ],
    correct: 'A',
  },
  {
    id: 2, type: 'concept',
    question: 'What status code does the server respond with to confirm a successful WebSocket handshake?',
    options: [
      { id: 'A', text: '200 OK' },
      { id: 'B', text: '101 Switching Protocols' },
      { id: 'C', text: '426 Upgrade Required' },
      { id: 'D', text: '301 Moved Permanently' },
    ],
    correct: 'B',
  },
  {
    id: 3, type: 'system-design',
    question: 'In the system design from Act 1, which service should receive traffic directly from the CDN?',
    options: [
      { id: 'A', text: 'App Server' },
      { id: 'B', text: 'API Gateway / LB' },
      { id: 'C', text: 'AI Orchestrator' },
      { id: 'D', text: 'Redis Cache' },
    ],
    correct: 'B',
  },
  {
    id: 4, type: 'scenario',
    question: 'A real-time dashboard polls every 2 seconds using HTTP. Users report sluggishness and battery drain. What is the root cause?',
    options: [
      { id: 'A', text: 'The server hardware is underpowered' },
      { id: 'B', text: 'HTTP headers add ~800 bytes per request, keeping the radio active pointlessly' },
      { id: 'C', text: 'JavaScript parses JSON responses too slowly' },
      { id: 'D', text: 'The Wi-Fi connection has high latency' },
    ],
    correct: 'B',
  },
  {
    id: 5, type: 'concept',
    question: 'What key capability does WebSocket have that Server-Sent Events (SSE) lack?',
    options: [
      { id: 'A', text: 'Binary data support' },
      { id: 'B', text: 'Full-duplex communication — client sends messages anytime' },
      { id: 'C', text: 'Encrypted transport via TLS' },
      { id: 'D', text: 'Standardized by the W3C' },
    ],
    correct: 'B',
  },
  {
    id: 6, type: 'scenario',
    question: 'A WebSocket server restarts and 5000 clients reconnect within 100ms. CPU spikes to 100%, crashing the server again. What prevents this?',
    options: [
      { id: 'A', text: 'Add more RAM to the server' },
      { id: 'B', text: 'Exponential backoff with random jitter on reconnection' },
      { id: 'C', text: 'Switch from WebSocket to HTTP/2' },
      { id: 'D', text: 'Use a different load balancing algorithm' },
    ],
    correct: 'B',
  },
  {
    id: 7, type: 'system-design',
    question: 'In Act 1, what happens when Browser connects directly to API Gateway, bypassing the CDN?',
    options: [
      { id: 'A', text: 'The page loads faster with fewer network hops' },
      { id: 'B', text: 'DDoS traffic hits the raw gateway — infrastructure team paged at 2 AM' },
      { id: 'C', text: 'Images fail to load without CDN compression' },
      { id: 'D', text: 'The connection auto-upgrades to WebSocket' },
    ],
    correct: 'B',
  },
  {
    id: 8, type: 'scenario',
    question: 'You have 5 WebSocket server pods behind a round-robin load balancer. A user disconnects briefly, reconnects to a different pod, and loses session state. What is the correct fix?',
    options: [
      { id: 'A', text: 'Use Redis Pub/Sub to share session state across pods' },
      { id: 'B', text: 'Increase the WebSocket timeout to 24 hours' },
      { id: 'C', text: 'Switch from WebSocket to HTTP long polling' },
      { id: 'D', text: 'Route all traffic to a single pod' },
    ],
    correct: 'A',
  },
  {
    id: 9, type: 'concept',
    question: 'What mechanism detects WebSocket connections that are dead on the client side but still open on the server?',
    options: [
      { id: 'A', text: 'Garbage collection' },
      { id: 'B', text: 'Connection pooling' },
      { id: 'C', text: 'Heartbeat / ping-pong frames' },
      { id: 'D', text: 'Reference counting' },
    ],
    correct: 'C',
  },
  {
    id: 10, type: 'system-design',
    question: 'What is the correct end-to-end request flow from Browser to the LLM API in the Act 1 architecture?',
    options: [
      { id: 'A', text: 'Browser → API GW → LLM' },
      { id: 'B', text: 'Browser → CDN → API GW → WS Server → App Server → Orchestrator → LLM' },
      { id: 'C', text: 'Browser → CDN → WS Server → App Server → LLM' },
      { id: 'D', text: 'Browser → WS Server → App Server → Orchestrator → LLM' },
    ],
    correct: 'B',
  },
]
