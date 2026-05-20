// Minimal mock backend for viva/demo (no DB, in-memory).
// Starts on http://localhost:3000 and serves routes under /api
//
// Run:
//   node mock-backend/server.js
//
// Then set frontend apiUrl to:
//   http://localhost:3000/api

const http = require('http');
const { URL } = require('url');

const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;

// In-memory demo data
const users = []; // { id, fullName, email, phoneNumber, password }
const categories = [
  { id: 1, name: 'Cleaning', icon: 'cleaning', image: '' },
  { id: 2, name: 'Plumbing', icon: 'water', image: '' },
  { id: 3, name: 'Electrician', icon: 'flash', image: '' }
];
const services = [
  { id: 'svc1', category: 'Cleaning', name: 'Home Cleaning', price: 1500 },
  { id: 'svc2', category: 'Cleaning', name: 'Deep Cleaning', price: 2500 },
  { id: 'svc3', category: 'Plumbing', name: 'Leak Fix', price: 1800 },
  { id: 'svc4', category: 'Electrician', name: 'Wiring Check', price: 2000 }
];
const bookings = []; // { id, userId, ...bookingData, status }
const requests = []; // { _id, userId, ... }
const chatMessages = []; // { _id, userId, text, type, timestamp }
const notifications = []; // { id, userId, title, message, createdAt }

function json(res, statusCode, data) {
  const body = JSON.stringify(data);
  res.writeHead(statusCode, {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(body),
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,PATCH,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
  });
  res.end(body);
}

function notFound(res) {
  json(res, 404, { message: 'Not found' });
}

function badRequest(res, message) {
  json(res, 400, { message });
}

function ok(res, data) {
  json(res, 200, data);
}

function created(res, data) {
  json(res, 201, data);
}

function getBearerToken(req) {
  const auth = req.headers.authorization || '';
  const m = auth.match(/^Bearer\s+(.+)$/i);
  return m ? m[1] : null;
}

function demoTokenForUser(user) {
  // This is NOT a real JWT. It just satisfies the frontend demo flow.
  return `demo-token:${user.id}`;
}

function userIdFromToken(token) {
  if (!token) return null;
  const prefix = 'demo-token:';
  if (!token.startsWith(prefix)) return null;
  return token.slice(prefix.length);
}

function readJson(req) {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', (chunk) => (data += chunk));
    req.on('end', () => {
      if (!data) return resolve({});
      try {
        resolve(JSON.parse(data));
      } catch (e) {
        reject(new Error('Invalid JSON'));
      }
    });
  });
}

function handleOptions(req, res) {
  res.writeHead(204, {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,PATCH,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '600'
  });
  res.end();
}

