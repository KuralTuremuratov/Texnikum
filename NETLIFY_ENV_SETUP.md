# 🔧 Настройка Environment Variables в Netlify

## ⚠️ ВАЖНО: Netlify Functions не работают без этих переменных!

Чтобы сайт заработал, необходимо настроить следующие переменные окружения в Netlify Dashboard.

---

## 📋 Обязательные переменные

### 1. Перейдите в Netlify Dashboard
🔗 https://app.netlify.com/sites/texnikumdemo/settings/env

### 2. Добавьте следующие переменные:

#### 🔐 Авторизация админов
```
ADMIN_EMAIL=turemuratova0206@gmail.com
ADMIN_PASSWORD_HASH=scrypt:ВАШИХ_ХЕША:ВАШИХ_СОЛИ

ADMIN_EMAIL_2=второй_email@gmail.com (если есть)
ADMIN_PASSWORD_HASH_2=scrypt:ХЕША_2:СОЛИ_2 (если есть)
```

#### 🔑 JWT Secret
```
JWT_SECRET=сгенерируйте_случайную_строку_минимум_32_символа
```

Пример генерации JWT_SECRET:
```bash
# В PowerShell
-join ((65..90) + (97..122) + (48..57) | Get-Random -Count 64 | ForEach-Object {[char]$_})
```

#### 🗄️ База данных Neon
```
DATABASE_URL=postgresql://user:password@host.neon.tech/dbname?sslmode=require
```

Возьмите из вашего Neon Dashboard: https://neon.tech

#### 📸 ImageKit (для загрузки фото)
```
IMAGEKIT_PUBLIC_KEY=ваш_public_key
IMAGEKIT_PRIVATE_KEY=ваш_private_key
```

Возьмите из ImageKit Dashboard: https://imagekit.io/dashboard/developer/api-keys

---

## 🔨 Как сгенерировать ADMIN_PASSWORD_HASH

### Способ 1: Через Node.js (рекомендуется)

Создайте файл `generate-hash.js`:
```javascript
const crypto = require('crypto');

const password = 'ваш_пароль_здесь';
const salt = crypto.randomBytes(32).toString('hex');
const hash = crypto.scryptSync(password, Buffer.from(salt, 'hex'), 64).toString('hex');

console.log(`scrypt:${salt}:${hash}`);
```

Запустите:
```bash
node generate-hash.js
```

### Способ 2: Использовать существующий скрипт
```bash
cd scripts
node hash-admin-password.js
```

Введите пароль, скопируйте результат формата `scrypt:...`

---

## ✅ После добавления переменных

1. **Redeploy сайта:**
   - Netlify → Deploys → Trigger deploy → Clear cache and deploy

2. **Или через Git:**
   ```bash
   git commit --allow-empty -m "trigger: redeploy with env vars"
   git push origin main
   ```

3. **Проверка:**
   - Откройте: https://texnikumdemo.netlify.app/login
   - Введите email и пароль
   - Должно успешно войти в админ-панель

---

## 🐛 Проверка деплоя Functions

### Откройте Netlify Functions Dashboard:
🔗 https://app.netlify.com/sites/texnikumdemo/functions

Должна быть функция: **api**

### Проверка в браузере:
Откройте DevTools (F12) → Network → попробуйте войти

Запрос должен быть:
```
POST /.netlify/functions/api
Status: 200 OK (если данные верные)
Status: 401 Unauthorized (если пароль неверный)
```

Если **502 Bad Gateway** → проверьте environment variables!

---

## 📝 Текущие настройки проекта

### netlify.toml
```toml
[build]
  command = "npm run build"
  publish = "build"
  functions = "netlify/functions"
```

### API Endpoint
```javascript
// src/lib/supabase.js
const endpoint = '/.netlify/functions/api';
```

---

## 🔒 Безопасность

✅ **Что уже настроено:**
- Пароли хешируются с scrypt
- JWT токены с HMAC-SHA256
- Rate limiting (5 попыток / 15 мин)
- Security headers (CSP, X-Frame-Options и др.)
- HTTPS принудительный редирект

❌ **Что НЕ должно быть в Git:**
- Реальные пароли
- DATABASE_URL
- Private keys (IMAGEKIT_PRIVATE_KEY)
- JWT_SECRET

Все секреты только в Netlify Environment Variables!

---

## 🆘 Troubleshooting

### Проблема: "Server API topilmadi"
**Решение:**
1. Проверьте, что все env variables настроены
2. Redeploy с очисткой кеша
3. Проверьте Netlify Functions logs

### Проблема: "DATABASE_URL is not configured"
**Решение:**
Добавьте DATABASE_URL в Netlify env variables

### Проблема: "JWT_SECRET is not configured"
**Решение:**
Сгенерируйте и добавьте JWT_SECRET (минимум 32 символа)

### Проблема: "Email yoki parol noto'g'ri"
**Решение:**
1. Проверьте правильность email (должен совпадать с ADMIN_EMAIL)
2. Пересгенерируйте ADMIN_PASSWORD_HASH для вашего пароля

---

## 📞 Быстрая помощь

1. **Netlify Dashboard:** https://app.netlify.com/sites/texnikumdemo
2. **Environment Variables:** https://app.netlify.com/sites/texnikumdemo/settings/env
3. **Functions Logs:** https://app.netlify.com/sites/texnikumdemo/functions
4. **Deploys:** https://app.netlify.com/sites/texnikumdemo/deploys

---

**После настройки переменных окружения сайт заработает полностью!** 🚀
