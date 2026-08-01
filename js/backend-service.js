const express = require('express');
const cors = require('cors');
const crypto = require('node:crypto');

const app = express();
const PORT = Number(process.env.API_PORT) || 4000;
const SESSION_TTL_MS = 1000 * 60 * 60 * 24; // 24 hours

const apiRoutes = [
  { method: 'GET', path: '/api/health', auth: false, description: 'API health status' },
  { method: 'GET', path: '/api/endpoints', auth: false, description: 'List available API endpoints' },
  { method: 'GET', path: '/admin/orders', auth: false, description: 'List current orders' },
  { method: 'GET', path: '/admin/orders/in-progress', auth: false, description: 'List in-progress delivery orders' },
  { method: 'POST', path: '/api/auth/login', auth: false, description: 'Create an auth session' },
  { method: 'GET', path: '/api/auth/session', auth: true, description: 'Read current auth session' },
  { method: 'POST', path: '/api/auth/logout', auth: true, description: 'Close current auth session' },
  { method: 'GET', path: '/api/dashboard/kpis', auth: true, description: 'Dashboard KPI summary' },
  { method: 'GET', path: '/api/dashboard/revenue-overview', auth: true, description: 'Revenue chart data' },
  { method: 'GET', path: '/api/analytics/overview', auth: true, description: 'Analytics overview cards' },
  { method: 'GET', path: '/api/profiles', auth: true, description: 'List profiles' },
  { method: 'GET', path: '/api/profiles/:id', auth: true, description: 'Read profile by id' },
];

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use((req, res, next) => {
  const startedAt = process.hrtime.bigint();

  res.on('finish', () => {
    const durationMs = Number(process.hrtime.bigint() - startedAt) / 1e6;
    console.log(
      `[${new Date().toISOString()}] ${req.method} ${req.originalUrl} -> ${res.statusCode} (${durationMs.toFixed(1)} ms)`
    );
  });

  next();
});

// In-memory store for demo sessions (replace with Redis/DB in production)
const sessions = new Map();

const LOGIN_EMAIL = process.env.DASHBOARD_LOGIN_EMAIL || 'admin@kwala.app';
const LOGIN_PASSWORD = process.env.DASHBOARD_LOGIN_PASSWORD || 'Kwala@123';

const dashboardKpis = {
  revenue: 46740,
  users: 380,
  sales: 1328,
  customerLtv: 156,
  activeCustomers: 1247,
  avgDeliveryMinutes: 28,
  cac: 12.5,
};

const revenueByMonth = [
  { month: 'Jan', y2025: 38, y2024: 28 },
  { month: 'Feb', y2025: 42, y2024: 32 },
  { month: 'Mar', y2025: 35, y2024: 25 },
  { month: 'Apr', y2025: 48, y2024: 35 },
  { month: 'May', y2025: 40, y2024: 30 },
  { month: 'Jun', y2025: 45, y2024: 33 },
  { month: 'Jul', y2025: 32, y2024: 22 },
  { month: 'Aug', y2025: 50, y2024: 38 },
  { month: 'Sep', y2025: 55, y2024: 40 },
  { month: 'Oct', y2025: 60, y2024: 42 },
  { month: 'Nov', y2025: 58, y2024: 45 },
  { month: 'Dec', y2025: 62, y2024: 48 },
];

const profiles = [
  {
    id: 'profile_1',
    name: 'barir ali',
    email: 'barir.ali@email.com',
    phone: '+212 6XX XXX XXX',
    isPremium: true,
    isVerified: true,
    memberSince: 'January 2024',
  },
  {
    id: 'profile_2',
    name: 'yassine harmati',
    email: 'yassine.smith@email.com',
    phone: '+212 7XX XXX XXX',
    isPremium: false,
    isVerified: true,
    memberSince: 'March 2024',
  },
  {
    id: 'profile_3',
    name: 'Family Account',
    email: 'family@email.com',
    phone: '+212 6XX XXX XXX',
    isPremium: true,
    isVerified: false,
    memberSince: 'December 2023',
  },
];