const server = http.createServer(async (req, res) => {
  try {
    if (!req.url) return notFound(res);
    if (req.method === 'OPTIONS') return handleOptions(req, res);

    const url = new URL(req.url, `http://${req.headers.host}`);
    const path = url.pathname;

    // Health
    if (req.method === 'GET' && path === '/') {
      return ok(res, { status: 'ok', message: 'Mock backend running', baseUrl: `http://localhost:${PORT}/api` });
    }
    if (req.method === 'GET' && path === '/api') {
      return ok(res, { status: 'ok', message: 'Mock API root' });
    }

    // AUTH
    if (req.method === 'POST' && path === '/api/auth/signup') {
      const body = await readJson(req);
      const { fullName, email, phoneNumber, password } = body || {};
      if (!fullName || !phoneNumber || !password) return badRequest(res, 'fullName, phoneNumber, password required');

      const existing = users.find((u) => u.phoneNumber === phoneNumber);
      if (existing) return badRequest(res, 'User already exists');

      const user = { id: String(Date.now()), fullName, email: email || '', phoneNumber, password };
      users.push(user);

      return created(res, {
        token: demoTokenForUser(user),
        user: { id: user.id, fullName: user.fullName, email: user.email, phoneNumber: user.phoneNumber }
      });
    }

    if (req.method === 'POST' && path === '/api/auth/login') {
      const body = await readJson(req);
      const { phoneNumber, password } = body || {};
      if (!phoneNumber || !password) return badRequest(res, 'phoneNumber and password required');

      const user = users.find((u) => u.phoneNumber === phoneNumber && u.password === password);
      if (!user) return badRequest(res, 'Invalid credentials');

      return ok(res, {
        token: demoTokenForUser(user),
        user: { id: user.id, fullName: user.fullName, email: user.email, phoneNumber: user.phoneNumber }
      });
    }

    if (req.method === 'POST' && path === '/api/auth/forgot-password') {
      // Demo: always "send" OTP
      return ok(res, { message: 'OTP sent (demo)', otp: '123456' });
    }

    if (req.method === 'POST' && path === '/api/auth/reset-password') {
      const body = await readJson(req);
      const { phoneNumber, newPassword } = body || {};
      const user = users.find((u) => u.phoneNumber === phoneNumber);
      if (!user) return badRequest(res, 'User not found');
      user.password = newPassword || user.password;
      return ok(res, { message: 'Password reset (demo)' });
    }

    if (req.method === 'POST' && path === '/api/auth/verify-otp') {
      // Demo: always verified
      return ok(res, { message: 'OTP verified (demo)' });
    }

    if (req.method === 'PUT' && path === '/api/auth/profile') {
      const token = getBearerToken(req);
      const userId = userIdFromToken(token);
      if (!userId) return json(res, 401, { message: 'Unauthorized (demo token missing)' });

      const body = await readJson(req);
      const user = users.find((u) => u.id === userId);
      if (!user) return notFound(res);

      // Update allowed fields for demo
      user.fullName = body.fullName ?? user.fullName;
      user.email = body.email ?? user.email;
      user.phoneNumber = body.phoneNumber ?? user.phoneNumber;
      user.location = body.location ?? user.location;

      return ok(res, { user: { id: user.id, fullName: user.fullName, email: user.email, phoneNumber: user.phoneNumber, location: user.location } });
    }

    // CATEGORIES
    if (req.method === 'GET' && path === '/api/categories') {
      return ok(res, categories);
    }
    if (req.method === 'GET' && path === '/api/categories/featured') {
      const limit = Number(url.searchParams.get('limit') || '3');
      return ok(res, categories.slice(0, Math.max(0, limit)));
    }
    if (req.method === 'GET' && path === '/api/categories/search') {
      const q = (url.searchParams.get('q') || '').toLowerCase();
      return ok(res, categories.filter((c) => c.name.toLowerCase().includes(q)));
    }
    if (req.method === 'GET' && path.startsWith('/api/categories/')) {
      const id = path.split('/').pop();
      const cat = categories.find((c) => String(c.id) === String(id));
      if (!cat) return notFound(res);
      return ok(res, cat);
    }

    // SERVICES
    if (req.method === 'GET' && path === '/api/services') {
      return ok(res, services);
    }
    if (req.method === 'GET' && path.startsWith('/api/services/category/')) {
      const category = decodeURIComponent(path.split('/').pop() || '');
      return ok(res, services.filter((s) => s.category.toLowerCase() === category.toLowerCase()));
    }

    // NOTIFICATIONS
    if (req.method === 'GET' && path === '/api/notifications') {
      const userId = url.searchParams.get('userId') || '';
      return ok(res, notifications.filter((n) => !userId || n.userId === userId));
    }

    // CONTACT SUPPORT
    if (req.method === 'POST' && path === '/api/contact-support') {
      const body = await readJson(req);
      return created(res, { message: 'Support request received (demo)', data: body || {} });
    }

    // BOOKINGS (expects Authorization: Bearer <token>)
    if (path === '/api/bookings' && req.method === 'POST') {
      const token = getBearerToken(req);
      const userId = userIdFromToken(token);
      if (!userId) return json(res, 401, { message: 'Unauthorized (demo token missing)' });

      const body = await readJson(req);
      const booking = { id: String(Date.now()), userId, status: 'confirmed', ...body };
      bookings.push(booking);
      return created(res, booking);
    }
    if (path === '/api/bookings/my-bookings' && req.method === 'GET') {
      const token = getBearerToken(req);
      const userId = userIdFromToken(token);
      if (!userId) return json(res, 401, { message: 'Unauthorized (demo token missing)' });
      return ok(res, bookings.filter((b) => b.userId === userId));
    }
    if (path.startsWith('/api/bookings/') && req.method === 'GET') {
      const token = getBearerToken(req);
      const userId = userIdFromToken(token);
      if (!userId) return json(res, 401, { message: 'Unauthorized (demo token missing)' });
      const id = path.split('/')[3];
      const b = bookings.find((x) => x.id === id && x.userId === userId);
      if (!b) return notFound(res);
      return ok(res, b);
    }
    if (path.endsWith('/cancel') && path.startsWith('/api/bookings/') && req.method === 'PATCH') {
      const token = getBearerToken(req);
      const userId = userIdFromToken(token);
      if (!userId) return json(res, 401, { message: 'Unauthorized (demo token missing)' });
      const id = path.split('/')[3];
      const b = bookings.find((x) => x.id === id && x.userId === userId);
      if (!b) return notFound(res);
      b.status = 'cancelled';
      return ok(res, b);
    }

    // REQUESTS (basic demo)
    if (path === '/api/requests' && req.method === 'GET') {
      return ok(res, requests);
    }
    if (path === '/api/my-requests' && req.method === 'GET') {
      const token = getBearerToken(req);
      const userId = userIdFromToken(token);
      if (!userId) return json(res, 401, { message: 'Unauthorized (demo token missing)' });
      return ok(res, requests.filter((r) => r.userId === userId));
    }
    if (path.startsWith('/api/requests/') && req.method === 'GET') {
      const id = path.split('/').pop();
      const r = requests.find((x) => x._id === id);
      if (!r) return notFound(res);
      return ok(res, r);
    }

    // CHAT (basic demo)
    if (path === '/api/chat/send' && req.method === 'POST') {
      const body = await readJson(req);
      const msg = {
        _id: String(Date.now()),
        userId: body.userId || 'demo',
        text: body.text || '',
        type: body.type || 'text',
        audioLength: body.audioLength,
        timestamp: new Date().toISOString()
      };
      chatMessages.push(msg);
      return created(res, msg);
    }
    if (path === '/api/chat/messages' && req.method === 'GET') {
      const userId = url.searchParams.get('userId') || '';
      return ok(res, chatMessages.filter((m) => !userId || m.userId === userId));
    }

    return notFound(res);
  } catch (e) {
    return json(res, 500, { message: 'Mock backend error', error: String(e && e.message ? e.message : e) });
  }
});

server.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Mock backend listening on http://localhost:${PORT}`);
  // eslint-disable-next-line no-console
  console.log(`API base: http://localhost:${PORT}/api`);
});

