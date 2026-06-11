WEBSOCKET POSTS 
LInkeDIn Posts: 
 
Post 1 — LinkedIn 
Hook: Relatable pain 
 
400 zombie connections. 
that's what I found when I actually looked at what was happening in memory. 
users were getting disconnected from live discussions randomly. no error logs. no pattern. I kept staring at the message handling code thinking that's where the bug is. 
it wasn't. 
the bug was that I never taught my server how to know when someone actually left. 
here's the thing about WebSocket that HTTP spoils you on — with HTTP a request comes in, response goes out, connection closes. clean. automatic. you never think about it. 
WebSocket is a tunnel that stays open. indefinitely. and mobile networks are not indefinitely reliable. 
user loses signal on the metro. their app freezes. TCP connection doesn't cleanly close it just goes... quiet. your server still thinks they're there. holding memory. holding a file descriptor. holding a Redis subscription. 
multiply that by a few hundred users and your pod starts sweating. 
the fix is embarrassingly simple once you know it exists. 
ping every connection every 30 seconds. if they don't pong back, they're gone. clean it up. 
the WebSocket protocol has ping/pong frames built in for exactly this reason. most tutorials never mention them. every production system eventually learns about them the hard way. 
I learned about them at 2am reading memory profiler output. 
you're learning about them right now. 
what's the weirdest bug you've ever found at 2am? drop it below, I genuinely want to know
#SystemDesign #WebSockets #BackendDevelopment #SoftwareEngineering 
 
Image prompt: 
Handwritten-style dark background diagram. Title: "WebSocket Connection Lifecycle". Five stages drawn as a horizontal flow with arrows: CONNECTING → OPEN → ACTIVE → IDLE (marked in red: "danger zone") → ZOMBIE (skull icon, marked: "memory leak"). Below: ping/pong flow drawn as two vertical lines (client and server) with arrows: server sends "ping →", client replies "← pong", then a red X line labeled "no pong = terminate + cleanup". Clean whiteboard marker aesthetic, minimal color (white lines, red highlights only). 
 
 
Post 2 — LinkedIn 
Hook: Counterintuitive / aha moment 
 
WebSocket starts as HTTP. 
then HTTP dies. 
that one sentence took me way too long to actually understand and once I did a bunch of production decisions suddenly made sense. 
when your client opens a WebSocket connection it sends a completely normal HTTP GET request. inside that request is a header saying "I want to upgrade this." server says 101 — switching protocols. and after that single exchange the HTTP protocol is just gone from that socket. what's left is a raw TCP tunnel where both sides can talk whenever they want without asking permission first. 
this has three consequences that nobody explains upfront. 
auth happens once. at the handshake. not on every message like REST. you validate the JWT when the connection opens and that connection becomes the proof of identity for its entire lifetime. miss this and anyone can send messages as anyone. 
load balancers need special config. standard round-robin sees a new request and sends it to whichever pod has the least load. but WebSocket state lives in pod memory. if your reconnect lands on a different pod your connection breaks. you need sticky sessions. AWS ALB has this as a checkbox. that checkbox matters. 
multi-pod realtime needs Redis Pub/Sub. User A on Pod 1 and User B on Pod 2 are in the same discussion. Pod 1 cannot reach Pod 2's connections directly. Redis sits in the middle. Pod 1 publishes to a channel. every pod subscribed to that channel receives it. every user gets the message regardless of which pod they landed on. 
Discord figured this out early. so did Slack. the WebSocket is just the last mile. the architecture around it is the actual engineering. 
one question, are you building anything with WebSocket right now or still on the polling approach? curious where most people actually are with this
#SystemDesign #BackendEngineering #WebSockets #SoftwareArchitecture 
 
Image prompt: 
Clean architecture diagram, dark navy background, white and blue lines. Three-column layout. Left column labeled "CLIENT" with mobile phone icon. Middle column labeled "PODS" showing Pod 1 and Pod 2 as two rectangles. Right column labeled "REDIS" with cylinder icon. Arrows: Client A connects to Pod 1 (solid line), Client B connects to Pod 2 (solid line). Pod 1 has arrow going right labeled "PUBLISH → discussion:42". Redis has arrows going down to Pod 1 and Pod 2 labeled "BROADCAST". Both pods have arrows going back to their clients. Title at top: "How realtime comments actually work across multiple servers." Minimal, blueprint aesthetic. 
 
 
TWITTER POSTS 
 
  
Post 3 — Twitter
Hook: Interview question

