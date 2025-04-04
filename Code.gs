function getWeather() {
  const url = 'https://weather.com/id-ID/weather/tenday/l/37481c74ed6cf5f8fbfa0d34209696457628b602dda8140c8f58d68062c8a99d';
  
  // Fetching the webpage
  const response = UrlFetchApp.fetch(url);
  const content = response.getContentText();
  
  // Logging untuk debugging
  Logger.log("Berhasil mengambil HTML dengan panjang: " + content.length + " karakter");
  
  // Parsing the response to extract weather data
  const weatherData = extractWeatherData(content);
  
  // Generate date and time dengan format Indonesia
  const now = new Date();
  const formattedDate = Utilities.formatDate(now, Session.getScriptTimeZone(), "yyyy-MM-dd HH:mm:ss");
  
  // Membuat format bahasa Indonesia untuk hari dan bulan
  const hariIndonesia = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jum\'at', 'Sabtu'];
  const bulanIndonesia = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
  
  const hari = hariIndonesia[now.getDay()];
  const tanggal = now.getDate();
  const bulan = bulanIndonesia[now.getMonth()];
  const tahun = now.getFullYear();
  const jam = String(now.getHours()).padStart(2, '0');
  const menit = String(now.getMinutes()).padStart(2, '0');
  const detik = String(now.getSeconds()).padStart(2, '0');
  
  const emailDate = `${hari}, ${tanggal} ${bulan} ${tahun} Jam ${jam}.${menit}.${detik} WIB`;

  // Prepare message content with emoji/icons - lebih informatif
  let messageContent = `🌤️ *INFORMASI CUACA TERKINI*\n`;
  messageContent += `📍 *Wilayah Pesantren Kota Kediri dan Sekitarnya*\n`;
  messageContent += `🕒 *Diperbarui:* ${emailDate}\n\n`;
  messageContent += `━━━━━━━━━━━━━━━━━━━━━━\n\n`;
  
  // Fungsi untuk mendapatkan tanggal esok dalam format Indonesia
  function getTomorrowIndonesiaDate() {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const hariIndonesia = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jum\'at', 'Sabtu'];
    const bulanIndonesia = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    
    const hari = hariIndonesia[tomorrow.getDay()];
    const tanggal = tomorrow.getDate();
    const bulan = bulanIndonesia[tomorrow.getMonth()];
    const tahun = tomorrow.getFullYear();
    
    return `${hari}, ${tanggal} ${bulan} ${tahun}`;
  }
  
  const tomorrowDate = getTomorrowIndonesiaDate();
  
  // Log data untuk debugging
  Logger.log("Data yang diperoleh: " + JSON.stringify(weatherData));
  
  // Identifikasi data berdasarkan hari dan waktu
  const todaySiang = weatherData.find(entry => 
    entry.day.toLowerCase().includes("jum") && 
    entry.timeOfDay && 
    entry.timeOfDay.toLowerCase().includes("siang"));
  
  const todayMalam = weatherData.find(entry => 
    entry.day.toLowerCase().includes("jum") && 
    entry.timeOfDay && 
    entry.timeOfDay.toLowerCase().includes("malam"));
  
  const tomorrowSiang = weatherData.find(entry => 
    entry.day.toLowerCase().includes("sab") && 
    entry.timeOfDay && 
    entry.timeOfDay.toLowerCase().includes("siang"));
  
  const tomorrowMalam = weatherData.find(entry => 
    entry.day.toLowerCase().includes("sab") && 
    entry.timeOfDay && 
    entry.timeOfDay.toLowerCase().includes("malam"));
  
  Logger.log("Hari ini siang: " + JSON.stringify(todaySiang));
  Logger.log("Hari ini malam: " + JSON.stringify(todayMalam));
  Logger.log("Besok siang: " + JSON.stringify(tomorrowSiang));
  Logger.log("Besok malam: " + JSON.stringify(tomorrowMalam));
  
  // Tampilkan data untuk hari ini (siang dan malam)
  messageContent += `☀️ *PRAKIRAAN HARI INI*\n\n`;
  
  // Tampilkan data untuk siang hari ini
  if (todaySiang) {
    messageContent += `🌞 *SIANG*\n`;
    messageContent += `• *Kondisi Cuaca:* ${todaySiang.description}\n`;
    messageContent += `• *Suhu:* ${todaySiang.temperature}°\n`;
    
    if (todaySiang.humidity) {
      messageContent += `• *Kelembapan Udara:* ${todaySiang.humidity}\n`;
    }
    
    if (todaySiang.uvIndex) {
      messageContent += `• *Indeks UV:* ${todaySiang.uvIndex}\n`;
    }
    
    if (todaySiang.windDirection) {
      messageContent += `• *Angin:* ${todaySiang.windDirection} ${todaySiang.windSpeed || ''}\n`;
    }
    
    if (todaySiang.sunrise) {
      messageContent += `• *Matahari Terbit:* ${todaySiang.sunrise}\n`;
    }
    
    if (todaySiang.sunset) {
      messageContent += `• *Matahari Terbenam:* ${todaySiang.sunset}\n`;
    }
    
    // Saran aktivitas untuk siang
    messageContent += `\n*Saran Aktivitas:*\n`;
    if (todaySiang.description.toLowerCase().includes("hujan") || todaySiang.description.toLowerCase().includes("badai")) {
      messageContent += `🌧️ Bawalah payung atau jas hujan untuk aktivitas di luar ruangan.\n`;
    } else if (todaySiang.description.toLowerCase().includes("cerah")) {
      messageContent += `😎 Cuaca bagus untuk aktivitas luar ruangan, gunakan pelindung sinar matahari jika diperlukan.\n`;
    } else if (todaySiang.description.toLowerCase().includes("berawan")) {
      messageContent += `☁️ Cuaca cukup nyaman untuk beraktivitas di luar ruangan.\n`;
    } else {
      messageContent += `🌤️ Siapkan diri Anda untuk cuaca yang bervariasi. Tetap waspada terhadap perubahan cuaca mendadak.\n`;
    }
    
    messageContent += `\n`;
  }
  
  // Tampilkan data untuk malam hari ini
  if (todayMalam) {
    messageContent += `🌙 *MALAM*\n`;
    messageContent += `• *Kondisi Cuaca:* ${todayMalam.description}\n`;
    messageContent += `• *Suhu:* ${todayMalam.temperature}°\n`;
    
    if (todayMalam.humidity) {
      messageContent += `• *Kelembapan Udara:* ${todayMalam.humidity}\n`;
    }
    
    if (todayMalam.uvIndex) {
      messageContent += `• *Indeks UV:* ${todayMalam.uvIndex}\n`;
    }
    
    if (todayMalam.windDirection) {
      messageContent += `• *Angin:* ${todayMalam.windDirection} ${todayMalam.windSpeed || ''}\n`;
    }
    
    // Informasi bulan
    let hasAstroInfo = false;
    if (todayMalam.moonrise || todayMalam.moonPhase || todayMalam.moonset) {
      messageContent += `\n*Informasi Astronomi:*\n`;
      hasAstroInfo = true;
      
      if (todayMalam.moonrise) {
        messageContent += `• *Bulan Terbit:* ${todayMalam.moonrise}\n`;
      }
      
      if (todayMalam.moonPhase) {
        messageContent += `• *Fase Bulan:* ${todayMalam.moonPhase}\n`;
      }
      
      if (todayMalam.moonset) {
        messageContent += `• *Bulan Terbenam:* ${todayMalam.moonset}\n`;
      }
    }
    
    if (!hasAstroInfo) {
      messageContent += `\n`;
    }
    
    // Saran aktivitas untuk malam
    messageContent += `\n*Saran Aktivitas:*\n`;
    if (todayMalam.description.toLowerCase().includes("hujan") || todayMalam.description.toLowerCase().includes("badai")) {
      messageContent += `🌧️ Hindari perjalanan tidak penting di malam hari. Jika harus keluar, hati-hati di jalan karena visibilitas mungkin berkurang.\n`;
    } else if (todayMalam.description.toLowerCase().includes("cerah")) {
      messageContent += `✨ Malam yang bagus untuk melihat bintang atau bulan.\n`;
    } else {
      messageContent += `🌙 Pastikan membawa penerangan jika bepergian malam hari.\n`;
    }
  }
  
  messageContent += `\n━━━━━━━━━━━━━━━━━━━━━━\n\n`;
  
  // Tampilkan data untuk besok (siang dan malam)
  messageContent += `🌅 *PRAKIRAAN BESOK (${tomorrowDate})*\n\n`;
  
  // Tampilkan data untuk siang besok
  if (tomorrowSiang) {
    messageContent += `🌞 *SIANG*\n`;
    messageContent += `• *Kondisi Cuaca:* ${tomorrowSiang.description}\n`;
    messageContent += `• *Suhu:* ${tomorrowSiang.temperature}°\n`;
    
    if (tomorrowSiang.humidity) {
      messageContent += `• *Kelembapan Udara:* ${tomorrowSiang.humidity}\n`;
    }
    
    if (tomorrowSiang.uvIndex) {
      messageContent += `• *Indeks UV:* ${tomorrowSiang.uvIndex}\n`;
    }
    
    if (tomorrowSiang.windDirection) {
      messageContent += `• *Angin:* ${tomorrowSiang.windDirection} ${tomorrowSiang.windSpeed || ''}\n`;
    }
    
    if (tomorrowSiang.sunrise) {
      messageContent += `• *Matahari Terbit:* ${tomorrowSiang.sunrise}\n`;
    }
    
    if (tomorrowSiang.sunset) {
      messageContent += `• *Matahari Terbenam:* ${tomorrowSiang.sunset}\n`;
    }
    
    // Saran aktivitas untuk siang besok
    messageContent += `\n*Saran Aktivitas:*\n`;
    if (tomorrowSiang.description.toLowerCase().includes("hujan") || tomorrowSiang.description.toLowerCase().includes("badai")) {
      messageContent += `🌧️ Siapkan payung atau jas hujan untuk aktivitas di luar ruangan besok.\n`;
    } else if (tomorrowSiang.description.toLowerCase().includes("cerah")) {
      messageContent += `😎 Cuaca diprediksi bagus untuk aktivitas luar ruangan, gunakan pelindung sinar matahari jika diperlukan.\n`;
    } else if (tomorrowSiang.description.toLowerCase().includes("berawan")) {
      messageContent += `☁️ Cuaca diprediksi cukup nyaman untuk beraktivitas di luar ruangan.\n`;
    } else {
      messageContent += `🌤️ Siapkan diri Anda untuk cuaca yang bervariasi besok. Tetap waspada terhadap perubahan cuaca mendadak.\n`;
    }
    
    messageContent += `\n`;
  }
  
  // Tampilkan data untuk malam besok
  if (tomorrowMalam) {
    messageContent += `🌙 *MALAM*\n`;
    messageContent += `• *Kondisi Cuaca:* ${tomorrowMalam.description}\n`;
    messageContent += `• *Suhu:* ${tomorrowMalam.temperature}°\n`;
    
    if (tomorrowMalam.humidity) {
      messageContent += `• *Kelembapan Udara:* ${tomorrowMalam.humidity}\n`;
    }
    
    if (tomorrowMalam.uvIndex) {
      messageContent += `• *Indeks UV:* ${tomorrowMalam.uvIndex}\n`;
    }
    
    if (tomorrowMalam.windDirection) {
      messageContent += `• *Angin:* ${tomorrowMalam.windDirection} ${tomorrowMalam.windSpeed || ''}\n`;
    }
    
    // Informasi bulan
    let hasAstroInfo = false;
    if (tomorrowMalam.moonrise || tomorrowMalam.moonPhase || tomorrowMalam.moonset) {
      messageContent += `\n*Informasi Astronomi:*\n`;
      hasAstroInfo = true;
      
      if (tomorrowMalam.moonrise) {
        messageContent += `• *Bulan Terbit:* ${tomorrowMalam.moonrise}\n`;
      }
      
      if (tomorrowMalam.moonPhase) {
        messageContent += `• *Fase Bulan:* ${tomorrowMalam.moonPhase}\n`;
      }
      
      if (tomorrowMalam.moonset) {
        messageContent += `• *Bulan Terbenam:* ${tomorrowMalam.moonset}\n`;
      }
    }
    
    if (!hasAstroInfo) {
      messageContent += `\n`;
    }
    
    // Saran aktivitas untuk malam besok
    messageContent += `\n*Saran Aktivitas:*\n`;
    if (tomorrowMalam.description.toLowerCase().includes("hujan") || tomorrowMalam.description.toLowerCase().includes("badai")) {
      messageContent += `🌧️ Hindari perjalanan tidak penting di malam hari besok. Jika harus keluar, hati-hati di jalan karena visibilitas mungkin berkurang.\n`;
    } else if (tomorrowMalam.description.toLowerCase().includes("cerah")) {
      messageContent += `✨ Malam besok diprediksi bagus untuk melihat bintang atau bulan.\n`;
    } else {
      messageContent += `🌙 Pastikan membawa penerangan jika bepergian malam hari besok.\n`;
    }
  }
  
  messageContent += `\n━━━━━━━━━━━━━━━━━━━━━━\n\n`;
  
  // Tambahkan sumber informasi di akhir pesan
  messageContent += `_Informasi ini disiapkan khusus untuk warga Pesantren Kota Kediri dan sekitarnya. Semoga bermanfaat untuk perencanaan aktivitas Anda._`;

  // Subject email yang mencakup tanggal dan jam
  const recipientEmail = "<email@kamu.com"; // Ubah dengan email tujuan
  const emailSubject = `Cuaca Wilayah Pesantren Kediri - ${formattedDate}`;
  const emailBody = messageContent;

  // Mengirim email
  MailApp.sendEmail({
    to: recipientEmail,
    subject: emailSubject,
    body: emailBody,
    name: "Weather ID", // Nama pengirim
  });
  
  // Mengirim pesan ke WhatsApp Gateway
  sendToWhatsAppGateway(messageContent);
  
  Logger.log("Email dan pesan WhatsApp telah dikirim.");
}

