# NexaCloud — Landing Page

Landing page statis (HTML + CSS + JS murni) hasil translasi dari desain Figma "NexaCloud - LP".

## Cara menjalankan

Buka `index.html` langsung di browser, atau serve lokal:

```bash
npx serve .
```

## Struktur

```
nexa-cloud/
├── index.html          # Seluruh markup halaman
├── css/
│   └── style.css       # Design tokens (warna Figma), layout, responsive s/d mobile
├── js/
│   └── main.js         # Slider marketplace, FAQ accordion, nav mobile,
│                       # step highlight, pixel-rain canvas, back-to-top
└── assets/
    ├── images/         # Ilustrasi hasil export desain (hero, db-server, dst)
    │   ├── Left.svg    # Aksen glow kanan hero (dari Figma)
    │   └── Left-1.svg  # Aksen glow kiri hero (dari Figma)
    └── icons/          # Logo, ikon aplikasi/database, pill cloud provider
```

## Catatan desain

- Font: **Mona Sans** + **DM Mono** (label letter-spaced) via Google Fonts.
- Palet mengikuti style guide Figma: primary `#4B12C1`, secondary `#FB923C`,
  neutral `#191919 / #6A6C6A / #E5E7EB / #FAFAFA`, plus gradient purple dark.
- Breakpoint: `1100px` (tablet) dan `768px` (mobile, menu hamburger).
- Slider marketplace: scroll-snap + tombol panah + drag mouse (touch native).