WebSocket question that actually separates mid from senior:
"4 pods behind a load balancer. User A on Pod 1. User B on Pod 2. same chat room. User A sends a message. does User B see it?"
most people say yes.
answer is no. not without extra architecture.
Pod 1 only knows its own connections. has no idea Pod 2 exists. broadcasts to its users. Pod 2's users get nothing.
fix is Redis Pub/Sub.
every pod subscribes to the same channel. any pod publishes, all pods receive, all users see it. 6 lines of code that make realtime actually work across servers.
also — auth on WebSocket happens once. at the handshake. not on every message.
after HTTP 101 the connection is the identity. validate your JWT when the tunnel opens or you have a security hole the size of a truck.
two concepts. both missing from most WebSocket tutorials. both asked in every senior interview.
got it right without scrolling? reply with your answer before reading. let's see

Post 4 — Twitter
Hook: Humorous

me: builds WebSocket feature
me: tests it locally, works perfectly
me: scales to multiple pods
half the users: not seeing any messages
me: 🙂
me: 🙂
me: 🙂

two days I spent on this.
the bug wasn't in message handling. wasn't in the WebSocket logic. was in something I didn't even know I needed to think about.
WebSocket connections live on a specific pod. Pod 1 knows its users. Pod 2 knows its users. neither knows the other exists.
User A comments from Pod 1. Pod 1 broadcasts. Pod 1's users see it. Pod 2 is just sitting there in silence. User B never gets the message.
fix is Redis Pub/Sub. every pod subscribes to a shared channel. one pod publishes, all pods receive, done.
await redis.publish("discussion:42", comment)
that one line connects your entire server fleet into a single broadcast system.
senior engineers reach for this the moment they go multi-pod. I reached for it after two days of debugging and mild existential crisis.
took me 2 days. took you 40 seconds.
what's your "2 days debugging something embarrassing" story. reply below I'll read every single one

Post 5 — Twitter
Hook: Storytelling

before 2011 every "realtime" feature on the internet was lying to you.
stock tickers refreshing every 2 seconds. chat apps asking the server "anything new?" hundreds of times a minute. notifications that arrived 30 seconds after the event. the web wasn't live. it was just polling fast enough that nobody noticed the delay.
then RFC 6455 shipped. WebSocket.
one HTTP request. server responds 101. HTTP dies on that socket.
what's left is a raw TCP tunnel. both sides talk whenever. no asking permission. no 200-800 bytes of headers on every message. no pretending.
Discord built their messaging on it. Figma's multiplayer cursors run on it. every trading terminal you've ever used is powered by it.
most developers still don't know what actually happens at the network level when they type new WebSocket()
TCP handshake. TLS handshake. HTTP upgrade. 101 switching protocols. HTTP gone. tunnel open.
under 350ms. stays open for hours.
the internet stopped polling in 2011.
some codebases just haven't gotten the memo.
what "realtime" feature in your codebase is actually just polling with confidence?

Post 6 — Twitter
okay so I actually embarrassed myself in a system design discussion last month.
someone asked how WebSocket handles multiple servers and I said "oh the load balancer takes care of it"
it does not.
the load balancer has no idea your WebSocket connections exist as actual living state on a specific machine. it just routes. blindly.
so User A is on Server 1. User B is on Server 2. same discussion thread. User A types something.
Server 1 sends it to everyone Server 1 knows about.
Server 2 just. doesn't know.
User B sees nothing.
the fix is Redis Pub/Sub and honestly once you see it you can't unsee it. every server subscribes to the same channel. one publishes, all receive. done.
but the part that got me was realizing how many "realtime" features I'd built before that were quietly broken at scale and I just never had enough users to notice
that's the scary part tbh
not the bug. the not knowing.


Let me search for production WebSocket patterns first.Everything I need. Now let me build the full deep-dive.

---

# WebSockets — From First Principles to Senior Engineer Level

---