// Fungsi untuk mengekstrak data cuaca menggunakan RegEx
function extractWeatherData(content) {
  const result = [];
  
  try {
    // Cari blok data untuk hari ini (Siang)
    const todaySiangContent = extractDaypartContent(content, "Jum", "Siang");
    if (todaySiangContent) {
      Logger.log("Berhasil mendapatkan blok data untuk Jum Siang");
      const todaySiang = parseWeatherBlock(todaySiangContent, "Jum", "Siang");
      if (todaySiang) {
        result.push(todaySiang);
      }
    } else {
      Logger.log("Tidak menemukan blok data untuk Jum Siang");
    }
    
    // Cari blok data untuk hari ini (Malam)
    const todayMalamContent = extractDaypartContent(content, "Jum", "Malam");
    if (todayMalamContent) {
      Logger.log("Berhasil mendapatkan blok data untuk Jum Malam");
      const todayMalam = parseWeatherBlock(todayMalamContent, "Jum", "Malam");
      if (todayMalam) {
        result.push(todayMalam);
      }
    } else {
      Logger.log("Tidak menemukan blok data untuk Jum Malam");
    }
    
    // Cari blok data untuk besok (Siang)
    const tomorrowSiangContent = extractDaypartContent(content, "Sab", "Siang");
    if (tomorrowSiangContent) {
      Logger.log("Berhasil mendapatkan blok data untuk Sab Siang");
      const tomorrowSiang = parseWeatherBlock(tomorrowSiangContent, "Sab", "Siang");
      if (tomorrowSiang) {
        result.push(tomorrowSiang);
      }
    } else {
      Logger.log("Tidak menemukan blok data untuk Sab Siang");
    }
    
    // Cari blok data untuk besok (Malam)
    const tomorrowMalamContent = extractDaypartContent(content, "Sab", "Malam");
    if (tomorrowMalamContent) {
      Logger.log("Berhasil mendapatkan blok data untuk Sab Malam");
      const tomorrowMalam = parseWeatherBlock(tomorrowMalamContent, "Sab", "Malam");
      if (tomorrowMalam) {
        result.push(tomorrowMalam);
      }
    } else {
      Logger.log("Tidak menemukan blok data untuk Sab Malam");
    }
  } catch (error) {
    Logger.log("Error saat mengekstrak data cuaca: " + error.message);
  }
  
  return result;
}

