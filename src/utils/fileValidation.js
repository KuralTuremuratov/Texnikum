// 🔒 Валидация загружаемых файлов

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp', 'image/gif'];
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB

export function validateImageFile(file) {
  if (!file) {
    throw new Error('Файл не выбран');
  }

  // Проверка типа файла
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    throw new Error('Разрешены только изображения (JPEG, PNG, WebP, GIF)');
  }

  // Проверка размера
  if (file.size > MAX_IMAGE_SIZE) {
    const sizeMB = (MAX_IMAGE_SIZE / (1024 * 1024)).toFixed(0);
    throw new Error(`Размер файла не должен превышать ${sizeMB}MB. Текущий размер: ${(file.size / (1024 * 1024)).toFixed(2)}MB`);
  }

  // Проверка расширения файла
  const fileName = file.name || '';
  const ext = fileName.split('.').pop()?.toLowerCase();
  const allowedExtensions = ['jpg', 'jpeg', 'png', 'webp', 'gif'];
  
  if (!ext || !allowedExtensions.includes(ext)) {
    throw new Error('Недопустимое расширение файла');
  }

  return true;
}

export function sanitizeFileName(fileName) {
  // Удаляем опасные символы из имени файла
  return fileName
    .replace(/[^a-zA-Z0-9._-]/g, '_')
    .replace(/_{2,}/g, '_')
    .substring(0, 200); // Ограничение длины
}