## Chapter 1: Why WebSockets Exist — The Problem First

To understand WebSockets you must first understand what HTTP does wrong for real-time use cases.

### HTTP's fundamental model

```
Client            Server
  |                  |
  |── GET /feed ───→ |   client asks
  |← 200 + data ────|   server answers
  |    (connection closes)
  |                  |
  |── GET /feed ───→ |   client asks AGAIN
  |← 200 + data ────|   server answers AGAIN
  |    (connection closes)
```

Every request opens a new TCP connection, does work, closes. HTTP is **stateless and unidirectional by design.** The server can never speak first. It can only respond.

Now imagine building live comments for your books app with HTTP:

```
Option 1: Polling
Client asks "any new comments?" every 2 seconds
→ 99% of those requests return "no"
→ 10,000 users × 1 request/2s = 5,000 requests/second of pure waste

Option 2: Long Polling
Client asks → server holds the connection open until something happens
→ Better, but still a new TCP handshake every time a message arrives
→ Awkward, half-duplex, kills load balancers
```

Neither works well. You need the server to **push** data to the client the instant something happens, without the client asking. That's what WebSocket solves.

---

## Chapter 2: What WebSocket Actually Is — First Principles

The WebSocket protocol provides full-duplex, bidirectional communication over a single TCP connection. It starts with an HTTP upgrade handshake, then switches to a lightweight framed messaging format.

Three words matter here:

**Full-duplex** — both sides can send at the same time. Not taking turns like HTTP. Like a phone call, not walkie-talkies.

**Single TCP connection** — one connection stays open the entire time. No repeated handshakes.

**Persistent** — the connection lives until someone explicitly closes it or a network failure occurs.

```
Client            Server
  |                  |
  |── Upgrade ──────→|   "let's switch to WebSocket"
  |← 101 ───────────|   "agreed"
  |                  |
  |═══ open tunnel ══|   connection stays alive
  |                  |
  |── comment ──────→|   client sends anytime
  |← new post ───────|   server sends anytime
  |← another user ───|   server pushes without being asked
  |── typing... ────→|   bidirectional, simultaneous
  |                  |
  |── close ────────→|   either side can end it
```

---

## Chapter 3: The Handshake — What Actually Happens at the Network Level

WebSocket could have been a raw TCP protocol but wasn't, and the reason is pragmatic: firewalls and proxies. Corporate firewalls block outbound connections on non-standard ports. HTTP proxies only forward HTTP traffic. By starting as an HTTP request on port 80 or 443, WebSocket piggybacks on existing HTTP infrastructure. The connection looks like normal web traffic until the upgrade completes.

Here's the exact sequence when your React Native app opens a discussion thread:

### Step 1 — TCP Handshake (invisible to you)
```
Client → Server: SYN
Server → Client: SYN-ACK
Client → Server: ACK
(~10-100ms depending on distance)
```

### Step 2 — TLS Handshake (because you use wss://)
```
TLS negotiation — 1-2 extra round trips
(adds ~30-200ms, but only happens ONCE per connection)
```

### Step 3 — HTTP Upgrade Request
The WebSocket handshake begins as a standard HTTP/1.1 request with two special headers: `Upgrade: websocket` and `Connection: Upgrade`. The client also sends a `Sec-WebSocket-Key` header containing a base64-encoded random value.

```http
GET /ws/discussion/thread_42 HTTP/1.1
Host: api.booksapp.com
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Key: x3JJHMbDL1EzLkh9GBhXDw==
Sec-WebSocket-Version: 13
Authorization: Bearer <jwt_token>
```

### Step 4 — Server Response
The server responds with HTTP 101 Switching Protocols and a `Sec-WebSocket-Accept` hash derived from the client key. After this exchange, both sides communicate using WebSocket frames instead of HTTP.

```http
HTTP/1.1 101 Switching Protocols
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Accept: HSmrc0sMlYUkAGmm5OPpG2HaGWk=
```

After this 101 response, **HTTP is dead on this connection.** The TCP socket is now speaking the WebSocket protocol. No more HTTP headers ever on this connection.

The total time from calling `new WebSocket()` to the `onopen` event firing is typically 50-350ms. The handshake itself is fast — latency is dominated by TCP and TLS setup.