// Fungsi untuk mendapatkan blok konten untuk hari dan waktu tertentu
function extractDaypartContent(content, day, timeOfDay) {
  try {
    const regex = new RegExp(`<span class="DailyContent--daypartDate--[^"]*">${day}[^<]*<\\/span> \\| ${timeOfDay}[\\s\\S]*?<\\/div><\\/div><\\/div><\\/div>`, "i");
    const matches = content.match(regex);
    return matches ? matches[0] : null;
  } catch (error) {
    Logger.log(`Error saat mengekstrak blok konten untuk ${day} ${timeOfDay}: ${error.message}`);
    return null;
  }
}

// Fungsi untuk mengekstrak informasi dari blok cuaca
function parseWeatherBlock(blockContent, day, timeOfDay) {
  try {
    // 1. Suhu
    const tempRegex = /<span data-testid="TemperatureValue" class="DailyContent--temp--[^"]*"[^>]*>([^<°]*)/i;
    const tempMatch = blockContent.match(tempRegex);
    const temperature = tempMatch ? tempMatch[1].trim() : "";
    
    // 2. Deskripsi cuaca
    const descRegex = /<p data-testid="wxPhrase" class="DailyContent--narrative--[^"]*">([^<]*)<\/p>/i;
    const descMatch = blockContent.match(descRegex);
    const description = descMatch ? descMatch[1].trim() : "";
    
    // 3. Arah dan kecepatan angin
    const windRegex = /<span data-testid="Wind" class="Wind--windWrapper--[^"]*[^>]*><span>([^<]*)<\/span><span>([^<]*)<\/span> <span>([^<]*)<\/span>/i;
    const windMatch = blockContent.match(windRegex);
    const windDirection = windMatch ? windMatch[1].trim() : "";
    const windSpeed = windMatch ? `${windMatch[2].trim()} ${windMatch[3].trim()}` : "";
    
    // 4. Kemungkinan hujan
    const precipRegex = /<span data-testid="PercentageValue" class="DailyContent--value--[^"]*">([^<]*)<\/span>/i;
    const precipMatch = blockContent.match(precipRegex);
    const precipitation = precipMatch ? precipMatch[1].trim() : "";
    
    // Untuk blok informasi tambahan
    let humidity = "";
    let uvIndex = "";
    let sunrise = "";
    let sunset = "";
    let moonrise = "";
    let moonPhase = "";
    let moonset = "";
    
    // 5. Kelembapan
    const humidityRegex = /<span data-testid="PercentageValue" class="DetailsTable--value--[^"]*">([^<]*)<\/span>/i;
    const humidityMatch = blockContent.match(humidityRegex);
    if (humidityMatch) {
      humidity = humidityMatch[1].trim();
    }
    
    // 6. Indeks UV
    const uvRegex = /<span data-testid="UVIndexValue" class="DetailsTable--value--[^"]*">([^<]*)<\/span>/i;
    const uvMatch = blockContent.match(uvRegex);
    if (uvMatch) {
      uvIndex = uvMatch[1].trim();
    }
    
    if (timeOfDay === "Siang") {
      // 7. Sunrise (untuk siang)
      const sunriseRegex = /<span data-testid="SunriseTime" class="DetailsTable--value--[^"]*">([^<]*)<\/span>/i;
      const sunriseMatch = blockContent.match(sunriseRegex);
      if (sunriseMatch) {
        sunrise = sunriseMatch[1].trim();
      }
      
      // 8. Sunset (untuk siang)
      const sunsetRegex = /<span data-testid="SunsetTime" class="DetailsTable--value--[^"]*">([^<]*)<\/span>/i;
      const sunsetMatch = blockContent.match(sunsetRegex);
      if (sunsetMatch) {
        sunset = sunsetMatch[1].trim();
      }
    } else {
      // 9. Moonrise (untuk malam)
      const moonriseRegex = /<span data-testid="MoonriseTime" class="DetailsTable--value--[^"]*">([^<]*)<\/span>/i;
      const moonriseMatch = blockContent.match(moonriseRegex);
      if (moonriseMatch) {
        moonrise = moonriseMatch[1].trim();
      }
      
      // 10. Moon phase (untuk malam)
      const moonPhaseRegex = /<span data-testid="moonPhase" class="DetailsTable--moonPhrase--[^"]*">([^<]*)<\/span>/i;
      const moonPhaseMatch = blockContent.match(moonPhaseRegex);
      if (moonPhaseMatch) {
        moonPhase = moonPhaseMatch[1].trim();
      }
      
      // 11. Moonset (untuk malam)
      const moonsetRegex = /<span data-testid="MoonsetTime" class="DetailsTable--value--[^"]*">([^<]*)<\/span>/i;
      const moonsetMatch = blockContent.match(moonsetRegex);
      if (moonsetMatch) {
        moonset = moonsetMatch[1].trim();
      }
    }
    
    return {
      day: day,
      timeOfDay: timeOfDay,
      temperature: temperature,
      description: description,
      precipitation: precipitation,
      windDirection: windDirection,
      windSpeed: windSpeed,
      humidity: humidity,
      uvIndex: uvIndex,
      sunrise: sunrise,
      sunset: sunset,
      moonrise: moonrise,
      moonPhase: moonPhase,
      moonset: moonset
    };
  } catch (error) {
    Logger.log(`Error saat mengekstrak data dari blok cuaca untuk ${day} ${timeOfDay}: ${error.message}`);
    return null;
  }
}

