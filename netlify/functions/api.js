const { neon } = require('@neondatabase/serverless');
const crypto = require('crypto');

// Rate limiting для защиты от брутфорса
const loginAttempts = new Map();

const TABLES = {
  course_schedules: ['course_number', 'day', 'para1', 'para2', 'para3', 'para4', 'para5'],
  teacher_schedules: ['teacher', 'dushanba', 'seshanba', 'chorshanba', 'payshanba', 'juma', 'shanba'],
  gallery_images: ['title', 'description', 'image_url', 'image_path', 'is_active'],
  employees: ['name', 'position', 'photo_url', 'is_active', 'display_order'],
};

function db() {
  if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is not configured.');
  return neon(process.env.DATABASE_URL);
}

function encode(value) { return Buffer.from(JSON.stringify(value)).toString('base64url'); }
function sign(payload) {
  const body = `${encode({ alg: 'HS256', typ: 'JWT' })}.${encode(payload)}`;
  const signature = crypto.createHmac('sha256', process.env.JWT_SECRET).update(body).digest('base64url');
  return `${body}.${signature}`;
}
function authenticated(headers) {
  const token = (headers.authorization || '').replace(/^Bearer\s+/i, '');
  const [head, body, signature] = token.split('.');
  if (!head || !body || !signature || !process.env.JWT_SECRET) return false;
  const expected = crypto.createHmac('sha256', process.env.JWT_SECRET).update(`${head}.${body}`).digest('base64url');
  if (signature.length !== expected.length || !crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) return false;
  try { return JSON.parse(Buffer.from(body, 'base64url').toString()).exp > Math.floor(Date.now() / 1000); } catch { return false; }
}
function passwordMatchesHash(password, storedHash) {
  const [kind, salt, digest] = (storedHash || '').split(':');
  if (kind !== 'scrypt' || !salt || !digest) return false;
  const actual = crypto.scryptSync(password, Buffer.from(salt, 'hex'), 64).toString('hex');
  return actual.length === digest.length && crypto.timingSafeEqual(Buffer.from(actual), Buffer.from(digest));
}
function response(statusCode, payload) {
  return { statusCode, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }, body: JSON.stringify(payload) };
}
function imageKitAuth() {
  const { IMAGEKIT_PRIVATE_KEY: privateKey, IMAGEKIT_PUBLIC_KEY: publicKey } = process.env;
  if (!privateKey || !publicKey) throw new Error('ImageKit is not configured.');
  const token = crypto.randomUUID();
  const expire = Math.floor(Date.now() / 1000) + 15 * 60;
  const signature = crypto.createHmac('sha1', privateKey).update(`${token}${expire}`).digest('hex');
  return { token, expire, signature, publicKey };
}
async function removeImageKitFile(fileId) {
  const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
  if (!privateKey) throw new Error('ImageKit is not configured.');
  if (!fileId || fileId.length > 300) throw new Error('Invalid image identifier.');
  const authorization = Buffer.from(`${privateKey}:`).toString('base64');
  const result = await fetch(`https://api.imagekit.io/v1/files/${encodeURIComponent(fileId)}`, { method: 'DELETE', headers: { Authorization: `Basic ${authorization}` } });
  if (!result.ok && result.status !== 404) throw new Error('ImageKit could not delete the image.');
}
function safeFields(table, values) {
  const allowed = TABLES[table];
  if (!allowed) throw new Error('Unknown table.');
  return Object.fromEntries(Object.entries(values || {}).filter(([key]) => allowed.includes(key)));
}

// 🔒 НОВАЯ ФУНКЦИЯ: Rate Limiting
function checkRateLimit(email) {
  const key = (email || '').toLowerCase().trim();
  if (!key) throw new Error('Email is required');
  
  const now = Date.now();
  const attempts = loginAttempts.get(key) || [];
  
  // Удалить попытки старше 15 минут
  const recent = attempts.filter(t => now - t < 15 * 60 * 1000);
  
  // Максимум 5 попыток за 15 минут
  if (recent.length >= 5) {
    throw new Error('Слишком много попыток входа. Попробуйте через 15 минут.');
  }
  
  recent.push(now);
  loginAttempts.set(key, recent);
  
  // Очистка старых записей (каждый час)
  if (Math.random() < 0.01) {
    for (const [k, attempts] of loginAttempts.entries()) {
      if (attempts.every(t => now - t > 60 * 60 * 1000)) {
        loginAttempts.delete(k);
      }
    }
  }
}