---

## Chapter 4: WebSocket Frames — How Data Actually Travels

After the handshake, data travels in **frames**, not HTTP requests. A frame is a lightweight binary packet:

```
┌─────────┬────────┬──────────────┬─────────────────────────┐
│ FIN bit │ Opcode │ Payload Len  │ Payload Data            │
│ (1 bit) │(4 bits)│  (7 bits+)   │ (your actual message)   │
└─────────┴────────┴──────────────┴─────────────────────────┘
```

**Opcode** tells what type of frame:
```
0x1 = text frame      (JSON string, most common)
0x2 = binary frame    (images, files)
0x8 = close frame     (graceful shutdown)
0x9 = ping frame      (heartbeat check)
0xA = pong frame      (heartbeat response)
```

Compared to HTTP, a WebSocket text frame has **2-14 bytes of overhead** per message. An HTTP request has **200-800 bytes of headers** per message. At 1000 messages per second this is a massive difference.

---

## Chapter 5: Connection Lifecycle — What Seniors Track

Production WebSocket systems spend more engineering effort on connection management than on message handling.

The full lifecycle every senior engineer designs around:

```
1. CONNECTING    → TCP + TLS + HTTP upgrade happening
2. OPEN          → onopen fires, ready to send/receive
3. ACTIVE        → normal message flow
4. IDLE          → connected but no messages (dangerous — see heartbeats)
5. CLOSING       → one side sent close frame
6. CLOSED        → TCP connection terminated
```

### The Zombie Connection Problem

This is the #1 real-world WebSocket bug. A user's phone loses signal. Their TCP connection doesn't cleanly close — it just goes silent. Your server still thinks they're connected. That "zombie" connection holds memory, a file descriptor, and a Redis Pub/Sub subscription — all for a user who left 20 minutes ago.

Dead connections silently consume memory and file descriptors. Without heartbeats, you will eventually crash under load. Every production server needs heartbeat implementation.

### Heartbeat — Ping/Pong Pattern

```python
# Server-side heartbeat in FastAPI
import asyncio

async def heartbeat(websocket: WebSocket):
    """Runs as background task for every connection"""
    while True:
        await asyncio.sleep(30)          # check every 30 seconds
        try:
            await websocket.send_text('{"type":"ping"}')
            # if client doesn't respond → connection is dead
        except:
            break                        # connection gone, clean up

@app.websocket("/ws/discussion/{thread_id}")
async def discussion_ws(websocket: WebSocket, thread_id: str):
    await websocket.accept()

    # start heartbeat as concurrent task
    hb_task = asyncio.create_task(heartbeat(websocket))

    try:
        while True:
            data = await websocket.receive_text()
            msg = json.loads(data)

            if msg["type"] == "pong":
                pass                     # client alive, continue
            elif msg["type"] == "comment":
                await handle_comment(msg, thread_id)

    except WebSocketDisconnect:
        hb_task.cancel()                 # CRITICAL: cancel heartbeat
        await manager.disconnect(websocket, thread_id)
```

Client-side (React Native):
```javascript
ws.onmessage = (event) => {
    const msg = JSON.parse(event.data);
    if (msg.type === 'ping') {
        ws.send(JSON.stringify({ type: 'pong' }));
    }
};
```

---

## Chapter 6: Authentication — The Right Way

HTTP requests carry auth in every header. WebSocket only has one chance — **the handshake.**

```python
# WRONG — auth in query string (visible in logs, browser history)
wss://api.booksapp.com/ws?token=eyJhbGciOiJ...

# RIGHT — auth in header during upgrade
GET /ws/discussion/42 HTTP/1.1
Authorization: Bearer eyJhbGciOiJ...
```

In FastAPI:

```python
from fastapi import WebSocket, HTTPException
from app.auth import decode_jwt

async def get_ws_user(websocket: WebSocket):
    """Extract and validate JWT at connection time"""
    token = websocket.headers.get("Authorization", "").replace("Bearer ", "")

    if not token:
        await websocket.close(code=4001)   # custom close code: unauthorized
        return None

    user = decode_jwt(token)
    if not user:
        await websocket.close(code=4001)
        return None

    return user

@app.websocket("/ws/discussion/{thread_id}")
async def discussion_ws(websocket: WebSocket, thread_id: str):
    user = await get_ws_user(websocket)
    if not user:
        return                             # connection rejected

    await websocket.accept()
    # now you know who this is for the entire connection lifetime
```

