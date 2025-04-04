# WeatherPesantren

![WeatherPesantren Banner](https://blog.classy.id/upload/gambar_berita/3dff6b3cd03dac0a28dc1cec300f3dcb_20250404150004.jpeg)

WeatherPesantren adalah sistem informasi cuaca otomatis berbasis Google Apps Script yang dirancang khusus untuk warga Pesantren Kota Kediri dan sekitarnya. Sistem ini mengambil data cuaca dari Weather.com dan mendistribusikannya melalui WhatsApp dan email dalam format yang informatif dan mudah dibaca.

## Fitur Utama

- 🌤️ Mengambil data cuaca terkini dari Weather.com secara otomatis
- 📱 Mengirimkan informasi cuaca melalui WhatsApp dan email
- 🌞 Menyajikan prakiraan cuaca untuk hari ini dan besok (siang dan malam)
- 🌧️ Informasi detail seperti suhu, kelembaban, UV index, arah angin, dll
- 🌙 Data astronomi seperti waktu terbit/terbenam matahari dan bulan
- 💡 Rekomendasi aktivitas berdasarkan kondisi cuaca

## Cara Kerja

Script ini bekerja dengan menggunakan teknik web scraping untuk mengambil data cuaca dari Weather.com. Langkah-langkahnya meliputi:

1. Mengakses halaman cuaca Weather.com untuk wilayah Pesantren Kota Kediri
2. Mengekstrak data seperti suhu, deskripsi cuaca, kelembaban, dll menggunakan RegEx
3. Memformat data dalam pesan yang informatif dan mudah dibaca
4. Mengirimkan informasi melalui WhatsApp Gateway dan email
5. Proses ini dijalankan otomatis setiap 6 jam menggunakan trigger Google Apps Script

## Panduan Penggunaan

### Prasyarat
- Akun Google untuk menjalankan Google Apps Script
- Akses ke layanan WhatsApp Gateway MPedia 

### Instalasi
1. Buka [Google Apps Script](https://script.google.com)
2. Buat project baru
3. Copy-paste kode dari file `weather_script.js` ke editor
4. Sesuaikan konfigurasi berikut:
   - URL Weather.com untuk lokasi Anda
   - API key dan URL untuk WhatsApp Gateway
   - Nomor pengirim dan penerima WhatsApp
   - Alamat email penerima

### Mengatur Trigger Otomatis
1. Jalankan fungsi `createTrigger()` untuk mengatur trigger otomatis setiap 6 jam
2. Atau jalankan `runOnce()` untuk menjalankan script secara manual

## Struktur Pesan

Pesan yang dikirim memiliki format sebagai berikut:

```
🌤️ INFORMASI CUACA TERKINI
📍 Wilayah Pesantren Kota Kediri dan Sekitarnya
🕒 Diperbarui: [Tanggal dan Waktu]

━━━━━━━━━━━━━━━━━━━━━━

☀️ PRAKIRAAN HARI INI

🌞 SIANG
• Kondisi Cuaca: [Deskripsi]
• Suhu: [Suhu]°
• Kelembapan Udara: [Kelembapan]
• Indeks UV: [Indeks UV]
• Angin: [Arah dan Kecepatan]
• Matahari Terbit: [Waktu]
• Matahari Terbenam: [Waktu]

Saran Aktivitas:
[Rekomendasi berdasarkan kondisi cuaca]

🌙 MALAM
[Informasi untuk malam hari]

━━━━━━━━━━━━━━━━━━━━━━

🌅 PRAKIRAAN BESOK

[Informasi untuk besok siang dan malam]
```

## Customisasi

Script ini dapat disesuaikan untuk kebutuhan khusus:

- Ubah lokasi dengan mengganti URL Weather.com
- Tambahkan informasi cuaca tambahan dengan memodifikasi fungsi `parseWeatherBlock()`
- Sesuaikan format pesan di fungsi `getWeather()`
- Ubah frekuensi pengiriman dengan memodifikasi trigger di `createTrigger()`

## Troubleshooting

Jika script tidak berfungsi sebagaimana mestinya:

1. Periksa log eksekusi di Google Apps Script untuk error
2. Verifikasi bahwa struktur HTML di Weather.com tidak berubah
3. Pastikan API key dan URL WhatsApp Gateway masih valid
4. Jalankan `runOnce()` untuk pengujian manual dan melihat log

## Lisensi

MIT License

## Kontributor

- Andri (andri@zonahelm.com)

## Support

Untuk pertanyaan atau dukungan, silakan hubungi andri@zonahelm.com
