const endpoint = '/.netlify/functions/api';
const tokenKey = 'texnikum_admin_token';
const listeners = new Set();

async function request(payload) {
  const token = sessionStorage.getItem(tokenKey);
  const response = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) }, body: JSON.stringify(payload) });
  const contentType = response.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) {
    throw new Error('Server API topilmadi. Netlify Functions bilan qayta deploy qiling.');
  }
  const result = await response.json();
  if (!response.ok) throw new Error(result.error || 'Server error');
  return result;
}
function user() { const token = sessionStorage.getItem(tokenKey); return token ? { email: 'admin' } : null; }
function notify() { const session = user() ? { user: user() } : null; listeners.forEach((listener) => listener('SIGNED_IN', session)); }

class Query {
  constructor(table, action, values) { this.table = table; this.action = action || 'select'; this.values = values; this.filters = {}; this.sort = undefined; }
  select() { this.selectAfterWrite = true; return this; }
  eq(key, value) { this.filters[key] = value; return this; }
  order(column, options = {}) { this.sort = { column, ...options }; return this; }
  insert(rows) { this.action = 'insert'; this.values = rows[0]; return this; }
  update(values) { this.action = 'update'; this.values = values; return this; }
  delete() { this.action = 'delete'; return this; }
  then(resolve, reject) {
    const payload = { action: this.action, table: this.table, values: this.values, filters: this.filters, order: this.sort };
    if (this.action === 'update' || this.action === 'delete') payload.id = Number(this.filters.id);
    return request(payload).then((result) => resolve({ data: result.data || [], error: null })).catch((error) => resolve({ data: null, error }));
  }
}

export const supabase = {
  from: (table) => new Query(table),
  auth: {
    getSession: async () => ({ data: { session: user() ? { user: user() } : null } }),
    getUser: async () => ({ data: { user: user() }, error: user() ? null : new Error('Unauthorized') }),
    signInWithPassword: async ({ email, password }) => {
      try { const result = await request({ action: 'login', email, password }); sessionStorage.setItem(tokenKey, result.token); notify(); return { data: { user: result.user }, error: null }; } catch (error) { return { data: null, error }; }
    },
    signOut: async () => { sessionStorage.removeItem(tokenKey); notify(); },
    onAuthStateChange: (callback) => { listeners.add(callback); return { data: { subscription: { unsubscribe: () => listeners.delete(callback) } } }; },
  },
  storage: { from: () => ({ upload: async () => ({ error: new Error('Cloudinary is not configured yet.') }), getPublicUrl: () => ({ data: null }), remove: async () => ({ error: null }) }) },
};