**Senior rule: authenticate at handshake time, not on every message.** The user is verified once when they connect. After that, the connection itself is the proof of identity.

---

## Chapter 7: The Multi-Pod Problem and Sticky Sessions

This is where most junior engineers make a critical mistake.

### The Problem

```
User A ──→ Pod 1 (WS connection stored in Pod 1's memory)
User B ──→ Pod 2 (WS connection stored in Pod 2's memory)

User A sends comment
Pod 1 publishes to Redis channel "discussion:42"
Pod 2 is subscribed → broadcasts to User B ✅

BUT:

Load balancer reboots
User A reconnects → gets routed to Pod 2 by round-robin
User A's previous state on Pod 1 is gone
```

### Fix 1 — Sticky Sessions (ALB)

Without sticky sessions, reconnects land on different instances and break in-memory state. Enabling session affinity keeps a client pinned to one instance, which drastically reduces cross-node coordination overhead.

In AWS ALB you enable this with one setting: **stickiness duration = connection lifetime.** The load balancer sets a cookie. Every subsequent request from that client goes to the same pod.

### Fix 2 — Design Pods as Stateless

Better than sticky sessions: **don't store state in pod memory at all.** Every WS connection state goes into Redis. Any pod can serve any user because all state is external.

```python
# WRONG — state in pod memory
local_connections = {}  # dies when pod restarts

# RIGHT — state in Redis
async def register_connection(user_id: str, thread_id: str, pod_id: str):
    await redis.hset(
        f"ws:connections:{thread_id}",
        user_id,
        pod_id                           # which pod this user is on
    )
    await redis.expire(f"ws:connections:{thread_id}", 3600)
```

Combined with Redis Pub/Sub from the last lesson, you get a fully stateless WS layer.

---

## Chapter 8: Reconnection — The Thundering Herd Problem

Your server crashes. 5,000 clients simultaneously try to reconnect. The reconnect storm kills your recovering server before it can serve a single request.

When a server restarts or a network blip occurs, all connected clients disconnect simultaneously. If they all reconnect at once, the TLS handshake and WebSocket upgrade overhead can overwhelm the server before a single message is exchanged. The fix is jittered reconnection on the client side combined with server-side connection rate limiting.

### Exponential Backoff with Jitter — the standard solution

```javascript
// React Native client
class WSManager {
    constructor() {
        this.ws = null;
        this.reconnectAttempts = 0;
        this.maxAttempts = 10;
    }

    connect(threadId) {
        this.ws = new WebSocket(`wss://api.booksapp.com/ws/discussion/${threadId}`);

        this.ws.onopen = () => {
            this.reconnectAttempts = 0;    // reset on success
            console.log('Connected');
        };

        this.ws.onclose = () => {
            this.scheduleReconnect(threadId);
        };

        this.ws.onerror = () => {
            this.ws.close();
        };
    }

    scheduleReconnect(threadId) {
        if (this.reconnectAttempts >= this.maxAttempts) return;

        // exponential backoff: 1s, 2s, 4s, 8s, 16s...
        const base = Math.min(30000, 1000 * 2 ** this.reconnectAttempts);

        // jitter: randomize ±30% so not all clients retry at same moment
        const jitter = base * 0.3 * Math.random();
        const delay = base + jitter;

        this.reconnectAttempts++;
        setTimeout(() => this.connect(threadId), delay);
    }
}
```

Without jitter, 5000 clients all wait exactly 2 seconds and hit the server simultaneously. With jitter, they spread across a 2-2.6 second window — the server recovers gracefully.

---

## Chapter 9: Memory Leaks — The Silent Killer

Memory leaks occur when close and error handlers fail to remove stored references.

This is the most common production WebSocket bug:

```python
# WRONG — memory leak
connections = {}

@app.websocket("/ws/discussion/{thread_id}")
async def ws_endpoint(websocket: WebSocket, thread_id: str):
    connections[thread_id] = websocket          # stored
    await websocket.accept()
    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        pass                                     # ← FORGOT TO DELETE!
        # connections[thread_id] still holds dead websocket object
        # memory never freed, grows forever