const demoOrders = [
  {
    id: 1001,
    status: 'pending',
    restaurant_id: 11,
    bag_id: 301,
    boy_id: null,
    created_at: '2026-04-11T07:30:00.000Z',
    total_amount: 16.5,
    currency: 'MAD',
  },
  {
    id: 1002,
    status: 'in_progress',
    restaurant_id: 11,
    bag_id: 302,
    boy_id: 71,
    created_at: '2026-04-11T08:10:00.000Z',
    total_amount: 21,
    currency: 'MAD',
  },
  {
    id: 1003,
    status: 'delivered',
    restaurant_id: 12,
    bag_id: 301,
    boy_id: 72,
    created_at: '2026-04-11T09:25:00.000Z',
    total_amount: 32.8,
    currency: 'MAD',
  },
  {
    id: 1004,
    status: 'in_progress',
    restaurant_id: 13,
    bag_id: 303,
    boy_id: 73,
    created_at: '2026-04-11T10:05:00.000Z',
    total_amount: 12.4,
    currency: 'MAD',
  },
  {
    id: 1005,
    status: 'preparing',
    restaurant_id: 12,
    bag_id: 304,
    boy_id: null,
    created_at: '2026-04-11T10:40:00.000Z',
    total_amount: 18.9,
    currency: 'MAD',
  },
  {
    id: 1006,
    status: 'in_progress',
    restaurant_id: 11,
    bag_id: 301,
    boy_id: 71,
    created_at: '2026-04-11T11:12:00.000Z',
    total_amount: 25.2,
    currency: 'MAD',
  },
  {
    id: 1007,
    status: 'cancelled',
    restaurant_id: 13,
    bag_id: 303,
    boy_id: null,
    created_at: '2026-04-11T11:45:00.000Z',
    total_amount: 14.7,
    currency: 'MAD',
  },
  {
    id: 1008,
    status: 'in_progress',
    restaurant_id: 12,
    bag_id: 304,
    boy_id: 74,
    created_at: '2026-04-11T12:20:00.000Z',
    total_amount: 27.6,
    currency: 'MAD',
  },
];

function parseOptionalInt(value) {
  if (value === undefined || value === null || value === '') {
    return null;
  }

  const parsed = Number.parseInt(String(value), 10);
  return Number.isNaN(parsed) ? null : parsed;
}

function parseOptionalDate(value) {
  if (!value) {
    return null;
  }

  const parsed = new Date(String(value));
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function parsePaging(query) {
  const rawSkip = Number.parseInt(String(query.skip ?? '0'), 10);
  const rawLimit = Number.parseInt(String(query.limit ?? '100'), 10);
  const skip = Number.isNaN(rawSkip) || rawSkip < 0 ? 0 : rawSkip;
  const limit = Number.isNaN(rawLimit) || rawLimit < 1 ? 100 : Math.min(rawLimit, 500);
  return { skip, limit };
}

function withinTimeRange(order, timeFrom, timeTo) {
  const orderDate = new Date(order.created_at);

  if (timeFrom && orderDate < timeFrom) {
    return false;
  }

  if (timeTo && orderDate > timeTo) {
    return false;
  }

  return true;
}

function filterOrders(items, filters) {
  const {
    status,
    restaurantId,
    bagId,
    boyId,
    timeFrom,
    timeTo,
  } = filters;

  return items.filter((order) => {
    if (status && String(order.status).toLowerCase() !== status) {
      return false;
    }

    if (restaurantId !== null && order.restaurant_id !== restaurantId) {
      return false;
    }

    if (bagId !== null && order.bag_id !== bagId) {
      return false;
    }

    if (boyId !== null && order.boy_id !== boyId) {
      return false;
    }

    return withinTimeRange(order, timeFrom, timeTo);
  });
}

function createSession(user) {
  const token = crypto.randomUUID();
  const expiresAt = Date.now() + SESSION_TTL_MS;
  const record = { token, user, expiresAt };
  sessions.set(token, record);
  return record;
}

function getSessionFromHeader(req) {
  const authorization = req.headers.authorization || '';
  const [scheme, token] = authorization.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return null;
  }

  const record = sessions.get(token);
  if (!record) {
    return null;
  }

  if (record.expiresAt < Date.now()) {
    sessions.delete(token);
    return null;
  }

  return record;
}

function requireAuth(req, res, next) {
  const session = getSessionFromHeader(req);

  if (!session) {
    res.status(401).json({
      ok: false,
      error: 'Unauthorized. Provide a valid Bearer token.',
    });
    return;
  }

  req.session = session;
  next();
}

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'kwala-dashboard-api' });
});