// Fungsi untuk menghapus tag HTML yang tidak diinginkan
function cleanText(input) {
  // Menghapus semua tag HTML seperti <span>, <div>, dll.
  return input.replace(/<\/?[^>]+(>|$)/g, '').replace(/&deg;/g, '°');
}

// Fungsi untuk mengirim pesan ke WhatsApp Gateway menggunakan REST API
function sendToWhatsAppGateway(message) {
  const url = 'https://mpedia-whatsapp/send-message';
  const api_key = '<apikey>';
  const sender = '<sender>'; // Nomor pengirim
  const number = '<nomerTujuan>'; // Nomor tujuan

  const payload = {
    api_key: api_key,
    sender: sender,
    number: number,
    message: message
  };
  
  const options = {
    method: 'POST',
    contentType: 'application/json',
    payload: JSON.stringify(payload)
  };
  
  try {
    const response = UrlFetchApp.fetch(url, options);
    Logger.log("Pesan berhasil dikirim ke WhatsApp Gateway.");
  } catch (error) {
    Logger.log(`Error mengirim pesan ke WhatsApp Gateway: ${error}`);
  }
}

// Fungsi untuk membuat trigger otomatis berjalan setiap 6 jam
function createTrigger() {
  // Hapus semua trigger lama terlebih dahulu untuk menghindari trigger berlebihan
  deleteTriggers();

  // Membuat trigger yang berjalan setiap 6 jam
  ScriptApp.newTrigger('getWeather')
    .timeBased()
    .everyHours(6) // Set trigger untuk berjalan setiap 6 jam
    .create();
  
  Logger.log("Trigger berhasil dibuat untuk menjalankan setiap 6 jam.");
}