# RIGHT — always clean up
@app.websocket("/ws/discussion/{thread_id}")
async def ws_endpoint(websocket: WebSocket, thread_id: str, user_id: str):
    await manager.connect(websocket, thread_id, user_id)
    try:
        while True:
            data = await websocket.receive_text()
            await handle_message(data, thread_id, user_id)
    except WebSocketDisconnect:
        await manager.disconnect(websocket, thread_id, user_id)  # ALWAYS
    except Exception as e:
        await manager.disconnect(websocket, thread_id, user_id)  # ALWAYS
        raise e
```

**Senior rule: every code path that exits the WebSocket handler must call disconnect.** Use try/finally to guarantee it.

```python
    try:
        while True:
            data = await websocket.receive_text()
            await handle_message(data, thread_id, user_id)
    finally:
        await manager.disconnect(websocket, thread_id, user_id)
        # finally runs even on unexpected exceptions
```

---

## Chapter 10: WebSocket vs SSE — Choosing the Right Tool

The mistake people make is thinking bidirectional communication is a feature. It's not — it's a tradeoff. You get bidirectional capability in exchange for significantly more complexity. If you're not using that capability, you paid for nothing.

| | WebSocket | SSE |
|---|---|---|
| Direction | Bidirectional | Server → Client only |
| Protocol | Custom framing over TCP | Plain HTTP |
| Reconnect | Manual (you write it) | Automatic (browser handles it) |
| Load balancer config | Needs sticky sessions | Standard HTTP, no config |
| Complexity | High | Low |
| Use case | Chat, live collaboration | Feed updates, notifications |

For your books app specifically:

```
USE WebSocket for:
    └── Discussion comments (user types → server broadcasts → all see it)
    └── Bot conversations (back and forth dialogue)
    └── Typing indicators ("Ali is typing...")

USE SSE for:
    └── News feed new post notification ("3 new posts")
    └── Like/comment count updates on feed cards
    └── Notification bell counter
```

SSE code is dramatically simpler:

```python
# SSE — server pushes, client just listens
from fastapi.responses import StreamingResponse
import asyncio

@app.get("/feed/updates")
async def feed_updates(user_id: str = Depends(get_current_user)):
    async def event_stream():
        pubsub = redis.pubsub()
        await pubsub.subscribe(f"feed:{user_id}")
        async for message in pubsub.listen():
            if message["type"] == "message":
                yield f"data: {message['data']}\n\n"

    return StreamingResponse(
        event_stream(),
        media_type="text/event-stream"
    )
```

No sticky sessions. No reconnect logic. No heartbeat implementation. Browser reconnects automatically.

---

## Chapter 11: Production Scale Numbers — What to Expect

A single server instance can handle 100,000 concurrent WebSocket connections using under 64MB of memory with optimized configuration.

For your books app reality:

```
10k registered users
→ ~500 daily active users (5% DAU is realistic early stage)
→ ~50 concurrent WS connections at peak
→ One FastAPI pod handles this completely idle

100k registered users
→ ~5000 daily active users
→ ~500 concurrent WS connections at peak
→ 2-3 pods, Redis Pub/Sub handling cross-pod messages

1M registered users
→ ~50k daily active
→ ~5000 concurrent WS connections
→ Dedicated WS gateway service, separate from API
```

What actually limits WebSocket performance in production is connection churn, not connection count. Each new connection requires a TCP handshake, TLS negotiation, and HTTP upgrade. At scale, thousands of connections per minute opening and closing consumes far more CPU than holding hundreds of thousands of idle connections. Monitor your connections-per-second rate, not your total connection count.

---

## Chapter 12: Full Production Implementation for Your Books App

Putting everything together:

```python
# ws/manager.py
import asyncio, json, time
from fastapi import WebSocket, WebSocketDisconnect
from redis.asyncio import Redis