// 🔒 НОВАЯ ФУНКЦИЯ: Валидация Email
function validateEmail(email) {
  if (!email || typeof email !== 'string') return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// 🔒 НОВАЯ ФУНКЦИЯ: Валидация входных данных
function validateInput(input) {
  // Ограничение на длину строк
  const maxStringLength = 5000;
  
  for (const [key, value] of Object.entries(input)) {
    if (typeof value === 'string' && value.length > maxStringLength) {
      throw new Error(`Field ${key} exceeds maximum length`);
    }
  }
}

exports.handler = async (event) => {
  try {
    const input = event.body ? JSON.parse(event.body) : {};
    const { action, table, id, values, filters = {}, order } = input;
    
    // Валидация входных данных
    validateInput(input);
    
    const client = db();

    // 🔒 LOGIN с Rate Limiting и Валидацией
    if (action === 'login') {
      // Rate limiting
      try {
        checkRateLimit(input.email);
      } catch (error) {
        return response(429, { error: error.message });
      }
      
      // Валидация email
      if (!validateEmail(input.email)) {
        return response(400, { error: 'Неверный формат email' });
      }
      
      const admins = [
        { email: process.env.ADMIN_EMAIL, hash: process.env.ADMIN_PASSWORD_HASH },
        { email: process.env.ADMIN_EMAIL_2, hash: process.env.ADMIN_PASSWORD_HASH_2 },
      ];
      const admin = admins.find((candidate) => candidate.email && candidate.email.toLowerCase() === String(input.email || '').toLowerCase());
      if (!admin || !passwordMatchesHash(input.password || '', admin.hash)) {
        return response(401, { error: "Email yoki parol noto'g'ri." });
      }
      
      const now = Math.floor(Date.now() / 1000);
      return response(200, { 
        token: sign({ sub: admin.email, iat: now, exp: now + 60 * 60 * 8 }), 
        user: { email: admin.email } 
      });
    }
    
    if (action === 'session') {
      return authenticated(event.headers) 
        ? response(200, { user: { email: process.env.ADMIN_EMAIL } }) 
        : response(401, { error: 'Unauthorized' });
    }

    if (action === 'select') {
      if (!TABLES[table]) return response(400, { error: 'Unknown table.' });
      const clauses = [], args = [];
      for (const [key, value] of Object.entries(filters)) {
        if (!(TABLES[table].includes(key) || key === 'id')) return response(400, { error: 'Invalid filter.' });
        args.push(value); 
        clauses.push(`${key} = $${args.length}`);
      }
      const orderColumn = TABLES[table].includes(order?.column) || order?.column === 'id' || order?.column === 'uploaded_at' ? order.column : 'id';
      const rows = await client.query(`SELECT * FROM ${table}${clauses.length ? ` WHERE ${clauses.join(' AND ')}` : ''} ORDER BY ${orderColumn} ${order?.ascending === false ? 'DESC' : 'ASC'}`, args);
      return response(200, { data: rows });
    }

    // 🔒 Все остальные действия требуют авторизации
    if (!authenticated(event.headers)) {
      return response(401, { error: 'Unauthorized' });
    }
    
    if (action === 'imagekit_auth') return response(200, imageKitAuth());
    
    if (action === 'delete_image') {
      await removeImageKitFile(String(input.fileId || ''));
      return response(200, { data: [] });
    }
    
    if (!TABLES[table]) return response(400, { error: 'Unknown table.' });
    
    if (action === 'insert') {
      const fields = safeFields(table, values);
      const names = Object.keys(fields);
      if (!names.length) return response(400, { error: 'No valid values.' });
      const rows = await client.query(`INSERT INTO ${table} (${names.join(', ')}) VALUES (${names.map((_, index) => `$${index + 1}`).join(', ')}) RETURNING *`, Object.values(fields));
      return response(200, { data: rows });
    }
    
    if (action === 'update') {
      const fields = safeFields(table, values);
      const names = Object.keys(fields);
      if (!names.length || !Number.isInteger(id)) return response(400, { error: 'Invalid update.' });
      await client.query(`UPDATE ${table} SET ${names.map((name, index) => `${name} = $${index + 1}`).join(', ')} WHERE id = $${names.length + 1}`, [...Object.values(fields), id]);
      return response(200, { data: [] });
    }
    
    if (action === 'delete' && Number.isInteger(id)) {
      await client.query(`DELETE FROM ${table} WHERE id = $1`, [id]);
      return response(200, { data: [] });
    }
    
    return response(400, { error: 'Unknown action.' });
  } catch (error) {
    console.error('API Error:', error);
    // 🔒 НЕ раскрываем детали ошибок в production
    return response(500, { error: 'Server error. Please try again later.' });
  }
};