// Fungsi untuk menghapus semua trigger yang sudah ada untuk menghindari duplikasi
function deleteTriggers() {
  const allTriggers = ScriptApp.getProjectTriggers();
  
  // Menghapus setiap trigger yang ada
  allTriggers.forEach(trigger => {
    ScriptApp.deleteTrigger(trigger);
  });
  
  Logger.log("Semua trigger lama berhasil dihapus.");
}

// Fungsi untuk menjalankan sekali untuk testing
function runOnce() {
  try {
    Logger.log("Memulai pengujian getWeather()...");
    getWeather();
    Logger.log("getWeather() berhasil dijalankan.");
  } catch (error) {
    Logger.log("ERROR dalam menjalankan getWeather(): " + error.message);
    Logger.log("Stack trace: " + error.stack);
    
    // Kirim email notifikasi error
    try {
      MailApp.sendEmail({
        to: "andri@zonahelm.com",
        subject: "ERROR - Script Cuaca Weather Grabber",
        body: "Terjadi error dalam menjalankan script cuaca:\n\n" + 
              "Error message: " + error.message + "\n\n" + 
              "Stack trace: " + error.stack + "\n\n" +
              "Silakan periksa log eksekusi script untuk informasi lebih lanjut.",
        name: "Weather ID Error Reporter",
      });
    } catch (emailError) {
      Logger.log("Gagal mengirim email notifikasi error: " + emailError.message);
    }
  }
}
