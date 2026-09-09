# ImageKit sozlamasi

1. ImageKit panelidagi chap menyudan **Settings** ni bosing.
2. **Developer options** yoki **API Keys** bo'limini oching.
3. Netlify → **Project configuration → Environment variables** ga quyidagi qiymatlarni kiriting:

| Key | ImageKit dan olinadigan qiymat |
| --- | --- |
| `IMAGEKIT_PUBLIC_KEY` | Public key |
| `IMAGEKIT_PRIVATE_KEY` | Private key |

`IMAGEKIT_PRIVATE_KEY` maxfiy: uni chatga yubormang va GitHub'ga yozmang. Ikkala qiymat uchun **All scopes** ni tanlang.

4. Saqlang, so'ng Netlify → **Deploys → Trigger deploy → Deploy site** ni bosing.

Rasmlar ImageKit Media Library ichidagi `texnikum-gallery` papkasiga yuklanadi. Sayt faqat tizimga kirgan administrator uchun bir martalik server imzosi yaratadi; private key brauzerga uzatilmaydi.
