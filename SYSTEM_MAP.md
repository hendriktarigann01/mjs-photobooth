# Project Summary
- **Tujuan aplikasi**: Aplikasi Photobooth interaktif dengan fitur penangkapan gambar via webcam, kustomisasi layout dan frame, penerapan filter, serta pengiriman hasil foto melalui Email, WhatsApp request, dan QR code (upload ke cloud storage).
- **Tech stack utama**: Next.js 14.2.11 (App Router), React 18, TypeScript, Material UI (MUI) v6, Supabase (Database & Storage client), TanStack React Query, Nodemailer, dan `html2canvas`.
- **Pola arsitektur**: Menggunakan arsitektur App Router (`app/`). Komponen antarmuka utama adalah Client Components yang dipisah ke dalam folder `views/`. Alur aplikasi dikontrol secara terpusat oleh React Context (`PhotoboothProvider`). Server-side logic (pengiriman email) ditangani melalui Next.js API Routes.

# Core Logic Flow (Function-Level Flowchart)
- **Photobooth Main Flow**:
  `HomeView -> WelcomeScreen -> LayoutScreen -> PhotoScreen -> PreviewScreen -> QRScreen`
- **Image Capture & Upload Flow**:
  `PreviewScreen[savePhotoResult] (via html2canvas) -> PhotoboothContext[setPhotoResult] -> QRScreen[onDownload] -> api/uploader[useUploadImage] -> Supabase Storage`
- **Send Email Flow**:
  `PreviewScreen -> SendOptionMenu -> app/api/send-email/route.ts[POST] -> nodemailer -> Email Terkirim`
- **WhatsApp Request Flow**:
  `PreviewScreen -> SendOptionMenu -> api/whatsapp[createWhatsappRequest] -> Supabase DB[whatsapp_requests]`

# Clean Tree
```
├── public/               # Asset statis, gambar background, frame
└── src/
    ├── api/              # Modul wrapper untuk API (uploader, whatsapp)
    ├── app/              # Next.js App Router & API Routes
    │   ├── api/          # Route Handlers (mis. send-email)
    │   └── whatsapp-request/ # Page untuk dashboard admin WA
    ├── components/       # Reusable UI components
    ├── config/           # Konfigurasi environment (env.ts)
    ├── contexts/         # React Context (PhotoboothProvider)
    ├── helpers/          # Fungsi utilitas (resize gambar, inisialisasi Supabase client)
    ├── hooks/            # Custom React hooks
    ├── providers/        # Global context providers (MUI, Query, Notistack)
    ├── styles/           # Global CSS
    ├── templates/        # Template HTML untuk pengiriman email
    ├── themes/           # Kustomisasi tema Material UI
    └── views/            # Komponen halaman UI utama
        ├── home/         # Flow layar Photobooth
        └── whatsapp-request/ # Tabel dashboard request WhatsApp
```

# Module Map (The Chapters)
- `src/app/layout.tsx`: Root layout, membungkus seluruh aplikasi dengan global providers (MUI, React Query, Context).
- `src/app/page.tsx`: Entrypoint yang memanggil dan menampilkan `HomeView`.
- `src/app/api/send-email/route.ts`: API Endpoint (Server Route) untuk mengirimkan email dengan lampiran foto menggunakan `nodemailer`.
- `src/views/home/index.tsx`: Komponen utama yang mengatur transisi antar layar (Welcome, Layout, Photo, Preview, QR).
- `src/views/home/screens/PreviewScreen/index.tsx`: Menggabungkan kumpulan foto dari kamera dengan overlay frame menggunakan `html2canvas` menjadi satu gambar final.
- `src/views/home/screens/QRScreen/index.tsx`: Mengunggah gambar final ke Supabase, lalu me-render QR Code dari URL gambar untuk dipindai pengguna.
- `src/contexts/PhotoboothProvider.tsx`: State manager utama untuk menyimpan data sesi (event, layout, foto jepretan, frame, hasil final).
- `src/api/uploader.ts`: Hooks mutasi untuk mengunggah gambar (format Base64 Buffer) ke Supabase Storage.
- `src/api/whatsapp.ts`: Modul query/mutasi untuk operasi CRUD tabel `whatsapp_requests`.

# Data & Config
- **Environment**: Variabel env dikonfigurasi melalui `src/config/env.ts`. Memanfaatkan `NEXT_PUBLIC_EMAILER_*` dan `NEXT_PUBLIC_SUPABASE_*`.
- **Skema Database (Supabase)**:
  - Tabel: `whatsapp_requests`
    - Kolom penting: `id`, `phone`, `photo_link`, `isSent`, `created_at`.
- **Storage (Supabase Bucket)**:
  - Nama bucket dinamis sesuai nama `event` (default: `"photobooth"`).
- **Templates**: File template email berada di folder `src/templates/`.

# External Integrations
- **Supabase Storage**: Menyimpan hasil gambar photobooth secara cloud (`src/api/uploader.ts`).
- **Supabase Database**: Menyimpan log antrean nomor WhatsApp untuk dikirimkan foto (`src/api/whatsapp.ts`).
- **Nodemailer (SMTP)**: Integrasi dengan server SMTP pihak ketiga untuk mengirimkan email foto ke pengguna (`src/app/api/send-email/route.ts`).

# Risks / Blind Spots
- **Exposure Credentials**: Penggunaan awalan `NEXT_PUBLIC_` untuk kredensial sensitif seperti `NEXT_PUBLIC_EMAILER_PASS` membuat password terekspos ke sisi klien (browser). Sebaiknya kredensial server (seperti SMTP) tidak diberi prefix `NEXT_PUBLIC_`.
- **Supabase RLS**: File source code tidak menunjukkan aturan Row Level Security (RLS) di Supabase. Sangat bergantung pada konfigurasi RLS di dashboard Supabase agar `anon key` tidak disalahgunakan.
- **Dynamic Routing**: Nama bucket upload bergantung pada query parameter `event`. Jika bucket tidak di-provision otomatis, upload akan gagal bila folder event tersebut tidak ada.