app.get('/api/endpoints', (_req, res) => {
  res.json({ ok: true, data: apiRoutes });
});

app.get('/admin/orders', (req, res) => {
  const status = req.query.status ? String(req.query.status).trim().toLowerCase() : null;
  const restaurantId = parseOptionalInt(req.query.restaurant_id);
  const bagId = parseOptionalInt(req.query.bag_id);
  const timeFrom = parseOptionalDate(req.query.time_from);
  const timeTo = parseOptionalDate(req.query.time_to);
  const { skip, limit } = parsePaging(req.query);

  const filtered = filterOrders(demoOrders, {
    status,
    restaurantId,
    bagId,
    boyId: null,
    timeFrom,
    timeTo,
  });

  const items = filtered.slice(skip, skip + limit);
  res.json({ total: filtered.length, items });
});

app.get('/admin/orders/in-progress', (req, res) => {
  const restaurantId = parseOptionalInt(req.query.restaurant_id);
  const bagId = parseOptionalInt(req.query.bag_id);
  const boyId = parseOptionalInt(req.query.boy_id);
  const timeFrom = parseOptionalDate(req.query.time_from);
  const timeTo = parseOptionalDate(req.query.time_to);
  const { skip, limit } = parsePaging(req.query);

  const inProgressStatuses = new Set(['in_progress', 'assigned', 'picked_up', 'on_the_way']);
  const inProgress = demoOrders.filter((order) => inProgressStatuses.has(String(order.status).toLowerCase()));
  const filtered = filterOrders(inProgress, {
    status: null,
    restaurantId,
    bagId,
    boyId,
    timeFrom,
    timeTo,
  });

  const items = filtered.slice(skip, skip + limit);
  res.json({ total: filtered.length, items });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body || {};

  if (email !== LOGIN_EMAIL || password !== LOGIN_PASSWORD) {
    res.status(401).json({
      ok: false,
      error: 'Invalid email or password.',
    });
    return;
  }

  const session = createSession({
    id: 'admin_1',
    name: 'Dashboard Admin',
    email,
  });

  res.json({
    ok: true,
    message: 'Login successful.',
    token: session.token,
    expiresAt: session.expiresAt,
    user: session.user,
  });
});

app.get('/api/auth/session', requireAuth, (req, res) => {
  res.json({
    ok: true,
    user: req.session.user,
    expiresAt: req.session.expiresAt,
  });
});

app.post('/api/auth/logout', requireAuth, (req, res) => {
  sessions.delete(req.session.token);
  res.json({ ok: true, message: 'Logged out.' });
});

app.get('/api/dashboard/kpis', requireAuth, (_req, res) => {
  res.json({ ok: true, data: dashboardKpis });
});

app.get('/api/dashboard/revenue-overview', requireAuth, (_req, res) => {
  res.json({ ok: true, data: revenueByMonth });
});

app.get('/api/analytics/overview', requireAuth, (_req, res) => {
  res.json({
    ok: true,
    data: {
      totalRevenue: 8540,
      totalOrders: 342,
      avgOrderValue: 24.97,
      customerLtv: 156,
      cac: 12.5,
      conversionRate: 4.8,
    },
  });
});

app.get('/api/profiles', requireAuth, (_req, res) => {
  res.json({ ok: true, data: profiles });
});

app.get('/api/profiles/:id', requireAuth, (req, res) => {
  const profile = profiles.find((item) => item.id === req.params.id);

  if (!profile) {
    res.status(404).json({
      ok: false,
      error: 'Profile not found.',
    });
    return;
  }

  res.json({ ok: true, data: profile });
});

app.use((_req, res) => {
  res.status(404).json({ ok: false, error: 'Endpoint not found.' });
});

app.listen(PORT, () => {
  console.log(`Kwala API running on http://localhost:${PORT}`);
  console.log('Default login (override with env vars):');
  console.log(`  DASHBOARD_LOGIN_EMAIL=${LOGIN_EMAIL}`);
  console.log('  DASHBOARD_LOGIN_PASSWORD=<hidden>');
  console.log('Available endpoints:');
  apiRoutes.forEach((route) => {
    console.log(`  ${route.method.padEnd(6)} ${route.path}${route.auth ? ' [auth]' : ''}`);
  });
});
