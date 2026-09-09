// Usage: node scripts/hash-admin-password.js "your-new-password"
const crypto = require('crypto');

const password = process.argv[2];
if (!password) {
  console.error('Usage: node scripts/hash-admin-password.js "your-new-password"');
  process.exit(1);
}

const salt = crypto.randomBytes(16).toString('hex');
const digest = crypto.scryptSync(password, Buffer.from(salt, 'hex'), 64).toString('hex');
console.log(`scrypt:${salt}:${digest}`);