class DiscussionManager:
    def __init__(self, redis: Redis):
        self.redis = redis
        # local to this pod only
        # { thread_id: { user_id: websocket } }
        self.connections: dict[str, dict[str, WebSocket]] = {}

    async def connect(self, ws: WebSocket, thread_id: str, user_id: str):
        await ws.accept()

        if thread_id not in self.connections:
            self.connections[thread_id] = {}
            # first user in this thread on this pod
            # start listening to Redis channel for this thread
            asyncio.create_task(self._redis_listener(thread_id))

        self.connections[thread_id][user_id] = ws

        # tell others this user joined
        await self.publish(thread_id, {
            "type": "presence",
            "user_id": user_id,
            "status": "joined"
        })

    async def disconnect(self, ws: WebSocket, thread_id: str, user_id: str):
        if thread_id in self.connections:
            self.connections[thread_id].pop(user_id, None)

            if not self.connections[thread_id]:
                del self.connections[thread_id]
                # no more users in this thread on this pod
                # Redis listener task will also clean up

        await self.publish(thread_id, {
            "type": "presence",
            "user_id": user_id,
            "status": "left"
        })

    async def publish(self, thread_id: str, message: dict):
        """Any pod calls this → all pods receive → all users see it"""
        await self.redis.publish(
            f"discussion:{thread_id}",
            json.dumps(message)
        )

    async def _redis_listener(self, thread_id: str):
        """Background task — runs per active thread per pod"""
        pubsub = self.redis.pubsub()
        await pubsub.subscribe(f"discussion:{thread_id}")

        try:
            async for message in pubsub.listen():
                if message["type"] != "message":
                    continue

                # send to all local websockets for this thread
                dead = []
                for user_id, ws in self.connections.get(thread_id, {}).items():
                    try:
                        await ws.send_text(message["data"])
                    except:
                        dead.append(user_id)   # clean up dead connections

                for user_id in dead:
                    self.connections[thread_id].pop(user_id, None)

                # if no more connections, stop listening
                if not self.connections.get(thread_id):
                    break
        finally:
            await pubsub.unsubscribe(f"discussion:{thread_id}")


# ws/routes.py
manager = DiscussionManager(redis)

@app.websocket("/ws/discussion/{thread_id}")
async def discussion_websocket(
    websocket: WebSocket,
    thread_id: str,
    user = Depends(get_ws_user)          # auth at handshake
):
    if not user:
        return

    await manager.connect(websocket, thread_id, user.id)

    try:
        while True:
            raw = await websocket.receive_text()
            msg = json.loads(raw)

            if msg["type"] == "comment":
                # 1. persist to DB first — never lose data
                comment = await db.save_comment({
                    "thread_id": thread_id,
                    "user_id": user.id,
                    "text": msg["text"],
                    "timestamp": time.time()
                })

                # 2. broadcast via Redis — real-time delivery
                await manager.publish(thread_id, {
                    "type": "comment",
                    "comment_id": comment.id,
                    "user_id": user.id,
                    "text": msg["text"],
                    "timestamp": comment.timestamp
                })

            elif msg["type"] == "typing":
                # typing indicators — don't persist, just broadcast
                await manager.publish(thread_id, {
                    "type": "typing",
                    "user_id": user.id
                })

    except WebSocketDisconnect:
        pass
    finally:
        await manager.disconnect(websocket, thread_id, user.id)
```

---

## TL;DR — What a Senior Engineer Knows About WebSockets

- HTTP can't push — WebSocket solves this with a persistent bidirectional TCP tunnel
- The handshake starts as HTTP (port 80/443) for firewall compatibility, upgrades to WS after 101
- Data travels in lightweight frames — 2-14 bytes overhead vs 200-800 bytes per HTTP request
- **Authenticate at handshake time** — JWT in header, not query string
- **Always use heartbeat/ping-pong** — zombie connections will crash you under load
- **Always clean up in finally block** — memory leaks from missed disconnects are the #1 production bug
- **Sticky sessions on ALB** — so reconnects go to same pod, or better, design pods as stateless with Redis
- **Exponential backoff with jitter** — prevent thundering herd when server restarts
- **Redis Pub/Sub** solves the multi-pod problem — all pods subscribe to same channel
- **Not everything needs WebSocket** — SSE is simpler for server-to-client only flows like feed updates
- Monitor connections-per-second (churn), not just total connections — churn is what kills servers