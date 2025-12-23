/**
 * Telegram Admin Reminder System by Vex
 * ─────────────────────────────────────
 * Categories: INTI, INFOKOM, GK3, DISARDA
 * Features: Auto reminder, admin tagging, warning system, persistent storage
 */

const TelegramBot = require('node-telegram-bot-api');
const cron = require('node-cron');
const fs = require('fs');
const chalk = require('chalk');
const axios = require('axios');
const path = require('path');
const archiver = require("archiver");
const unzipper = require("unzipper");
const ch = require('cheerio');
const yts = require('yt-search');
const ytdl = require('ytdl-core');
const FormData = require('form-data');
const { createCanvas, loadImage } = require('canvas');
const os = require('os');
const fetch = require('node-fetch');
const SPOTIFY_CLIENT_ID = "f235a7370f4442f7a062738fdd310dfa";
const SPOTIFY_CLIENT_SECRET = "0cf4d6c4e1344f45bdd8b3d4a5f3cad5";
const { ImageUploadService } = require('node-upload-images');
const { tiktokDl } = require('./scraper');
const settings = require('./settings');
const allowedKeys = ["ownerId","groupId","exGroupId", "exUserId","dev","vercel"];
const settingsPath = "./settings.js";
const owner = parseInt(settings.owner); // convert string ke number
const dev = settings.dev;
const userState = {};
const token = settings.token;
const {
    loadJsonData,
    saveJsonData,
    checkCooldown,
    setCooldown
} = require('./function');
const koorUsersFile = 'koorUsers.json';
const ram = (os.totalmem() / Math.pow(1024, 3)).toFixed(2) + ' GB';
    const freeRam = (os.freemem() / Math.pow(1024, 3)).toFixed(2) + ' GB';
try {
    koorUsers = JSON.parse(fs.readFileSync(koorUsersFile));
} catch (error) {
    console.error('Error reading koorUsers file:', error);
}
const startImageUrl = 'https://files.catbox.moe/pqx2t3.mp4';
const cekIdImageUrl = 'https://files.catbox.moe/pqx2t3.mp4';
const pagaskaImageUrl = 'https://files.catbox.moe/pqx2t3.mp4';
const koorImageUrl = 'https://files.catbox.moe/pqx2t3.mp4';

function pickRandom(list) {
  return list[Math.floor(Math.random() * list.length)];
}

function getRunDuration() {
  const uptime = process.uptime(); 
  const days = Math.floor(uptime / (3600 * 24));
  const hours = Math.floor((uptime % (3600 * 24)) / 3600);
  const minutes = Math.floor((uptime % 3600) / 60);
  const seconds = Math.floor(uptime % 60);
  return `${days} Hari ${hours} Jam ${minutes} Menit ${seconds} Detik`;
}

// log command
function notifyOwner(commandName, msg) {
    const userId = msg.from.id;
    const username = msg.from.username || msg.from.first_name;
    const chatId = msg.chat.id;
    const now = new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' });

    const logMessage = `<blockquote>💬 Command: /${commandName}
👤 User: @${username}
🆔 ID: ${userId}
🕒 Waktu: ${now}
</blockquote>
    `;
    bot.sendMessage(owner, logMessage, { parse_mode: 'HTML' });
}

  const bot = new TelegramBot(settings.token, { polling: true });
  
    const sendStartMenu = (chatId, messageId, username) => {
    const caption = `Hallo @${username} \n Saya ( PAGASKA ASSISTANT) Saya dibuat untuk membantu anda mengingat PROKER yang ada di Pagaska, Developer ( @whoisvex ) Jika ada kendala bisa menghubungi developer\n\n《 PAGASKA ASSISTANT 🐉
📡run time : ${getRunDuration()}`;

    const options = {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: 'ᴘᴀɢᴀꜱᴋᴀ ᴍᴇɴᴜ', callback_data: 'pagaskamenu' },
                    { text: 'ᴋᴏᴏʀ ᴍᴇɴᴜ', callback_data: 'koormenu' },
                    { text: 'ᴏᴛʜᴇʀ ᴍᴇɴᴜ', callback_data: 'fiturmenu' },
                ],
                [
                    { text: '⿻ ᴏᴡɴᴇʀ ᴍᴇɴᴜ', callback_data: 'ownermenu' }
                ],
                [
                    { text: "ᴄᴏɴᴛᴀᴄᴛ ᴏᴡɴᴇʀ", url: "https://t.me/whoisvex" }
                ]
            ]
        }
    };

    bot.editMessageMedia(
        {
            type: 'video',
            media: startImageUrl,
            caption: caption
        },
        { chat_id: chatId, message_id: messageId, ...options }
    );
};
    
const sendPagaskaMenu = (chatId, messageId, username) => {
    const caption = `Hi @${username} Ini adalah Pagaska Menu:\n
╭──✧ ᴘᴀɢᴀꜱᴋᴀ ᴍᴇɴᴜ ✧
│ ⪼ /remind <option>
╰────────────⧽

╭──✧ coming soon ✧
│ ⪼ COMING SOON 
╰────────────⧽\n\nDeveloper: @whoisvex`;

    const options = {
        reply_markup: {
            inline_keyboard: [
                [{ text: '<<', callback_data: 'startmenu' }]
            ]
        }
    };

    bot.editMessageMedia(
        {
            type: 'video',
            media: pagaskaImageUrl,
            caption: caption
        },
        { chat_id: chatId, message_id: messageId, ...options }
    );
};

const sendKoorMenu = (chatId, messageId, username) => {
    const caption = `Hi @${username} Ini adalah Koor Menu:\n
╭──✧ ᴋᴏᴏʀ ᴍᴇɴᴜ ✧
│ ⪼ /warning <peringatan anggota>
│ ⪼ /status <status proker>
╰────────────⧽\n\nDeveloper: @whoisvex`;

    const options = {
        reply_markup: {
            inline_keyboard: [
                [{ text: '<<', callback_data: 'startmenu' }]
            ]
        }
    };

    bot.editMessageMedia(
        {
            type: 'video',
            media: koorImageUrl,
            caption: caption
        },
        { chat_id: chatId, message_id: messageId, ...options }
    );
};

const sendFiturMenu = (chatId, messageId, username) => {
    const caption = `Hi @${username} Ini adalah Other Menu:\n
╭──✧ ᴄᴏɴᴠᴇʀᴛ ᴍᴇɴᴜ ✧
│ ⪼ /tourl <reply>
│ ⪼ /ytmp3 <link>
╰────────────⧽

╭──✧ ꜱᴛᴀʟᴋ ᴍᴇɴᴜ ✧
│ ⪼ /stalkgithub <user>
│ ⪼ /stalkyt <username>
│ ⪼ /stalkig <username>
│ ⪼ /stalktiktok <user>
╰────────────⧽

╭──✧ ᴍᴇᴅɪᴀ ᴍᴇɴᴜ ✧
│ ⪼ /pin <teks>
│ ⪼ /brat <teks>
│ ⪼ /cweb <cweb vercel>
│ ⪼ /iqc <ss iphone>
│ ⪼ /fakestory <username> <teks> <url pp>
│ ⪼ /faketweet 
│ ⪼ /faketweet2 
│ ⪼ /emojimix <emoji1> <emoji2> 
│ ⪼ /emojirandom <generate random emojimix>
│ ⪼ /smeme <teks atas> <teks bawah> <url>
│ ⪼ /smeme2 <teks atas> <teks bawah>
│ ⪼ /ssweb <url>
╰────────────⧽

╭──✧ ᴘʟᴀʏ ᴍᴇɴᴜ ✧
│ ⪼ /play <nama lagu>
│ ⪼ /playch <nama lagu>
╰────────────⧽

╭──✧ ɢᴀᴍᴇꜱ ᴍᴇɴᴜ ✧
│ ⪼ /rch <link channel> <emoji,emoji>
│ ⪼ /tebakjkt <tebak nama member>
│ ⪼ /cc <cerdas cermat>
│ ⪼ /akutansi <soal berbasis akutansi>
│ ⪼ /siapakahaku <Game tebak tokoh>
│ ⪼ /baskara <kata-kata hari ini>
╰────────────⧽\n\nDeveloper: @whoisvex`;
    const options = {
        reply_markup: {
            inline_keyboard: [
                [{ text: '<<', callback_data: 'startmenu' }]
            ]
        }
    };

    bot.editMessageMedia(
        {
            type: 'video',
            media: koorImageUrl,
            caption: caption
        },
        { chat_id: chatId, message_id: messageId, ...options }
    );
};

const sendOwnerMenu = (chatId, messageId, username) => {
    const caption = `Hi @${username} Ini adalah Owner Menu:\n
╭──✧ ᴏᴡɴᴇʀ ᴍᴇɴᴜ ✧
│ ⪼ /bcall
│ ⪼ /backup
│ ⪼ /setting
│ ⪼ /bc
│ ⪼ /react
│ ⪼ /sendmsg
│ ⪼ /restart
│ ⪼ /addkoor <id>
│ ⪼ /listuser
╰────────────⧽\n\nDeveloper: @whoisvex`;
    const options = {
        reply_markup: {
            inline_keyboard: [
                [{ text: '<<', callback_data: 'startmenu' }]
            ]
        }
    };

    bot.editMessageMedia(
        {
            type: 'video',
            media: koorImageUrl,
            caption: caption
        },
        { chat_id: chatId, message_id: messageId, ...options }
    );
};

// ╔════════════════════════════════════════════╗
// ║         FUNCTION PLAY CH.                                                                           ║
// ╚════════════════════════════════════════════╝

async function getSpotifyToken() {
  try {
    const res = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Authorization": "Basic " + 
          Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString("base64"),
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: "grant_type=client_credentials",
    });
    
    if (!res.ok) {
      console.error("Token request failed:", res.status, res.statusText);
      return null;
    }
    
    const data = await res.json();
    console.log("Token obtained successfully");
    return data.access_token;
  } catch (error) {
    console.error("getSpotifyToken error:", error.message);
    return null;
  }
}

async function searchSpotify(query, token) {
  try {
    const res = await fetch(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=1`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    
    const data = await res.json();
    
    console.log("Spotify API Response:", JSON.stringify(data, null, 2));
    
    if (!data.tracks || !data.tracks.items || data.tracks.items.length === 0) {
      console.log("No tracks found for query:", query);
      return null;
    }
    
    return data.tracks.items[0];
  } catch (error) {
    console.error("Spotify search error:", error.message);
    return null;
  }
}

async function isUserAdminInChannel(bot, userId, chatId) {
  try {
    const chatMember = await bot.getChatMember(chatId, userId);
    return chatMember.status === 'administrator' || chatMember.status === 'creator';
  } catch (err) {
    console.error("Error checking admin status:", err.message);
    return false;
  }
}

// ╔════════════════════════════════════════════╗
// ║         COMMAND HANDLER.                                                                        ║
// ╚════════════════════════════════════════════╝

bot.onText(/\/play (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const query = match[1];

  try {
    await bot.sendMessage(chatId, "⏳ Lagi nyari lagu di Spotify, tunggu bentar...");

    const token = await getSpotifyToken();
    if (!token) {
      return bot.sendMessage(chatId, "❌ Gagal mendapatkan token Spotify. Coba lagi nanti.");
    }

    const track = await searchSpotify(query, token);

    if (!track) {
      return bot.sendMessage(chatId, "❌ Lagu tidak ditemukan di Spotify!");
    }

    const title = track.name;
    const artist = track.artists.map((a) => a.name).join(", ");
    const cover = track.album.images[0]?.url;
    const duration = `${Math.floor(track.duration_ms / 60000)}:${String(
      Math.floor((track.duration_ms % 60000) / 1000)
    ).padStart(2, "0")}`;
    const spotifyUrl = track.external_urls.spotify;

    const caption = `
🎵 <b>${title}</b>
👤 <b>${artist}</b>
🕒 Durasi: <b>${duration}</b>
`;

    try {
      if (cover && cover.startsWith('http')) {
        await bot.sendPhoto(chatId, cover, {
          caption: caption,
          parse_mode: "HTML",
        });
      } else {
        await bot.sendMessage(chatId, caption, { parse_mode: "HTML" });
      }
    } catch (photoErr) {
      console.error("Photo Error:", photoErr.message);
      await bot.sendMessage(chatId, caption, { parse_mode: "HTML" });
    }

    try {
      const searchQuery = `${title} ${artist}`;
      const apiUrl = `https://api.ootaizumi.web.id/downloader/spotifyplay?query=${encodeURIComponent(searchQuery)}`;
      
      console.log("Requesting API:", apiUrl);
      const response = await axios.get(apiUrl);
      
      let downloadUrl;
      const data = response.data;

      if (data.result?.download) {
        downloadUrl = data.result.download;
      } else if (data.success?.result?.downloadUrl) {
        downloadUrl = data.success.result.downloadUrl;
      } else if (data.downloadUrl) {
        downloadUrl = data.downloadUrl;
      } else if (data.download) {
        downloadUrl = data.download;
      } else if (data.result?.url) {
        downloadUrl = data.result.url;
      } else if (data.url) {
        downloadUrl = data.url;
      } else if (data.data?.url) {
        downloadUrl = data.data.url;
      }

      console.log("Download URL ditemukan:", downloadUrl ? "Ya" : "Tidak");

      if (downloadUrl && downloadUrl.startsWith('http')) {
        try {
          await bot.sendAudio(chatId, downloadUrl, {
            title: title.substring(0, 64),
            performer: artist.substring(0, 64),
            caption: `🎵 ${title}\n👤 ${artist}`,
            parse_mode: "HTML"
          });
        } catch (audioErr) {
          console.error("Audio send error:", audioErr.message);
          await bot.sendDocument(chatId, downloadUrl, {
            caption: `🎵 ${title}\n👤 ${artist}\n\n⚠️ Dikirim sebagai dokumen karena format audio tidak didukung`,
            parse_mode: "HTML"
          });
        }
      } else {
        await bot.sendMessage(
          chatId,
          `ℹ️ Audio tidak tersedia untuk didownload.\n🔗 Putar di Spotify: ${spotifyUrl}`,
          { parse_mode: "HTML" }
        );
      }
    } catch (downloadErr) {
      console.error("Download Error:", downloadErr.message);
      
      await bot.sendMessage(
        chatId,
        `ℹ️ Gagal mendownload audio dari API.\n🔗 Putar di Spotify: ${spotifyUrl}`,
        { parse_mode: "HTML" }
      );
    }

  } catch (err) {
    console.error("Play Error:", err.message);
    console.error("Error Stack:", err.stack);
    
    let errorMessage = "❌ Terjadi kesalahan";
    if (err.message.includes("Cannot read properties of undefined")) {
      errorMessage = "❌ Gagal memproses data dari Spotify. Coba lagu lain atau coba lagi nanti.";
    }
    
    bot.sendMessage(chatId, errorMessage);
  }
});

bot.onText(/\/playch (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  const sender = msg.from.username || msg.from.first_name;
  const input = match[1];
  
  const parts = input.split(',');
  if (parts.length < 2) {
    return bot.sendMessage(chatId, "❌ Format salah! Gunakan: /playch namalagu,idchannel\nContoh: /playch Bohemian Rhapsody,@musikchannel");
  }
  
  const query = parts[0].trim();
  let targetChatId = parts.slice(1).join(',').trim();
  
  if (targetChatId.startsWith('@')) {
    targetChatId = targetChatId.substring(1);
  }

  try {
    const isAdmin = await isUserAdminInChannel(bot, userId, targetChatId);
    if (!isAdmin) {
      return bot.sendMessage(chatId, "❌ Anda harus menjadi admin di channel tersebut untuk menggunakan perintah ini!");
    }

    await bot.sendMessage(chatId, `⏳ Mencari lagu "${query}" dan mengirim ke channel...`);

    const token = await getSpotifyToken();
    if (!token) {
      return bot.sendMessage(chatId, "❌ Gagal mendapatkan token Spotify. Coba lagi nanti.");
    }

    const track = await searchSpotify(query, token);

    if (!track) {
      return bot.sendMessage(chatId, "❌ Lagu tidak ditemukan di Spotify!");
    }

    const title = track.name;
    const artist = track.artists.map((a) => a.name).join(", ");
    const cover = track.album.images[0]?.url;
    const duration = `${Math.floor(track.duration_ms / 60000)}:${String(
      Math.floor((track.duration_ms % 60000) / 1000)
    ).padStart(2, "0")}`;
    const spotifyUrl = track.external_urls.spotify;

    const caption = `
🎵 <b>${title}</b>
👤 <b>${artist}</b>
🕒 Durasi: <b>${duration}</b>
📤 Dikirim oleh: <b>${sender}</b>
`;

    try {
      if (cover && cover.startsWith('http')) {
        await bot.sendPhoto(targetChatId, cover, {
          caption,
          parse_mode: "HTML",
        });
      } else {
        await bot.sendMessage(targetChatId, caption, { parse_mode: "HTML" });
      }
    } catch (photoErr) {
      console.error("Photo Error:", photoErr.message);
      await bot.sendMessage(targetChatId, caption, { parse_mode: "HTML" });
    }

    try {
      const searchQuery = `${title} ${artist}`;
      const api = `https://api.ootaizumi.web.id/downloader/spotifyplay?query=${encodeURIComponent(
        searchQuery
      )}`;
      
      console.log("Requesting API:", api);
      const response = await axios.get(api);
      console.log("API Response:", JSON.stringify(response.data, null, 2));

      let downloadUrl;
      const data = response.data;

      if (data.result && data.result.download) {
        downloadUrl = data.result.download;
      } else if (data.success && data.result && data.result.downloadUrl) {
        downloadUrl = data.result.downloadUrl;
      } else if (data.downloadUrl) {
        downloadUrl = data.downloadUrl;
      } else if (data.download) {
        downloadUrl = data.download;
      } else if (data.result && data.result.url) {
        downloadUrl = data.result.url;
      } else if (data.url) {
        downloadUrl = data.url;
      } else if (data.data && data.data.url) {
        downloadUrl = data.data.url;
      }

      console.log("Download URL:", downloadUrl);
      
      if (downloadUrl && downloadUrl.startsWith('http')) {
        const headResponse = await axios.head(downloadUrl).catch(() => null);
        const contentType = headResponse?.headers['content-type'];
        
        console.log("Content-Type:", contentType);

        if (contentType && contentType.includes('audio')) {
          await bot.sendAudio(targetChatId, downloadUrl, {
            title: title,
            performer: artist,
            caption: `🎵 ${title} - ${artist}\n📤 Dikirim oleh: ${sender}`,
            parse_mode: "HTML"
          });
        } else {
          await bot.sendDocument(targetChatId, downloadUrl, {
            caption: `🎵 ${title} - ${artist}\n📤 Dikirim oleh: ${sender}`,
            parse_mode: "HTML"
          });
        }
      } else {
        await bot.sendMessage(
          targetChatId,
          `ℹ️ Audio tidak tersedia untuk didownload.\n🔗 Putar di Spotify: ${spotifyUrl}\n📤 Dikirim oleh: ${sender}`,
          { parse_mode: "HTML" }
        );
      }
      
      await bot.sendMessage(chatId, `✅ Lagu "${title}" berhasil dikirim ke channel!`);
      
    } catch (downloadErr) {
      console.error("Download Error:", downloadErr.message);
      console.error("Error Details:", downloadErr.response?.data);
      
      await bot.sendMessage(
        targetChatId,
        `ℹ️ Gagal mendownload audio dari API.\n🔗 Putar di Spotify: ${spotifyUrl}\n📤 Dikirim oleh: ${sender}`,
        { parse_mode: "HTML" }
      );
      await bot.sendMessage(chatId, `⚠️ Lagu berhasil dikirim ke channel tetapi gagal mendownload audio.`);
    }

  } catch (err) {
    console.error("PlayCh Error:", err.message);
    console.error("Error Stack:", err.stack);
    
    if (err.message.includes("chat not found")) {
      await bot.sendMessage(chatId, "❌ Channel tidak ditemukan! Pastikan bot sudah ditambahkan ke channel tersebut.");
    } else if (err.message.includes("Forbidden")) {
      await bot.sendMessage(chatId, "❌ Bot tidak memiliki akses ke channel tersebut! Pastikan bot sudah menjadi admin.");
    } else {
      await bot.sendMessage(chatId, `❌ Terjadi kesalahan: ${err.message}`);
    }
  }
});

// ╔════════════════════════════════════════════╗
// ║         STORAGE & DATABASE CONFIG          ║
// ╚════════════════════════════════════════════╝

const DATA_DIR = path.join(__dirname, 'data');
const REMINDERS_FILE = path.join(DATA_DIR, 'reminders.json');

// Buat folder data jika belum ada
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Load reminders dari file
function loadReminders() {
  try {
    if (fs.existsSync(REMINDERS_FILE)) {
      const data = fs.readFileSync(REMINDERS_FILE, 'utf8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('❌ Error loading reminders:', error.message);
  }
  return {};
}

// Save reminders ke file
function saveReminders(data) {
  try {
    fs.writeFileSync(REMINDERS_FILE, JSON.stringify(data, null, 2), 'utf8');
    console.log('💾 Reminders saved to file');
  } catch (error) {
    console.error('❌ Error saving reminders:', error.message);
  }
}

// Load existing reminders dari storage
const reminderStatus = new Map(Object.entries(loadReminders()));

// ╔════════════════════════════════════════════╗
// ║         ADMIN & CATEGORY CONFIG            ║
// ╚════════════════════════════════════════════╝

const ADMIN_CONFIG = {
  INTI: {
    name: 'INTI',
    admins: [123456789, 987654321], // User IDs admin INTI
    emoji: '🔧',
    color: '🔵'
  },
  INFOKOM: {
    name: 'INFOKOM',
    admins: [8193445272, 5895716664, 6613152462], // User IDs admin INFOKOM
    emoji: '💻',
    color: '🟢'
  },
  GK3: {
    name: 'GK3',
    admins: [333333333, 444444444], // User IDs admin GK3
    emoji: '🏗️',
    color: '🟡'
  },
  DISARDA: {
    name: 'DISARDA',
    admins: [555555555, 666666666], // User IDs admin DISARDA
    emoji: '🌾',
    color: '🔴'
  }
};

// Tasks schedule - hari dan jam untuk setiap kategori
const TASKS_SCHEDULE = {
  INTI: {
    day: 1, // Senin (0-6: Minggu-Sabtu)
    time: '09:00',
    title: 'Senin Produktif',
    description: 'Pertemuan rutin tim INTI'
  },
  INFOKOM: {
    day: 2, // Selasa
    time: '07:00',
    title: 'Selasa Nusantara',
    description: 'Kegiatan Rutin INFOKOM'
  },
  GK3: {
    day: 3, // Rabu
    time: '07:00',
    title: 'Rabu Baris-berbaris',
    description: 'Proker Video GK3'
  },
  INFOKOM: {
    day: 4, // Kamis
    time: '07:00',
    title: 'Kamis Jas Merah',
    description: 'Proker Video Sejarah'
  }
};

// ╔════════════════════════════════════════════╗
// ║         HELPER FUNCTIONS                   ║
// ╚════════════════════════════════════════════╝

// Format day name
function getDayName(dayNumber) {
  const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  return days[dayNumber];
}

// Create reminder key
function getReminderKey(category) {
  return `reminder_${category}`;
}

// Convert Map to plain object untuk storage
function reminderToJSON(reminder) {
  return {
    messageId: reminder.messageId,
    chatId: reminder.chatId,
    category: reminder.category,
    timestamp: reminder.timestamp,
    admins: reminder.admins,
    responses: Object.fromEntries(reminder.responses)
  };
}

// Convert plain object back to Map
function jsonToReminder(data) {
  return {
    messageId: data.messageId,
    chatId: data.chatId,
    category: data.category,
    timestamp: data.timestamp,
    admins: data.admins,
    responses: new Map(Object.entries(data.responses))
  };
}

// ╔════════════════════════════════════════════╗
// ║         BUILD REMINDER MESSAGE             ║
// ╚════════════════════════════════════════════╝

function buildReminderText(category) {
  const config = ADMIN_CONFIG[category];
  const task = TASKS_SCHEDULE[category];
  const reminderKey = getReminderKey(category);
  const reminder = reminderStatus.get(reminderKey);

  let responseText = '';
  if (reminder && reminder.responses.size > 0) {
    responseText = `\n\n*✅ Status Admin yang sudah merespon:*\n`;
    reminder.responses.forEach((status, adminId) => {
      responseText += `├─ ID: \`${adminId}\` → ${status}\n`;
    });
  }

  const reminderText = `
${config.color} *REMINDER ${config.name}* ${config.color}
────────────────────────────────

📅 *Hari:* ${getDayName(task.day)}
🕐 *Jam:* ${task.time}
🎯 *Kegiatan:* ${task.title}
📝 *Deskripsi:* ${task.description}

👥 *Admin ${config.name}:*
${config.admins.map(id => `• ID: \`${id}\``).join('\n')}

⚠️ *Perhatian:*
Silakan tekan salah satu tombol di bawah untuk konfirmasi status tugas ini.
${responseText}

${config.emoji} Reminder dikirim ke semua admin ${config.name}
`;

  return reminderText;
}

// ╔════════════════════════════════════════════╗
// ║         SEND REMINDER TO ADMINS            ║
// ╚════════════════════════════════════════════╝

async function sendReminder(category, chatId) {
  const config = ADMIN_CONFIG[category];
  const task = TASKS_SCHEDULE[category];
  
  if (!config || !task) {
    console.log(`❌ Kategori ${category} tidak ditemukan`);
    return;
  }

  // Create inline keyboard untuk konfirmasi
  const keyboard = {
    inline_keyboard: [
      [
        {
          text: '✅ Sudah Dikerjakan',
          callback_data: `task_done_${category}`
        },
        {
          text: '⏳ Belum Dimulai',
          callback_data: `task_pending_${category}`
        }
      ],
      [
        {
          text: '❌ Tidak Bisa Dikerjakan',
          callback_data: `task_failed_${category}`
        }
      ]
    ]
  };

  const reminderText = buildReminderText(category);

  try {
    // Send to group chat
    const msg = await bot.sendMessage(chatId, reminderText, {
      parse_mode: 'Markdown',
      reply_markup: keyboard
    }).catch(err => {
      throw new Error(`Failed to send message: ${err.message}`);
    });

    // Store reminder info
    const reminderKey = getReminderKey(category);
    reminderStatus.set(reminderKey, {
      messageId: msg.message_id,
      chatId: chatId,
      category: category,
      timestamp: Date.now(),
      admins: config.admins,
      responses: new Map()
    });

    // Save to file
    const allReminders = {};
    reminderStatus.forEach((value, key) => {
      allReminders[key] = reminderToJSON(value);
    });
    saveReminders(allReminders);

    console.log(`✅ Reminder ${category} terkirim ke chat ${chatId}`);

  } catch (error) {
    console.error(`❌ Error mengirim reminder ${category}:`, error.message);
  }
}

// ╔════════════════════════════════════════════╗
// ║         WARNING SYSTEM                     ║
// ╚════════════════════════════════════════════╝

async function sendWarning(category, chatId) {
  const config = ADMIN_CONFIG[category];
  const task = TASKS_SCHEDULE[category];

  if (!config || !task) return;

  const reminderKey = getReminderKey(category);
  const reminder = reminderStatus.get(reminderKey);
  
  if (!reminder) {
    console.log(`⚠️ Tidak ada reminder untuk ${category}`);
    return;
  }

  // Get admins yang belum merespon
  const respondedAdmins = Array.from(reminder.responses.keys());
  const nonRespondedAdmins = config.admins.filter(
    id => !respondedAdmins.includes(String(id))
  );

  if (nonRespondedAdmins.length === 0) {
    console.log(`✅ Semua admin ${category} sudah merespon`);
    return;
  }

  const warningText = `
⚠️ *WARNING - ${config.name}* ⚠️
────────────────────

🎯 *Tugas:* ${task.title}
⏰ *Status:* Belum ada respon dari beberapa admin

👥 *Admin yang BELUM merespon:*
${nonRespondedAdmins.map(id => `• \`${id}\` ❌`).join('\n')}

✅ *Admin yang SUDAH merespon:*
${respondedAdmins.map(id => {
  const response = reminder.responses.get(id);
  return `• \`${id}\` - ${response}`;
}).join('\n') || 'Belum ada respon'}

⚡ *URGENT!* Segera konfirmasi status tugas Anda!
`;

  try {
    await bot.sendMessage(chatId, warningText, {
      parse_mode: 'Markdown'
    }).catch(err => {
      throw new Error(`Failed to send warning: ${err.message}`);
    });
    
    console.log(`⚠️ Warning ${category} terkirim - Admin belum merespon: ${nonRespondedAdmins.join(', ')}`);
  } catch (error) {
    console.error(`❌ Error mengirim warning ${category}:`, error.message);
  }
}

// ╔════════════════════════════════════════════╗
// ║         BUTTON CALLBACK HANDLER            ║
// ╚════════════════════════════════════════════╝

bot.on('callback_query', async (query) => {
  const data = query.data;
  const fromId = query.from.id;
  const firstName = query.from.first_name;

  // Pattern: task_done_CATEGORY, task_pending_CATEGORY, task_failed_CATEGORY
  const match = data.match(/^task_(done|pending|failed)_(.+)$/);
  
  if (!match) return;

  const [, status, category] = match;
  const config = ADMIN_CONFIG[category];

  if (!config) {
    bot.answerCallbackQuery(query.id, '❌ Kategori tidak ditemukan', true);
    return;
  }

  // Check apakah user adalah admin kategori ini
  const isAdmin = config.admins.includes(fromId);
  
  if (!isAdmin) {
    bot.answerCallbackQuery(
      query.id,
      '❌ Anda bukan admin kategori ' + category,
      true
    );
    return;
  }

  // Store response
  const reminderKey = getReminderKey(category);
  const reminder = reminderStatus.get(reminderKey);

  if (!reminder) {
    bot.answerCallbackQuery(query.id, '❌ Reminder tidak ditemukan', true);
    return;
  }

  const statusLabel = {
    done: '✅ Sudah Dikerjakan',
    pending: '⏳ Belum Dimulai',
    failed: '❌ Tidak Bisa Dikerjakan'
  };

  reminder.responses.set(String(fromId), statusLabel[status]);

  // Save updated reminder to file
  const allReminders = {};
  reminderStatus.forEach((value, key) => {
    allReminders[key] = reminderToJSON(value);
  });
  saveReminders(allReminders);

  // Response text
  const responseText = {
    done: '✅ Terima kasih! Status tugas: SELESAI',
    pending: '⏳ Terima kasih! Status tugas: PENDING',
    failed: '❌ Terima kasih! Status tugas: GAGAL'
  };

  bot.answerCallbackQuery(query.id, responseText[status]);

  // Edit message untuk show yang respon - JANGAN CLOSE BUTTON
  try {
    const updatedText = buildReminderText(category);
    
    // Keep buttons tetap aktif
    const keyboard = {
      inline_keyboard: [
        [
          {
            text: '✅ Sudah Dikerjakan',
            callback_data: `task_done_${category}`
          },
          {
            text: '⏳ Belum Dimulai',
            callback_data: `task_pending_${category}`
          }
        ],
        [
          {
            text: '❌ Tidak Bisa Dikerjakan',
            callback_data: `task_failed_${category}`
          }
        ]
      ]
    };

    await bot.editMessageText(updatedText, {
      chat_id: query.message.chat.id,
      message_id: query.message.message_id,
      parse_mode: 'Markdown',
      reply_markup: keyboard
    }).catch(err => {
      if (err.message !== 'Bad Request: message is not modified') {
        console.error('Edit message error:', err.message);
      }
    });
  } catch (err) {
    console.error('Error updating message:', err.message);
  }

  console.log(`✔️ Admin ${firstName} (${fromId}) merespons ${category}: ${statusLabel[status]}`);
});

// ╔════════════════════════════════════════════╗
// ║         COMMAND HANDLERS                   ║
// ╚════════════════════════════════════════════╝

// Command: /remind <category> - Test reminder manual
bot.onText(/\/remind\s+(\w+)/i, async (msg, match) => {
  notifyOwner('remind', msg);
  const chatId = msg.chat.id;
  const category = match[1].toUpperCase();

  if (!ADMIN_CONFIG[category]) {
    bot.sendMessage(chatId, `❌ Kategori ${category} tidak ditemukan!\n\nKategori yang tersedia: ${Object.keys(ADMIN_CONFIG).join(', ')}`);
    return;
  }

  await sendReminder(category, chatId);
  bot.sendMessage(chatId, `✅ Reminder ${category} telah dikirim!`);
});

// command /ping
bot.onText(/\/ping/, async (msg) => {
  notifyOwner('ping', msg);
  const chatId = msg.chat.id;
    
  // Runtime bot
  const botuptime = process.uptime();
  const botUptimeStr = `${Math.floor(botuptime / 86400)}d ${Math.floor((botuptime % 86400) / 3600)}h ${Math.floor((botuptime % 3600) / 60)}m ${Math.floor(botuptime % 60)}s`;

  // Runtime VPS
  const vpsUptime = os.uptime();
  const vpsUptimeStr = `${Math.floor(vpsUptime / 86400)}d ${Math.floor((vpsUptime % 86400) / 3600)}h ${Math.floor((vpsUptime % 3600) / 60)}m`;

  const cpuModel = os.cpus()[0].model;
  const cpuCores = os.cpus().length;
  const totalMem = (os.totalmem() / (1024 ** 3)).toFixed(2);
  const freeMem = (os.freemem() / (1024 ** 3)).toFixed(2);

  const msgText = `🏓 𝖯𝗈𝗇𝗀 : ${botUptimeStr}
<blockquote expandable>↬ 𝖴𝗉𝖳𝗂𝗆𝖾 : ${vpsUptimeStr}
↬ 𝖢𝖯𝖴 : ${cpuModel} (${cpuCores} cores)
↬ 𝖱𝖠𝖬 : ${freeMem} / ${totalMem} GB
</blockquote>`;

  bot.sendMessage(chatId, msgText, { 
    parse_mode: "HTML",
    reply_to_message_id: msg.message_id 
  });
});

bot.onText(/\/cek/, async (msg) => {
	const chatId = msg.chat.id;
	
	const cekText = `Bot online, jangan lupa start bot di pv
<blockquote expandable> Pagaska Assistant on
📡run time : ${getRunDuration()}
</blockquote>`;

  bot.sendMessage(chatId, cekText, { 
    parse_mode: "HTML",
    reply_to_message_id: msg.message_id 
  });
});

// command /restart
bot.onText(/^\/restart$/, async (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id.toString();

    if (userId !== owner) {
        bot.sendMessage(chatId, "❌ Kamu bukan Developer");
        return;
    }

  const bars = [
    "⏳ ᴘʀᴏᴄᴇꜱꜱ [░░░░░░░░░░] 0%",
    "⏳ ᴘʀᴏᴄᴇꜱꜱ [█░░░░░░░░░] 10%",
    "⏳ ᴘʀᴏᴄᴇꜱꜱ [██░░░░░░░░] 20%",
    "⏳ ᴘʀᴏᴄᴇꜱꜱ [███░░░░░░░] 30%",
    "⏳ ᴘʀᴏᴄᴇꜱꜱ [████░░░░░░] 40%",
    "⏳ ᴘʀᴏᴄᴇꜱꜱ [█████░░░░░] 50%",
    "⏳ ᴘʀᴏᴄᴇꜱꜱ [██████░░░░] 60%",
    "⏳ ᴘʀᴏᴄᴇꜱꜱ [███████░░░] 70%",
    "⏳ ᴘʀᴏᴄᴇꜱꜱ [████████░░] 80%",
    "⏳ ᴘʀᴏᴄᴇꜱꜱ [█████████░] 90%",
    "✅ ʀᴇꜱᴛᴀʀᴛ ᴄᴏᴍᴘʟᴇᴛᴇ\n[██████████] 100%",
    "👋 ɢᴏᴏᴅ ʙʏᴇ..."
  ];

  try {
    let sent = await bot.sendMessage(chatId, bars[0]);

    for (let i = 1; i < bars.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 500));
      await bot.editMessageText(bars[i], {
        chat_id: chatId,
        message_id: sent.message_id
      });
    }

    await new Promise(resolve => setTimeout(resolve, 5000));
    process.exit(0);
  } catch (e) {
    console.error(e);
    bot.sendMessage(chatId, "❌ Gagal restart bot.");
  }
});

bot.onText(/\/addkoor (\d+)/, (msg, match) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id.toString();
    const newKoorId = match[1].toString();

    // Cek apakah pengirim adalah pemilik bot
    if (msg.from.id !== owner) {
    return bot.sendMessage(
      chatId,
      `❌ Kamu bukan ${dev}!`,
      { parse_mode: "Markdown", reply_to_message_id: msg.message_id }
    );
  }

    try {
        // Baca file koorUsers.json
        let koorUsers = [];
        if (fs.existsSync(koorUsersFile)) {
            koorUsers = JSON.parse(fs.readFileSync(koorUsersFile));
        }

        // Periksa apakah ID sudah ada dalam daftar koor
        if (koorUsers.includes(newKoorId)) {
            bot.sendMessage(chatId, `${newKoorId} Sudah Di Addkoor`);
            return;
        }

        // Tambahkan ID baru ke daftar koor
        koorUsers.push(newKoorId);
        fs.writeFileSync(koorUsersFile, JSON.stringify(koorUsers, null, 2));

        bot.sendMessage(chatId, `Sukses Add ${newKoorId} Menjadi Koor`);
    } catch (error) {
        console.error("Error updating koorUsers file:", error);
        bot.sendMessage(chatId, "Terjadi kesalahan saat memperbarui daftar koor.");
    }
});

function loadKoorUsers() {
    try {
        const data = fs.readFileSync('koorUsers.json', 'utf8');
        return JSON.parse(data);
    } catch (err) {
        return { koor: [] };
    }
}

const koorFile = "koorUsers.json";


// Fungsi untuk menyimpan daftar pengguna premium
const saveKoorUsers = (data) => {
    fs.writeFileSync(koorFile, JSON.stringify(data, null, 2));
};

// Fungsi untuk menghapus user dari daftar premium
const removeKoorUser = (userId) => {
    let koorUsers = loadKoorUsers();
    const index = koorUsers.indexOf(userId);
    if (index !== -1) {
        koorUsers.splice(index, 1);
        saveKoorUsers(koorUsers);
        return true;
    }
    return false;
};

bot.onText(/\/listuser/, (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;
    const admin = owner;

    // Cek apakah yang menjalankan perintah adalah owner
    if (userId.toString() !== admin) {
        return bot.sendMessage(chatId, "Fitur Khusus Owner!");
    }

    // Baca file premiumUsers.json
    fs.readFile('koorUsers.json', 'utf8', (err, data) => {
        if (err) {
            console.error("Error membaca file:", err);
            return bot.sendMessage(chatId, "⚠️ Terjadi kesalahan saat membaca daftar pengguna.");
        }

        let koorUsers;
        try {
            koorUsers = JSON.parse(data);
        } catch (e) {
            return bot.sendMessage(chatId, "⚠️ Format file koorUsers.json tidak valid.");
        }

        // Cek apakah ada pengguna
        if (koorUsers.length === 0) {
            return bot.sendMessage(chatId, "📌 *LIST USER PAGASKA*\n\nTidak ada user.", { parse_mode: "Markdown" });
        }

        // Buat daftar user premium dalam format pesan
        const listMessage = koorUsers
            .map((id, index) => `*${index + 1}.* [${id}](tg://user?id=${id})`)
            .join("\n");

        const message = `📌 *LIST USER PAGASKA*\n\n${listMessage}\n\n🔰 *Total:* ${koorUsers.length} user`;

        bot.sendMessage(chatId, message, { parse_mode: "Markdown" });
    });
});

// 1. Random Baskara (Kata-kata mutiara)
bot.onText(/^\/baskara$/, async (msg) => {
    const chatId = msg.chat.id;
    
    try {
        await bot.sendChatAction(chatId, 'typing');
        
        const response = await axios.get('https://zelapioffciall.koyeb.app/random/baskara', {
            timeout: 10000
        });

        if (response.data && response.data.status && response.data.baskara) {
            const message = `💭 *Random Baskara*\n\n` +
                           `"${response.data.baskara}"\n\n` +
                           `_Creator: ${response.data.creator || 'Unknown'}_`;
            
            bot.sendMessage(chatId, message, {
                parse_mode: 'Markdown',
                reply_to_message_id: msg.message_id
            });
        } else {
            throw new Error('Format response tidak sesuai');
        }
    } catch (error) {
        console.error('Error baskara:', error);
        bot.sendMessage(chatId, 
            `❌ Gagal mengambil kata-kata baskara!\nError: ${error.message}`,
            { reply_to_message_id: msg.message_id }
        );
    }
});

// 2. Membuat Stiker Meme (Smeme)
bot.onText(/^\/smeme(?:\s+([^|]+)\|(.+))?$/, async (msg, match) => {
    const chatId = msg.chat.id;
    const textAtas = match[1] ? match[1].trim() : '';
    const textBawah = match[2] ? match[2].trim() : '';
    
    if (!textAtas || !textBawah) {
        return bot.sendMessage(chatId,
            `🖼️ *Cara Penggunaan Smeme:*\n` +
            `/smeme <text_atas>|<text_bawah>\n\n` +
            `*Contoh:*\n` +
            `/smeme Pagaska|Assistant\n` +
            `/smeme Bot Telegram|Keren Banget`,
            { parse_mode: 'Markdown', reply_to_message_id: msg.message_id }
        );
    }
    
    try {
        await bot.sendChatAction(chatId, 'upload_photo');
        
        // Gunakan background default atau dari URL
        const background = 'https://example.com/default-bg.jpg'; // Ganti dengan URL background default
        
        const response = await axios.get(`https://api.elrayyxml.web.id/api/maker/smeme?text_atas=${encodeURIComponent(textAtas)}&text_bawah=${encodeURIComponent(textBawah)}&background=${encodeURIComponent(background)}`, {
            timeout: 15000,
            responseType: 'arraybuffer'
        });

        if (response.data && response.headers['content-type']?.includes('image')) {
            await bot.sendPhoto(chatId, Buffer.from(response.data), {
                caption: `🖼️ Smeme: "${textAtas}" | "${textBawah}"`,
                reply_to_message_id: msg.message_id
            });
        } else {
            throw new Error('Response bukan gambar');
        }
    } catch (error) {
        console.error('Error smeme:', error);
        bot.sendMessage(chatId, 
            `❌ Gagal membuat smeme!\nError: ${error.message}\n\n` +
            `*Tips:* API ini mungkin membutuhkan parameter background yang valid.`,
            { parse_mode: 'Markdown', reply_to_message_id: msg.message_id }
        );
    }
});

// 3. Screenshot Website (SSWeb)
bot.onText(/^\/ssweb(?:\s+(\S+))?$/, async (msg, match) => {
    const chatId = msg.chat.id;
    const url = match[1];
    
    if (!url) {
        return bot.sendMessage(chatId,
            `🌐 *Cara Penggunaan SSWeb:*\n` +
            `/ssweb <url>\n\n` +
            `*Contoh:*\n` +
            `/ssweb https://www.google.com\n` +
            `/ssweb https://github.com\n\n` +
            `*Parameter default:*\n` +
            `• width: 1280px\n` +
            `• height: 720px\n` +
            `• full_page: true`,
            { parse_mode: 'Markdown', reply_to_message_id: msg.message_id }
        );
    }
    
    // Validasi URL
    try {
        new URL(url);
    } catch {
        return bot.sendMessage(chatId,
            `❌ URL tidak valid!\nPastikan URL dimulai dengan http:// atau https://`,
            { reply_to_message_id: msg.message_id }
        );
    }
    
    try {
        await bot.sendChatAction(chatId, 'upload_photo');
        
        const apiUrl = `https://movanest.zone.id/v2/ssweb?url=${encodeURIComponent(url)}&width=1280&height=720&full_page=true`;
        
        const response = await axios.get(apiUrl, {
            timeout: 30000, // Timeout lebih lama untuk screenshot
            responseType: 'arraybuffer'
        });

        if (response.data && response.headers['content-type']?.includes('image')) {
            await bot.sendPhoto(chatId, Buffer.from(response.data), {
                caption: `🌐 Screenshot: ${url}`,
                reply_to_message_id: msg.message_id
            });
        } else {
            // Coba cek apakah response JSON (error message)
            try {
                const errorText = Buffer.from(response.data).toString();
                const errorJson = JSON.parse(errorText);
                throw new Error(errorJson.message || 'Gagal mengambil screenshot');
            } catch {
                throw new Error('Response bukan gambar');
            }
        }
    } catch (error) {
        console.error('Error ssweb:', error);
        bot.sendMessage(chatId, 
            `❌ Gagal mengambil screenshot!\nError: ${error.message}\n\n` +
            `*Kemungkinan penyebab:*\n` +
            `1. Website memblokir screenshot\n` +
            `2. Timeout terlalu lama\n` +
            `3. API sedang gangguan`,
            { parse_mode: 'Markdown', reply_to_message_id: msg.message_id }
        );
    }
});

// 4. Random Hentai (NSFW Content)
bot.onText(/^\/hentai$/, async (msg) => {
    const chatId = msg.chat.id;
    
    // PERINGATAN: Konten NSFW
    const warningMsg = await bot.sendMessage(chatId,
        `⚠️ *PERINGATAN KONTEN DEWASA*\n\n` +
        `Fitur ini menampilkan konten hentai (18+).\n\n` +
        `Apakah Anda berusia 18+ dan ingin melanjutkan?`,
        {
            parse_mode: 'Markdown',
            reply_to_message_id: msg.message_id,
            reply_markup: {
                inline_keyboard: [
                    [
                        { text: '✅ Ya, Lanjutkan', callback_data: 'hentai_confirm' },
                        { text: '❌ Batalkan', callback_data: 'hentai_cancel' }
                    ]
                ]
            }
        }
    );
    
    // Simpan message ID untuk dihapus nanti
    setTimeout(() => {
        bot.deleteMessage(chatId, warningMsg.message_id).catch(() => {});
    }, 10000);
});

// Handler konfirmasi hentai
bot.on('callback_query', async (callbackQuery) => {
    const chatId = callbackQuery.message.chat.id;
    const messageId = callbackQuery.message.message_id;
    const data = callbackQuery.data;
    
    if (data === 'hentai_confirm') {
        await bot.answerCallbackQuery(callbackQuery.id, { text: 'Mengambil data hentai...' });
        
        try {
            // Hapus pesan peringatan
            await bot.deleteMessage(chatId, messageId).catch(() => {});
            
            await bot.sendChatAction(chatId, 'upload_video');
            
            const response = await axios.get('https://movanest.zone.id/v2/hentai?query=random', {
                timeout: 20000
            });

            if (response.data && response.data.status && response.data.result && response.data.result.length > 0) {
                const hentai = response.data.result[0];
                
                // Kirim informasi dulu
                const infoMsg = `🎬 *Random Hentai*\n\n` +
                               `*Judul:* ${hentai.title}\n` +
                               `*Kategori:* ${hentai.category || 'Unknown'}\n` +
                               `*Views:* ${hentai.views_count || '0'}\n` +
                               `*Type:* ${hentai.type}\n\n` +
                               `_Creator: ${response.data.creator || 'Unknown'}_`;
                
                await bot.sendMessage(chatId, infoMsg, {
                    parse_mode: 'Markdown',
                    reply_to_message_id: callbackQuery.message.reply_to_message?.message_id
                });
                
                // Kirim video (jika tersedia)
                if (hentai.video_1 || hentai.video_2) {
                    const videoUrl = hentai.video_1 || hentai.video_2;
                    
                    try {
                        await bot.sendVideo(chatId, videoUrl, {
                            caption: hentai.title,
                            reply_to_message_id: callbackQuery.message.reply_to_message?.message_id
                        });
                    } catch (videoError) {
                        console.error('Error sending video:', videoError);
                        // Kirim link sebagai fallback
                        await bot.sendMessage(chatId,
                            `📥 *Link Video:*\n${videoUrl}\n\n` +
                            `*Link Detail:*\n${hentai.link}`,
                            { parse_mode: 'Markdown' }
                        );
                    }
                } else {
                    await bot.sendMessage(chatId,
                        `🔗 *Link Detail:*\n${hentai.link}`,
                        { parse_mode: 'Markdown' }
                    );
                }
            } else {
                throw new Error('Tidak ada hasil hentai');
            }
        } catch (error) {
            console.error('Error hentai:', error);
            bot.sendMessage(chatId, 
                `❌ Gagal mengambil data hentai!\nError: ${error.message}`,
                { reply_to_message_id: callbackQuery.message.reply_to_message?.message_id }
            );
        }
    } else if (data === 'hentai_cancel') {
        await bot.answerCallbackQuery(callbackQuery.id, { text: 'Dibatalkan' });
        await bot.deleteMessage(chatId, messageId).catch(() => {});
    }
});

// Versi smeme dengan parameter lengkap (opsional)
bot.onText(/^\/smeme2(?:\s+([^|]+)\|([^|]+)\|(.+))?$/, async (msg, match) => {
    const chatId = msg.chat.id;
    const textAtas = match[1] ? match[1].trim() : '';
    const textBawah = match[2] ? match[2].trim() : '';
    const background = match[3] ? match[3].trim() : '';
    
    if (!textAtas || !textBawah || !background) {
        return bot.sendMessage(chatId,
            `🖼️ *Cara Penggunaan Smeme2:*\n` +
            `/smeme2 <text_atas>|<text_bawah>|<background_url>\n\n` +
            `*Contoh:*\n` +
            `/smeme2 Pagaska|Assistant|https://example.com/bg.jpg`,
            { parse_mode: 'Markdown', reply_to_message_id: msg.message_id }
        );
    }
    
    try {
        await bot.sendChatAction(chatId, 'upload_photo');
        
        const response = await axios.get(`https://api.elrayyxml.web.id/api/maker/smeme?text_atas=${encodeURIComponent(textAtas)}&text_bawah=${encodeURIComponent(textBawah)}&background=${encodeURIComponent(background)}`, {
            timeout: 15000,
            responseType: 'arraybuffer'
        });

        if (response.data) {
            await bot.sendPhoto(chatId, Buffer.from(response.data), {
                caption: `🖼️ Smeme dengan custom background`,
                reply_to_message_id: msg.message_id
            });
        }
    } catch (error) {
        console.error('Error smeme2:', error);
        bot.sendMessage(chatId, 
            `❌ Gagal membuat smeme dengan background custom!\nError: ${error.message}`,
            { reply_to_message_id: msg.message_id }
        );
    }
});

// Handler untuk tombol jawaban
bot.on('callback_query', (callbackQuery) => {
  const message = callbackQuery.message;
  const data = callbackQuery.data;

  if (data.startsWith('jawab_')) {
    const index = parseInt(data.split('_')[1]);
    const jawaban = soal[index].jawaban;
    
    bot.answerCallbackQuery(callbackQuery.id, {
      text: `Jawaban: ${jawaban}`,
      show_alert: true
    });
  }
});

// Handler untuk tombol jawaban
bot.on('callback_query', (callbackQuery) => {
  const message = callbackQuery.message;
  const data = callbackQuery.data;

  if (data.startsWith('jawab_')) {
    const index = parseInt(data.split('_')[1]);
    const jawaban = soal[index].jawaban;
    
    bot.answerCallbackQuery(callbackQuery.id, {
      text: `Jawaban: ${jawaban}`,
      show_alert: true
    });
  }
});

// Storage untuk game aktif per chat
const activeCCGames = {};

// Mapping mata pelajaran
const subjects = {
  'bindo': 'Bahasa Indonesia',
  'tik': 'TIK',
  'pkn': 'PKN',
  'bing': 'Bahasa Inggris',
  'penjas': 'Penjas',
  'pai': 'PAI',
  'matematika': 'Matematika',
  'jawa': 'Bahasa Jawa',
  'ips': 'IPS',
  'ipa': 'IPA'
};

// Command /cc - Pilih mata pelajaran
bot.onText(/^\/cc$/, async (msg) => {
  const chatId = msg.chat.id;

  // Cek apakah sudah ada game aktif
  if (activeCCGames[chatId]) {
    return bot.sendMessage(chatId, 
      `⚠️ Masih ada game aktif!\n\n` +
      `Ketik jawaban atau gunakan /berhenti untuk berhenti.`,
      { reply_to_message_id: msg.message_id }
    );
  }

  // Buat inline keyboard untuk pilih mata pelajaran
  const keyboard = {
    inline_keyboard: [
      [
        { text: "📚 Bahasa Indonesia", callback_data: "cc_bindo" },
        { text: "💻 TIK", callback_data: "cc_tik" }
      ],
      [
        { text: "🏛️ PKN", callback_data: "cc_pkn" },
        { text: "🌍 Bahasa Inggris", callback_data: "cc_bing" }
      ],
      [
        { text: "⚽ Penjas", callback_data: "cc_penjas" },
        { text: "🕌 PAI", callback_data: "cc_pai" }
      ],
      [
        { text: "🔢 Matematika", callback_data: "cc_matematika" },
        { text: "🗣️ Bahasa Jawa", callback_data: "cc_jawa" }
      ],
      [
        { text: "🌏 IPS", callback_data: "cc_ips" },
        { text: "🔬 IPA", callback_data: "cc_ipa" }
      ]
    ]
  };

  await bot.sendMessage(
    chatId, 
    `🎮 *CERDAS CERMAT*\n\n` +
    `Pilih mata pelajaran yang ingin dimainkan:`,
    {
      parse_mode: "Markdown",
      reply_markup: keyboard,
      reply_to_message_id: msg.message_id
    }
  );
});

// Handler untuk callback pilih mata pelajaran
bot.on("callback_query", async (query) => {
  const chatId = query.message.chat.id;
  const messageId = query.message.message_id;
  const data = query.data;

  try {
    // Handle pilihan mata pelajaran
    if (data.startsWith("cc_") && !data.includes("_start_") && data !== "cc_back") {
      const subject = data.replace("cc_", "");
      
      if (!subjects[subject]) {
        return await bot.answerCallbackQuery(query.id, { text: "❌ Mata pelajaran tidak valid!" });
      }

      await bot.answerCallbackQuery(query.id, { text: `📚 ${subjects[subject]} dipilih!` });

      // Edit message untuk pilih jumlah soal
      const jumlahKeyboard = {
        inline_keyboard: [
          [
            { text: "5 Soal", callback_data: `cc_start_${subject}_5` },
            { text: "6 Soal", callback_data: `cc_start_${subject}_6` }
          ],
          [
            { text: "7 Soal", callback_data: `cc_start_${subject}_7` },
            { text: "8 Soal", callback_data: `cc_start_${subject}_8` }
          ],
          [
            { text: "9 Soal", callback_data: `cc_start_${subject}_9` },
            { text: "10 Soal", callback_data: `cc_start_${subject}_10` }
          ],
          [
            { text: "◀️ Kembali", callback_data: "cc_back" }
          ]
        ]
      };

      await bot.editMessageText(
        `📚 *Mata Pelajaran: ${subjects[subject]}*\n\n` +
        `Pilih jumlah soal:`,
        {
          chat_id: chatId,
          message_id: messageId,
          parse_mode: "Markdown",
          reply_markup: jumlahKeyboard
        }
      );
    }

    // Handle mulai game
    if (data.startsWith("cc_start_")) {
      const parts = data.split("_");
      const subject = parts[2];
      const jumlah = parseInt(parts[3]);

      await bot.answerCallbackQuery(query.id, { text: "🔄 Memuat soal..." });

      try {
        // Fetch soal dari API
        console.log(`Fetching CC: ${subject}, ${jumlah} soal`);
        
        // Hapus message pilihan
        await bot.deleteMessage(chatId, messageId).catch(() => {});

        // Gunakan soal statis jika API bermasalah
        const soalData = generateDummySoal(subject, jumlah);
        
        // Mulai game
        await startCCGame(chatId, subject, soalData, query.message.message_id);

      } catch (err) {
        console.error("Error starting game", err.message);
        
        await bot.sendMessage(
          chatId,
          `❌ Gagal memulai game!\n\n` +
          `Error: ${err.message}\n\n` +
          `Silakan coba lagi dengan /cc`,
          {
            parse_mode: "Markdown",
            reply_to_message_id: messageId
          }
        );
      }
    }

    // Handle tombol kembali
    if (data === "cc_back") {
      await bot.answerCallbackQuery(query.id, { text: "Kembali ke menu utama" });
      
      const keyboard = {
        inline_keyboard: [
          [
            { text: "📚 Bahasa Indonesia", callback_data: "cc_bindo" },
            { text: "💻 TIK", callback_data: "cc_tik" }
          ],
          [
            { text: "🏛️ PKN", callback_data: "cc_pkn" },
            { text: "🌍 Bahasa Inggris", callback_data: "cc_bing" }
          ],
          [
            { text: "⚽ Penjas", callback_data: "cc_penjas" },
            { text: "🕌 PAI", callback_data: "cc_pai" }
          ],
          [
            { text: "🔢 Matematika", callback_data: "cc_matematika" },
            { text: "🗣️ Bahasa Jawa", callback_data: "cc_jawa" }
          ],
          [
            { text: "🌏 IPS", callback_data: "cc_ips" },
            { text: "🔬 IPA", callback_data: "cc_ipa" }
          ]
        ]
      };

      await bot.editMessageText(
        `🎮 *CERDAS CERMAT*\n\n` +
        `Pilih mata pelajaran yang ingin dimainkan:`,
        {
          chat_id: chatId,
          message_id: messageId,
          parse_mode: "Markdown",
          reply_markup: keyboard
        }
      );
    }
  } catch (error) {
    console.error("Error in callback_query handler:", error);
    await bot.answerCallbackQuery(query.id, { text: "❌ Terjadi kesalahan!" });
  }
});

// Function untuk generate dummy soal jika API bermasalah
function generateDummySoal(subject, jumlah) {
  const soalList = [];
  
  for (let i = 1; i <= jumlah; i++) {
    soalList.push({
      pertanyaan: `Contoh soal ${i} untuk ${subjects[subject]}?`,
      pilihan: ["Pilihan A", "Pilihan B", "Pilihan C", "Pilihan D"],
      jawaban: "Pilihan A"
    });
  }
  
  return soalList;
}

// Function untuk memulai game
async function startCCGame(chatId, subject, soalData, replyToMessageId) {
  const totalSoal = soalData.length;
  
  // Inisialisasi game state
  activeCCGames[chatId] = {
    subject: subject,
    subjectName: subjects[subject],
    soalData: soalData,
    currentIndex: 0,
    score: 0,
    correctAnswers: 0,
    wrongAnswers: 0,
    startTime: Date.now(),
    messageIds: [],
    isWaitingAnswer: false
  };

  console.log(`Game started for chat ${chatId}: ${subject}, ${totalSoal} soal`);

  // Kirim intro
  const introMsg = await bot.sendMessage(
    chatId,
    `🎮 *GAME DIMULAI!*\n\n` +
    `📚 Mata Pelajaran: *${subjects[subject]}*\n` +
    `📝 Jumlah Soal: *${totalSoal}*\n\n` +
    `Siap-siap! Soal pertama akan muncul dalam 3 detik...`,
    {
      parse_mode: "Markdown",
      reply_to_message_id: replyToMessageId
    }
  );

  // Simpan message ID
  activeCCGames[chatId].messageIds.push(introMsg.message_id);

  // Tunggu 3 detik lalu kirim soal pertama
  setTimeout(() => {
    sendNextQuestion(chatId);
  }, 3000);
}

// Function untuk kirim soal berikutnya
async function sendNextQuestion(chatId) {
  const game = activeCCGames[chatId];
  
  if (!game) return;

  // Set flag sedang menunggu jawaban
  game.isWaitingAnswer = true;

  const soal = game.soalData[game.currentIndex];
  const questionNumber = game.currentIndex + 1;
  const totalSoal = game.soalData.length;

  // Format pertanyaan
  let questionText = `📝 *SOAL ${questionNumber}/${totalSoal}*\n\n`;
  questionText += `${soal.pertanyaan || soal.question || soal.soal || "Tidak ada pertanyaan"}\n\n`;

  // Tambahkan pilihan jika ada
  if (soal.pilihan || soal.options || soal.choices) {
    const pilihan = soal.pilihan || soal.options || soal.choices;
    questionText += `*Pilihan Jawaban:*\n`;
    
    if (Array.isArray(pilihan)) {
      pilihan.forEach((p, i) => {
        const label = String.fromCharCode(65 + i); // A, B, C, D
        questionText += `${label}. ${p}\n`;
      });
    } else if (typeof pilihan === 'object') {
      Object.entries(pilihan).forEach(([key, value]) => {
        questionText += `${key}. ${value}\n`;
      });
    }
  } else {
    questionText += `*Jawablah dengan singkat dan jelas*\n`;
  }

  questionText += `\n💡 Ketik jawaban Anda atau /berhenti untuk keluar`;

  try {
    const questionMsg = await bot.sendMessage(chatId, questionText, {
      parse_mode: "Markdown"
    });

    game.messageIds.push(questionMsg.message_id);
  } catch (error) {
    console.error("Error sending question:", error);
  }
}

// Handler untuk jawaban
bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  
  // Skip jika tidak ada text atau adalah command (kecuali /berhenti)
  if (!msg.text || msg.text.trim() === '') return;
  
  // Handle command /berhenti terpisah
  if (msg.text === '/berhenti') return;
  
  // Skip jika tidak ada game aktif
  if (!activeCCGames[chatId]) return;

  // Skip jika game sedang tidak menunggu jawaban
  if (!activeCCGames[chatId].isWaitingAnswer) return;

  const game = activeCCGames[chatId];
  
  // Set flag tidak menunggu jawaban lagi
  game.isWaitingAnswer = false;
  
  const soal = game.soalData[game.currentIndex];
  
  // Get jawaban yang benar
  let correctAnswer = soal.jawaban || soal.answer || soal.correct || "Pilihan A";
  
  if (typeof correctAnswer === 'string') {
    correctAnswer = correctAnswer.toLowerCase().trim();
  }

  const userAnswer = msg.text.toLowerCase().trim();

  console.log('User answer:', userAnswer, 'Correct:', correctAnswer);

  // Cek jawaban
  let isCorrect = false;
  
  // Jika jawaban teks langsung
  if (userAnswer === correctAnswer) {
    isCorrect = true;
  }
  // Jika jawaban berupa huruf (A, B, C, D)
  else if (userAnswer.length === 1 && /^[a-d]$/.test(userAnswer)) {
    const index = userAnswer.charCodeAt(0) - 97; // a=0, b=1, c=2, d=3
    const pilihan = soal.pilihan || soal.options || soal.choices;
    
    if (Array.isArray(pilihan) && pilihan[index]) {
      if (pilihan[index].toLowerCase().trim() === correctAnswer) {
        isCorrect = true;
      }
    }
  }
  // Jika jawaban berupa pilihan
  else if (soal.pilihan && Array.isArray(soal.pilihan)) {
    // Cek apakah user menjawab teks pilihan
    for (let i = 0; i < soal.pilihan.length; i++) {
      if (soal.pilihan[i].toLowerCase().trim() === userAnswer) {
        if (soal.pilihan[i].toLowerCase().trim() === correctAnswer) {
          isCorrect = true;
        }
        break;
      }
    }
  }

  if (isCorrect) {
    game.score += 10;
    game.correctAnswers++;
    
    await bot.sendMessage(chatId, 
      `✅ *BENAR!*\n\n` +
      `Jawaban: *${soal.jawaban || soal.answer || "Pilihan A"}*\n` +
      `Score: +10 poin\n` +
      `Total Score: ${game.score}`,
      { 
        parse_mode: "Markdown",
        reply_to_message_id: msg.message_id 
      }
    );
  } else {
    game.wrongAnswers++;
    
    await bot.sendMessage(chatId, 
      `❌ *SALAH!*\n\n` +
      `Jawaban yang benar: *${soal.jawaban || soal.answer || "Pilihan A"}*\n` +
      `Score saat ini: ${game.score}`,
      { 
        parse_mode: "Markdown",
        reply_to_message_id: msg.message_id 
      }
    );
  }

  // Lanjut ke soal berikutnya atau selesai
  game.currentIndex++;

  if (game.currentIndex < game.soalData.length) {
    // Masih ada soal
    setTimeout(() => {
      sendNextQuestion(chatId);
    }, 2000);
  } else {
    // Game selesai
    setTimeout(() => {
      endGame(chatId);
    }, 2000);
  }
});

// Function untuk mengakhiri game
async function endGame(chatId) {
  const game = activeCCGames[chatId];
  
  if (!game) return;

  const duration = Math.floor((Date.now() - game.startTime) / 1000);
  const totalSoal = game.soalData.length;
  const percentage = totalSoal > 0 ? Math.round((game.correctAnswers / totalSoal) * 100) : 0;

  // Tentukan grade
  let grade, emoji;
  if (percentage >= 90) {
    grade = "Excellent!";
    emoji = "🏆";
  } else if (percentage >= 75) {
    grade = "Great!";
    emoji = "🌟";
  } else if (percentage >= 60) {
    grade = "Good!";
    emoji = "👍";
  } else if (percentage >= 50) {
    grade = "Not Bad!";
    emoji = "👌";
  } else {
    grade = "Keep Trying!";
    emoji = "💪";
  }

  const resultText = `
${emoji} *GAME SELESAI!* ${emoji}

📚 *Mata Pelajaran:* ${game.subjectName}
⏱️ *Waktu:* ${duration} detik

📊 *HASIL:*
✅ Benar: ${game.correctAnswers}
❌ Salah: ${game.wrongAnswers}
📝 Total Soal: ${totalSoal}
🎯 Persentase: ${percentage}%
⭐ Score: ${game.score}

${emoji} *Grade: ${grade}*

Main lagi dengan /cc
  `;

  try {
    await bot.sendMessage(chatId, resultText, { parse_mode: "Markdown" });

    // Hapus pesan-pesan game lama
    for (const msgId of game.messageIds) {
      try {
        await bot.deleteMessage(chatId, msgId);
      } catch (e) {
        // Ignore error jika message tidak bisa dihapus
      }
    }
  } catch (error) {
    console.error("Error sending game result:", error);
  } finally {
    // Hapus game dari storage
    delete activeCCGames[chatId];
    console.log(`Game ended for chat ${chatId}`);
  }
}

// Command /berhenti - Stop game
bot.onText(/^\/berhenti$/, async (msg) => {
  const chatId = msg.chat.id;

  if (!activeCCGames[chatId]) {
    return bot.sendMessage(chatId, 
      "⚠️ Tidak ada game aktif!\n\nGunakan /cc untuk memulai game.",
      { reply_to_message_id: msg.message_id }
    );
  }

  const game = activeCCGames[chatId];
  
  await bot.sendMessage(chatId, 
    `🛑 *GAME DIHENTIKAN*\n\n` +
    `📚 Mata Pelajaran: ${game.subjectName}\n` +
    `📝 Soal Terjawab: ${game.currentIndex}/${game.soalData.length}\n` +
    `⭐ Score Akhir: ${game.score}\n\n` +
    `Main lagi dengan /cc`,
    { 
      parse_mode: "Markdown",
      reply_to_message_id: msg.message_id 
    }
  );

  // Hapus pesan-pesan game lama
  for (const msgId of game.messageIds) {
    try {
      await bot.deleteMessage(chatId, msgId);
    } catch (e) {
      // Ignore error
    }
  }

  delete activeCCGames[chatId];
  console.log(`Game stopped by user for chat ${chatId}`);
});

bot.onText(/\/akutansi/, (msg) => {
  const chatId = msg.chat.id;
  const soal = [
    {
      soal: "Perusahaan membeli perlengkapan kantor senilai Rp 10.000 secara tunai. Jurnalnya?",
      jawaban: "debit perlengkapan kantor Rp 10.000, credit kas Rp 10.000"
    },
    {
      soal: "Diterima pendapatan jasa dari pelanggan sebesar Rp 10.000. Jurnal umum?",
      jawaban: "debit kas Rp 10.000, credit pendapatan jasa Rp 10.000"
    },
    {
      soal: "Dibayar beban listrik bulan ini Rp 10.000. Pencatatan jurnal?",
      jawaban: "debit beban listrik Rp 10.000, credit kas Rp 10.000"
    },
    {
      soal: "Perusahaan membeli peralatan senilai Rp 10.000 secara kredit. Jurnal?",
      jawaban: "debit peralatan Rp 10.000, credit utang usaha Rp 10.000"
    },
    {
      soal: "Dibayar gaji karyawan sebesar Rp 10.000. Bagaimana jurnalnya?",
      jawaban: "debit beban gaji Rp 10.000, credit kas Rp 10.000"
    },
    {
      soal: "Perusahaan menerima piutang dari pelanggan sebesar Rp 10.000. Jurnal?",
      jawaban: "debit kas Rp 10.000, credit piutang usaha Rp 10.000"
    },
    {
      soal: "Dibayar sewa gedung untuk bulan depan Rp 10.000. Jurnal penyesuaian?",
      jawaban: "debit beban sewa Rp 10.000, credit kas Rp 10.000"
    },
    {
      soal: "Perusahaan mengambil prive untuk pemilik senilai Rp 10.000. Jurnalnya?",
      jawaban: "debit prive Rp 10.000, credit kas Rp 10.000"
    },
    {
      soal: "Dibeli barang dagangan secara tunai senilai Rp 10.000. Jurnal?",
      jawaban: "debit pembelian Rp 10.000, credit kas Rp 10.000"
    },
    {
      soal: "Dijual barang dagangan secara tunai senilai Rp 10.000. Jurnal?",
      jawaban: "debit kas Rp 10.000, credit penjualan Rp 10.000"
    },
    {
      soal: "Dibayar beban iklan sebesar Rp 10.000. Jurnal umum?",
      jawaban: "debit beban iklan Rp 10.000, credit kas Rp 10.000"
    },
    {
      soal: "Perusahaan menerima pendapatan diterima di muka Rp 10.000. Jurnal?",
      jawaban: "debit kas Rp 10.000, credit pendapatan diterima di muka Rp 10.000"
    },
    {
      soal: "Dibayar angsuran utang bank Rp 10.000 (pokok Rp 10.000). Jurnal?",
      jawaban: "debit utang bank Rp 10.000, credit kas Rp 10.000"
    },
    {
      soal: "Penyusutan peralatan bulan ini Rp 10.000. Jurnal penyesuaian?",
      jawaban: "debit beban penyusutan Rp 10.000, credit akumulasi penyusutan Rp 10.000"
    },
    {
      soal: "Dibayar premi asuransi untuk satu tahun Rp 10.000. Jurnal awal?",
      jawaban: "debit asuransi dibayar di muka Rp 10.000, credit kas Rp 10.000"
    },
    {
      soal: "Perusahaan membayar utang kepada supplier sebesar Rp 10.000. Jurnal?",
      jawaban: "debit utang usaha Rp 10.000, credit kas Rp 10.000"
    },
    {
      soal: "Diterima pendapatan komisi sebesar Rp 10.000 secara tunai. Jurnal?",
      jawaban: "debit kas Rp 10.000, credit pendapatan komisi Rp 10.000"
    },
    {
      soal: "Dibayar beban transportasi untuk operasional Rp 10.000. Jurnal?",
      jawaban: "debit beban transportasi Rp 10.000, credit kas Rp 10.000"
    },
    {
      soal: "Perusahaan mengeluarkan obligasi senilai Rp 10.000. Jurnal penerbitan?",
      jawaban: "debit kas Rp 10.000, credit utang obligasi Rp 10.000"
    },
    {
      soal: "Dibeli tanah untuk investasi senilai Rp 10.000 tunai. Jurnal?",
      jawaban: "debit tanah Rp 10.000, credit kas Rp 10.000"
    },
    {
      soal: "Perusahaan membeli perlengkapan kantor senilai Rp 10.000 secara tunai. Jurnalnya?",
      jawaban: "debit perlengkapan kantor Rp 10.000, credit kas Rp 10.000"
    },
    {
      soal: "Diterima pendapatan jasa dari pelanggan sebesar Rp 10.000. Jurnal umum?",
      jawaban: "debit kas Rp 10.000, credit pendapatan jasa Rp 10.000"
    },
    {
      soal: "Dibayar beban listrik bulan ini Rp 10.000. Pencatatan jurnal?",
      jawaban: "debit beban listrik Rp 10.000, credit kas Rp 10.000"
    },
    {
      soal: "Perusahaan membeli peralatan senilai Rp 10.000 secara kredit. Jurnal?",
      jawaban: "debit peralatan Rp 10.000, credit utang usaha Rp 10.000"
    },
    {
      soal: "Dibayar gaji karyawan sebesar Rp 10.000. Bagaimana jurnalnya?",
      jawaban: "debit beban gaji Rp 10.000, credit kas Rp 10.000"
    },
    {
      soal: "Perusahaan menerima piutang dari pelanggan sebesar Rp 10.000. Jurnal?",
      jawaban: "debit kas Rp 10.000, credit piutang usaha Rp 10.000"
    },
    {
      soal: "Dibayar sewa gedung untuk bulan depan Rp 10.000. Jurnal penyesuaian?",
      jawaban: "debit beban sewa Rp 10.000, credit kas Rp 10.000"
    },
    {
      soal: "Perusahaan mengambil prive untuk pemilik senilai Rp 10.000. Jurnalnya?",
      jawaban: "debit prive Rp 10.000, credit kas Rp 10.000"
    },
    {
      soal: "Dibeli barang dagangan secara tunai senilai Rp 10.000. Jurnal?",
      jawaban: "debit pembelian Rp 10.000, credit kas Rp 10.000"
    },
    {
      soal: "Dijual barang dagangan secara tunai senilai Rp 10.000. Jurnal?",
      jawaban: "debit kas Rp 10.000, credit penjualan Rp 10.000"
    },
    {
      soal: "Dibayar beban iklan sebesar Rp 10.000. Jurnal umum?",
      jawaban: "debit beban iklan Rp 10.000, credit kas Rp 10.000"
    },
    {
      soal: "Perusahaan menerima pendapatan diterima di muka Rp 10.000. Jurnal?",
      jawaban: "debit kas Rp 10.000, credit pendapatan diterima di muka Rp 10.000"
    },
    {
      soal: "Dibayar angsuran utang bank Rp 10.000 (pokok Rp 10.000). Jurnal?",
      jawaban: "debit utang bank Rp 10.000, credit kas Rp 10.000"
    },
    {
      soal: "Penyusutan peralatan bulan ini Rp 10.000. Jurnal penyesuaian?",
      jawaban: "debit beban penyusutan Rp 10.000, credit akumulasi penyusutan Rp 10.000"
    },
    {
      soal: "Dibayar premi asuransi untuk satu tahun Rp 10.000. Jurnal awal?",
      jawaban: "debit asuransi dibayar di muka Rp 10.000, credit kas Rp 10.000"
    },
    {
      soal: "Perusahaan membayar utang kepada supplier sebesar Rp 10.000. Jurnal?",
      jawaban: "debit utang usaha Rp 10.000, credit kas Rp 10.000"
    },
    {
      soal: "Diterima pendapatan komisi sebesar Rp 10.000 secara tunai. Jurnal?",
      jawaban: "debit kas Rp 10.000, credit pendapatan komisi Rp 10.000"
    },
    {
      soal: "Dibayar beban transportasi untuk operasional Rp 10.000. Jurnal?",
      jawaban: "debit beban transportasi Rp 10.000, credit kas Rp 10.000"
    },
    {
      soal: "Perusahaan mengeluarkan obligasi senilai Rp 10.000. Jurnal penerbitan?",
      jawaban: "debit kas Rp 10.000, credit utang obligasi Rp 10.000"
    },
    {
      soal: "Dibeli tanah untuk investasi senilai Rp 10.000 tunai. Jurnal?",
      jawaban: "debit tanah Rp 10.000, credit kas Rp 10.000"
    }
  ];

  // Acak soal
  const randomSoal = soal[Math.floor(Math.random() * soal.length)];
  
  const options = {
    reply_markup: JSON.stringify({
      inline_keyboard: [
        [
          { text: "Lihat Jawaban", callback_data: `jawab_${soal.indexOf(randomSoal)}` }
        ]
      ]
    })
  };

  bot.sendMessage(chatId, `📚 Soal Akuntansi:\n\n${randomSoal.soal}`, options);
});

// Handler untuk tombol jawaban
bot.on('callback_query', (callbackQuery) => {
  const message = callbackQuery.message;
  const data = callbackQuery.data;

  if (data.startsWith('jawab_')) {
    const index = parseInt(data.split('_')[1]);
    const jawaban = soal[index].jawaban;
    
    bot.answerCallbackQuery(callbackQuery.id, {
      text: `Jawaban: ${jawaban}`,
      show_alert: true
    });
  }
});

// Game: Siapakah Aku
bot.onText(/^\/siapakahaku$/, async (msg) => {
    const chatId = msg.chat.id;
    
    try {
        await bot.sendChatAction(chatId, 'typing');
        
        const response = await axios.get('https://api.deline.web.id/game/siapakahaku', {
            timeout: 10000,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        });

        if (response.data && response.data.result) {
            const data = response.data.result;
            let message = `🎮 *SIAPAKAH AKU?*\n\n`;
            
            if (data.pertanyaan) {
                message += `*Pertanyaan:* ${data.pertanyaan}\n\n`;
            }
            
            if (data.clue) {
                message += `*Clue:* ${data.clue}\n\n`;
            }
            
            if (data.jawaban) {
                message += `💡 *Jawaban:* ${data.jawaban}`;
            }
            
            bot.sendMessage(chatId, message, {
                parse_mode: 'Markdown',
                reply_to_message_id: msg.message_id
            });
        } else {
            throw new Error('Format response tidak sesuai');
        }
    } catch (error) {
        console.error('Error siapakahaku:', error);
        bot.sendMessage(chatId, 
            `❌ Gagal mengambil data siapakahaku!\nError: ${error.message}`,
            { reply_to_message_id: msg.message_id }
        );
    }
});

// Helper untuk validasi URL
function isValidUrl(string) {
    try {
        new URL(string);
        return true;
    } catch (_) {
        return false;
    }
}

// 📱 FAKE STORY INSTAGRAM
bot.onText(/^\/fakestory(?:\s+(.+))?$/, async (msg, match) => {
    const chatId = msg.chat.id;
    const text = match[1];
    
    if (!text) {
        return bot.sendMessage(chatId,
            `📱 *FAKE STORY INSTAGRAM*\n\n` +
            `*Format:*\n` +
            `/fakestory username|avatar|caption\n\n` +
            `*Contoh:*\n` +
            `/fakestory juicee90y|https://api.deline.web.id/m2otvzIbpT.jpg|ndul cantik\n\n` +
            `*Penjelasan:*\n` +
            `• username* : Nama pengguna\n` +
            `• avatar*   : URL foto profil\n` +
            `• caption*  : Teks story`,
            { parse_mode: 'Markdown', reply_to_message_id: msg.message_id }
        );
    }
    
    try {
        const params = text.split('|');
        if (params.length < 3) {
            return bot.sendMessage(chatId,
                '❌ Format salah! Gunakan: username|avatar|caption\n' +
                'Contoh: juicee90y|https://api.deline.web.id/m2otvzIbpT.jpg|ndul cantik',
                { reply_to_message_id: msg.message_id }
            );
        }
        
        const username = params[0].trim();
        const avatar = params[1].trim();
        const caption = params[2].trim();
        
        if (!isValidUrl(avatar)) {
            return bot.sendMessage(chatId,
                '❌ URL avatar tidak valid!',
                { reply_to_message_id: msg.message_id }
            );
        }
        
        await bot.sendChatAction(chatId, 'upload_photo');
        
        const response = await axios.get(
            `https://api.deline.web.id/maker/fakestory?username=${encodeURIComponent(username)}&avatar=${encodeURIComponent(avatar)}&caption=${encodeURIComponent(caption)}`,
            {
                timeout: 15000,
                responseType: 'arraybuffer',
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                }
            }
        );

        if (response.data && response.headers['content-type']?.includes('image')) {
            await bot.sendPhoto(chatId, Buffer.from(response.data), {
                caption: `📱 Fake Story by @${username}\n${caption}`,
                reply_to_message_id: msg.message_id
            });
        } else {
            throw new Error('Response bukan gambar');
        }
    } catch (error) {
        console.error('Error fakestory:', error.message);
        bot.sendMessage(chatId, 
            `❌ Gagal membuat fake story!\nError: ${error.message}`,
            { reply_to_message_id: msg.message_id }
        );
    }
});

// 🐦 FAKE TWEET (Versi 1)
bot.onText(/^\/faketweet(?:\s+(.+))?$/, async (msg, match) => {
    const chatId = msg.chat.id;
    const text = match[1];
    
    if (!text) {
        return bot.sendMessage(chatId,
            `🐦 *FAKE TWEET v1*\n\n` +
            `*Format:*\n` +
            `/faketweet username|avatar|caption\n\n` +
            `*Contoh:*\n` +
            `/faketweet juicee90y|https://api.deline.web.id/m2otvzIbpT.jpg|ndul cantik\n\n` +
            `*Parameter:*\n` +
            `• username* : Nama pengguna Twitter\n` +
            `• avatar*   : URL foto profil\n` +
            `• caption*  : Isi tweet`,
            { parse_mode: 'Markdown', reply_to_message_id: msg.message_id }
        );
    }
    
    try {
        const params = text.split('|');
        if (params.length < 3) {
            return bot.sendMessage(chatId,
                '❌ Format salah! Gunakan: username|avatar|caption\n' +
                'Contoh: juicee90y|https://api.deline.web.id/m2otvzIbpT.jpg|ndul cantik',
                { reply_to_message_id: msg.message_id }
            );
        }
        
        const username = params[0].trim();
        const avatar = params[1].trim();
        const caption = params[2].trim();
        
        if (!isValidUrl(avatar)) {
            return bot.sendMessage(chatId,
                '❌ URL avatar tidak valid!',
                { reply_to_message_id: msg.message_id }
            );
        }
        
        await bot.sendChatAction(chatId, 'upload_photo');
        
        const response = await axios.get(
            `https://api.deline.web.id/maker/faketweet?username=${encodeURIComponent(username)}&avatar=${encodeURIComponent(avatar)}&caption=${encodeURIComponent(caption)}`,
            {
                timeout: 15000,
                responseType: 'arraybuffer',
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                }
            }
        );

        if (response.data && response.headers['content-type']?.includes('image')) {
            await bot.sendPhoto(chatId, Buffer.from(response.data), {
                caption: `🐦 Fake Tweet by @${username}\n${caption}`,
                reply_to_message_id: msg.message_id
            });
        } else {
            throw new Error('Response bukan gambar');
        }
    } catch (error) {
        console.error('Error faketweet:', error.message);
        bot.sendMessage(chatId, 
            `❌ Gagal membuat fake tweet!\nError: ${error.message}`,
            { reply_to_message_id: msg.message_id }
        );
    }
});

// 🐦 FAKE TWEET 2 (Versi Lengkap)
bot.onText(/^\/faketweet2(?:\s+(.+))?$/, async (msg, match) => {
    const chatId = msg.chat.id;
    const text = match[1];
    
    if (!text) {
        return bot.sendMessage(chatId,
            `🐦 *FAKE TWEET v2* (Parameter Lengkap)\n\n` +
            `*Format:*\n` +
            `/faketweet2 name|username|comment|avatar|verified|retweets|quotes|likes\n\n` +
            `*Contoh minimal:*\n` +
            `/faketweet2 agas|juicee90|ndul cantik|https://api.deline.web.id/jFuiYAGpxo.jpg|true\n\n` +
            `*Contoh lengkap:*\n` +
            `/faketweet2 Agas|juicee90|Cantik banget ndul!|https://api.deline.web.id/jFuiYAGpxo.jpg|true|1200|450|8900\n\n` +
            `*Parameter wajib:*\n` +
            `• name*     : Nama lengkap\n` +
            `• username* : Username Twitter\n` +
            `• comment*  : Isi tweet\n` +
            `• avatar*   : URL foto profil\n` +
            `• verified* : true/false\n\n` +
            `*Parameter opsional:*\n` +
            `• retweets  : Jumlah retweet (default: random)\n` +
            `• quotes    : Jumlah quote (default: random)\n` +
            `• likes     : Jumlah like (default: random)`,
            { parse_mode: 'Markdown', reply_to_message_id: msg.message_id }
        );
    }
    
    try {
        const params = text.split('|');
        if (params.length < 5) {
            return bot.sendMessage(chatId,
                '❌ Parameter kurang! Minimal: name|username|comment|avatar|verified\n' +
                'Contoh: agas|juicee90|ndul cantik|https://api.deline.web.id/jFuiYAGpxo.jpg|true',
                { reply_to_message_id: msg.message_id }
            );
        }
        
        // Ambil parameter wajib
        const name = params[0].trim();
        const username = params[1].trim();
        const comment = params[2].trim();
        const avatar = params[3].trim();
        const verified = params[4].trim().toLowerCase();
        
        if (!isValidUrl(avatar)) {
            return bot.sendMessage(chatId,
                '❌ URL avatar tidak valid!',
                { reply_to_message_id: msg.message_id }
            );
        }
        
        if (verified !== 'true' && verified !== 'false') {
            return bot.sendMessage(chatId,
                '❌ Verified harus true atau false!',
                { reply_to_message_id: msg.message_id }
            );
        }
        
        // Ambil parameter opsional
        const retweets = params[5] ? params[5].trim() : '150';
        const quotes = params[6] ? params[6].trim() : '45';
        const likes = params[7] ? params[7].trim() : '1200';
        
        await bot.sendChatAction(chatId, 'upload_photo');
        
        // Build URL dengan semua parameter
        const apiUrl = `https://api.deline.web.id/maker/faketweet2?` +
            `name=${encodeURIComponent(name)}&` +
            `username=${encodeURIComponent(username)}&` +
            `comment=${encodeURIComponent(comment)}&` +
            `avatar=${encodeURIComponent(avatar)}&` +
            `verified=${verified}&` +
            `retweets=${retweets}&` +
            `quotes=${quotes}&` +
            `likes=${likes}&` +
            `client=${encodeURIComponent('Telegram Bot')}`;
        
        console.log('API URL:', apiUrl);
        
        const response = await axios.get(apiUrl, {
            timeout: 15000,
            responseType: 'arraybuffer',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        });

        if (response.data && response.headers['content-type']?.includes('image')) {
            await bot.sendPhoto(chatId, Buffer.from(response.data), {
                caption: `🐦 Fake Tweet v2\n👤 ${name} (@${username})\n${comment}`,
                reply_to_message_id: msg.message_id
            });
        } else {
            throw new Error('Response bukan gambar');
        }
    } catch (error) {
        console.error('Error faketweet2:', error.message);
        bot.sendMessage(chatId, 
            `❌ Gagal membuat fake tweet v2!\nError: ${error.message}`,
            { reply_to_message_id: msg.message_id }
        );
    }
});

// 🎨 EMOJI MIX (Versi Diperbaiki)
bot.onText(/^\/emojimix(?:\s+(\S+)\s+(\S+))?$/, async (msg, match) => {
    const chatId = msg.chat.id;
    const messageId = msg.message_id;
    const username = msg.from.username || msg.from.first_name;
    
    // Ambil parameter
    const emoji1 = match[1];
    const emoji2 = match[2];
    
    // Validasi input
    if (!emoji1 || !emoji2) {
        return bot.sendMessage(chatId,
            `🎨 *EMOJI MIX*\n\n` +
            `*Cara Penggunaan:*\n` +
            `/emojimix <emoji1> <emoji2>\n\n` +
            `*Contoh:*\n` +
            `/emojimix 😂 🐶\n` +
            `/emojimix 🤖 💻\n` +
            `/emojimix 😎 🚀\n\n` +
            `💡 *Tips:*\n` +
            `• Gunakan emoji yang umum\n` +
            `• Spasi antara dua emoji\n` +
            `• Emoji harus bisa digabungkan`,
            { 
                parse_mode: 'Markdown',
                reply_to_message_id: messageId,
                reply_markup: {
                    inline_keyboard: [
                        [
                            { text: "😍 + 😂", callback_data: "emojimix_😍_😂" },
                            { text: "🐶 + 🐱", callback_data: "emojimix_🐶_🐱" },
                            { text: "🤖 + 💻", callback_data: "emojimix_🤖_💻" }
                        ],
                        [
                            { text: "🔥 + 🚀", callback_data: "emojimix_🔥_🚀" },
                            { text: "🎮 + 👾", callback_data: "emojimix_🎮_👾" },
                            { text: "🍕 + 🍔", callback_data: "emojimix_🍕_🍔" }
                        ]
                    ]
                }
            }
        );
    }
    
    try {
        // Kirim status "typing"
        await bot.sendChatAction(chatId, 'upload_photo');
        
        console.log(`🔍 Mencoba gabungkan: ${emoji1} + ${emoji2}`);
        
        // Coba beberapa format API yang berbeda
        let imageBuffer = null;
        let apiResponse = null;
        
        // ================================
        // METODE 1: API deline.web.id
        // ================================
        try {
            console.log('Mencoba API deline.web.id...');
            const apiUrl = `https://api.deline.web.id/maker/emojimix?emoji1=${encodeURIComponent(emoji1)}&emoji2=${encodeURIComponent(emoji2)}`;
            console.log('URL API:', apiUrl);
            
            const response = await axios.get(apiUrl, {
                timeout: 10000,
                responseType: 'arraybuffer',
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                    'Accept': 'image/*'
                }
            });
            
            if (response.status === 200 && response.data) {
                const contentType = response.headers['content-type'];
                console.log('Content-Type:', contentType);
                
                if (contentType && contentType.includes('image')) {
                    imageBuffer = response.data;
                    apiResponse = response;
                    console.log('✅ API deline.web.id berhasil');
                }
            }
        } catch (api1Error) {
            console.log('❌ API deline.web.id gagal:', api1Error.message);
        }
        
        // ================================
        // METODE 2: API alternatif 1
        // ================================
        if (!imageBuffer) {
            try {
                console.log('Mencoba API alternatif 1...');
                // API alternatif yang populer
                const emoji1Code = Buffer.from(emoji1).toString('hex');
                const emoji2Code = Buffer.from(emoji2).toString('hex');
                
                const altUrl = `https://emojimix-api.vercel.app/api/v1?emoji1=${encodeURIComponent(emoji1)}&emoji2=${encodeURIComponent(emoji2)}`;
                console.log('URL Alternatif:', altUrl);
                
                const response = await axios.get(altUrl, {
                    timeout: 10000,
                    responseType: 'arraybuffer'
                });
                
                if (response.status === 200 && response.data) {
                    imageBuffer = response.data;
                    apiResponse = response;
                    console.log('✅ API alternatif berhasil');
                }
            } catch (api2Error) {
                console.log('❌ API alternatif 1 gagal:', api2Error.message);
            }
        }
        
        // ================================
        // METODE 3: API alternatif 2 (Google)
        // ================================
        if (!imageBuffer) {
            try {
                console.log('Mencoba API Google...');
                // Google Emoji Kitchen
                const googleUrl = `https://www.gstatic.com/android/keyboard/emojikitchen/20201001/u${emoji1.codePointAt(0).toString(16)}/u${emoji1.codePointAt(0).toString(16)}_u${emoji2.codePointAt(0).toString(16)}.png`;
                
                const response = await axios.get(googleUrl, {
                    timeout: 10000,
                    responseType: 'arraybuffer'
                });
                
                if (response.status === 200 && response.data) {
                    imageBuffer = response.data;
                    apiResponse = response;
                    console.log('✅ API Google berhasil');
                }
            } catch (api3Error) {
                console.log('❌ API Google gagal:', api3Error.message);
            }
        }
        
        // ================================
        // KIRIM HASIL ATAU ERROR
        // ================================
        if (imageBuffer && apiResponse) {
            // Berhasil mendapatkan gambar
            await bot.sendPhoto(chatId, imageBuffer, {
                caption: `🎨 *Emoji Mix Berhasil!*\n\n` +
                        `Emoji 1: ${emoji1}\n` +
                        `Emoji 2: ${emoji2}\n\n` +
                        `Dibuat untuk: @${username}`,
                parse_mode: 'Markdown',
                reply_to_message_id: messageId,
                reply_markup: {
                    inline_keyboard: [
                        [
                            { text: "🔀 Coba Kombinasi Lain", callback_data: "emojimix_menu" }
                        ]
                    ]
                }
            });
            
            console.log(`✅ Gambar berhasil dikirim: ${emoji1} + ${emoji2}`);
            
        } else {
            // Semua API gagal
            console.log('❌ Semua API gagal');
            
            // Tampilkan daftar emoji yang bisa digabungkan
            const combinableEmojis = [
                "😂 😍 😊 😒 😘 😭 😜 😁 🤣 😂",
                "🐶 🐱 🐭 🐹 🐰 🦊 🐻 🐼 🐨 🐯",
                "🍕 🍔 🍟 🌭 🍿 🥓 🥚 🍳 🥞 🧇",
                "🚗 🚕 🚙 🚌 🚎 🏎️ 🚓 🚑 🚒 🚐",
                "⚽ 🏀 🏈 ⚾ 🎾 🏐 🏉 🎱 🏓 🏸",
                "🎮 👾 🕹️ 🎲 ♟️ 🎯 🎳 🎪 🎭 🎨",
                "📱 💻 🖥️ 🖨️ 🎧 🎮 📷 🎥 💾 📼"
            ];
            
            await bot.sendMessage(chatId,
                `❌ *Gagal Menggabungkan Emoji*\n\n` +
                `Emoji yang dicoba:\n` +
                `${emoji1} + ${emoji2}\n\n` +
                `*Kemungkinan penyebab:*\n` +
                `1. Kombinasi emoji tidak didukung\n` +
                `2. API sedang bermasalah\n` +
                `3. Emoji tidak valid\n\n` +
                `💡 *Coba kombinasi ini:*\n` +
                combinableEmojis.join('\n') + `\n\n` +
                `Atau gunakan tombol di bawah untuk kombinasi yang sudah terbukti berhasil:`,
                {
                    parse_mode: 'Markdown',
                    reply_to_message_id: messageId,
                    reply_markup: {
                        inline_keyboard: [
                            [
                                { text: "😂 + 😍", callback_data: "emojimix_😂_😍" },
                                { text: "🐶 + 🐱", callback_data: "emojimix_🐶_🐱" },
                                { text: "🍕 + 🍔", callback_data: "emojimix_🍕_🍔" }
                            ],
                            [
                                { text: "🤖 + 💻", callback_data: "emojimix_🤖_💻" },
                                { text: "🎮 + 👾", callback_data: "emojimix_🎮_👾" },
                                { text: "🔥 + 🚀", callback_data: "emojimix_🔥_🚀" }
                            ],
                            [
                                { text: "🔄 Coba Lagi", callback_data: "emojimix_retry" }
                            ]
                        ]
                    }
                }
            );
        }
        
    } catch (error) {
        console.error('❌ Error utama emojimix:', error.message);
        console.error('Stack:', error.stack);
        
        await bot.sendMessage(chatId,
            `❌ *Error System*\n\n` +
            `Terjadi kesalahan sistem saat memproses emoji mix.\n\n` +
            `*Detail Error:*\n\`${error.message}\`\n\n` +
            `Silakan coba kombinasi lain atau hubungi developer.`,
            {
                parse_mode: 'Markdown',
                reply_to_message_id: messageId
            }
        );
    }
});

// ===========================================
// HANDLER UNTUK CALLBACK QUERY (TOMBOL)
// ===========================================
bot.on('callback_query', async (callbackQuery) => {
    const chatId = callbackQuery.message.chat.id;
    const messageId = callbackQuery.message.message_id;
    const data = callbackQuery.data;
    const username = callbackQuery.from.username || callbackQuery.from.first_name;
    
    try {
        // Handler untuk emoji mix dari tombol
        if (data.startsWith('emojimix_')) {
            const parts = data.split('_');
            
            if (parts[1] === 'menu') {
                // Tampilkan menu emoji mix
                await bot.editMessageText(
                    `🎨 *Pilih Kombinasi Emoji*\n\n` +
                    `Klik tombol di bawah untuk mencoba kombinasi yang sudah terbukti berhasil:`,
                    {
                        chat_id: chatId,
                        message_id: messageId,
                        parse_mode: 'Markdown',
                        reply_markup: {
                            inline_keyboard: [
                                [
                                    { text: "😍 + 😂", callback_data: "emojimix_😍_😂" },
                                    { text: "🐶 + 🐱", callback_data: "emojimix_🐶_🐱" },
                                    { text: "🤖 + 💻", callback_data: "emojimix_🤖_💻" }
                                ],
                                [
                                    { text: "🔥 + 🚀", callback_data: "emojimix_🔥_🚀" },
                                    { text: "🎮 + 👾", callback_data: "emojimix_🎮_👾" },
                                    { text: "🍕 + 🍔", callback_data: "emojimix_🍕_🍔" }
                                ],
                                [
                                    { text: "🎵 + 🎤", callback_data: "emojimix_🎵_🎤" },
                                    { text: "☕ + 🍩", callback_data: "emojimix_☕_🍩" },
                                    { text: "📱 + 💻", callback_data: "emojimix_📱_💻" }
                                ],
                                [
                                    { text: "✏️ Manual Input", callback_data: "emojimix_input" }
                                ]
                            ]
                        }
                    }
                );
                
            } else if (parts[1] === 'input') {
                // Minta input manual
                await bot.editMessageText(
                    `🎨 *Input Manual Emoji Mix*\n\n` +
                    `Silakan kirim perintah:\n` +
                    `/emojimix 😂 🐶\n\n` +
                    `Ganti 😂 dan 🐶 dengan emoji pilihan Anda.`,
                    {
                        chat_id: chatId,
                        message_id: messageId,
                        parse_mode: 'Markdown'
                    }
                );
                
            } else if (parts[1] === 'retry') {
                // Tampilkan menu retry
                await bot.editMessageText(
                    `🔄 *Coba Kombinasi Emoji*\n\n` +
                    `Pilih kombinasi di bawah atau ketik:\n` +
                    `/emojimix 😂 🐶`,
                    {
                        chat_id: chatId,
                        message_id: messageId,
                        parse_mode: 'Markdown',
                        reply_markup: {
                            inline_keyboard: [
                                [
                                    { text: "😂 + 😍", callback_data: "emojimix_😂_😍" },
                                    { text: "🐶 + 🐱", callback_data: "emojimix_🐶_🐱" }
                                ],
                                [
                                    { text: "🍕 + 🍔", callback_data: "emojimix_🍕_🍔" },
                                    { text: "🎮 + 👾", callback_data: "emojimix_🎮_👾" }
                                ]
                            ]
                        }
                    }
                );
                
            } else if (parts.length >= 3) {
                // Ada emoji dari tombol
                const emoji1 = parts[1];
                const emoji2 = parts[2];
                
                // Kirim pesan "processing"
                await bot.answerCallbackQuery(callbackQuery.id, {
                    text: `Menggabungkan ${emoji1} + ${emoji2}...`,
                    show_alert: false
                });
                
                // Simulasikan pengiriman perintah
                const fakeMsg = {
                    chat: { id: chatId },
                    from: callbackQuery.from,
                    message_id: messageId,
                    text: `/emojimix ${emoji1} ${emoji2}`
                };
                
                // Panggil handler emojimix
                const regex = /^\/emojimix(?:\s+(\S+)\s+(\S+))?$/;
                const handlerMatch = fakeMsg.text.match(regex);
                
                if (handlerMatch) {
                    // Hapus pesan lama
                    await bot.deleteMessage(chatId, messageId).catch(() => {});
                    
                    // Buat message baru
                    await bot.sendMessage(chatId, 
                        `🎨 *Memproses Emoji Mix...*\n\n` +
                        `${emoji1} + ${emoji2}`,
                        { parse_mode: 'Markdown' }
                    );
                    
                    // Panggil handler secara manual
                    const emojiMixHandler = bot._events.callback_query || 
                        bot.onText.mock?.calls?.find(call => 
                            call[0].toString() === '/^\\/emojimix(?:\\s+(\\S+)\\s+(\\S+))?$/'
                        );
                    
                    if (emojiMixHandler) {
                        setTimeout(() => {
                            emojiMixHandler[1](fakeMsg, handlerMatch);
                        }, 1000);
                    }
                }
            }
            
            await bot.answerCallbackQuery(callbackQuery.id);
        }
        
    } catch (error) {
        console.error('Error callback_query emojimix:', error);
        await bot.answerCallbackQuery(callbackQuery.id, {
            text: '❌ Terjadi kesalahan',
            show_alert: true
        });
    }
});

// ===========================================
// COMMAND BANTUAN EMOJI MIX
// ===========================================
bot.onText(/^\/emojilist$/, (msg) => {
    const chatId = msg.chat.id;
    const messageId = msg.message_id;
    
    const emojiCategories = {
        "😊 Wajah & Emosi": "😂 😍 😊 😒 😘 😭 😜 😁 🤣 😂 🙃 😉 😎 🥳 😡 🤬 🤯",
        "🐾 Hewan & Alam": "🐶 🐱 🐭 🐹 🐰 🦊 🐻 🐼 🐨 🐯 🦁 🐮 🐷 🐸 🐵 🐔 🐧 🐦",
        "🍕 Makanan & Minuman": "🍕 🍔 🍟 🌭 🍿 🥓 🥚 🍳 🥞 🧇 🧀 🍖 🍗 🥩 🍤 🍣 🍱",
        "🚗 Transportasi": "🚗 🚕 🚙 🚌 🚎 🏎️ 🚓 🚑 🚒 🚐 🚚 🚛 🚜 🏍️ 🛵 🚲 🛴",
        "⚽ Olahraga & Game": "⚽ 🏀 🏈 ⚾ 🎾 🏐 🏉 🎱 🏓 🏸 🏒 🏏 🥋 🥊 🎮 👾 🕹️",
        "🎵 Hiburan & Seni": "🎵 🎶 🎤 🎧 🎷 🎸 🎻 🥁 🎹 🎨 🎭 🎪 🎬 🎮 🎰 🎳",
        "📱 Teknologi": "📱 💻 🖥️ 🖨️ 🎧 🎮 📷 🎥 💾 📼 📟 📠 🔌 💡 🔦 🕯️",
        "🎨 Objek & Simbol": "❤️ 🧡 💛 💚 💙 💜 🖤 🤍 🤎 💔 ❣️ 💕 💞 💓 💗 💖 💘"
    };
    
    let message = `🎨 *DAFTAR EMOJI UNTUK MIX*\n\n`;
    
    for (const [category, emojis] of Object.entries(emojiCategories)) {
        message += `*${category}:*\n${emojis}\n\n`;
    }
    
    message += `💡 *Cara Penggunaan:*\n`;
    message += `/emojimix 😂 🐶\n`;
    message += `/emojimix 🤖 💻\n\n`;
    message += `⚠️ *Catatan:*\n`;
    message += `• Tidak semua kombinasi bisa digabungkan\n`;
    message += `• Gunakan emoji yang umum\n`;
    message += `• Coba kombinasi dalam kategori sama`;
    
    bot.sendMessage(chatId, message, {
        parse_mode: 'Markdown',
        reply_to_message_id: messageId,
        reply_markup: {
            inline_keyboard: [
                [
                    { text: "🎲 Kombinasi Acak", callback_data: "emojimix_random" },
                    { text: "🚀 Coba Sekarang", callback_data: "emojimix_menu" }
                ]
            ]
        }
    });
});

// ===========================================
// FEATURE: RANDOM EMOJI MIX
// ===========================================
bot.onText(/^\/emojirandom$/, async (msg) => {
    const chatId = msg.chat.id;
    const messageId = msg.message_id;
    
    // Daftar kombinasi yang sudah terbukti berhasil
    const provenCombinations = [
        ["😂", "😍"], ["🐶", "🐱"], ["🍕", "🍔"],
        ["🤖", "💻"], ["🎮", "👾"], ["🔥", "🚀"],
        ["🎵", "🎤"], ["☕", "🍩"], ["📱", "💻"],
        ["😎", "🚀"], ["🐼", "🎋"], ["🍦", "🍓"],
        ["🎯", "🎪"], ["🧠", "💡"], ["🌮", "🌯"],
        ["🦄", "🌈"], ["👻", "🎃"], ["🎄", "🎁"],
        ["🏆", "🥇"], ["💖", "💕"], ["🎸", "🎶"]
    ];
    
    // Pilih kombinasi acak
    const randomIndex = Math.floor(Math.random() * provenCombinations.length);
    const [emoji1, emoji2] = provenCombinations[randomIndex];
    
    // Kirim pesan
    await bot.sendMessage(chatId,
        `🎲 *Kombinasi Emoji Acak*\n\n` +
        `Coba gabungkan:\n` +
        `${emoji1} + ${emoji2}\n\n` +
        `Ketik: /emojimix ${emoji1} ${emoji2}`,
        {
            parse_mode: 'Markdown',
            reply_to_message_id: messageId,
            reply_markup: {
                inline_keyboard: [
                    [
                        { 
                            text: `🔀 Coba ${emoji1} + ${emoji2}`, 
                            callback_data: `emojimix_${emoji1}_${emoji2}`
                        }
                    ],
                    [
                        { text: "🎲 Kombinasi Lain", callback_data: "emojimix_random" },
                        { text: "📋 Daftar Emoji", callback_data: "emojimix_list" }
                    ]
                ]
            }
        }
    );
});

// 🐛 DEBUG EMOJI MIX
bot.onText(/^\/debugemojimix(?:\s+(\S+)\s+(\S+))?$/, async (msg, match) => {
    const chatId = msg.chat.id;
    const emoji1 = match[1] || "😂";
    const emoji2 = match[2] || "🐶";
    
    try {
        console.log("🔍 DEBUG EMOJI MIX");
        console.log("Emoji 1:", emoji1);
        console.log("Emoji 1 code:", emoji1.codePointAt(0).toString(16));
        console.log("Emoji 2:", emoji2);
        console.log("Emoji 2 code:", emoji2.codePointAt(0).toString(16));
        
        // Coba API langsung
        const testUrl = `https://api.deline.web.id/maker/emojimix?emoji1=${encodeURIComponent(emoji1)}&emoji2=${encodeURIComponent(emoji2)}`;
        console.log("Test URL:", testUrl);
        
        const response = await axios.get(testUrl, {
            timeout: 5000,
            validateStatus: () => true // Terima semua status
        });
        
        console.log("Response Status:", response.status);
        console.log("Response Headers:", JSON.stringify(response.headers, null, 2));
        console.log("Response Type:", typeof response.data);
        console.log("Response Length:", response.data?.length || 0);
        console.log("Content-Type:", response.headers['content-type']);
        
        let debugMessage = `🐛 *DEBUG EMOJI MIX*\n\n`;
        debugMessage += `Emoji 1: ${emoji1}\n`;
        debugMessage += `Emoji 2: ${emoji2}\n`;
        debugMessage += `URL: ${testUrl}\n\n`;
        debugMessage += `Status: ${response.status}\n`;
        debugMessage += `Content-Type: ${response.headers['content-type'] || 'Tidak ada'}\n`;
        debugMessage += `Data Type: ${typeof response.data}\n`;
        debugMessage += `Data Length: ${response.data?.length || 0}\n\n`;
        
        if (response.headers['content-type']?.includes('image')) {
            debugMessage += `✅ API mengembalikan gambar\n`;
            // Coba kirim gambar
            await bot.sendPhoto(chatId, Buffer.from(response.data), {
                caption: `Debug: ${emoji1} + ${emoji2}`
            });
        } else if (typeof response.data === 'string') {
            debugMessage += `📝 Response text: ${response.data.substring(0, 200)}...`;
        } else if (response.data && typeof response.data === 'object') {
            debugMessage += `📦 Response JSON: ${JSON.stringify(response.data, null, 2).substring(0, 300)}...`;
        }
        
        await bot.sendMessage(chatId, debugMessage, { parse_mode: 'Markdown' });
        
    } catch (error) {
        console.error("Debug error:", error);
        await bot.sendMessage(chatId, 
            `❌ Debug Error:\n${error.message}\n\nStack: ${error.stack}`,
            { parse_mode: 'Markdown' }
        );
    }
});

//Iqc
bot.onText(/\/iqc/, async (msg) => {
	notifyOwner('iqc', msg);
	
  try {
    const text = msg.text.split(' ').slice(1).join(' ');
    if (!text) return bot.sendMessage(msg.chat.id, 'Contoh: /iqc halo');
    
    await bot.sendMessage(msg.chat.id, '⏳');
    
    const url = `https://brat.siputzx.my.id/iphone-quoted?time=17:23&batteryPercentage=87&carrierName=INDOSAT&messageText=${encodeURIComponent(text)}&emojiStyle=apple`;
    const res = await axios.get(url, { responseType: 'arraybuffer' });
    
    await bot.sendPhoto(msg.chat.id, Buffer.from(res.data));

  } catch (e) {
    console.error('/iqc error', e);
    await bot.sendMessage(msg.chat.id, 'Gagal memproses iqc.');
  }
});

//brat
bot.onText(/\/brat (.+)/, async (msg, match) => {
	notifyOwner('brat', msg);
    const chatId = msg.chat.id;
    const text = match[1];

    if (!text) {
        return bot.sendMessage(chatId, 'Contoh penggunaan: /brat teksnya');
    }

    try {
        const imageUrl = `https://kepolu-brat.hf.space/brat?q=${encodeURIComponent(text)}`;
        const tempFilePath = './temp_sticker.webp';
        const downloadFile = async (url, dest) => {
            const writer = fs.createWriteStream(dest);

            const response = await axios({
                url,
                method: 'GET',
                responseType: 'stream',
            });

            response.data.pipe(writer);

            return new Promise((resolve, reject) => {
                writer.on('finish', resolve);
                writer.on('error', reject);
            });
        };

        await downloadFile(imageUrl, tempFilePath);

        await bot.sendSticker(chatId, tempFilePath);

        await fs.promises.unlink(tempFilePath);
    } catch (error) {
        console.error(error.message || error);
        bot.sendMessage(chatId, 'Terjadi kesalahan saat membuat stiker. Pastikan teks valid atau coba lagi.');
    }
});

// Buat folder temp jika belum ada
const tempDir = path.join(__dirname, 'temp');
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}

// Function untuk download gambar
const downloadImage = async (url, filepath) => {
  const response = await axios({
    url,
    method: 'GET',
    responseType: 'stream',
    timeout: 30000,
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    }
  });

  const writer = fs.createWriteStream(filepath);
  response.data.pipe(writer);

  return new Promise((resolve, reject) => {
    writer.on('finish', resolve);
    writer.on('error', reject);
  });
};

// command papayang
bot.onText(/^\/papayang$/, async (msg) => {
  const chatId = msg.chat.id;
  let wait;
  let tempFile = null;

  try {
    // Kirim loading message
    await bot.sendChatAction(chatId, "upload_photo");
    wait = await bot.sendMessage(chatId, "🔄 Mengambil gambar pap ayang...", {
      reply_to_message_id: msg.message_id
    });

    // Fetch dari API
    console.log('Fetching papayang API...');
    const response = await axios.get('https://api-faa.my.id/faa/papayang', {
      timeout: 30000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json, text/plain, */*',
        'Referer': 'https://api-faa.my.id/'
      }
    });

    // Debug: log full response
    console.log('Papayang Full Response:', JSON.stringify(response.data, null, 2));

    // Cek berbagai kemungkinan struktur response
    let imageUrl;
    
    // Helper function untuk validasi URL
    const isValidUrl = (str) => {
      if (typeof str !== 'string') return false;
      return str.startsWith('http://') || str.startsWith('https://');
    };
    
    if (isValidUrl(response.data.url)) {
      imageUrl = response.data.url;
    } else if (isValidUrl(response.data.result?.url)) {
      imageUrl = response.data.result.url;
    } else if (isValidUrl(response.data.data?.url)) {
      imageUrl = response.data.data.url;
    } else if (isValidUrl(response.data.image)) {
      imageUrl = response.data.image;
    } else if (isValidUrl(response.data)) {
      imageUrl = response.data;
    } else {
      // Log seluruh struktur response untuk debugging
      console.error('Full Response Keys:', Object.keys(response.data));
      console.error('Full Response Values:', Object.values(response.data));
      throw new Error("URL gambar tidak ditemukan. Cek console untuk detail response.");
    }

    console.log('Image URL found:', imageUrl);

    // Update loading message
    await bot.editMessageText("📥 Mengunduh gambar...", {
      chat_id: chatId,
      message_id: wait.message_id
    });

    // Download gambar ke temp folder
    const fileName = `papayang_${Date.now()}.jpg`;
    tempFile = path.join(tempDir, fileName);
    
    console.log('Downloading image to:', tempFile);
    await downloadImage(imageUrl, tempFile);
    console.log('Download complete!');

    // Update loading message
    await bot.editMessageText("📤 Mengirim gambar...", {
      chat_id: chatId,
      message_id: wait.message_id
    });

    // Kirim gambar dari file
    await bot.sendPhoto(chatId, tempFile, {
      caption: "🎀 Random Papayang Image",
      reply_to_message_id: msg.message_id
    });

    // Hapus pesan loading
    await bot.deleteMessage(chatId, wait.message_id).catch(() => {});

    // Hapus file temporary
    if (fs.existsSync(tempFile)) {
      fs.unlinkSync(tempFile);
      console.log('Temp file deleted:', tempFile);
    }

  } catch (err) {
    console.error("❌ Error Papayang:", err.message);
    if (err.response) {
      console.error("Response Status:", err.response.status);
      console.error("Response Headers:", err.response.headers);
      console.error("Response Data:", err.response.data);
    }
    
    const errMsg = err.code === 'ECONNABORTED' 
      ? "⏱️ Timeout! Server terlalu lama merespons."
      : err.response?.status === 403
      ? "🚫 Akses ditolak oleh server (403 Forbidden)"
      : err.response?.status === 404
      ? "❌ Endpoint tidak ditemukan (404)"
      : err.response?.status 
      ? `🌐 Server error (${err.response.status})`
      : err.message.includes("URL gambar tidak ditemukan")
      ? "⚠️ Response API tidak mengandung URL gambar.\n\nCek console untuk melihat struktur response API."
      : `⚠️ ${err.message}`;

    if (wait) {
      try {
        await bot.editMessageText(errMsg, {
          chat_id: chatId,
          message_id: wait.message_id
        });
      } catch {
        await bot.sendMessage(chatId, errMsg, {
          reply_to_message_id: msg.message_id
        });
      }
    } else {
      await bot.sendMessage(chatId, errMsg, {
        reply_to_message_id: msg.message_id
      });
    }

    // Hapus file temporary jika ada error
    if (tempFile && fs.existsSync(tempFile)) {
      fs.unlinkSync(tempFile);
    }
  }
});

// command waifu
bot.onText(/^\/waifu$/, async (msg) => {
  const chatId = msg.chat.id;
  let wait;
  let tempFile = null;

  try {
    // Kirim loading message
    await bot.sendChatAction(chatId, "upload_photo");
    wait = await bot.sendMessage(chatId, "🔄 Mengambil gambar waifu...", {
      reply_to_message_id: msg.message_id
    });

    // Fetch dari API
    console.log('Fetching waifu API...');
    const response = await axios.get('https://api-faa.my.id/faa/waifu', {
      timeout: 30000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json, text/plain, */*',
        'Referer': 'https://api-faa.my.id/'
      }
    });

    // Debug: log full response
    console.log('Waifu Full Response:', JSON.stringify(response.data, null, 2));

    // Cek berbagai kemungkinan struktur response
    let imageUrl;
    
    // Helper function untuk validasi URL
    const isValidUrl = (str) => {
      if (typeof str !== 'string') return false;
      return str.startsWith('http://') || str.startsWith('https://');
    };
    
    if (isValidUrl(response.data.url)) {
      imageUrl = response.data.url;
    } else if (isValidUrl(response.data.result?.url)) {
      imageUrl = response.data.result.url;
    } else if (isValidUrl(response.data.data?.url)) {
      imageUrl = response.data.data.url;
    } else if (isValidUrl(response.data.image)) {
      imageUrl = response.data.image;
    } else if (isValidUrl(response.data)) {
      imageUrl = response.data;
    } else {
      // Log seluruh struktur response untuk debugging
      console.error('Full Response Keys:', Object.keys(response.data));
      console.error('Full Response Values:', Object.values(response.data));
      throw new Error("URL gambar tidak ditemukan. Cek console untuk detail response.");
    }

    console.log('Image URL found:', imageUrl);

    // Update loading message
    await bot.editMessageText("📥 Mengunduh gambar...", {
      chat_id: chatId,
      message_id: wait.message_id
    });

    // Download gambar ke temp folder
    const fileName = `waifu_${Date.now()}.jpg`;
    tempFile = path.join(tempDir, fileName);
    
    console.log('Downloading image to:', tempFile);
    await downloadImage(imageUrl, tempFile);
    console.log('Download complete!');

    // Update loading message
    await bot.editMessageText("📤 Mengirim gambar...", {
      chat_id: chatId,
      message_id: wait.message_id
    });

    // Kirim gambar dari file
    await bot.sendPhoto(chatId, tempFile, {
      caption: "💖 Random Waifu Image",
      reply_to_message_id: msg.message_id
    });

    // Hapus pesan loading
    await bot.deleteMessage(chatId, wait.message_id).catch(() => {});

    // Hapus file temporary
    if (fs.existsSync(tempFile)) {
      fs.unlinkSync(tempFile);
      console.log('Temp file deleted:', tempFile);
    }

  } catch (err) {
    console.error("❌ Error Waifu:", err.message);
    if (err.response) {
      console.error("Response Status:", err.response.status);
      console.error("Response Headers:", err.response.headers);
      console.error("Response Data:", err.response.data);
    }
    
    const errMsg = err.code === 'ECONNABORTED' 
      ? "⏱️ Timeout! Server terlalu lama merespons."
      : err.response?.status === 403
      ? "🚫 Akses ditolak oleh server (403 Forbidden)"
      : err.response?.status === 404
      ? "❌ Endpoint tidak ditemukan (404)"
      : err.response?.status 
      ? `🌐 Server error (${err.response.status})`
      : err.message.includes("URL gambar tidak ditemukan")
      ? "⚠️ Response API tidak mengandung URL gambar.\n\nCek console untuk melihat struktur response API."
      : `⚠️ ${err.message}`;

    if (wait) {
      try {
        await bot.editMessageText(errMsg, {
          chat_id: chatId,
          message_id: wait.message_id
        });
      } catch {
        await bot.sendMessage(chatId, errMsg, {
          reply_to_message_id: msg.message_id
        });
      }
    } else {
      await bot.sendMessage(chatId, errMsg, {
        reply_to_message_id: msg.message_id
      });
    }

    // Hapus file temporary jika ada error
    if (tempFile && fs.existsSync(tempFile)) {
      fs.unlinkSync(tempFile);
    }
  }
});

// command anime (gabungan dengan button)
bot.onText(/^\/pap$/, async (msg) => {
  const chatId = msg.chat.id;

  const inlineKeyboard = {
    inline_keyboard: [
      [
        { text: "🎀 Pap ayang", callback_data: "anime_papayang" },
        { text: "💖 Waifu", callback_data: "anime_waifu" }
      ]
    ]
  };

  await bot.sendMessage(
    chatId, 
    "🎨 *Pilih kategori pap:*\n\nSilahkan pilih salah satu:", 
    {
      parse_mode: "Markdown",
      reply_markup: inlineKeyboard,
      reply_to_message_id: msg.message_id
    }
  );
});

// Handler untuk button anime
bot.on("callback_query", async (query) => {
  const chatId = query.message.chat.id;
  const messageId = query.message.message_id;
  const data = query.data;
  let tempFile = null;

  try {
    if (data === "anime_papayang") {
      await bot.answerCallbackQuery(query.id, { text: "🔄 Mengambil pap ayang..." });
      await bot.sendChatAction(chatId, "upload_photo");

      console.log('Button: Fetching papayang API...');
      const response = await axios.get('https://api-faa.my.id/faa/papayang', {
        timeout: 30000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Accept': 'application/json, text/plain, */*',
          'Referer': 'https://api-faa.my.id/'
        }
      });

      console.log('Button Pap ayang Response:', JSON.stringify(response.data, null, 2));

      let imageUrl;
      
      // Helper function untuk validasi URL
      const isValidUrl = (str) => {
        if (typeof str !== 'string') return false;
        return str.startsWith('http://') || str.startsWith('https://');
      };
      
      if (isValidUrl(response.data.url)) imageUrl = response.data.url;
      else if (isValidUrl(response.data.result?.url)) imageUrl = response.data.result.url;
      else if (isValidUrl(response.data.data?.url)) imageUrl = response.data.data.url;
      else if (isValidUrl(response.data.image)) imageUrl = response.data.image;
      else if (isValidUrl(response.data)) imageUrl = response.data;
      else {
        console.error('Full Response Keys:', Object.keys(response.data));
        console.error('Full Response Values:', Object.values(response.data));
        throw new Error("URL gambar tidak ditemukan");
      }

      console.log('Button: Image URL found:', imageUrl);

      const fileName = `papayang_btn_${Date.now()}.jpg`;
      tempFile = path.join(tempDir, fileName);
      
      await downloadImage(imageUrl, tempFile);
      console.log('Button: Download complete!');

      await bot.sendPhoto(chatId, tempFile, {
        caption: "🎀 Random Pap ayang",
        reply_to_message_id: messageId
      });

      if (fs.existsSync(tempFile)) {
        fs.unlinkSync(tempFile);
      }

    } else if (data === "anime_waifu") {
      await bot.answerCallbackQuery(query.id, { text: "🔄 Mengambil waifu..." });
      await bot.sendChatAction(chatId, "upload_photo");

      console.log('Button: Fetching waifu API...');
      const response = await axios.get('https://api-faa.my.id/faa/waifu', {
        timeout: 30000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Accept': 'application/json, text/plain, */*',
          'Referer': 'https://api-faa.my.id/'
        }
      });

      console.log('Button Waifu Response:', JSON.stringify(response.data, null, 2));

      let imageUrl;
      
      // Helper function untuk validasi URL
      const isValidUrl = (str) => {
        if (typeof str !== 'string') return false;
        return str.startsWith('http://') || str.startsWith('https://');
      };
      
      if (isValidUrl(response.data.url)) imageUrl = response.data.url;
      else if (isValidUrl(response.data.result?.url)) imageUrl = response.data.result.url;
      else if (isValidUrl(response.data.data?.url)) imageUrl = response.data.data.url;
      else if (isValidUrl(response.data.image)) imageUrl = response.data.image;
      else if (isValidUrl(response.data)) imageUrl = response.data;
      else {
        console.error('Full Response Keys:', Object.keys(response.data));
        console.error('Full Response Values:', Object.values(response.data));
        throw new Error("URL gambar tidak ditemukan");
      }

      console.log('Button: Image URL found:', imageUrl);

      const fileName = `waifu_btn_${Date.now()}.jpg`;
      tempFile = path.join(tempDir, fileName);
      
      await downloadImage(imageUrl, tempFile);
      console.log('Button: Download complete!');

      await bot.sendPhoto(chatId, tempFile, {
        caption: "💖 Random Waifu Image",
        reply_to_message_id: messageId
      });

      if (fs.existsSync(tempFile)) {
        fs.unlinkSync(tempFile);
      }
    }

  } catch (err) {
    console.error("❌ Callback Error:", err.message);
    if (err.response) {
      console.error("Response Status:", err.response.status);
      console.error("Response Data:", err.response.data);
    }
    
    const errMsg = err.response?.status === 403
      ? "🚫 Akses ditolak (403)"
      : err.response?.status 
      ? `🌐 Server error (${err.response.status})`
      : "⚠️ Gagal mengambil gambar. Cek console.";

    await bot.answerCallbackQuery(query.id, { text: "❌ Error!" });
    await bot.sendMessage(chatId, errMsg, {
      reply_to_message_id: messageId
    });

    if (tempFile && fs.existsSync(tempFile)) {
      fs.unlinkSync(tempFile);
    }
  }
});

bot.onText(/^\/cweb$/, async (msg) => {
    const chatId = msg.chat.id
    const keyboard = {
      inline_keyboard: [
        [{ text: "📤 Create Website", callback_data: "menu_deploy" }],
        [{ text: "🌐 Web2Zip", callback_data: "menu_web2zip" }]
      ]
    }
    await bot.sendMessage(chatId, `<b>🌐 ᴡᴇʙ ᴅᴇᴘʟᴏʏ ᴍᴇɴᴜ</b>\nᴛʜᴀɴᴋꜱ ꜰʀᴏᴍ @${owner}`, {
      parse_mode: "HTML",
      reply_markup: keyboard
    })
  })

  bot.on("callback_query", async (callbackQuery) => {
    const chatId = callbackQuery.message.chat.id
    const data = callbackQuery.data
    const userId = callbackQuery.from.id

    if (data === "menu_deploy") {
      userState[userId] = { step: "upload", data: {} }
      bot.answerCallbackQuery(callbackQuery.id)
      return bot.sendMessage(chatId, `<blockquote>✅ Kirim file dengan format\n.zip atau .html untuk dideploy.</blockquote>`, { parse_mode: "HTML" })
    }

    if (data === "menu_web2zip") {
      userState[userId] = { step: "web2zip", data: {} }
      bot.answerCallbackQuery(callbackQuery.id)
      return bot.sendMessage(chatId, `<blockquote>🌐 Kirim URL website.\nContoh: https://example.com</blockquote>`, { parse_mode: "HTML" })
    }
  })

  bot.on("document", async (msg) => {
    const chatId = msg.chat.id
    const userId = msg.from.id
    if (!userState[userId] || userState[userId].step !== "upload") return

    const fileId = msg.document.file_id
    const file = await bot.getFile(fileId)
    const fileLink = `https://api.telegram.org/file/bot${settings.token}/${file.file_path}`

    userState[userId] = {
      step: "name",
      data: {
        file: fileLink,
        isZip: msg.document.file_name.endsWith(".zip"),
        isHtml: msg.document.file_name.endsWith(".html")
      }
    }

    await bot.sendMessage(chatId, `<blockquote>📦 Sukses terima file!\nSekarang kirim nama untuk website anda.</blockquote>`, { parse_mode: "HTML" })
  })

  bot.on("message", async (msg) => {
    const chatId = msg.chat.id
    const userId = msg.from.id
    const text = msg.text?.trim()
    if (!text || !userState[userId]) return

    const state = userState[userId]

    if (state.step === "web2zip") {
      userState[userId] = null

      if (!text.startsWith("http://") && !text.startsWith("https://")) {
        return bot.sendMessage(chatId, `<blockquote>❌ URL tidak valid!</blockquote>`, { parse_mode: "HTML" })
      }

      await bot.sendMessage(chatId, `<blockquote>⏳ Processing website...</blockquote>`, { parse_mode: "HTML" })
      try {
        const encodedUrl = encodeURIComponent(text)
        const apiUrl = `https://api.nekolabs.my.id/tools/web2zip?url=${encodedUrl}`
        const response = await fetch(apiUrl)
        if (!response.ok) throw new Error(`HTTP error ${response.status}`)

        const json = await response.json()
        if (!json.status || !json.result?.downloadUrl) throw new Error("Gagal ambil source")

        const zipRes = await fetch(json.result.downloadUrl)
        const buffer = await zipRes.buffer()

        await bot.sendDocument(chatId, buffer, {
          parse_mode: "HTML"
        }, {
          filename: `website-by-@${owner}.zip`,
          contentType: "application/zip"
        })
      } catch (e) {
        bot.sendMessage(chatId, `<blockquote>❌ Error extract:\n${e.message}</blockquote>`, { parse_mode: "HTML" })
      }
      return
    }

    if (state.step === "name") {
      const webName = text.toLowerCase().replace(/[^a-z0-9-_]/g, "")
      await bot.sendMessage(chatId, "<blockquote>⏳ Mengecek nama website...</blockquote>", { parse_mode: "HTML" })

      try {
        const domainCheckUrl = `https://${webName}.vercel.app`
        try { await fetch(domainCheckUrl) } catch {}

        const fileBuffer = await fetch(state.data.file).then(res => res.buffer())
        const filesToUpload = []

        if (state.data.isZip) {
          const directory = await unzipper.Open.buffer(Buffer.from(fileBuffer))
          for (const zipFile of directory.files) {
            if (zipFile.type === "File") {
              const content = await zipFile.buffer()
              const filePath = zipFile.path.replace(/^\/+/, "")
              filesToUpload.push({ file: filePath, data: content.toString("base64"), encoding: "base64" })
            }
          }
        } else if (state.data.isHtml) {
          filesToUpload.push({ file: "index.html", data: Buffer.from(fileBuffer).toString("base64"), encoding: "base64" })
        }

        const headers = { Authorization: `Bearer ${settings.vercelToken}`, "Content-Type": "application/json" }
        await fetch("https://api.vercel.com/v9/projects", { method: "POST", headers, body: JSON.stringify({ name: webName }) }).catch(() => {})
        const deployRes = await fetch("https://api.vercel.com/v13/deployments", { method: "POST", headers, body: JSON.stringify({ name: webName, project: webName, files: filesToUpload }) })
        const deployData = await deployRes.json()

        if (!deployData.url || !deployData.id) throw new Error("Deploy gagal")

        await fetch(`https://api.vercel.com/v2/deployments/${deployData.id}/aliases`, { method: "POST", headers, body: JSON.stringify({ alias: `${webName}.vercel.app` }) })
        await bot.sendMessage(chatId, `<blockquote><b>✅ Website berhasil dibuat!</b>\n\n🔗 https://${webName}.vercel.app</blockquote>`, {
          parse_mode: "HTML",
          reply_markup: { inline_keyboard: [[{ text: "🌐 ᴄᴇᴋ ᴡᴇʙꜱɪᴛᴇ", url: `https://${webName}.vercel.app` }]] }
        })
      } catch (e) {
        bot.sendMessage(chatId, `<blockquote>❌ Deploy gagal:\n${e.message}</blockquote>`, { parse_mode: "HTML" })
      }
      userState[userId] = null
    }
  });

//tourl
bot.onText(/\/tourl/, async (msg, match) => {
	notifyOwner('tourl', msg);
    const chatId = msg.chat.id;
    const isPrivateChat = msg.chat.type === 'private';

    if (msg.reply_to_message && msg.reply_to_message.photo) {
        try {
            const fileId = msg.reply_to_message.photo[msg.reply_to_message.photo.length - 1].file_id;
            const filePath = await bot.downloadFile(fileId, './temp');
            const fileBuffer = fs.readFileSync(filePath);
            
            const service = new ImageUploadService('pixhost.to');
            const { directLink } = await service.uploadFromBinary(fileBuffer, 'uploaded_image.png');
            const responseText = `Berikut adalah URL gambar Anda:\n${directLink}`;
            bot.sendMessage(chatId, responseText, { reply_to_message_id: msg.message_id });

            fs.unlinkSync(filePath);
        } catch (error) {
            const errorMessage = `Terjadi kesalahan: ${error.message}`;
            bot.sendMessage(chatId, errorMessage, { reply_to_message_id: msg.message_id });
        }
    } else {
       
        const errorText = isPrivateChat
            ? 'Harap balas pesan dengan gambar untuk mengubahnya menjadi URL.'
            : 'Perintah ini hanya berfungsi jika Anda membalas pesan dengan gambar.';
        bot.sendMessage(chatId, errorText, { reply_to_message_id: msg.message_id });
    }
});

const doConvert = async (imageInput) => {
  const form = new FormData();

  form.append('format', 'ascii');
  form.append('width', '100');
  form.append('textcolor', '#000000');
  form.append('bgcolor', '#ffffff');
  form.append('invert', '0');
  form.append('contrast', '1');

  if (imageInput.startsWith('http')) {
    const imgBuffer = await ax.get(imageInput, {
      responseType: 'arraybuffer'
    });
    form.append('image', Buffer.from(imgBuffer.data), {
      filename: 'remote-img.jpg',
      contentType: 'image/jpeg'
    });
  } else {
    const localPath = path.resolve(imageInput);
    const stream = fs.createReadStream(localPath);
    form.append('image', stream, {
      filename: path.basename(localPath),
      contentType: 'image/jpeg'
    });
  }

  try {
    const res = await ax.post('/convert/result.cgi', form, {
      baseURL: 'https://www.text-image.com',
      headers: {
        ...form.getHeaders(),
        Origin: 'https://www.text-image.com',
        Referer: 'https://www.text-image.com/convert/ascii.html'
      },
      maxBodyLength: Infinity,
      maxContentLength: Infinity
    });

    const $ = ch.load(res.data);
    const ascii = $('#tiresult').text().trim();
    const shareLink = $('#sharebutton').parent().find('a').attr('href') ?? null;

    return { ascii, shareLink };
  } catch (err) {
    console.log('Error:', err.message);
    return null;
  }
};

// Handler untuk foto
bot.on('photo', async (msg) => {
  const chatId = msg.chat.id;
  const photo = msg.photo[msg.photo.length - 1]; // Ambil foto dengan resolusi tertinggi

  try {
    // Kirim status processing
    await bot.sendMessage(chatId, '⏳ Sedang memproses gambar...');

    // Download foto dari Telegram
    const fileLink = await bot.getFileLink(photo.file_id);
    
    // Konversi ke ASCII
    const result = await doConvert(fileLink);

    if (!result || !result.ascii) {
      await bot.sendMessage(chatId, '❌ Gagal mengkonversi gambar. Coba lagi!');
      return;
    }

    // Kirim hasil ASCII (split jika terlalu panjang)
    const maxLength = 4096; // Batas karakter Telegram
    if (result.ascii.length <= maxLength) {
      await bot.sendMessage(chatId, `\`\`\`\n${result.ascii}\n\`\`\``, {
        parse_mode: 'Markdown'
      });
    } else {
      // Split menjadi beberapa pesan jika terlalu panjang
      const chunks = result.ascii.match(new RegExp(`.{1,${maxLength - 10}}`, 'g'));
      for (const chunk of chunks) {
        await bot.sendMessage(chatId, `\`\`\`\n${chunk}\n\`\`\``, {
          parse_mode: 'Markdown'
        });
      }
    }

    // Kirim share link jika ada
    if (result.shareLink) {
      await bot.sendMessage(
        chatId,
        `🔗 Share link: ${result.shareLink}`
      );
    }

  } catch (err) {
    console.error('Error:', err);
    await bot.sendMessage(
      chatId,
      '❌ Terjadi kesalahan saat memproses gambar.'
    );
  }
});

// Handler untuk dokumen gambar
bot.on('document', async (msg) => {
  const chatId = msg.chat.id;
  const doc = msg.document;

  // Cek apakah dokumen adalah gambar
  if (!doc.mime_type || !doc.mime_type.startsWith('image/')) {
    await bot.sendMessage(chatId, '❌ Hanya file gambar yang didukung!');
    return;
  }

  try {
    await bot.sendMessage(chatId, '⏳ Sedang memproses gambar...');

    const fileLink = await bot.getFileLink(doc.file_id);
    const result = await doConvert(fileLink);

    if (!result || !result.ascii) {
      await bot.sendMessage(chatId, '❌ Gagal mengkonversi gambar. Coba lagi!');
      return;
    }

    const maxLength = 4096;
    if (result.ascii.length <= maxLength) {
      await bot.sendMessage(chatId, `\`\`\`\n${result.ascii}\n\`\`\``, {
        parse_mode: 'Markdown'
      });
    } else {
      const chunks = result.ascii.match(new RegExp(`.{1,${maxLength - 10}}`, 'g'));
      for (const chunk of chunks) {
        await bot.sendMessage(chatId, `\`\`\`\n${chunk}\n\`\`\``, {
          parse_mode: 'Markdown'
        });
      }
    }

    if (result.shareLink) {
      await bot.sendMessage(chatId, `🔗 Share link: ${result.shareLink}`);
    }

  } catch (err) {
    console.error('Error:', err);
    await bot.sendMessage(chatId, '❌ Terjadi kesalahan saat memproses gambar.');
  }
});

    // command stalkig  
bot.onText(/^\/stalkig(?:\s+(.+))?/, async (msg, match) => {
  notifyOwner('stalkig', msg);
  const chatId = msg.chat.id;
  const username = match[1];

  if (!username) {
    return bot.sendMessage(chatId, "⚠️ Masukkan username IG!\nContoh: /stalkig google");
  }
    
  let loadingMsg;
  try {
    loadingMsg = await bot.sendMessage(chatId, '⏳ Mengambil data...', {
      reply_to_message_id: msg.message_id
    });

    const apiUrl = `https://api-faa.my.id/faa/igstalk?username=${encodeURIComponent(username)}`;
    const res = await fetch(apiUrl);
    
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    
    const json = await res.json();

    if (!json.status || !json.result || !json.result.profile) {
      await bot.deleteMessage(chatId, loadingMsg.message_id);
      return bot.sendMessage(chatId, "❌ User tidak ditemukan atau API error!");
    }

    // Sesuai struktur API: json.result.profile
    const profile = json.result.profile;

    let caption = `✦ Instagram Stalker ✦

⤷ ɴᴀᴍᴀ: ${profile.full_name || "Kosong"}
⤷ ᴜꜱᴇʀɴᴀᴍᴇ: ${profile.username || "Kosong"}
⤷ ʙɪᴏ: ${profile.biography || "Kosong"}
⤷ ꜰᴏʟʟᴏᴡᴇʀꜱ: ${profile.followers || 0}
⤷ ꜰᴏʟʟᴏᴡɪɴɢ: ${profile.following || 0}
⤷ ᴘᴏꜱᴛꜱ: ${profile.posts || 0}

✦ ᴘʀᴏꜰɪʟᴇ ɪɴꜰᴏ ✦
⤷ Profile URL: ${profile.profile_picture_url || "Kosong"}`;

    // Hapus loading message
    await bot.deleteMessage(chatId, loadingMsg.message_id).catch(() => {});

    // Kirim foto profil - pakai profile_picture_hd atau profile_picture_url
    const profilePic = profile.profile_picture_hd || profile.profile_picture_url;
    
    if (profilePic) {
      await bot.sendPhoto(chatId, profilePic, {
        caption,
        reply_to_message_id: msg.message_id
      });
    } else {
      await bot.sendMessage(chatId, caption, {
        reply_to_message_id: msg.message_id
      });
    }

  } catch (err) {
    console.error("Error detail:", err);
    
    if (loadingMsg) {
      await bot.deleteMessage(chatId, loadingMsg.message_id).catch(() => {});
    }
    
    await bot.sendMessage(chatId, "❌ Gagal mengambil data user IG.\nError: " + err.message, {
      reply_to_message_id: msg.message_id
    });
  }
});
    
    // command /stalkroblox
bot.onText(/^\/stalkroblox (.+)/, async (msg, match) => {
  notifyOwner('stalkroblox', msg);
  const chatId = msg.chat.id;
  const username = match[1];

  bot.sendMessage(chatId, '⏳', {
    reply_to_message_id: msg.message_id
  });
    
  try {
    const res = await axios.get(`https://api.siputzx.my.id/api/stalk/roblox?user=${encodeURIComponent(username)}`);
    const data = res.data;

    if (!data.status) {
      return bot.sendMessage(chatId, `❌ User *${username}* tidak ditemukan`, { parse_mode: "Markdown" });
    }

    const info = data.data;
    const basic = info.basic;
    const avatar = info.avatar?.fullBody?.data?.[0]?.imageUrl;
    const followers = info.social?.followers?.count || 0;
    const following = info.social?.following?.count || 0;
    const friends = info.social?.friends?.count || 0;
    const groups = info.groups?.list?.data?.length || 0;

    let caption = `
╭───❖ *Roblox Stalker*
│ 👤 *Username:* ${basic.name}
│ 🏷️ *Display:* ${basic.displayName}
│ 🆔 *UserId:* ${basic.id}
│ 📅 *Created:* ${basic.created.split("T")[0]}
│ ✅ *Verified:* ${basic.hasVerifiedBadge ? "Yes" : "No"}
│ 🤝 *Friends:* ${friends}
│ 👥 *Followers:* ${followers}
│ 👣 *Following:* ${following}
│ 👪 *Groups:* ${groups}
╰─────────────❖
    `;

    if (info.achievements?.robloxBadges?.length) {
      caption += `\n🏅 *Achievement:*\n`;
      info.achievements.robloxBadges.slice(0, 5).forEach(b => {
        caption += `- ${b.name}\n`;
      });
      if (info.achievements.robloxBadges.length > 5) caption += `+${info.achievements.robloxBadges.length - 5} more...\n`;
    }

    if (avatar) {
      await bot.sendPhoto(chatId, avatar, {
        caption,
        parse_mode: "Markdown"
      });
    } else {
      await bot.sendMessage(chatId, caption, { parse_mode: "Markdown" });
    }

  } catch (e) {
    console.error(e);
    bot.sendMessage(chatId, "❌ Gagal ambil data Roblox user!");
  }
});
    
    // command /stalktiktok
bot.onText(/^\/stalktiktok(?:\s+(.+))?/, async (msg, match) => {
  notifyOwner('stalktt', msg);
  const chatId = msg.chat.id;
  const username = match[1]?.trim();

  if (!username) {
    return bot.sendMessage(chatId, "⚠️ Masukkan username TikTok.\nContoh: `/stalktiktok mrbeast`", { parse_mode: "Markdown" });
  }
    
  const loadingMsg = await bot.sendMessage(chatId, '⏳ Sedang mengambil data...', {
    reply_to_message_id: msg.message_id
  });

  try {
    const res = await axios.get(`https://api-faa.my.id/faa/tiktokstalk?username=${encodeURIComponent(username)}`);
    const data = res.data;

    // DEBUG: Log struktur response
    console.log('API Response:', JSON.stringify(data, null, 2));

    // Cek berbagai kemungkinan struktur response
    let user, stats;

    if (data.data?.user) {
      // Struktur: data.data.user
      user = data.data.user;
      stats = data.data.stats;
    } else if (data.user) {
      // Struktur: data.user
      user = data.user;
      stats = data.stats;
    } else if (data.result) {
      // Struktur: data.result
      user = data.result.user || data.result;
      stats = data.result.stats || data.result;
    } else {
      // Struktur langsung
      user = data;
      stats = data;
    }

    if (!user) {
      await bot.deleteMessage(chatId, loadingMsg.message_id);
      return bot.sendMessage(chatId, "❌ User TikTok tidak ditemukan atau format response tidak sesuai.");
    }

    const caption = `
⟢ TikTok Stalk Result
──────────────────────
✦ ID: \`${user.id || user.uid || '-'}\`
✦ Username: @${user.uniqueId || user.username || username}
✦ Nickname: ${user.nickname || user.nickName || '-'}
✦ Verified: ${user.verified ? "✅ Yes" : "❌ No"}
✦ Bio: ${user.signature || user.bio || "-"}
✦ Link: ${user.bioLink?.link || user.bioLink || "-"}

⟢ Stats
──────────────────────
✦ Followers: ${(stats.followerCount || stats.followers || 0).toLocaleString('id-ID')}
✦ Following: ${(stats.followingCount || stats.following || 0).toLocaleString('id-ID')}
✦ Likes: ${(stats.heartCount || stats.hearts || stats.likes || 0).toLocaleString('id-ID')}
✦ Videos: ${(stats.videoCount || stats.videos || 0).toLocaleString('id-ID')}
    `.trim();

    await bot.deleteMessage(chatId, loadingMsg.message_id);
    
    const avatar = user.avatarLarger || user.avatarLarge || user.avatar || user.avatarThumb;
    
    if (avatar) {
      await bot.sendPhoto(chatId, avatar, {
        caption,
        parse_mode: "Markdown",
        reply_to_message_id: msg.message_id
      });
    } else {
      await bot.sendMessage(chatId, caption, {
        parse_mode: "Markdown",
        reply_to_message_id: msg.message_id
      });
    }

  } catch (e) {
    console.error('TikTok Stalk Error:', e.response?.data || e.message);
    await bot.deleteMessage(chatId, loadingMsg.message_id).catch(() => {});
    bot.sendMessage(chatId, `❌ Gagal mengambil data TikTok.\nError: ${e.message}`, {
      reply_to_message_id: msg.message_id
    });
  }
});
    
    // command /stalkyt
bot.onText(/\/stalkyt (.+)/, async (msg, match) => {
  notifyOwner('stalkyt', msg);
  const chatId = msg.chat.id;
  const username = match[1];
    
  bot.sendMessage(chatId, '⏳', {
    reply_to_message_id: msg.message_id
  });

  try {
    const res = await axios.get(`https://api.zenzxz.my.id/api/stalker/youtube?username=${encodeURIComponent(username)}`);
    const json = res.data;

    if (!json.status) {
      return bot.sendMessage(chatId, "⚠️ Channel tidak ditemukan.");
    }

    const ch = json.data.channel;
    const videos = json.data.latest_videos;

    let caption = `✦ YouTube Stalker ✦\n\n` +
      `⤷ ᴜꜱᴇʀɴᴀᴍᴇ: ${ch.username}\n` +
      `⤷ ꜱᴜʙꜱᴄʀɪʙᴇʀꜱ: ${ch.subscriberCount}\n` +
      `⤷ ᴠɪᴅᴇᴏꜱ: ${ch.videoCount}\n` +
      `⤷ ʟɪɴᴋ: ${ch.channelUrl}\n` +
      `⤷ ᴅᴇꜱᴄ: ${ch.description || "Kosong"}\n\n`;

    if (videos.length) {
      caption += `✦ ᴠɪᴅᴇᴏ ᴛᴇʀʙᴀʀᴜ ✦\n` +
        `⤷ ᴊᴜᴅᴜʟ: ${videos[0].title}\n` +
        `⤷ ᴅᴜʀᴀꜱɪ: ${videos[0].duration}\n` +
        `⤷ ᴘᴜʙʟɪꜱʜᴇᴅ: ${videos[0].publishedTime}\n` +
        `⤷ ᴠɪᴇᴡꜱ: ${videos[0].viewCount}\n` +
        `⤷ ʟɪɴᴋ: ${videos[0].videoUrl}`;
    }

    bot.sendPhoto(chatId, ch.avatarUrl, {
      caption,
      parse_mode: "Markdown"
    });

  } catch (e) {
    console.error(e);
    bot.sendMessage(chatId, "❌ Gagal mengambil data YouTube.");
  }
});

   // command /stalkgithub
bot.onText(/\/stalkgithub (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const username = match[1];

  if (!username) return bot.sendMessage(chatId, "❌ Format salah! Contoh:\n/stalkgithub LoL-Human");

  try {
    const res = await fetch(`https://api.fikmydomainsz.xyz/stalk/github?username=${encodeURIComponent(username)}`);
    const data = await res.json();

    if (!data.status || !data.result) {
      return bot.sendMessage(chatId, `❌ API error: ${data.message || "Gagal mengambil info GitHub"}`);
    }

    const info = data.result;

    let reply = `- 👤 GitHub Stalk -\n` +
                `📝 Name: ${info.name || "-"}\n` +
                `💻 Username: ${username}\n` +
                `🔗 URL: ${info.url}\n` +
                `📌 Type: ${info.type}\n` +
                `👥 Followers: ${info.followers}\n` +
                `👤 Following: ${info.following}\n` +
                `📂 Public Repos: ${info.public_repos}\n` +
                `📄 Public Gists: ${info.public_gists}\n` +
                `🏢 Company: ${info.company || "-"}\n` +
                `📍 Location: ${info.location || "-"}\n` +
                `✉️ Email: ${info.email || "-"}\n` +
                `📝 Bio: ${info.bio || "-"}`;

    bot.sendPhoto(chatId, info.avatar, { caption: reply });

  } catch (err) {
    console.log("Error /stalkgithub:", err.message);
    bot.sendMessage(chatId, "❌ Terjadi kesalahan saat memproses request.");
  }
});

// command send message gb
bot.onText(/^\/sendmsg (.+)$/, async (msg, match) => {
  const chatId = msg.chat.id;
  const replyTo = msg.reply_to_message;
  const targetGroupId = match[1]; // id group tujuan

  if (!replyTo) {
    return bot.sendMessage(chatId, "❌ Reply pesan yang diforward!");
  }

  try {
    await bot.forwardMessage(targetGroupId, chatId, replyTo.message_id);
    bot.sendMessage(chatId, `✅ Sukses diforward ke grup ${targetGroupId}`);
  } catch (err) {
    console.error(err);
    bot.sendMessage(chatId, "❌ Gagal forward pesan, cek lagi ID grupnya.");
  }
});

// command backup
let autoBackupInterval = null;

bot.onText(/\/backup/, (msg) => {
  const chatId = msg.chat.id;

  // Perbaikan: gunakan number untuk perbandingan
  if (msg.from.id !== owner) {
    return bot.sendMessage(
      chatId,
      `❌ Kamu bukan ${dev}!`,
      { parse_mode: "Markdown", reply_to_message_id: msg.message_id }
    );
  }

  const doBackup = () => {
    const backupFile = `VEX_BACKUP.zip`;
    const output = fs.createWriteStream(backupFile);
    const archive = archiver("zip", { zlib: { level: 9 } });

    output.on("close", () => {
      bot.sendDocument(chatId, backupFile).then(() => {
        fs.unlinkSync(backupFile);
      }).catch(err => {
        console.error("Error sending backup:", err);
      });
    });

    archive.on("error", (err) => {
      console.error(err);
      bot.sendMessage(chatId, "❌ Gagal membuat backup!");
    });

    archive.pipe(output);

    ["pagaska.js", "settings.js", "koorUsers.json", "package.json"].forEach((file) => {
      if (fs.existsSync(file)) {
        archive.file(file, { name: path.basename(file) });
      }
    });

    ["menu", "lib", "db"].forEach((dir) => {
      if (fs.existsSync(dir)) {
        archive.directory(dir, dir);
      }
    });

    archive.finalize();
  };

  // langsung backup pertama kali
  doBackup();

  // clear interval lama kalau ada
  if (autoBackupInterval) clearInterval(autoBackupInterval);

  // auto backup tiap 30 menit
  autoBackupInterval = setInterval(doBackup, 30 * 60 * 1000);

  bot.sendMessage(chatId, "✅ Auto-backup aktif setiap 30 menit.", { 
    reply_to_message_id: msg.message_id 
  });
});

// command broadcast
bot.onText(/^\/bc$/, async (msg) => {
  const chatId = msg.chat.id;

  // Perbaikan: gunakan number untuk perbandingan
  if (msg.from.id !== owner) {
    return bot.sendMessage(chatId, "❌ ᴋʜᴜsᴜs ᴏᴡɴᴇʀ", {
      reply_to_message_id: msg.message_id
    });
  }

  if (!msg.reply_to_message) {
    return bot.sendMessage(chatId, "⚠️ ʀᴇᴘʟʏ ᴘᴇsᴀɴɴʏᴀ", {
      reply_to_message_id: msg.message_id
    });
  }
    
  const koorUsersFile = "./koorUsers.json";
  let users = [];
  if (fs.existsSync(koorUsersFile)) {
    try {
      users = JSON.parse(fs.readFileSync(koorUsersFile, 'utf8'));
    } catch (err) {
      console.error("Error reading koorUsers.json:", err);
      return bot.sendMessage(chatId, "❌ Error membaca file users!", {
        reply_to_message_id: msg.message_id
      });
    }
  } else {
    return bot.sendMessage(chatId, "⚠️ File koorUsers.json tidak ditemukan!", {
      reply_to_message_id: msg.message_id
    });
  }

  if (users.length === 0) {
    return bot.sendMessage(chatId, "⚠️ Tidak ada user untuk broadcast!", {
      reply_to_message_id: msg.message_id
    });
  }

  // Kirim pesan progress
  const progressMsg = await bot.sendMessage(chatId, "📤 Memulai broadcast...", {
    reply_to_message_id: msg.message_id
  });

  let sukses = 0, gagal = 0;
  for (let uid of users) {
    try {
      await bot.forwardMessage(uid, chatId, msg.reply_to_message.message_id);

      // Kirim button setelah forward
      await bot.sendMessage(uid, "💬 Pesan dari owner", {
        reply_markup: {
          inline_keyboard: [
            [{ text: "Kirim Pesan", callback_data: `contact_owner` }]
          ]
        }
      });

      sukses++;
      
      // Delay untuk menghindari rate limit
      await new Promise(resolve => setTimeout(resolve, 100));
    } catch (err) {
      console.error(`Gagal kirim ke ${uid}:`, err.message);
      gagal++;
    }
  }

  // Hapus pesan progress dan kirim hasil
  await bot.deleteMessage(chatId, progressMsg.message_id);
  bot.sendMessage(chatId, `✅ ʙʀᴏᴀᴅᴄᴀꜱᴛ ꜱᴇʟᴇꜱᴀɪ\n\n📊 Hasil:\n• Sukses: ${sukses}\n• Gagal: ${gagal}\n• Total: ${users.length}`, { 
    parse_mode: "Markdown", 
    reply_to_message_id: msg.message_id 
  });
});

// Notifikasi owner
const notifOwner = owner;
let waitingReply = {};

// PERBAIKAN: handler tombol callback harus pakai bot.on("callback_query")
bot.on("callback_query", async (query) => {
  const chatId = query.message.chat.id;
  const data = query.data;

  try {
    if (data === "contact_owner") {
      waitingReply[chatId] = true;
      await bot.sendMessage(chatId, "✉️ Silahkan ketik pesan Anda.\nPesan akan diteruskan ke owner.");
      await bot.answerCallbackQuery(query.id, { text: "✅ Silahkan ketik pesan" });
      return;
    }

    // Handler untuk Pinterest navigation
    if (data.startsWith("pin_")) {
      const [action, targetChatId, idxStr] = data.split("|");
      const messageId = query.message.message_id;

      const pinCache = global.pinData?.[messageId];
      if (!pinCache) {
        return bot.answerCallbackQuery(query.id, { text: "⚠️ Data sudah kadaluarsa." });
      }

      let index = parseInt(idxStr);
      if (action === "pin_next") {
        index = (index + 1) % pinCache.results.length;
      } else if (action === "pin_prev") {
        index = (index - 1 + pinCache.results.length) % pinCache.results.length;
      }

      const item = pinCache.results[index];

      const inlineKeyboard = {
        inline_keyboard: [
          [
            { text: "⬅️", callback_data: `pin_prev|${targetChatId}|${index}` },
            { text: `${index + 1}/${pinCache.results.length}`, callback_data: "noop" },
            { text: "➡️", callback_data: `pin_next|${targetChatId}|${index}` }
          ]
        ]
      };

      await bot.editMessageMedia(
        {
          type: "photo",
          media: item.imageUrl,
          parse_mode: "Markdown"
        },
        {
          chat_id: targetChatId,
          message_id: messageId,
          reply_markup: inlineKeyboard
        }
      );

      pinCache.index = index;
      return bot.answerCallbackQuery(query.id);
    }

    // Ignore noop
    if (data === "noop") {
      return bot.answerCallbackQuery(query.id);
    }

  } catch (err) {
    console.error("❌ Callback Error:", err.message);
    bot.answerCallbackQuery(query.id, { text: "⚠️ Terjadi kesalahan." });
  }
});

// PERBAIKAN: handler pesan untuk contact owner
bot.on("message", async (msg) => {
  // Skip jika tidak ada text
  if (!msg.text) return;
  
  const chatId = msg.chat.id;

  // Skip jika message adalah command
  if (msg.text.startsWith('/')) return;

  // Skip jika dari owner
  if (msg.from.id === owner) return;

  if (waitingReply[chatId]) {
    try {
      const username = msg.from.username ? `@${msg.from.username}` : msg.from.first_name;
      const userId = msg.from.id;

      // Kirim ke owner dengan format yang lebih baik
      await bot.sendMessage(
        notifOwner, 
        `📩 *Pesan Baru dari User*\n\n` +
        `👤 Dari: ${username}\n` +
        `🆔 ID: \`${userId}\`\n` +
        `💬 Pesan:\n${msg.text}`,
        { parse_mode: "Markdown" }
      );

      // Konfirmasi ke user
      await bot.sendMessage(
        chatId, 
        `✅ *Pesan terkirim!*\n\nPesan Anda sudah diteruskan ke owner. Terima kasih!`, 
        { 
          parse_mode: "Markdown", 
          reply_to_message_id: msg.message_id 
        }
      );

      // Reset status
      delete waitingReply[chatId];
    } catch (err) {
      console.error("Error sending message to owner:", err);
      bot.sendMessage(chatId, "❌ Gagal mengirim pesan ke owner. Coba lagi nanti.");
    }
  }
});

// command pin
bot.onText(/^\/pin(?:\s+(.+))?$/, async (msg, match) => {
  const chatId = msg.chat.id;
  const query = match[1];

  if (!query) {
    return bot.sendMessage(chatId, "❌ Format salah!\n\nContoh:\n`/pin anime`", {
      parse_mode: "Markdown",
      reply_to_message_id: msg.message_id
    });
  }

  const url = `https://api.nekolabs.my.id/discovery/pinterest/search?q=${encodeURIComponent(query)}`;
  let wait;

  try {
    await bot.sendChatAction(chatId, "upload_photo");
    wait = await bot.sendMessage(chatId, "🔎 Mencari...", {
      reply_to_message_id: msg.message_id
    });

    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const data = await res.json();
    if (!data.success || !Array.isArray(data.result) || data.result.length === 0) {
      throw new Error("Tidak ditemukan hasil.");
    }

    const results = data.result.slice(0, 5);
    const index = 0;
    const item = results[index];

    if (!item.imageUrl) {
      throw new Error("URL gambar tidak tersedia.");
    }

    const inlineKeyboard = {
      inline_keyboard: [
        [
          { text: "⬅️", callback_data: `pin_prev|${chatId}|${index}` },
          { text: `${index + 1}/${results.length}`, callback_data: "noop" },
          { text: "➡️", callback_data: `pin_next|${chatId}|${index}` }
        ]
      ]
    };

    const sent = await bot.sendPhoto(chatId, item.imageUrl, {
      caption: `📌 Pinterest Search: *${query}*`,
      parse_mode: "Markdown",
      reply_markup: inlineKeyboard,
      reply_to_message_id: msg.message_id
    });

    // Hapus pesan loading
    await bot.deleteMessage(chatId, wait.message_id).catch(() => {});

    // Simpan data hasil pencarian ke memori sementara
    global.pinData = global.pinData || {};
    global.pinData[sent.message_id] = { results, index };

  } catch (err) {
    console.error("❌ Error Pinterest:", err.message);
    const errMsg =
      err.message.includes("Tidak ditemukan")
        ? "❌ Tidak ada hasil ditemukan untuk pencarian itu."
        : err.message.includes("HTTP")
        ? "🌐 Tidak bisa terhubung ke server Pinterest."
        : "⚠️ Terjadi kesalahan, coba lagi nanti.";

    if (wait) {
      try {
        await bot.editMessageText(errMsg, {
          chat_id: chatId,
          message_id: wait.message_id
        });
      } catch {
        await bot.sendMessage(chatId, errMsg, {
          reply_to_message_id: msg.message_id
        });
      }
    } else {
      await bot.sendMessage(chatId, errMsg, {
        reply_to_message_id: msg.message_id
      });
    }
  }
});

// Storage untuk game aktif per chat
const activeGames = {};

// command tebakjkt
bot.onText(/^\/tebakjkt$/, async (msg) => {
  const chatId = msg.chat.id;
  let wait;
  let tempFile = null;

  try {
    // Cek apakah sudah ada game aktif
    if (activeGames[chatId]) {
      const game = activeGames[chatId];
      return bot.sendMessage(chatId, 
        `⚠️ Masih ada game aktif!\n\n` +
        `Ketik jawaban atau gunakan /nyerah untuk menyerah.`,
        { reply_to_message_id: msg.message_id }
      );
    }

    // Kirim loading message
    await bot.sendChatAction(chatId, "upload_photo");
    wait = await bot.sendMessage(chatId, "🎮 Menyiapkan tebak JKT48...", {
      reply_to_message_id: msg.message_id
    });

    // Fetch dari API
    console.log('Fetching tebakjkt API...');
    const response = await axios.get('https://zelapioffciall.koyeb.app/games/tebakjkt', {
      timeout: 30000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'application/json'
      }
    });

    // Debug: log full response
    console.log('Tebak JKT Full Response:', JSON.stringify(response.data, null, 2));

    // Validasi response
    let imageUrl, jawaban;
    
    if (response.data.status && response.data.result) {
      imageUrl = response.data.result.img || response.data.result.image;
      jawaban = response.data.result.jawaban || response.data.result.answer;
    } else if (response.data.img) {
      imageUrl = response.data.img;
      jawaban = response.data.jawaban;
    } else if (response.data.image) {
      imageUrl = response.data.image;
      jawaban = response.data.answer || response.data.jawaban;
    } else {
      console.error('Response structure:', Object.keys(response.data));
      throw new Error("Data game tidak ditemukan");
    }

    if (!imageUrl || !jawaban) {
      throw new Error("Data tidak lengkap (gambar atau jawaban tidak ada)");
    }

    console.log('Image URL found:', imageUrl);
    console.log('Jawaban:', jawaban);

    // Update loading message
    await bot.editMessageText("📥 Mengunduh gambar...", {
      chat_id: chatId,
      message_id: wait.message_id
    });

    // Download gambar
    const fileName = `tebakjkt_${Date.now()}.jpg`;
    tempFile = path.join(tempDir, fileName);
    
    console.log('Downloading image to:', tempFile);
    await downloadImage(imageUrl, tempFile);
    console.log('Download complete!');

    // Hapus pesan loading
    await bot.deleteMessage(chatId, wait.message_id).catch(() => {});

    // Kirim gambar dengan petunjuk
    const gameMsg = await bot.sendPhoto(chatId, tempFile, {
      caption: 
        `🎮 *TEBAK MEMBER JKT48*\n\n` +
        `Siapa member JKT48 ini?\n\n` +
        `💡 Petunjuk:\n` +
        `• Ketik nama member untuk menjawab\n` +
        `• Gunakan /nyerah untuk menyerah\n\n` +
        `⏱️ Waktu: 60 detik`,
      parse_mode: "Markdown",
      reply_to_message_id: msg.message_id
    });

    // Simpan game aktif
    activeGames[chatId] = {
      jawaban: jawaban.toLowerCase().trim(),
      jawabanAsli: jawaban,
      messageId: gameMsg.message_id,
      startTime: Date.now()
    };

    console.log('Game started for chat:', chatId);

    // Hapus file temporary
    if (fs.existsSync(tempFile)) {
      fs.unlinkSync(tempFile);
      console.log('Temp file deleted:', tempFile);
    }

    // Auto-end game setelah 60 detik
    setTimeout(() => {
      if (activeGames[chatId]) {
        const game = activeGames[chatId];
        bot.sendMessage(chatId, 
          `⏰ *WAKTU HABIS!*\n\n` +
          `Jawabannya adalah: *${game.jawabanAsli}*\n\n` +
          `Coba lagi dengan /tebakjkt`,
          { 
            parse_mode: "Markdown",
            reply_to_message_id: game.messageId 
          }
        );
        delete activeGames[chatId];
        console.log('Game timeout for chat:', chatId);
      }
    }, 60000); // 60 detik

  } catch (err) {
    console.error("❌ Error Tebak JKT:", err.message);
    if (err.response) {
      console.error("Response Status:", err.response.status);
      console.error("Response Data:", err.response.data);
    }
    
    const errMsg = err.code === 'ECONNABORTED' 
      ? "⏱️ Timeout! Server terlalu lama merespons."
      : err.response?.status === 403
      ? "🚫 Akses ditolak oleh server"
      : err.response?.status === 404
      ? "❌ Endpoint tidak ditemukan"
      : err.response?.status 
      ? `🌐 Server error (${err.response.status})`
      : `⚠️ ${err.message}`;

    if (wait) {
      try {
        await bot.editMessageText(errMsg, {
          chat_id: chatId,
          message_id: wait.message_id
        });
      } catch {
        await bot.sendMessage(chatId, errMsg, {
          reply_to_message_id: msg.message_id
        });
      }
    } else {
      await bot.sendMessage(chatId, errMsg, {
        reply_to_message_id: msg.message_id
      });
    }

    // Hapus file temporary jika ada error
    if (tempFile && fs.existsSync(tempFile)) {
      fs.unlinkSync(tempFile);
    }
  }
});

// command nyerah
bot.onText(/^\/nyerah$/, async (msg) => {
  const chatId = msg.chat.id;

  if (!activeGames[chatId]) {
    return bot.sendMessage(chatId, 
      "⚠️ Tidak ada game aktif!\n\nGunakan /tebakjkt untuk memulai game.",
      { reply_to_message_id: msg.message_id }
    );
  }

  const game = activeGames[chatId];
  
  await bot.sendMessage(chatId, 
    `🏳️ *MENYERAH*\n\n` +
    `Jawabannya adalah: *${game.jawabanAsli}*\n\n` +
    `Coba lagi dengan /tebakjkt`,
    { 
      parse_mode: "Markdown",
      reply_to_message_id: game.messageId 
    }
  );

  delete activeGames[chatId];
  console.log('Game surrendered for chat:', chatId);
});

// Handler untuk jawaban
bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  
  // Skip jika tidak ada text atau adalah command
  if (!msg.text || msg.text.startsWith('/')) return;
  
  // Skip jika tidak ada game aktif
  if (!activeGames[chatId]) return;

  const game = activeGames[chatId];
  const userAnswer = msg.text.toLowerCase().trim();

  console.log('User answer:', userAnswer, 'Correct answer:', game.jawaban);

  // Cek jawaban
  if (userAnswer === game.jawaban) {
    const duration = Math.floor((Date.now() - game.startTime) / 1000);
    
    await bot.sendMessage(chatId, 
      `🎉 *BENAR!*\n\n` +
      `Jawabannya adalah: *${game.jawabanAsli}*\n` +
      `⏱️ Waktu: ${duration} detik\n\n` +
      `Main lagi dengan /tebakjkt`,
      { 
        parse_mode: "Markdown",
        reply_to_message_id: game.messageId 
      }
    );

    delete activeGames[chatId];
    console.log('Game completed for chat:', chatId);
  } else {
    // Jawaban salah, beri hint jika jawaban mirip
    const similarity = userAnswer.length >= 3 && game.jawaban.includes(userAnswer.substring(0, 3));
    
    await bot.sendMessage(chatId, 
      `❌ Salah!\n\n` + 
      (similarity ? `💡 Jawabannya mirip dengan "${userAnswer}"` : `Coba lagi!`),
      { reply_to_message_id: msg.message_id }
    );
  }
});

// command brainrot
bot.onText(/^\/brainrot$/, async (msg) => {
  const chatId = msg.chat.id;
  let wait;
  let tempFile = null;

  try {
    // Kirim loading message
    await bot.sendChatAction(chatId, "upload_photo");
    wait = await bot.sendMessage(chatId, "🎮 Mengambil brainrot game...", {
      reply_to_message_id: msg.message_id
    });

    // Fetch dari API
    console.log('Fetching brainrot API...');
    const response = await axios.get('https://zelapioffciall.koyeb.app/games/brainrots', {
      timeout: 30000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'application/json'
      }
    });

    // Debug: log full response
    console.log('Brainrot Full Response:', JSON.stringify(response.data, null, 2));

    // Validasi response
    let mediaUrl, jawaban;
    
    if (response.data.status && response.data.result) {
      // Response berisi object result dengan img dan jawaban
      if (response.data.result.img) {
        mediaUrl = response.data.result.img;
        jawaban = response.data.result.jawaban || '';
      } else if (typeof response.data.result === 'string') {
        mediaUrl = response.data.result;
      }
    } else if (response.data.img) {
      mediaUrl = response.data.img;
      jawaban = response.data.jawaban || '';
    } else if (response.data.url) {
      mediaUrl = response.data.url;
    } else if (response.data.video) {
      mediaUrl = response.data.video;
    } else if (typeof response.data === 'string' && response.data.startsWith('http')) {
      mediaUrl = response.data;
    } else {
      console.error('Response structure:', Object.keys(response.data));
      throw new Error("URL media tidak ditemukan");
    }

    if (!mediaUrl) {
      throw new Error("URL media tidak valid");
    }

    console.log('Media URL found:', mediaUrl);
    console.log('Jawaban:', jawaban || 'tidak ada');

    // Update loading message
    await bot.editMessageText("📥 Mengunduh media...", {
      chat_id: chatId,
      message_id: wait.message_id
    });

    // Deteksi tipe file dari URL
    const isVideo = mediaUrl.match(/\.(mp4|mov|avi|mkv|webm)$/i);
    const isImage = mediaUrl.match(/\.(jpg|jpeg|png|gif|webp)$/i);
    
    // Download media
    const fileExt = isVideo ? 'mp4' : 'jpg';
    const fileName = `brainrot_${Date.now()}.${fileExt}`;
    tempFile = path.join(tempDir, fileName);
    
    console.log('Downloading media to:', tempFile);
    await downloadImage(mediaUrl, tempFile);
    console.log('Download complete!');

    // Update loading message
    await bot.editMessageText("📤 Mengirim...", {
      chat_id: chatId,
      message_id: wait.message_id
    });

    // Buat caption
    let caption = "🎮 Random Brainrot";
    if (jawaban) {
      caption += `\n\n💬 ${jawaban}`;
    }

    // Kirim media sesuai tipe
    if (isVideo || !isImage) {
      // Kirim sebagai video
      await bot.sendVideo(chatId, tempFile, {
        caption: caption,
        reply_to_message_id: msg.message_id,
        supports_streaming: true
      });
    } else {
      // Kirim sebagai foto
      await bot.sendPhoto(chatId, tempFile, {
        caption: caption,
        reply_to_message_id: msg.message_id
      });
    }

    // Hapus pesan loading
    await bot.deleteMessage(chatId, wait.message_id).catch(() => {});

    // Hapus file temporary
    if (fs.existsSync(tempFile)) {
      fs.unlinkSync(tempFile);
      console.log('Temp file deleted:', tempFile);
    }

  } catch (err) {
    console.error("❌ Error Brainrot:", err.message);
    if (err.response) {
      console.error("Response Status:", err.response.status);
      console.error("Response Data:", err.response.data);
    }
    
    const errMsg = err.code === 'ECONNABORTED' 
      ? "⏱️ Timeout! Server terlalu lama merespons."
      : err.response?.status === 403
      ? "🚫 Akses ditolak oleh server"
      : err.response?.status === 404
      ? "❌ Endpoint tidak ditemukan"
      : err.response?.status 
      ? `🌐 Server error (${err.response.status})`
      : `⚠️ ${err.message}`;

    if (wait) {
      try {
        await bot.editMessageText(errMsg, {
          chat_id: chatId,
          message_id: wait.message_id
        });
      } catch {
        await bot.sendMessage(chatId, errMsg, {
          reply_to_message_id: msg.message_id
        });
      }
    } else {
      await bot.sendMessage(chatId, errMsg, {
        reply_to_message_id: msg.message_id
      });
    }

    // Hapus file temporary jika ada error
    if (tempFile && fs.existsSync(tempFile)) {
      fs.unlinkSync(tempFile);
    }
  }
});

// command ssweb (screenshot website)
bot.onText(/^\/ssweb(?:\s+(.+))?$/, async (msg, match) => {
  const chatId = msg.chat.id;
  const url = match[1];
  let wait;
  let tempFile = null;

  try {
    // Validasi input
    if (!url) {
      return bot.sendMessage(chatId, 
        "❌ Format salah!\n\n" +
        "Contoh:\n" +
        "`/ssweb https://google.com`\n" +
        "`/ssweb https://github.com`",
        {
          parse_mode: "Markdown",
          reply_to_message_id: msg.message_id
        }
      );
    }

    // Validasi URL
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      return bot.sendMessage(chatId, 
        "❌ URL harus dimulai dengan http:// atau https://",
        { reply_to_message_id: msg.message_id }
      );
    }

    // Kirim loading message
    await bot.sendChatAction(chatId, "upload_photo");
    wait = await bot.sendMessage(chatId, "📸 Mengambil screenshot website...", {
      reply_to_message_id: msg.message_id
    });

    // Fetch dari API
    console.log('Fetching ssweb API for:', url);
    const apiUrl = `https://zelapioffciall.koyeb.app/tools/ssweb?url=${encodeURIComponent(url)}`;
    
    const response = await axios.get(apiUrl, {
      timeout: 60000, // 60 detik karena screenshot butuh waktu
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'application/json'
      }
    });

    // Debug: log full response
    console.log('SSWeb Full Response:', JSON.stringify(response.data, null, 2));

    // Validasi response
    let imageUrl;
    if (response.data.status && response.data.result) {
      imageUrl = response.data.result;
    } else if (response.data.url) {
      imageUrl = response.data.url;
    } else if (response.data.image) {
      imageUrl = response.data.image;
    } else if (response.data.screenshot) {
      imageUrl = response.data.screenshot;
    } else if (typeof response.data === 'string' && response.data.startsWith('http')) {
      imageUrl = response.data;
    } else {
      console.error('Response structure:', Object.keys(response.data));
      throw new Error("URL screenshot tidak ditemukan");
    }

    console.log('Screenshot URL found:', imageUrl);

    // Update loading message
    await bot.editMessageText("📥 Mengunduh screenshot...", {
      chat_id: chatId,
      message_id: wait.message_id
    });

    // Download screenshot
    const fileName = `ssweb_${Date.now()}.png`;
    tempFile = path.join(tempDir, fileName);
    
    console.log('Downloading screenshot to:', tempFile);
    await downloadImage(imageUrl, tempFile);
    console.log('Download complete!');

    // Update loading message
    await bot.editMessageText("📤 Mengirim screenshot...", {
      chat_id: chatId,
      message_id: wait.message_id
    });

    // Kirim screenshot
    await bot.sendPhoto(chatId, tempFile, {
      caption: `📸 Screenshot: ${url}`,
      reply_to_message_id: msg.message_id
    });

    // Hapus pesan loading
    await bot.deleteMessage(chatId, wait.message_id).catch(() => {});

    // Hapus file temporary
    if (fs.existsSync(tempFile)) {
      fs.unlinkSync(tempFile);
      console.log('Temp file deleted:', tempFile);
    }

  } catch (err) {
    console.error("❌ Error SSWeb:", err.message);
    if (err.response) {
      console.error("Response Status:", err.response.status);
      console.error("Response Data:", err.response.data);
    }
    
    const errMsg = err.code === 'ECONNABORTED' 
      ? "⏱️ Timeout! Website terlalu lama loading atau server sibuk."
      : err.response?.status === 403
      ? "🚫 Akses ditolak oleh server"
      : err.response?.status === 404
      ? "❌ Website tidak ditemukan"
      : err.response?.status 
      ? `🌐 Server error (${err.response.status})`
      : err.message.includes("URL screenshot tidak ditemukan")
      ? "⚠️ Gagal mengambil screenshot. Coba website lain."
      : `⚠️ ${err.message}`;

    if (wait) {
      try {
        await bot.editMessageText(errMsg, {
          chat_id: chatId,
          message_id: wait.message_id
        });
      } catch {
        await bot.sendMessage(chatId, errMsg, {
          reply_to_message_id: msg.message_id
        });
      }
    } else {
      await bot.sendMessage(chatId, errMsg, {
        reply_to_message_id: msg.message_id
      });
    }

    // Hapus file temporary jika ada error
    if (tempFile && fs.existsSync(tempFile)) {
      fs.unlinkSync(tempFile);
    }
  }
});

// Search Roblox Player
bot.onText(/^\/sproblox(?:\s+(.+))?$/, async (msg, match) => {
    const chatId = msg.chat.id;
    const text = match[1];
    
    if (!text) {
        return bot.sendMessage(chatId,
            `🔍 *Roblox Player Search*\n\n` +
            `Cara penggunaan:\n` +
            `/sproblox <username roblox>\n\n` +
            `Contoh: /sproblox builderman\n` +
            `Contoh: /sproblox roblox`,
            { 
                parse_mode: 'Markdown',
                reply_to_message_id: msg.message_id 
            }
        );
    }
    
    try {
        // Kirim indikator typing
        await bot.sendChatAction(chatId, 'typing');
        
        const form = new FormData();
        form.append('action', 'roblox_search');
        form.append('query', text);
        form.append('nonce', '8793f105cf');

        const headers = {
            'accept': '*/*',
            'accept-language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7',
            'origin': 'https://www.lawod.com',
            'priority': 'u=1, i',
            'referer': 'https://www.lawod.com/roblox-player-finder/',
            'sec-ch-ua': '"Google Chrome";v="143", "Chromium";v="143", "Not A(Brand";v="24"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"Windows"',
            'sec-fetch-dest': 'empty',
            'sec-fetch-mode': 'cors',
            'sec-fetch-site': 'same-origin',
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36',
            'cookie': '_clck=17y8h8f%5E2%5Eg20%5E0%5E2180; __gads=ID=c1095dfe0cd2f62b:T=1766199115:RT=1766199115:S=ALNI_MaO1vxYfthgGTDp7rFxbk2Wagi6gA; __gpi=UID=000011cf391bd022:T=1766199115:RT=1766199115:S=ALNI_MZ6JxrLM8FuhsF7SdBnn0f22_WEkQ; __eoi=ID=e9605b47f5b58df4:T=1766199115:RT=1766199115:S=AA-AfjaLNxF-VyZQkhwsBD3j7e7v; _clsk=1p434hb%5E1766199117419%5E1%5E1%5Ee.clarity.ms%2Fcollect; FCCDCF=%5Bnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2C%5B%5B32%2C%22%5B%5C%221f466b2e-a0ac-4f50-8b0b-e26a5a612528%5C%22%2C%5B1766199117%2C26000000%5D%5D%22%5D%5D%5D; FCNEC=%5B%5B%22AKsRol-kOGxCjaJO8WTrh7ZBg9k7nvjbqeJ0K-vrziV9v6qhENJEMJ-Or1t6JREih-dZLnC3Vu-uMxPMLwwmDFMFyD0uYIB9QxkfMKxVHvC9arykfK3h7qz2534igCD4SbDop-zgZ0Lsb8uVtQVnhJBpBj-lVN3iPA%3D%3D%22%5D%5D',
            ...form.getHeaders()
        };

        const res = await axios.post(
            'https://www.lawod.com/wp-admin/admin-ajax.php',
            form,
            {
                headers: headers,
                timeout: 30000
            }
        );

        if (!res.data || !res.data.success || !res.data.data || !res.data.data.users) {
            return bot.sendMessage(chatId,
                `❌ Username *${text}* tidak ditemukan di Roblox!`,
                { 
                    parse_mode: 'Markdown',
                    reply_to_message_id: msg.message_id 
                }
            );
        }

        const plyer = res.data.data.users;
        const cnt = res.data.data.count;
        const tmstp = res.data.data.timestamp;
        const q = res.data.data.query;

        if (plyer.length === 0) {
            return bot.sendMessage(chatId,
                `❌ Username *${q}* tidak ditemukan di Roblox!`,
                { 
                    parse_mode: 'Markdown',
                    reply_to_message_id: msg.message_id 
                }
            );
        }

        const topplayer = plyer[0];
        const avaurl = topplayer.avatar ? topplayer.avatar.replace(/\\\//g, '/') : null;

        let pesan = `🔍 *ROBLOX PLAYER SEARCH*\n\n` +
                   `• Search: *${q}*\n` +
                   `• Total Found: *${cnt}* players\n` +
                   `• Timestamp: ${tmstp}\n\n` +
                   `───── • ─────\n\n` +
                   `🎮 *TOP PLAYER*\n` +
                   `• Username: *${topplayer.name}*\n` +
                   `• ID: ${topplayer.id}\n` +
                   `• Display: ${topplayer.displayName || 'None'}\n` +
                   `• Verified: ${topplayer.hasVerifiedBadge ? '✅' : '❌'}\n\n` +
                   `───── • ─────\n\n` +
                   `📋 *OTHER RESULTS*\n`;

        plyer.slice(1, 10).forEach((player, i) => {
            pesan += `${i+2}. *${player.name}* (ID: ${player.id})\n`;
        });

        pesan += `\n───── • ─────\n\n` +
                `📝 *Note:* ${cnt} Hasil per permintaan, tunggu beberapa menit setelah 1 permintaan.\n\n` +
                `🔧 *Fitur By Anomaki Team*\n` +
                `👨‍💻 *Created : xyzan code*\n` +
                `⚠️ *Jangan Hapus Wm*`;

        // Jika ada avatar, kirim dengan foto
        if (avaurl && avaurl.startsWith('http')) {
            try {
                await bot.sendPhoto(chatId, avaurl, {
                    caption: pesan,
                    parse_mode: 'Markdown',
                    reply_to_message_id: msg.message_id
                });
            } catch (photoError) {
                // Jika gagal kirim foto, kirim teks saja
                console.error('Error sending photo:', photoError);
                await bot.sendMessage(chatId, pesan, {
                    parse_mode: 'Markdown',
                    reply_to_message_id: msg.message_id
                });
            }
        } else {
            await bot.sendMessage(chatId, pesan, {
                parse_mode: 'Markdown',
                reply_to_message_id: msg.message_id
            });
        }

    } catch (e) {
        console.error('Error sproblox:', e);
        
        let errorMessage = `❌ Terjadi kesalahan saat mencari player Roblox!\n`;
        
        if (e.response) {
            errorMessage += `Status: ${e.response.status}\n`;
            if (e.response.data) {
                errorMessage += `Data: ${JSON.stringify(e.response.data).substring(0, 100)}...`;
            }
        } else if (e.request) {
            errorMessage += `Tidak ada response dari server`;
        } else {
            errorMessage += `Error: ${e.message}`;
        }
        
        await bot.sendMessage(chatId, errorMessage, {
            reply_to_message_id: msg.message_id
        });
    }
});

// Versi alternatif dengan format HTML
bot.onText(/^\/roblox(?:\s+(.+))?$/, async (msg, match) => {
    const chatId = msg.chat.id;
    const text = match[1];
    
    if (!text) {
        return bot.sendMessage(chatId,
            `<b>🔍 Roblox Player Search</b>\n\n` +
            `<code>Penggunaan: /roblox username</code>\n\n` +
            `<i>Contoh: /roblox builderman</i>`,
            { 
                parse_mode: 'HTML',
                reply_to_message_id: msg.message_id 
            }
        );
    }
    
    try {
        await bot.sendChatAction(chatId, 'typing');
        
        // ... (kode axios sama seperti di atas) ...
        
        const plyer = res.data.data.users;
        const cnt = res.data.data.count;
        const q = res.data.data.query;

        if (plyer.length === 0) {
            return bot.sendMessage(chatId,
                `<b>❌ Username "${q}" tidak ditemukan di Roblox!</b>`,
                { 
                    parse_mode: 'HTML',
                    reply_to_message_id: msg.message_id 
                }
            );
        }

        const topplayer = plyer[0];
        
        let pesan = `<b>🔍 ROBLOX PLAYER SEARCH</b>\n\n` +
                   `<b>Search:</b> <code>${q}</code>\n` +
                   `<b>Total Found:</b> <code>${cnt}</code> players\n\n` +
                   `<b>🎮 TOP PLAYER</b>\n` +
                   `<b>Username:</b> <code>${topplayer.name}</code>\n` +
                   `<b>ID:</b> <code>${topplayer.id}</code>\n` +
                   `<b>Display:</b> ${topplayer.displayName || 'None'}\n` +
                   `<b>Verified:</b> ${topplayer.hasVerifiedBadge ? '✅' : '❌'}\n\n` +
                   `<b>📋 OTHER RESULTS</b>\n`;

        plyer.slice(1, 10).forEach((player, i) => {
            pesan += `${i+2}. <code>${player.name}</code> (ID: ${player.id})\n`;
        });

        pesan += `\n<code>Note: ${cnt} Hasil per permintaan</code>\n\n` +
                `<i>Fitur By Anomaki Team • Created : xyzan code</i>`;

        await bot.sendMessage(chatId, pesan, {
            parse_mode: 'HTML',
            reply_to_message_id: msg.message_id
        });

    } catch (e) {
        console.error('Error roblox:', e);
        await bot.sendMessage(chatId,
            `<b>❌ Error:</b> ${e.message}`,
            { 
                parse_mode: 'HTML',
                reply_to_message_id: msg.message_id 
            }
        );
    }
});

// Command bantuan
bot.onText(/^\/robloxhelp$/, (msg) => {
    const chatId = msg.chat.id;
    
    const helpMessage = `🎮 *ROBLOX PLAYER SEARCH BOT*\n\n` +
                      `*Command yang tersedia:*\n` +
                      `/sproblox <username> - Cari player Roblox\n` +
                      `/roblox <username> - Cari player (format HTML)\n\n` +
                      `*Contoh:*\n` +
                      `/sproblox builderman\n` +
                      `/roblox roblox\n\n` +
                      `*Fitur:*\n` +
                      `• Mencari player Roblox berdasarkan username\n` +
                      `• Menampilkan 10 hasil pencarian\n` +
                      `• Menampilkan avatar player utama\n` +
                      `• Informasi lengkap player\n\n` +
                      `*Note:*\n` +
                      `10 result / request permenit, 1 kali request memunculkan 10 result\n\n` +
                      `🔧 *Fitur By Anomaki Team*\n` +
                      `👨‍💻 *Created : xyzan code*\n` +
                      `⚠️ *Jangan Hapus Wm*`;
    
    bot.sendMessage(chatId, helpMessage, {
        parse_mode: 'Markdown',
        reply_to_message_id: msg.message_id
    });
});

const tokens = [
  "movanest-keyAID7JF6TQD"
];

const DELAY_ON_LIMIT = 5000;

const reactToWhatsAppPost = async (postUrl, emojis) => {
  for (const token of tokens) {
    try {
      const response = await axios.get(
        "https://movanest.zone.id/user-coin",
        {
          params: {
            user_api_key: token,
            postUrl,
            emojis
          },
          timeout: 500000
        }
      );

      return {
        success: true,
        data: response.data
      };

    } catch (error) {
      const status = error.response?.status;
      const msg = error.response?.data?.message || error.message;

      if (status === 402 || msg.toLowerCase().includes("limit")) {
        await new Promise(r => setTimeout(r, DELAY_ON_LIMIT));
        continue;
      }

      if (status === 401) {
        continue;
      }

      return {
        success: false,
        status,
        error: error.response?.data || msg
      };
    }
  }

  return {
    success: false,
    status: 402,
    error: "All tokens are limited or exhausted"
  };
};

// Handler untuk command /reactwa, /reactch, /rch
bot.onText(/\/(reactwa|reactch|rch)(.*)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const text = match[2].trim();

  try {
    if (!text) {
      return bot.sendMessage(
        chatId,
        "Example: /reactwa <link-post> <emoji>",
        { reply_to_message_id: msg.message_id }
      );
    }

    const args = text.trim().split(" ");
    const postUrl = args[0];
    const emojis = args.slice(1).join(" ");

    if (!postUrl || !emojis) {
      return bot.sendMessage(
        chatId,
        "Format salah!\n/reactwa <link-post> <emoji>",
        { reply_to_message_id: msg.message_id }
      );
    }

    await bot.sendMessage(
      chatId,
      "Processing...",
      { reply_to_message_id: msg.message_id }
    );

    const result = await reactToWhatsAppPost(postUrl, emojis);

    if (result.success) {
      const data = result.data;

      const replyText =
        "✅ Success\n" +
        "Emoji: " + data.emojis + "\n" +
        "Channel:\n" +
        (data.postUrl || postUrl) + "\n" +
        "Remaining coins: " + data.remainingCoins;

      return bot.sendMessage(
        chatId,
        replyText,
        { reply_to_message_id: msg.message_id }
      );
    }

    return bot.sendMessage(
      chatId,
      "❌ Gagal Mengirim Reaction\n" +
      "Status: " + result.status + "\n" +
      "Error: " + JSON.stringify(result.error),
      { reply_to_message_id: msg.message_id }
    );

  } catch (e) {
    console.error('Error:', e);
    bot.sendMessage(
      chatId,
      "❌ Terjadi error: " + e.message,
      { reply_to_message_id: msg.message_id }
    );
  }
});

// Headers untuk API
const headers = {
  "x-api-key": "17e0ad41c6e1f51577a8279f12c0d2256caad74634a15bb930e3b568896aa4c3"
};

// Command handler untuk react channel
bot.onText(/\/react (.+)/, async (msg, match) => {
  notifyOwner('react', msg);
  const chatId = msg.chat.id;
  const input = match[1]; // Ambil text setelah /react

  try {
    // Parse input: format bisa "/react link emoji" atau "/react link|emoji"
    let link, emoji;
    
    if (input.includes('|')) {
      [link, emoji] = input.split('|').map(s => s.trim());
    } else {
      const parts = input.split(' ');
      link = parts[0];
      emoji = parts.slice(1).join(' ') || '👍'; // Default emoji jika tidak ada
    }

    if (!link) {
      return bot.sendMessage(chatId, '⚠️ Format salah!\nGunakan: /react <link> <emoji>\nContoh: /react https://t.me/channel/123 🔥');
    }

    // Encode parameters
    const encodedLink = encodeURIComponent(link);
    const encodedEmoji = encodeURIComponent(emoji);

    // Kirim loading message
    const loadingMsg = await bot.sendMessage(chatId, '⏳ Mengirim react...');

    // Request ke API
    const url = `https://react.whyux-xec.my.id/api/rch?link=${encodedLink}&emoji=${encodedEmoji}`;
    const response = await fetch(url, {
      method: "GET",
      headers
    });

    const responseText = await response.text();
    let result;

    try {
      result = JSON.parse(responseText);
    } catch {
      console.log("RAW RESPONSE:", responseText);
      return bot.editMessageText('⚠️ API error - response tidak valid', {
        chat_id: chatId,
        message_id: loadingMsg.message_id
      });
    }

    // Handle response
    if (result && result.success === true) {
      bot.editMessageText(
        `✅ React berhasil dikirim ke channel!\n🌟 Emoji: ${emoji}`,
        {
          chat_id: chatId,
          message_id: loadingMsg.message_id
        }
      );
    } else {
      console.error("API ERROR:", result);
      const errMsg = result?.error || "Gagal mengirim react";
      bot.editMessageText(`⚠️ ${errMsg}`, {
        chat_id: chatId,
        message_id: loadingMsg.message_id
      });
    }

  } catch (err) {
    console.error("FETCH ERROR:", err);
    bot.sendMessage(chatId, '⚠️ API nya capek kali bang! 🙄');
  }
});

//tiktok
bot.onText(/^(\.|\#|\/)tiktok$/, async (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, `Format salah example /tiktok link`);
  });
  

bot.onText(/\/tiktok (.+)/, async (msg, match) => {
	notifyOwner('tiktok', msg);
    const chatId = msg.chat.id;
    const text = match[1]; // Mengambil teks setelah perintah /tt

    if (!text.startsWith("https://")) {
        return bot.sendMessage(chatId, "Masukkin URL TikTok yang valid blog!");
    }

    try {
        bot.sendMessage(chatId, "⏳ Prosess sabarr yaaa");

        const result = await tiktokDl(text);

        if (!result.status) {
            return bot.sendMessage(chatId, "Terjadi kesalahan saat memproses URL lu belum mandi soalnya!");
        }

        if (result.durations === 0 && result.duration === "0 Seconds") {
            let mediaArray = [];

            for (let i = 0; i < result.data.length; i++) {
                const a = result.data[i];
                mediaArray.push({
                    type: 'photo',
                    media: a.url,
                    caption: `Foto Slide Ke ${i + 1}`
                });
            }

            return bot.sendMediaGroup(chatId, mediaArray);
        } else {
            const video = result.data.find(e => e.type === "nowatermark_hd" || e.type === "nowatermark");
            if (video) {
                return bot.sendVideo(chatId, video.url, { caption: "TikTok Downloader BY PAGASKA ASSISTANT" });
            }
        }
    } catch (e) {
        console.error(e);
        bot.sendMessage(chatId, "Terjadi kesalahan saat memproses permintaan.");
    }
});

try {
  koorUsers = JSON.parse(fs.readFileSync('koorUsers.json', 'utf8'));
} catch (error) {
  console.error("Error reading koorUsers file:", error);
  koorUsers = [];
}

bot.onText(/^\/bcall (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const isOwner = msg.from.id.toString() === owner;
  
  if (!isOwner) {
    return bot.sendMessage(chatId, "❌ Owner only!", { parse_mode: "HTML" });
  }

  const message = match[1];
  const allUsers = [...new Set([...koorUsers])];
  const totalUsers = allUsers.length;
  
  if (totalUsers === 0) {
    return bot.sendMessage(chatId, "❌ Tidak ada users!", { parse_mode: "HTML" });
  }

  const statusMsg = await bot.sendMessage(chatId, 
    `📢 <b>BROADCAST STARTED</b>\n\n` +
    `Target: All Users\n` +
    `Total: ${totalUsers} users\n` +
    `Pesan: ${message}\n\n` +
    `⏳ <i>Sedang mengirim... 0/${totalUsers}</i>`, 
    { parse_mode: "HTML" }
  );

  let successCount = 0;
  let failCount = 0;
  let failedUsers = [];

  for (let i = 0; i < allUsers.length; i++) {
    const userId = allUsers[i];
    
    try {
      await bot.sendMessage(userId, 
        `📢 <b>BROADCAST FROM OWNER</b>\n\n${message}`, 
        { parse_mode: "HTML" }
      );
      successCount++;
    } catch (error) {
      failCount++;
      failedUsers.push(userId);
    }

    if ((i + 1) % 10 === 0 || i === allUsers.length - 1) {
      await bot.editMessageText(
        `📢 <b>BROADCAST IN PROGRESS</b>\n\n` +
        `Target: All Users\n` +
        `Total: ${totalUsers} users\n\n` +
        `⏳ Progress: ${i + 1}/${totalUsers}\n` +
        `✅ Berhasil: ${successCount}\n` +
        `❌ Gagal: ${failCount}`,
        {
          chat_id: chatId,
          message_id: statusMsg.message_id,
          parse_mode: "HTML"
        }
      );
    }

    await new Promise(resolve => setTimeout(resolve, 500));
  }

  let resultMessage = `
📢 <b>BROADCAST COMPLETED</b>

<b>Target:</b> All Users (Koor + Anggota)
<b>Total Users:</b> ${totalUsers}
<b>Berhasil:</b> ${successCount}
<b>Gagal:</b> ${failCount}
`;

  if (failCount > 0) {
    resultMessage += `
⚠️ <b>Gagal dikirim ke:</b>
<code>${failedUsers.join(', ')}</code>
`;
  }

  resultMessage += `
📝 <b>Pesan:</b>
<code>${message}</code>
`;

  await bot.editMessageText(resultMessage, {
    chat_id: chatId,
    message_id: statusMsg.message_id,
    parse_mode: "HTML"
  });
});

//ytmp3
bot.onText(/\/ytmp3 (.+)/, async (msg, match) => {
  notifyOwner('ympt3', msg);
  const chatId = msg.chat.id;
  const url = match[1];
    
  // Fungsi ytmp3 di dalam handler
  async function ytmp3(url) {
    const headers = {
      "accept": "*/*",
      "accept-language": "id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7",
      "sec-ch-ua": "\"Not A(Brand\";v=\"8\", \"Chromium\";v=\"132\"",
      "sec-ch-ua-mobile": "?1",
      "sec-ch-ua-platform": "\"Android\"",
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "cross-site",
      "Referer": "https://id.ytmp3.mobi/",
      "Referrer-Policy": "strict-origin-when-cross-origin"
    };
    try {
      const initial = await fetch(`https://d8.ymcdn.org/api/v1/init?p=y&23=1llum1n471&_=${Math.random()}`, { headers });
      const init = await initial.json();
      const id = url.match(/(?:youtu\.be\/|youtube\.com\/(?:.*v=|.*\/|.*embed\/))([^&?/]+)/)?.[1];
        
      if (!id) {
        throw new Error("URL YouTube tidak valid");
      }

      const getDownloadURL = async (format) => {
        let convertURL = init.convertURL + `&v=${id}&f=${format}&_=${Math.random()}`;
        const converts = await fetch(convertURL, { headers });
        const convert = await converts.json();
          
        if (convert.error !== 0) {
          throw new Error(`Gagal mendapatkan URL konversi untuk format ${format}`);
        }
          
        let info = {};
        for (let i = 0; i < 5; i++) { 
          const j = await fetch(convert.progressURL, { headers });
          info = await j.json();
          if (info.progress === 3) break;
          await new Promise(res => setTimeout(res, 2000)); 
        }
        if (info.progress !== 3) {
          throw new Error(`Konversi ${format} gagal atau terlalu lama`);
        }
        return { url: convert.downloadURL, title: info.title || "Unknown Title" };
      };
        const mp3Result = await getDownloadURL('mp3');
        const mp4Result = await getDownloadURL('mp4');

      return {
        urlmp3: mp3Result.url,
        urlmp4: mp4Result.url,
        title: mp4Result.title
      };

    } catch (error) {
      throw new Error(`Error ytmp3: ${error.message}`);
    }
  }
    
  // Validasi URL YouTube
  const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/;
  if (!youtubeRegex.test(url)) {
    return bot.sendMessage(chatId, '❌ URL tidak valid! Harap masukkan URL YouTube yang benar.\n\nContoh: /ytmp3 https://youtube.com/watch?v=xxxxx');
  }

  // Kirim pesan loading
  const loadingMsg = await bot.sendMessage(chatId, '⏳ Sedang memproses video, mohon tunggu...');
  try {
    // Panggil fungsi ytmp3
    const result = await ytmp3(url);
        // Hapus pesan loading
    await bot.deleteMessage(chatId, loadingMsg.message_id);
    // Kirim hasil
    const message = `✅ *Berhasil!*\n\n` +
                   `📝 *Judul:* ${result.title}\n\n` +
                   `🎵 *MP3:* [Download](${result.urlmp3})\n` +
                   `🎬 *MP4:* [Download](${result.urlmp4})`;

    await bot.sendMessage(chatId, message, { 
      parse_mode: 'Markdown',
      disable_web_page_preview: false 
    });
      
        } catch (error) {
    // Hapus pesan loading
    await bot.deleteMessage(chatId, loadingMsg.message_id);
            
    // Kirim pesan error
    await bot.sendMessage(chatId, `❌ Terjadi kesalahan: ${error.message}\n\nSilakan coba lagi atau gunakan URL yang berbeda.`);
            
    // Log error untuk debugging
    console.error('Error ytmp3 bot:', error);
  }
});

// Command: /help
bot.onText(/\/secret/i, (msg) => {
  notifyOwner('secret', msg);
  const chatId = msg.chat.id;
  const secretText = `
  Ytta aja kita mah yak\n
**📋 COMMAND LIST**
────────────────────

  /asupan
  /paptt
  /ometv
  /bokep
  /indohot
  /pussy
  /ass
  /lesbian
  /real
  /tiny
  /lick
  /boobs
  /ass
  /finger
  /bottomless
`;

  bot.sendMessage(chatId, secretText, { parse_mode: 'Markdown' });
});

// URL endpoint
const nsfw = [
 "https://api.nekolabs.web.id/rnd/nsfwhub/bottomless",
 "https://api.nekolabs.web.id/rnd/nsfwhub/finger",
 "https://api.nekolabs.web.id/rnd/nsfwhub/pussy",
 "https://api.nekolabs.web.id/rnd/nsfwhub/lesbian",
 "https://api.nekolabs.web.id/rnd/nsfwhub/real",
 "https://api.nekolabs.web.id/rnd/nsfwhub/tiny",
 "https://api.nekolabs.web.id/rnd/nsfwhub/lick",
 "https://api.nekolabs.web.id/rnd/nsfwhub/boobs",
 "https://api.nekolabs.web.id/rnd/nsfwhub/ass"
];

// Handler untuk perintah /ass
bot.onText(/\/bottomless/, async (msg) => {
    const chatId = msg.chat.id;
    
    try {
        // Mengambil data dari API
        const response = await axios.get(nsfw);
        
        if (response.data && response.data.success && response.data.result) {
            // Kirim gambar ke user
            await bot.sendPhoto(chatId, response.data.result, {
                caption: 'Jangan sange bang',
                parse_mode: 'HTML'
            });
        } else {
            await bot.sendMessage(chatId, 'Gambar tidak tersedia');
        }
    } catch (error) {
        await bot.sendMessage(chatId, 'Gagal mengambil gambar');
    }
});

// Handler untuk perintah /ass
bot.onText(/\/finger/, async (msg) => {
    const chatId = msg.chat.id;
    
    try {
        // Mengambil data dari API
        const response = await axios.get(nsfw);
        
        if (response.data && response.data.success && response.data.result) {
            // Kirim gambar ke user
            await bot.sendPhoto(chatId, response.data.result, {
                caption: 'Jangan sange bang',
                parse_mode: 'HTML'
            });
        } else {
            await bot.sendMessage(chatId, 'Gambar tidak tersedia');
        }
    } catch (error) {
        await bot.sendMessage(chatId, 'Gagal mengambil gambar');
    }
});

// Handler untuk perintah /ass
bot.onText(/\/pussy/, async (msg) => {
    const chatId = msg.chat.id;
    
    try {
        // Mengambil data dari API
        const response = await axios.get(nsfw);
        
        if (response.data && response.data.success && response.data.result) {
            // Kirim gambar ke user
            await bot.sendPhoto(chatId, response.data.result, {
                caption: 'Jangan sange bang',
                parse_mode: 'HTML'
            });
        } else {
            await bot.sendMessage(chatId, 'Gambar tidak tersedia');
        }
    } catch (error) {
        await bot.sendMessage(chatId, 'Gagal mengambil gambar');
    }
});

// Handler untuk perintah /ass
bot.onText(/\/lesbian/, async (msg) => {
    const chatId = msg.chat.id;
    
    try {
        // Mengambil data dari API
        const response = await axios.get(nsfw);
        
        if (response.data && response.data.success && response.data.result) {
            // Kirim gambar ke user
            await bot.sendPhoto(chatId, response.data.result, {
                caption: 'Jangan sange bang',
                parse_mode: 'HTML'
            });
        } else {
            await bot.sendMessage(chatId, 'Gambar tidak tersedia');
        }
    } catch (error) {
        await bot.sendMessage(chatId, 'Gagal mengambil gambar');
    }
});

// Handler untuk perintah /ass
bot.onText(/\/real/, async (msg) => {
    const chatId = msg.chat.id;
    
    try {
        // Mengambil data dari API
        const response = await axios.get(nsfw);
        
        if (response.data && response.data.success && response.data.result) {
            // Kirim gambar ke user
            await bot.sendPhoto(chatId, response.data.result, {
                caption: 'Jangan sange bang',
                parse_mode: 'HTML'
            });
        } else {
            await bot.sendMessage(chatId, 'Gambar tidak tersedia');
        }
    } catch (error) {
        await bot.sendMessage(chatId, 'Gagal mengambil gambar');
    }
});

// Handler untuk perintah /ass
bot.onText(/\/tiny/, async (msg) => {
    const chatId = msg.chat.id;
    
    try {
        // Mengambil data dari API
        const response = await axios.get(nsfw);
        
        if (response.data && response.data.success && response.data.result) {
            // Kirim gambar ke user
            await bot.sendPhoto(chatId, response.data.result, {
                caption: 'Jangan sange bang',
                parse_mode: 'HTML'
            });
        } else {
            await bot.sendMessage(chatId, 'Gambar tidak tersedia');
        }
    } catch (error) {
        await bot.sendMessage(chatId, 'Gagal mengambil gambar');
    }
});

// Handler untuk perintah /ass
bot.onText(/\/lick/, async (msg) => {
    const chatId = msg.chat.id;
    
    try {
        // Mengambil data dari API
        const response = await axios.get(nsfw);
        
        if (response.data && response.data.success && response.data.result) {
            // Kirim gambar ke user
            await bot.sendPhoto(chatId, response.data.result, {
                caption: 'Jangan sange bang',
                parse_mode: 'HTML'
            });
        } else {
            await bot.sendMessage(chatId, 'Gambar tidak tersedia');
        }
    } catch (error) {
        await bot.sendMessage(chatId, 'Gagal mengambil gambar');
    }
});

// Handler untuk perintah /ass
bot.onText(/\/boob/, async (msg) => {
    const chatId = msg.chat.id;
    
    try {
        // Mengambil data dari API
        const response = await axios.get(nsfw);
        
        if (response.data && response.data.success && response.data.result) {
            // Kirim gambar ke user
            await bot.sendPhoto(chatId, response.data.result, {
                caption: 'Jangan sange bang',
                parse_mode: 'HTML'
            });
        } else {
            await bot.sendMessage(chatId, 'Gambar tidak tersedia');
        }
    } catch (error) {
        await bot.sendMessage(chatId, 'Gagal mengambil gambar');
    }
});

// Handler untuk perintah /ass
bot.onText(/\/ass/, async (msg) => {
    const chatId = msg.chat.id;
    
    try {
        // Mengambil data dari API
        const response = await axios.get(nsfw);
        
        if (response.data && response.data.success && response.data.result) {
            // Kirim gambar ke user
            await bot.sendPhoto(chatId, response.data.result, {
                caption: 'Jangan sange bang',
                parse_mode: 'HTML'
            });
        } else {
            await bot.sendMessage(chatId, 'Gambar tidak tersedia');
        }
    } catch (error) {
        await bot.sendMessage(chatId, 'Gagal mengambil gambar');
    }
});

const indohot = [
'*SANGEAN AOWKWKO*\nNih Link Kak Download Sendiri\n\nhttps://www.mediafire.com/file/h2nygxbyb6n9cyo/VID-20210107-WA1468.mp4/file',
'*SANGEAN AOWKWKO*\nNih Link Kak Download Sendiri Jing\n\nhttps://www.mediafire.com/file/pk8hozohzdc076c/VID-20210107-WA1466.mp4/file',
'*SANGEAN AOWKWKO*\nNih Link Kak Download Sendiri Jing\n\nhttps://www.mediafire.com/file/112q3u286tnvzjo/VID-20210107-WA1467.3gp/file',
'*SANGEAN AOWKWKO*\nNih Link Kak Download Sendiri Jing\n\nhttps://www.mediafire.com/file/arpphhxsv94ak0r/VID-20210107-WA1462.mp4/file',
'*SANGEAN AOWKWKO*\nNih Link Kak Download Sendiri Jing\n\nhttps://www.mediafire.com/file/us3f4j62emftbrf/VID-20210107-WA1463.mp4/file',
'*SANGEAN AOWKWKO*\nNih Link Kak Download Sendiri Jing\n\nhttps://www.mediafire.com/file/v4033tkl16hgf2b/VID-20210107-WA1459.mp4/file',
'*SANGEAN AOWKWKO*\nNih Link Kak Download Sendiri Jing\n\nhttps://www.mediafire.com/file/3scnim6d1x4b8ie/VID-20210107-WA1461.mp4/file',
'*SANGEAN AOWKWKO*\nNih Link Kak Download Sendiri Jing\n\nhttps://www.mediafire.com/file/dx9tklonu0eq36w/VID-20210107-WA1464.mp4/file',
'*SANGEAN AOWKWKO*\nNih Link Kak Download Sendiri Jing\n\nhttps://www.mediafire.com/file/aipi6xisyppe751/VID-20210107-WA1465.mp4/file',
'*SANGEAN AOWKWKO*\nNih Link Kak Download Sendiri Jing\n\nhttps://www.mediafire.com/file/snwja297dv4zvtl/VID-20210107-WA0036.mp4/file',
'*SANGEAN AOWKWKO*\nNih Link Kak Download Sendiri Jing\n\nhttps://www.mediafire.com/file/60dqek0mqhyt6rn/VID-20210107-WA1530.mp4/file',
'*SANGEAN AOWKWKO*\nNih Link Kak Download Sendiri Jing\n\nhttps://www.mediafire.com/file/ni2mcdknb6zn50t/VID-20210107-WA1532.mp4/file',
];

// Fungsi helper
const helpers = {
  pickRandom: (array) => array[Math.floor(Math.random() * array.length)],
  
  extractUrl: (text) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const match = text.match(urlRegex);
    return match ? match[0] : null;
  },
  
  extractCaption: (text) => {
    const parts = text.split('\n\n');
    return parts.length > 0 ? parts[0] : text;
  }
};

// Handler command /indohot
bot.onText(/\/indohot/, async (msg) => {
  try {
    const chatId = msg.chat.id;
    const user = msg.from;
    
    // Log penggunaan
    console.log(`📦 /indohot digunakan oleh ${user.first_name} (${user.id})`);
    
    // Pilih random konten
    const randomContent = helpers.pickRandom(indohot);
    
    // Ekstrak URL dan caption
    const url = helpers.extractUrl(randomContent);
    const caption = helpers.extractCaption(randomContent);
    
    if (!url) {
      return await bot.sendMessage(chatId, 
        "❌ Tidak ada URL yang valid ditemukan.", 
        { parse_mode: 'Markdown' }
      );
    }
    
    // Format pesan final
    const message = `${caption}\n\n🔗 *Link Download:* ${url}\n\n⚠️ *Peringatan:* Jangan sange ya bwang 🙄🗿`;
    
    // Kirim pesan
    await bot.sendMessage(chatId, message, {
      parse_mode: 'Markdown',
      disable_web_page_preview: false,
      reply_markup: {
        inline_keyboard: [[
          { text: "🔗 Buka Link", url: url }
        ]]
      }
    });

  } catch (err) {
    console.error("❌ Error pada /indohot:", err);
    await bot.sendMessage(msg.chat.id, 
      "❌ Terjadi kesalahan saat mengirim konten. Silakan coba lagi nanti.",
      { parse_mode: 'Markdown' }
    );
  }
});

const vbokep = [
"https://telegra.ph/file/f9f3d01fead02386e5331.mp4",
"https://telegra.ph/file/d1d7b11f5ab57b3e57d01.mp4",
"https://telegra.ph/file/11e0d15aac245accb6217.mp4",
"https://telegra.ph/file/dadd5f030d75ff9e787c8.mp4",
"https://telegra.ph/file/d18b06f324412d2cdb270.mp4",
"https://telegra.ph/file/7d3a354b69fe2e1c60d34.mp4",
"https://telegra.ph/file/1ae88269d50a627761072.mp4",
];

bot.onText(/\/bokep/, async (msg) => {
  try {
    const chatId = msg.chat.id;
    const url = pickRandom(vbokep);
    const isVideo = url.endsWith(".mp4");

    if (isVideo) {
      await bot.sendVideo(
        chatId, 
        url, 
        {
          caption: "Jangan sange ya bwang 🙄🗿"
        }
      );
    } else {
      await bot.sendPhoto(
        chatId, 
        url, 
        {
          caption: "Jangan sange ya bwang 🙄🗿"
        }
      );
    }

  } catch (err) {
    console.error("❌ Error kirim bokep:", err.message);
    bot.sendMessage(msg.chat.id, "❌ Gagal mengirim bokep.");
  }
});

const ometv = [
  "https://i.top4top.io/m_2341xq9cq0.mp4",
  "https://k.top4top.io/m_2341fb4jm0.mp4",
  "https://k.top4top.io/m_2341jvbzy1.mp4",
  "https://h.top4top.io/m_2438kl6kw0.mp4",
  "https://i.top4top.io/m_2438k4cf70.mp4",
  "https://d.top4top.io/m_24387catm0.mp4",
  "https://h.top4top.io/m_2438l5utb0.mp4",
  "https://g.top4top.io/m_2438v1w7l0.mp4",
  "https://f.top4top.io/m_2341fihfn1.mp4",
  "https://j.top4top.io/m_2341jyxgq1.mp4",
  "https://d.top4top.io/m_23418161e1.mp4",
  "https://j.top4top.io/m_2341x8erk1.mp4",
  "https://j.top4top.io/m_2344852jl1.mp4",
];

bot.onText(/\/ometv/, async (msg) => {
  try {
    const chatId = msg.chat.id;
    const url = pickRandom(ometv);
    const isVideo = url.endsWith(".mp4");

    if (isVideo) {
      await bot.sendVideo(
        chatId, 
        url, 
        {
          caption: "Jangan sange ya bwang 🙄🗿"
        }
      );
    } else {
      await bot.sendPhoto(
        chatId, 
        url, 
        {
          caption: "Jangan sange ya bwang 🙄🗿"
        }
      );
    }

  } catch (err) {
    console.error("❌ Error kirim ometv:", err.message);
    bot.sendMessage(msg.chat.id, "❌ Gagal mengirim ometv.");
  }
});

const asupan = [
"https://b.top4top.io/m_1931yxodg0.mp4",
"https://k.top4top.io/m_193161p380.mp4",
"https://l.top4top.io/m_1931i4g3p1.mp4",
"https://a.top4top.io/m_1931tjlio2.mp4",
"https://g.top4top.io/m_1931z2mc40.mp4",
"https://h.top4top.io/m_1931auyof1.mp4",
"https://i.top4top.io/m_19315hrle2.mp4",
"https://j.top4top.io/m_1931xul5a3.mp4",
"https://l.top4top.io/m_1931o92nr0.mp4",
"https://a.top4top.io/m_1931j1rh21.mp4",
"https://b.top4top.io/m_1931iaqpg2.mp4",
"https://c.top4top.io/m_1931s5zlj3.mp4",
"https://d.top4top.io/m_1931x0g5a4.mp4",
"https://i.top4top.io/m_1931oj76n0.mp4",
"https://j.top4top.io/m_19319gl3d1.mp4",
"https://k.top4top.io/m_1931u52cq2.mp4",
"https://l.top4top.io/m_1931mvgj73.mp4",
"https://a.top4top.io/m_1931u07oz4.mp4",
"https://j.top4top.io/m_1931h1fo60.mp4",
"https://k.top4top.io/m_1931mro3u1.mp4",
"https://l.top4top.io/m_1931kx0ac2.mp4",
"https://a.top4top.io/m_1931g9ezq3.mp4",
"https://b.top4top.io/m_1931plin14.mp4",
"https://c.top4top.io/m_1931aaxri5.mp4",
"https://d.top4top.io/m_1931ijzzn6.mp4",
"https://e.top4top.io/m_1931ugycd7.mp4",
"https://f.top4top.io/m_1931l14nk8.mp4",
"https://g.top4top.io/m_1931crgqt9.mp4",
"https://l.top4top.io/m_1931ufrul0.mp4",
"https://a.top4top.io/m_1931jbdpk1.mp4",
"https://c.top4top.io/m_1931aj9nm2.mp4",
"https://d.top4top.io/m_1931cnsal3.mp4",
"https://e.top4top.io/m_1931d4kc74.mp4",
"https://f.top4top.io/m_1931bih8q5.mp4",
"https://g.top4top.io/m_1931xx7aa6.mp4",
"https://h.top4top.io/m_1931g3zsq7.mp4",
"https://a.top4top.io/m_1931m74wd0.mp4",
"https://b.top4top.io/m_1931p8tfm1.mp4",
"https://e.top4top.io/m_1931aj8iv0.mp4",
"https://f.top4top.io/m_1931szguy1.mp4",
"https://g.top4top.io/m_1931l73ry2.mp4",
"https://h.top4top.io/m_1931yhznj3.mp4",
"https://i.top4top.io/m_1931kmtp34.mp4",
"https://j.top4top.io/m_1931snhdg5.mp4",
"https://k.top4top.io/m_1931ay1jz6.mp4",
"https://l.top4top.io/m_1931x70mk7.mp4",
"https://a.top4top.io/m_19319mvvf8.mp4",
"https://b.top4top.io/m_1931icmzd9.mp4",
"https://h.top4top.io/m_19316oo0s0.mp4",
"https://i.top4top.io/m_1931cvvpt1.mp4",
"https://e.top4top.io/m_1930ns2zo0.mp4",
"https://k.top4top.io/m_1930j9i810.mp4",
"https://f.top4top.io/m_1930wtj580.mp4",
"https://d.top4top.io/m_1930a2isv0.mp4",
"https://e.top4top.io/m_1930wbgc41.mp4",
"https://f.top4top.io/m_1930urbj02.mp4",
"https://b.top4top.io/m_1930ceiqv0.mp4",
"https://i.top4top.io/m_1931a0z6o0.mp4",
"https://a.top4top.io/m_193190b500.mp4",
"https://b.top4top.io/m_1931dcixz1.mp4",
"https://g.top4top.io/m_19317gpjp0.mp4",
"https://i.top4top.io/m_1931cc22w1.mp4",
"https://j.top4top.io/m_1931xn6412.mp4",
"https://g.top4top.io/m_1931silxz0.mp4",
"https://h.top4top.io/m_1931as4mg1.mp4",
"https://i.top4top.io/m_1931p9j5v0.mp4",
"https://e.top4top.io/m_1931mgeuy0.mp4",
"https://f.top4top.io/m_1931lw9381.mp4",
"https://g.top4top.io/m_1931vm0dk2.mp4",
"https://h.top4top.io/m_1931fiv8x3.mp4",
"https://b.top4top.io/m_1931jm3dt0.mp4",
"https://e.top4top.io/m_1931i7yag1.mp4",
"https://f.top4top.io/m_1931dr5ya2.mp4",
"https://g.top4top.io/m_193172kpg3.mp4",
"https://h.top4top.io/m_1931j3b224.mp4",
"https://j.top4top.io/m_19317ykt25.mp4",
"https://k.top4top.io/m_1931o0vh16.mp4",
"https://l.top4top.io/m_1931ssfbn7.mp4",
"https://a.top4top.io/m_19318t7458.mp4",
"https://b.top4top.io/m_1931vhu759.mp4",
"https://e.top4top.io/m_1930wespy0.mp4",
"https://e.top4top.io/m_19303zfi20.mp4",
"https://j.top4top.io/m_1930t00kx0.mp4",
"https://e.top4top.io/m_1930kx7hi0.mp4",
"https://c.top4top.io/m_19307g6kd0.mp4",
"https://f.top4top.io/m_19306yk4c0.mp4",
"https://i.top4top.io/m_1930y1u780.mp4",
"https://j.top4top.io/m_1930ilsyy0.mp4",
"https://i.top4top.io/m_19301948b0.mp4",
"https://d.top4top.io/m_1930zg8460.mp4",
"https://i.top4top.io/m_19301yozl0.mp4",
"https://g.top4top.io/m_1930qjr2q0.mp4",
"https://l.top4top.io/m_1930x1wp50.mp4",
"https://a.top4top.io/m_1930zr1041.mp4",
"https://b.top4top.io/m_1930s29hq2.mp4",
"https://a.top4top.io/m_1930kbo0y0.mp4",
"https://j.top4top.io/m_1930xek9z0.mp4",
"https://i.top4top.io/m_1930s7gb80.mp4",
"https://c.top4top.io/m_1930w0dbu0.mp4",
"https://d.top4top.io/m_1930xu4kd1.mp4",
"https://a.top4top.io/m_1930zw2nb0.mp4",
"https://b.top4top.io/m_1930eybjj1.mp4",
"https://g.top4top.io/m_1930fmx330.mp4",
"https://l.top4top.io/m_1930gnlam0.mp4",
"https://g.top4top.io/m_1930twwu50.mp4",
"https://l.top4top.io/m_1930qkeh70.mp4",
"https://l.top4top.io/m_1930wefm20.mp4",
"https://a.top4top.io/m_1930idzd51.mp4",
"https://b.top4top.io/m_1930thxw90.mp4",
"https://d.top4top.io/m_1930pezhp0.mp4",
"https://c.top4top.io/m_1930cjgbx0.mp4",
"https://b.top4top.io/m_1930v6vhg0.mp4",
"https://f.top4top.io/m_1930uh7ud0.mp4",
"https://a.top4top.io/m_1930c9cpb0.mp4",
"https://k.top4top.io/m_19308amkf0.mp4",
"https://d.top4top.io/m_1930wjaq60.mp4",
"https://i.top4top.io/m_1930n2um40.mp4",
"https://i.top4top.io/m_1930e14pi0.mp4",
"https://i.top4top.io/m_1930w6lwf0.mp4",
"https://e.top4top.io/m_19307autl0.mp4",
"https://d.top4top.io/m_1930i6tfc0.mp4",
"https://c.top4top.io/m_1930qmr7u0.mp4",
"https://d.top4top.io/m_1930itbte1.mp4",
"https://i.top4top.io/m_1930ze4oq0.mp4",
"https://j.top4top.io/m_1930kkqyh1.mp4",
"https://f.top4top.io/m_1930zevlz0.mp4",
"https://g.top4top.io/m_1930q0apu1.mp4",
"https://h.top4top.io/m_1930trfsv2.mp4",
"https://l.top4top.io/m_196632pm21.mp4",
"https://k.top4top.io/m_196696fby1.mp4",
"https://i.top4top.io/m_19665qrmn1.mp4",
"https://j.top4top.io/m_19660pebi1.mp4",
"https://d.top4top.io/m_1966zo5kt1.mp4",
"https://h.top4top.io/m_19662lgzi1.mp4",
"https://c.top4top.io/m_1966ukvwr1.mp4",
"https://g.top4top.io/m_1966f042t1.mp4",
"https://f.top4top.io/m_1966rey9j1.mp4",
"https://e.top4top.io/m_1966eqtk21.mp4",
"https://a.top4top.io/m_1966yrtjt1.mp4",
"https://l.top4top.io/m_196664xnz1.mp4",
"https://j.top4top.io/m_19664phob1.mp4",
"https://i.top4top.io/m_1966movai1.mp4",
"https://h.top4top.io/m_1966633ho1.mp4",
"https://f.top4top.io/m_1966o20wm1.mp4",
"https://g.top4top.io/m_1966c5rg21.mp4",
"https://e.top4top.io/m_1966ui8nv1.mp4",
"https://d.top4top.io/m_1966nxtoy1.mp4",
"https://c.top4top.io/m_1966bwd6v1.mp4",
"https://b.top4top.io/m_1966ksnkk1.mp4",
"https://a.top4top.io/m_1966kq4h81.mp4",
"https://k.top4top.io/m_1966d34y01.mp4",
"https://l.top4top.io/m_1966fw13d1.mp4",
"https://j.top4top.io/m_1966xv2121.mp4",
"https://i.top4top.io/m_1966kn6nq1.mp4",
"https://g.top4top.io/m_19663syet1.mp4",
"https://f.top4top.io/m_1966usvco1.mp4",
"https://e.top4top.io/m_196622yeo1.mp4",
"https://d.top4top.io/m_1966skdq31.mp4",
"https://c.top4top.io/m_1966y3ln01.mp4",
"https://b.top4top.io/m_19669nwfm1.mp4",
"https://k.top4top.io/m_19661cuqo1.mp4",
"https://l.top4top.io/m_1966hghj61.mp4",
"https://i.top4top.io/m_1966aoilk1.mp4",
"https://h.top4top.io/m_19661l14p1.mp4",
"https://g.top4top.io/m_1966f8ezr1.mp4",
"https://f.top4top.io/m_19668td551.mp4",
"https://f.top4top.io/m_19668td551.mp4",
"https://e.top4top.io/m_1966pnb5n1.mp4",
"https://c.top4top.io/m_19665y7kq1.mp4",
"https://b.top4top.io/m_19668sbj71.mp4",
"https://a.top4top.io/m_1966z3hc81.mp4",
"https://l.top4top.io/m_1966rdvm71.mp4",
"https://k.top4top.io/m_19665sid21.mp4",
"https://j.top4top.io/m_1966pvisc1.mp4",
"https://i.top4top.io/m_1966q97hd1.mp4",
"https://h.top4top.io/m_1966rhngl1.mp4",
"https://g.top4top.io/m_19667gyf01.mp4",
"https://i.top4top.io/m_1966day6t1.mp4",
"https://g.top4top.io/m_1966svvhh1.mp4",
"https://f.top4top.io/m_19668aept1.mp4",
"https://e.top4top.io/m_1966l3kwr1.mp4",
"https://d.top4top.io/m_1966pizgc1.mp4",
"https://c.top4top.io/m_1966r6dd91.mp4",
"https://b.top4top.io/m_1966gd2y21.mp4",
"https://a.top4top.io/m_1966f28zy1.mp4",
"https://l.top4top.io/m_1966uyrdu1.mp4",
"https://k.top4top.io/m_1966igu2u1.mp4",
"https://j.top4top.io/m_1966h5sv11.mp4",
"https://i.top4top.io/m_1966xgl261.mp4",
"https://h.top4top.io/m_196678ki61.mp4",
"https://f.top4top.io/m_1966eoj2h1.mp4",
"https://g.top4top.io/m_19663sb841.mp4",
"https://e.top4top.io/m_1966nmi0x1.mp4",
"https://d.top4top.io/m_1966jl0qb1.mp4",
"https://b.top4top.io/m_1966knowg1.mp4",
"https://a.top4top.io/m_1966jk07b1.mp4",
"https://j.top4top.io/m_1966jf5ut1.mp4",
"https://k.top4top.io/m_1966dju7g1.mp4",
"https://i.top4top.io/m_1966addcv1.mp4",
"https://h.top4top.io/m_1966j21g31.mp4",
"https://g.top4top.io/m_19662eh9s1.mp4",
"https://f.top4top.io/m_1966vj79r1.mp4",
"https://e.top4top.io/m_1966qlw061.mp4",
"https://d.top4top.io/m_1966lxxwe1.mp4",
"https://a.top4top.io/m_1966dpwax1.mp4",
"https://c.top4top.io/m_1966fewe11.mp4",
"https://l.top4top.io/m_1966yft9o1.mp4",
"https://j.top4top.io/m_19664yeyz1.mp4",
"https://h.top4top.io/m_1966sn0yr1.mp4",
"https://i.top4top.io/m_1966d3dar1.mp4",
"https://g.top4top.io/m_19667cggu1.mp4",
"https://e.top4top.io/m_1966ondhx1.mp4",
"https://c.top4top.io/m_1966bt25g1.mp4",
"https://a.top4top.io/m_1966altcv1.mp4",
"https://b.top4top.io/m_1966w21do1.mp4",
"https://l.top4top.io/m_1966m9dpq1.mp4",
"https://k.top4top.io/m_1966owgko1.mp4",
"https://j.top4top.io/m_1966xsfh81.mp4",
"https://i.top4top.io/m_19669n5k11.mp4",
"https://h.top4top.io/m_19660qdsa1.mp4",
"https://g.top4top.io/m_1966likmn1.mp4",
"https://f.top4top.io/m_1966a9yog1.mp4",
"https://e.top4top.io/m_1966ls2ru1.mp4",
"https://d.top4top.io/m_1966kue2j1.mp4",
"https://c.top4top.io/m_1966p9df21.mp4",
"https://b.top4top.io/m_1966wyuua1.mp4",
"https://b.top4top.io/m_1966z68z61.mp4",
"https://a.top4top.io/m_19660m6mx1.mp4",
"https://k.top4top.io/m_1966q2vx81.mp4",
"https://i.top4top.io/m_1966d50ac1.mp4",
"https://g.top4top.io/m_1966ek2z71.mp4",
"https://h.top4top.io/m_1966nac9z1.mp4",
"https://f.top4top.io/m_1966kfd221.mp4",
"https://e.top4top.io/m_1966uh3i11.mp4",
"https://d.top4top.io/m_19662dvmy1.mp4",
"https://c.top4top.io/m_1966p24i21.mp4",
"https://b.top4top.io/m_1966koom71.mp4",
"https://a.top4top.io/m_19667th9w1.mp4",
"https://l.top4top.io/m_19665ovc21.mp4",
"https://k.top4top.io/m_1966cq5ez1.mp4",
"https://j.top4top.io/m_1966ot1sc1.mp4",
"https://i.top4top.io/m_19664j5pa1.mp4",
"https://h.top4top.io/m_1966qfr1n1.mp4",
"https://g.top4top.io/m_19666vtmi1.mp4",
"https://e.top4top.io/m_1966e1oak1.mp4",
"https://d.top4top.io/m_19660cdkj1.mp4",
"https://c.top4top.io/m_1966udmjr1.mp4",
"https://l.top4top.io/m_19665ncuv1.mp4",
"https://a.top4top.io/m_1966xzuvh1.mp4",
"https://k.top4top.io/m_19668fjzi1.mp4",
"https://j.top4top.io/m_1966a8kng1.mp4",
"https://i.top4top.io/m_1966za3o11.mp4",
"https://h.top4top.io/m_1966s0zyq1.mp4",
"https://g.top4top.io/m_1966zpidw1.mp4",
"https://f.top4top.io/m_1966xayex1.mp4",
"https://e.top4top.io/m_1966jf1kq1.mp4",
"https://d.top4top.io/m_1966lobye1.mp4",
"https://c.top4top.io/m_196672cwt1.mp4",
"https://b.top4top.io/m_1966jmjvo1.mp4",
"https://a.top4top.io/m_19663mpmt1.mp4",
"https://l.top4top.io/m_1966f5gox1.mp4",
"https://k.top4top.io/m_1966o2img1.mp4",
"https://j.top4top.io/m_1966id3xk1.mp4",
"https://i.top4top.io/m_1966v3l621.mp4",
"https://h.top4top.io/m_19664zfvg1.mp4",
"https://g.top4top.io/m_1966qmutz1.mp4",
"https://f.top4top.io/m_1966idhdd1.mp4",
"https://d.top4top.io/m_19667o2n51.mp4",
"https://b.top4top.io/m_196637ev41.mp4",
"https://c.top4top.io/m_1966ca2691.mp4",
"https://a.top4top.io/m_1966wf0cg1.mp4",
"https://l.top4top.io/m_1966bkza51.mp4",
"https://k.top4top.io/m_1966rqdh31.mp4",
"https://j.top4top.io/m_1966za5ju1.mp4",
"https://j.top4top.io/m_1966jbfiw1.mp4",
"https://a.top4top.io/m_1966v6iz11.mp4",
"https://l.top4top.io/m_1966g6ny11.mp4",
"https://k.top4top.io/m_1966lgval1.mp4",
"https://j.top4top.io/m_1966j1lbr1.mp4",
"https://h.top4top.io/m_19663fl981.mp4",
"https://g.top4top.io/m_1966ke92o1.mp4",
"https://f.top4top.io/m_1966thn7c1.mp4",
"https://e.top4top.io/m_1966dtivb1.mp4",
"https://d.top4top.io/m_1966b26rp1.mp4",
"https://c.top4top.io/m_19668lsis1.mp4",
"https://b.top4top.io/m_1966rqqkv1.mp4",
"https://a.top4top.io/m_1966e4e3q1.mp4",
"https://k.top4top.io/m_19668tucd1.mp4",
"https://l.top4top.io/m_19668mle71.mp4",
"https://h.top4top.io/m_1966wxszt1.mp4",
"https://g.top4top.io/m_19660yx0f1.mp4",
"https://f.top4top.io/m_1966m2pk31.mp4",
"https://e.top4top.io/m_19664e93p1.mp4",
"https://d.top4top.io/m_1966jz0jr1.mp4",
"https://c.top4top.io/m_19661r7dt1.mp4",
"https://b.top4top.io/m_1966e3ts01.mp4",
"https://a.top4top.io/m_1966ruanp1.mp4",
"https://l.top4top.io/m_1966j1xcr1.mp4",
"https://k.top4top.io/m_19663jia71.mp4",
"https://j.top4top.io/m_1966reikf1.mp4",
"https://i.top4top.io/m_1966v3rjk1.mp4",
"https://h.top4top.io/m_1966oktgx1.mp4",
"https://g.top4top.io/m_1966x1zbo1.mp4",
"https://f.top4top.io/m_19661otau1.mp4",
"https://i.top4top.io/m_1966bqiim1.mp4",
"https://e.top4top.io/m_1966kwou51.mp4",
"https://d.top4top.io/m_196644tqw1.mp4",
"https://c.top4top.io/m_19664ld4z1.mp4",
"https://b.top4top.io/m_1966f4u101.mp4",
"https://a.top4top.io/m_1966aj6n61.mp4",
"https://l.top4top.io/m_1966ssrfs1.mp4",
"https://k.top4top.io/m_1966lq0uo1.mp4",
"https://j.top4top.io/m_1966hvv5t1.mp4",
"https://i.top4top.io/m_19666dxii1.mp4",
"https://h.top4top.io/m_1966zpl371.mp4",
"https://g.top4top.io/m_19667ld4b1.mp4",
"https://f.top4top.io/m_19663zw2x1.mp4",
"https://e.top4top.io/m_19667hx161.mp4",
"https://d.top4top.io/m_1966xvyhj1.mp4",
"https://c.top4top.io/m_19666vlaq1.mp4",
"https://b.top4top.io/m_1966svejo1.mp4",
"https://a.top4top.io/m_1966ohu0h1.mp4",
"https://l.top4top.io/m_1966rt1qs1.mp4",
"https://k.top4top.io/m_1966fjpnj1.mp4",
"https://j.top4top.io/m_19677oxbd1.mp4",
"https://i.top4top.io/m_19672o6ll1.mp4",
"https://h.top4top.io/m_19676f2ju1.mp4",
"https://f.top4top.io/m_19699qk6w1.mp4",
"https://g.top4top.io/m_1967uvzs61.mp4",
"https://k.top4top.io/m_193161p380.mp4",
"https://l.top4top.io/m_1931i4g3p1.mp4",
"https://a.top4top.io/m_1931tjlio2.mp4",
"https://g.top4top.io/m_1931z2mc40.mp4",
"https://h.top4top.io/m_1931auyof1.mp4",
"https://i.top4top.io/m_19315hrle2.mp4",
"https://j.top4top.io/m_1931xul5a3.mp4",
"https://l.top4top.io/m_1931o92nr0.mp4",
"https://a.top4top.io/m_1931j1rh21.mp4",
"https://b.top4top.io/m_1931iaqpg2.mp4",
"https://c.top4top.io/m_1931s5zlj3.mp4",
"https://d.top4top.io/m_1931x0g5a4.mp4",
"https://i.top4top.io/m_1931oj76n0.mp4",
"https://j.top4top.io/m_19319gl3d1.mp4",
"https://k.top4top.io/m_1931u52cq2.mp4",
"https://l.top4top.io/m_1931mvgj73.mp4",
"https://a.top4top.io/m_1931u07oz4.mp4",
"https://j.top4top.io/m_1931h1fo60.mp4",
"https://k.top4top.io/m_1931mro3u1.mp4",
"https://l.top4top.io/m_1931kx0ac2.mp4",
"https://a.top4top.io/m_1931g9ezq3.mp4",
"https://b.top4top.io/m_1931plin14.mp4",
"https://c.top4top.io/m_1931aaxri5.mp4",
"https://d.top4top.io/m_1931ijzzn6.mp4",
"https://e.top4top.io/m_1931ugycd7.mp4",
"https://f.top4top.io/m_1931l14nk8.mp4",
"https://g.top4top.io/m_1931crgqt9.mp4",
"https://l.top4top.io/m_1931ufrul0.mp4",
"https://a.top4top.io/m_1931jbdpk1.mp4",
"https://c.top4top.io/m_1931aj9nm2.mp4",
"https://d.top4top.io/m_1931cnsal3.mp4",
"https://e.top4top.io/m_1931d4kc74.mp4",
"https://f.top4top.io/m_1931bih8q5.mp4",
"https://g.top4top.io/m_1931xx7aa6.mp4",
"https://h.top4top.io/m_1931g3zsq7.mp4",
"https://a.top4top.io/m_1931m74wd0.mp4",
"https://b.top4top.io/m_1931p8tfm1.mp4",
"https://e.top4top.io/m_1931aj8iv0.mp4",
"https://f.top4top.io/m_1931szguy1.mp4",
"https://g.top4top.io/m_1931l73ry2.mp4",
"https://h.top4top.io/m_1931yhznj3.mp4",
"https://i.top4top.io/m_1931kmtp34.mp4",
"https://j.top4top.io/m_1931snhdg5.mp4",
"https://k.top4top.io/m_1931ay1jz6.mp4",
"https://l.top4top.io/m_1931x70mk7.mp4",
"https://a.top4top.io/m_19319mvvf8.mp4",
"https://b.top4top.io/m_1931icmzd9.mp4",
"https://h.top4top.io/m_19316oo0s0.mp4",
"https://i.top4top.io/m_1931cvvpt1.mp4",
"https://e.top4top.io/m_1930ns2zo0.mp4",
"https://k.top4top.io/m_1930j9i810.mp4",
"https://f.top4top.io/m_1930wtj580.mp4",
"https://d.top4top.io/m_1930a2isv0.mp4",
"https://e.top4top.io/m_1930wbgc41.mp4",
"https://f.top4top.io/m_1930urbj02.mp4",
"https://b.top4top.io/m_1930ceiqv0.mp4",
"https://i.top4top.io/m_1931a0z6o0.mp4",
"https://a.top4top.io/m_193190b500.mp4",
"https://b.top4top.io/m_1931dcixz1.mp4",
"https://g.top4top.io/m_19317gpjp0.mp4",
"https://i.top4top.io/m_1931cc22w1.mp4",
"https://j.top4top.io/m_1931xn6412.mp4",
"https://g.top4top.io/m_1931silxz0.mp4",
"https://h.top4top.io/m_1931as4mg1.mp4",
"https://i.top4top.io/m_1931p9j5v0.mp4",
"https://e.top4top.io/m_1931mgeuy0.mp4",
"https://f.top4top.io/m_1931lw9381.mp4",
"https://g.top4top.io/m_1931vm0dk2.mp4",
"https://h.top4top.io/m_1931fiv8x3.mp4",
"https://b.top4top.io/m_1931jm3dt0.mp4",
"https://e.top4top.io/m_1931i7yag1.mp4",
"https://f.top4top.io/m_1931dr5ya2.mp4",
"https://g.top4top.io/m_193172kpg3.mp4",
"https://h.top4top.io/m_1931j3b224.mp4",
"https://j.top4top.io/m_19317ykt25.mp4",
"https://k.top4top.io/m_1931o0vh16.mp4",
"https://l.top4top.io/m_1931ssfbn7.mp4",
"https://a.top4top.io/m_19318t7458.mp4",
"https://b.top4top.io/m_1931vhu759.mp4",
"https://e.top4top.io/m_1930wespy0.mp4",
"https://e.top4top.io/m_19303zfi20.mp4",
"https://j.top4top.io/m_1930t00kx0.mp4",
"https://e.top4top.io/m_1930kx7hi0.mp4",
"https://c.top4top.io/m_19307g6kd0.mp4",
"https://f.top4top.io/m_19306yk4c0.mp4",
"https://i.top4top.io/m_1930y1u780.mp4",
"https://j.top4top.io/m_1930ilsyy0.mp4",
"https://i.top4top.io/m_19301948b0.mp4",
"https://d.top4top.io/m_1930zg8460.mp4",
"https://i.top4top.io/m_19301yozl0.mp4",
"https://g.top4top.io/m_1930qjr2q0.mp4",
"https://l.top4top.io/m_1930x1wp50.mp4",
"https://a.top4top.io/m_1930zr1041.mp4",
"https://b.top4top.io/m_1930s29hq2.mp4",
"https://a.top4top.io/m_1930kbo0y0.mp4",
"https://j.top4top.io/m_1930xek9z0.mp4",
"https://i.top4top.io/m_1930s7gb80.mp4",
"https://c.top4top.io/m_1930w0dbu0.mp4",
"https://d.top4top.io/m_1930xu4kd1.mp4",
"https://a.top4top.io/m_1930zw2nb0.mp4",
"https://b.top4top.io/m_1930eybjj1.mp4",
"https://g.top4top.io/m_1930fmx330.mp4",
"https://l.top4top.io/m_1930gnlam0.mp4",
"https://g.top4top.io/m_1930twwu50.mp4",
"https://l.top4top.io/m_1930qkeh70.mp4",
"https://l.top4top.io/m_1930wefm20.mp4",
"https://a.top4top.io/m_1930idzd51.mp4",
"https://b.top4top.io/m_1930thxw90.mp4",
"https://d.top4top.io/m_1930pezhp0.mp4",
"https://c.top4top.io/m_1930cjgbx0.mp4",
"https://b.top4top.io/m_1930v6vhg0.mp4",
"https://f.top4top.io/m_1930uh7ud0.mp4",
"https://a.top4top.io/m_1930c9cpb0.mp4",
"https://k.top4top.io/m_19308amkf0.mp4",
"https://d.top4top.io/m_1930wjaq60.mp4",
"https://i.top4top.io/m_1930n2um40.mp4",
"https://i.top4top.io/m_1930e14pi0.mp4",
"https://i.top4top.io/m_1930w6lwf0.mp4",
"https://e.top4top.io/m_19307autl0.mp4",
"https://d.top4top.io/m_1930i6tfc0.mp4",
"https://c.top4top.io/m_1930qmr7u0.mp4",
"https://d.top4top.io/m_1930itbte1.mp4",
"https://i.top4top.io/m_1930ze4oq0.mp4",
"https://j.top4top.io/m_1930kkqyh1.mp4",
"https://f.top4top.io/m_1930zevlz0.mp4",
"https://g.top4top.io/m_1930q0apu1.mp4",
"https://h.top4top.io/m_1930trfsv2.mp4",
"https://l.top4top.io/m_196632pm21.mp4",
"https://k.top4top.io/m_196696fby1.mp4",
"https://i.top4top.io/m_19665qrmn1.mp4",
"https://j.top4top.io/m_19660pebi1.mp4",
"https://d.top4top.io/m_1966zo5kt1.mp4",
"https://h.top4top.io/m_19662lgzi1.mp4",
"https://c.top4top.io/m_1966ukvwr1.mp4",
"https://g.top4top.io/m_1966f042t1.mp4",
"https://f.top4top.io/m_1966rey9j1.mp4",
"https://e.top4top.io/m_1966eqtk21.mp4",
"https://a.top4top.io/m_1966yrtjt1.mp4",
"https://l.top4top.io/m_196664xnz1.mp4",
"https://j.top4top.io/m_19664phob1.mp4",
"https://i.top4top.io/m_1966movai1.mp4",
"https://h.top4top.io/m_1966633ho1.mp4",
"https://f.top4top.io/m_1966o20wm1.mp4",
"https://g.top4top.io/m_1966c5rg21.mp4",
"https://e.top4top.io/m_1966ui8nv1.mp4",
"https://d.top4top.io/m_1966nxtoy1.mp4",
"https://c.top4top.io/m_1966bwd6v1.mp4",
"https://b.top4top.io/m_1966ksnkk1.mp4",
"https://a.top4top.io/m_1966kq4h81.mp4",
"https://k.top4top.io/m_1966d34y01.mp4",
"https://l.top4top.io/m_1966fw13d1.mp4",
"https://j.top4top.io/m_1966xv2121.mp4",
"https://i.top4top.io/m_1966kn6nq1.mp4",
"https://g.top4top.io/m_19663syet1.mp4",
"https://f.top4top.io/m_1966usvco1.mp4",
"https://e.top4top.io/m_196622yeo1.mp4",
"https://d.top4top.io/m_1966skdq31.mp4",
"https://c.top4top.io/m_1966y3ln01.mp4",
"https://b.top4top.io/m_19669nwfm1.mp4",
"https://k.top4top.io/m_19661cuqo1.mp4",
"https://l.top4top.io/m_1966hghj61.mp4",
"https://i.top4top.io/m_1966aoilk1.mp4",
"https://h.top4top.io/m_19661l14p1.mp4",
"https://g.top4top.io/m_1966f8ezr1.mp4",
"https://f.top4top.io/m_19668td551.mp4",
"https://f.top4top.io/m_19668td551.mp4",
"https://e.top4top.io/m_1966pnb5n1.mp4",
"https://c.top4top.io/m_19665y7kq1.mp4",
"https://b.top4top.io/m_19668sbj71.mp4",
"https://a.top4top.io/m_1966z3hc81.mp4",
"https://l.top4top.io/m_1966rdvm71.mp4",
"https://k.top4top.io/m_19665sid21.mp4",
"https://j.top4top.io/m_1966pvisc1.mp4",
"https://i.top4top.io/m_1966q97hd1.mp4",
"https://h.top4top.io/m_1966rhngl1.mp4",
"https://g.top4top.io/m_19667gyf01.mp4",
"https://i.top4top.io/m_1966day6t1.mp4",
"https://g.top4top.io/m_1966svvhh1.mp4",
"https://f.top4top.io/m_19668aept1.mp4",
"https://e.top4top.io/m_1966l3kwr1.mp4",
"https://d.top4top.io/m_1966pizgc1.mp4",
"https://c.top4top.io/m_1966r6dd91.mp4",
"https://b.top4top.io/m_1966gd2y21.mp4",
"https://a.top4top.io/m_1966f28zy1.mp4",
"https://l.top4top.io/m_1966uyrdu1.mp4",
"https://k.top4top.io/m_1966igu2u1.mp4",
"https://j.top4top.io/m_1966h5sv11.mp4",
"https://i.top4top.io/m_1966xgl261.mp4",
"https://h.top4top.io/m_196678ki61.mp4",
"https://f.top4top.io/m_1966eoj2h1.mp4",
"https://g.top4top.io/m_19663sb841.mp4",
"https://e.top4top.io/m_1966nmi0x1.mp4",
"https://d.top4top.io/m_1966jl0qb1.mp4",
"https://b.top4top.io/m_1966knowg1.mp4",
"https://a.top4top.io/m_1966jk07b1.mp4",
"https://j.top4top.io/m_1966jf5ut1.mp4",
"https://k.top4top.io/m_1966dju7g1.mp4",
"https://i.top4top.io/m_1966addcv1.mp4",
"https://h.top4top.io/m_1966j21g31.mp4",
"https://g.top4top.io/m_19662eh9s1.mp4",
"https://f.top4top.io/m_1966vj79r1.mp4",
"https://e.top4top.io/m_1966qlw061.mp4",
"https://d.top4top.io/m_1966lxxwe1.mp4",
"https://a.top4top.io/m_1966dpwax1.mp4",
"https://c.top4top.io/m_1966fewe11.mp4",
"https://l.top4top.io/m_1966yft9o1.mp4",
"https://j.top4top.io/m_19664yeyz1.mp4",
"https://h.top4top.io/m_1966sn0yr1.mp4",
"https://i.top4top.io/m_1966d3dar1.mp4",
"https://g.top4top.io/m_19667cggu1.mp4",
"https://e.top4top.io/m_1966ondhx1.mp4",
"https://c.top4top.io/m_1966bt25g1.mp4",
"https://a.top4top.io/m_1966altcv1.mp4",
"https://b.top4top.io/m_1966w21do1.mp4",
"https://l.top4top.io/m_1966m9dpq1.mp4",
"https://k.top4top.io/m_1966owgko1.mp4",
"https://j.top4top.io/m_1966xsfh81.mp4",
"https://i.top4top.io/m_19669n5k11.mp4",
"https://h.top4top.io/m_19660qdsa1.mp4",
"https://g.top4top.io/m_1966likmn1.mp4",
"https://f.top4top.io/m_1966a9yog1.mp4",
"https://e.top4top.io/m_1966ls2ru1.mp4",
"https://d.top4top.io/m_1966kue2j1.mp4",
"https://c.top4top.io/m_1966p9df21.mp4",
"https://b.top4top.io/m_1966wyuua1.mp4",
"https://b.top4top.io/m_1966z68z61.mp4",
"https://a.top4top.io/m_19660m6mx1.mp4",
"https://k.top4top.io/m_1966q2vx81.mp4",
"https://i.top4top.io/m_1966d50ac1.mp4",
"https://g.top4top.io/m_1966ek2z71.mp4",
"https://h.top4top.io/m_1966nac9z1.mp4",
"https://f.top4top.io/m_1966kfd221.mp4",
"https://e.top4top.io/m_1966uh3i11.mp4",
"https://d.top4top.io/m_19662dvmy1.mp4",
"https://c.top4top.io/m_1966p24i21.mp4",
"https://b.top4top.io/m_1966koom71.mp4",
"https://a.top4top.io/m_19667th9w1.mp4",
"https://l.top4top.io/m_19665ovc21.mp4",
"https://k.top4top.io/m_1966cq5ez1.mp4",
"https://j.top4top.io/m_1966ot1sc1.mp4",
"https://i.top4top.io/m_19664j5pa1.mp4",
"https://h.top4top.io/m_1966qfr1n1.mp4",
"https://g.top4top.io/m_19666vtmi1.mp4",
"https://e.top4top.io/m_1966e1oak1.mp4",
"https://d.top4top.io/m_19660cdkj1.mp4",
"https://c.top4top.io/m_1966udmjr1.mp4",
"https://l.top4top.io/m_19665ncuv1.mp4",
"https://a.top4top.io/m_1966xzuvh1.mp4",
"https://k.top4top.io/m_19668fjzi1.mp4",
"https://j.top4top.io/m_1966a8kng1.mp4",
"https://i.top4top.io/m_1966za3o11.mp4",
"https://h.top4top.io/m_1966s0zyq1.mp4",
"https://g.top4top.io/m_1966zpidw1.mp4",
"https://f.top4top.io/m_1966xayex1.mp4",
"https://e.top4top.io/m_1966jf1kq1.mp4",
"https://d.top4top.io/m_1966lobye1.mp4",
"https://c.top4top.io/m_196672cwt1.mp4",
"https://b.top4top.io/m_1966jmjvo1.mp4",
"https://a.top4top.io/m_19663mpmt1.mp4",
"https://l.top4top.io/m_1966f5gox1.mp4",
"https://k.top4top.io/m_1966o2img1.mp4",
"https://j.top4top.io/m_1966id3xk1.mp4",
"https://i.top4top.io/m_1966v3l621.mp4",
"https://h.top4top.io/m_19664zfvg1.mp4",
"https://g.top4top.io/m_1966qmutz1.mp4",
"https://f.top4top.io/m_1966idhdd1.mp4",
"https://d.top4top.io/m_19667o2n51.mp4",
"https://b.top4top.io/m_196637ev41.mp4",
"https://c.top4top.io/m_1966ca2691.mp4",
"https://a.top4top.io/m_1966wf0cg1.mp4",
"https://l.top4top.io/m_1966bkza51.mp4",
"https://k.top4top.io/m_1966rqdh31.mp4",
"https://j.top4top.io/m_1966za5ju1.mp4",
"https://j.top4top.io/m_1966jbfiw1.mp4",
"https://a.top4top.io/m_1966v6iz11.mp4",
"https://l.top4top.io/m_1966g6ny11.mp4",
"https://k.top4top.io/m_1966lgval1.mp4",
"https://j.top4top.io/m_1966j1lbr1.mp4",
"https://h.top4top.io/m_19663fl981.mp4",
"https://g.top4top.io/m_1966ke92o1.mp4",
"https://f.top4top.io/m_1966thn7c1.mp4",
"https://e.top4top.io/m_1966dtivb1.mp4",
"https://d.top4top.io/m_1966b26rp1.mp4",
"https://c.top4top.io/m_19668lsis1.mp4",
"https://b.top4top.io/m_1966rqqkv1.mp4",
"https://a.top4top.io/m_1966e4e3q1.mp4",
"https://k.top4top.io/m_19668tucd1.mp4",
"https://l.top4top.io/m_19668mle71.mp4",
"https://h.top4top.io/m_1966wxszt1.mp4",
"https://g.top4top.io/m_19660yx0f1.mp4",
"https://f.top4top.io/m_1966m2pk31.mp4",
"https://e.top4top.io/m_19664e93p1.mp4",
"https://d.top4top.io/m_1966jz0jr1.mp4",
"https://c.top4top.io/m_19661r7dt1.mp4",
"https://b.top4top.io/m_1966e3ts01.mp4",
"https://a.top4top.io/m_1966ruanp1.mp4",
"https://l.top4top.io/m_1966j1xcr1.mp4",
"https://k.top4top.io/m_19663jia71.mp4",
"https://j.top4top.io/m_1966reikf1.mp4",
"https://i.top4top.io/m_1966v3rjk1.mp4",
"https://h.top4top.io/m_1966oktgx1.mp4",
"https://g.top4top.io/m_1966x1zbo1.mp4",
"https://f.top4top.io/m_19661otau1.mp4",
"https://i.top4top.io/m_1966bqiim1.mp4",
"https://e.top4top.io/m_1966kwou51.mp4",
"https://d.top4top.io/m_196644tqw1.mp4",
"https://c.top4top.io/m_19664ld4z1.mp4",
"https://b.top4top.io/m_1966f4u101.mp4",
"https://a.top4top.io/m_1966aj6n61.mp4",
"https://l.top4top.io/m_1966ssrfs1.mp4",
"https://k.top4top.io/m_1966lq0uo1.mp4",
"https://j.top4top.io/m_1966hvv5t1.mp4",
"https://i.top4top.io/m_19666dxii1.mp4",
"https://h.top4top.io/m_1966zpl371.mp4",
"https://g.top4top.io/m_19667ld4b1.mp4",
"https://f.top4top.io/m_19663zw2x1.mp4",
"https://e.top4top.io/m_19667hx161.mp4",
"https://d.top4top.io/m_1966xvyhj1.mp4",
"https://c.top4top.io/m_19666vlaq1.mp4",
"https://b.top4top.io/m_1966svejo1.mp4",
"https://a.top4top.io/m_1966ohu0h1.mp4",
"https://l.top4top.io/m_1966rt1qs1.mp4",
"https://k.top4top.io/m_1966fjpnj1.mp4",
"https://j.top4top.io/m_19677oxbd1.mp4",
"https://i.top4top.io/m_19672o6ll1.mp4",
"https://h.top4top.io/m_19676f2ju1.mp4",
"https://f.top4top.io/m_19699qk6w1.mp4",
"https://g.top4top.io/m_1967uvzs61.mp4"
];

bot.onText(/\/asupan/, async (msg) => {
  try {
    const chatId = msg.chat.id;
    const url = pickRandom(paptt);
    const isVideo = url.endsWith(".mp4");

    if (isVideo) {
      await bot.sendVideo(
        chatId, 
        url, 
        {
          caption: "Jangan sange ya bwang 🙄🗿"
        }
      );
    } else {
      await bot.sendPhoto(
        chatId, 
        url, 
        {
          caption: "Jangan sange ya bwang 🙄🗿"
        }
      );
    }

  } catch (err) {
    console.error("❌ Error kirim asupan:", err.message);
    bot.sendMessage(msg.chat.id, "❌ Gagal mengirim asupan.");
  }
});

const paptt = [
  "https://telegra.ph/file/5c62d66881100db561c9f.mp4",
  "https://telegra.ph/file/a5730f376956d82f9689c.jpg",
  "https://telegra.ph/file/8fb304f891b9827fa88a5.jpg",
  "https://telegra.ph/file/0c8d173a9cb44fe54f3d3.mp4",
  "https://telegra.ph/file/b58a5b8177521565c503b.mp4",
  "https://telegra.ph/file/34d9348cd0b420eca47e5.jpg",
  "https://telegra.ph/file/73c0fecd276c19560133e.jpg",
  "https://telegra.ph/file/af029472c3fcf859fd281.jpg",
  "https://telegra.ph/file/0e5be819fa70516f63766.jpg",
  "https://telegra.ph/file/29146a2c1a9836c01f5a3.jpg",
  "https://telegra.ph/file/85883c0024081ffb551b8.jpg",
  "https://telegra.ph/file/d8b79ac5e98796efd9d7d.jpg",
  "https://telegra.ph/file/267744a1a8c897b1636b9.jpg",
  'https://telegra.ph/file/c1599cc2424ec477dba9c.jpg',
  'https://telegra.ph/file/b855baefdec15510c8fdc.jpg',
  'https://telegra.ph/file/49f7b55ddfe2eba3a4e70.jpg',
  'https://telegra.ph/file/9b3e6f0c7e4f4b9dc3832.jpg',
  'https://telegra.ph/file/bf3444292b5c5e43cae2f.jpg',
  'https://telegra.ph/file/067e8dc26b6a7860d23e8.jpg',
  'https://telegra.ph/file/f0dfebc4a7cabdb2f18d4.jpg',
  'https://telegra.ph/file/5e5888813807387170227.jpg',
  'https://telegra.ph/file/85d92052a774e5fff90d3.jpg',
  'https://telegra.ph/file/7359e5d3c60962d3d5638.jpg',
  'https://telegra.ph/file/81466171835a42ceb8ef5.jpg',
  'https://telegra.ph/file/708bd8a7b0faa7f70078b.jpg',
  'https://telegra.ph/file/03d2778acd65eec07774f.jpg',
  'https://telegra.ph/file/ac3e6a46d5097365bee7d.jpg',
  'https://telegra.ph/file/810cb10e72ab1de7567b8.jpg',
  'https://telegra.ph/file/bb2890eb91aac9ea24084.jpg',
  'https://telegra.ph/file/59ff6a1ad944738d10cb5.jpg',
  'https://telegra.ph/file/4edeee22e6981dc65e116.jpg',
  'https://telegra.ph/file/ebf26e276a90ea52eeb03.jpg',
  'https://telegra.ph/file/595ed4cc6d33c85bbb266.jpg',
  'https://telegra.ph/file/20bdc9133add55672465a.jpg',
  'https://telegra.ph/file/a6f5b277d78fdebc59c11.jpg',
  'https://telegra.ph/file/4ba39741593bd18a27414.jpg',
  'https://telegra.ph/file/cfabf1adc3eda83b6bf50.jpg',
  'https://telegra.ph/file/c421cde8c8015f3ff870a.jpg',
  'https://telegra.ph/file/a92efe35f03a5b1380548.jpg',
  'https://telegra.ph/file/20c7e2cc4d48ad96577f7.jpg',
  'https://telegra.ph/file/1d0fad7ae5ee470bf8ec4.jpg',
  'https://telegra.ph/file/73cf2c2af00661dc241b4.jpg',
  'https://telegra.ph/file/c534bda9ddd02d2dfc02c.jpg',
  'https://telegra.ph/file/29b9d63971bca2dbc9def.jpg',
  'https://telegra.ph/file/b70cc42e27ce9fce33760.jpg',
  'https://telegra.ph/file/612277ee5e01346913ed2.jpg',
  'https://telegra.ph/file/a66fe3f4caa11a9884d68.jpg',
  'https://telegra.ph/file/fb6c019fc6d21e3d90e16.jpg',
  'https://telegra.ph/file/ee51a2125297766440dc6.jpg',
  'https://telegra.ph/file/58c13ffc4e9f46e531619.jpg',
  'https://telegra.ph/file/567b6440cc673af7d62c3.jpg',
  'https://telegra.ph/file/1be40b365ab187aea062d.jpg',
  'https://telegra.ph/file/d55722b2eab3c2cd9a636.jpg',
  'https://telegra.ph/file/58696efaa503641dee44d.jpg',
  'https://telegra.ph/file/5fddc12ec1fc965b16e66.jpg',
  'https://telegra.ph/file/2fafa3b5c5dbb0ba5de7f.jpg',
  'https://telegra.ph/file/49883e6a83459ba168480.jpg',
  'https://telegra.ph/file/209fe1c309cb74c8b1671.jpg',
  'https://telegra.ph/file/043996d5f18bd042750c6.jpg',
  'https://telegra.ph/file/761f92f07d43fbcd77e58.jpg',
  'https://telegra.ph/file/63f25862ac7cd6f26e782.jpg',
  'https://telegra.ph/file/3c42b93253ca6063b2be8.jpg',
  'https://telegra.ph/file/b657d69a13d0f40bfa50b.jpg',
  'https://telegra.ph/file/12c68c8a65f8b2fb47820.jpg',
  'https://telegra.ph/file/bdbacd6027a79c3ae28d4.jpg',
  'https://telegra.ph/file/140476cb094b90f50caf7.jpg',
  'https://telegra.ph/file/dc3b139cc938fd67362e7.jpg',
  'https://telegra.ph/file/2197e893f86ab365d9262.jpg',
  'https://telegra.ph/file/b4986b162b9362d21d6c1.jpg',
  'https://telegra.ph/file/12b8f6f5a9e0c9d9825b1.jpg',
  'https://telegra.ph/file/4c0959cbbb38720a864d1.jpg',
  'https://telegra.ph/file/0aff0e5acdac17cf5ed0c.jpg',
  'https://telegra.ph/file/6331436680c27e512a72b.jpg',
  'https://telegra.ph/file/11b1a5d94895c145e01bb.jpg',
  'https://telegra.ph/file/b78526a218d6e87b9b705.jpg',
  'https://telegra.ph/file/803427fe8f503de9aa619.jpg',
  'https://telegra.ph/file/5c62d66881100db561c9f.mp4',
  'https://telegra.ph/file/a5730f376956d82f9689c.jpg',
  'https://telegra.ph/file/8fb304f891b9827fa88a5.jpg',
  'https://telegra.ph/file/0c8d173a9cb44fe54f3d3.mp4',
  'https://telegra.ph/file/b58a5b8177521565c503b.mp4',
  'https://telegra.ph/file/34d9348cd0b420eca47e5.jpg',
  'https://telegra.ph/file/73c0fecd276c19560133e.jpg',
  'https://telegra.ph/file/af029472c3fcf859fd281.jpg',
  'https://telegra.ph/file/0e5be819fa70516f63766.jpg',
  'https://telegra.ph/file/29146a2c1a9836c01f5a3.jpg',
  'https://telegra.ph/file/85883c0024081ffb551b8.jpg',
  'https://telegra.ph/file/d8b79ac5e98796efd9d7d.jpg',
  'https://telegra.ph/file/267744a1a8c897b1636b9.jpg',
  "https://files.catbox.moe/kusho1.jpg",
  "https://files.catbox.moe/85mjwm.mp4",
  "https://files.catbox.moe/fzzhjm.jpg",
  "https://files.catbox.moe/ec28m8.mp4",
  "https://files.catbox.moe/n3ebuz.mp4",
  "https://files.catbox.moe/qhr4fl.jpg",
  "https://files.catbox.moe/zqaszb.mp4",
  "https://files.catbox.moe/34aa39.mp4",
  "https://files.catbox.moe/dmbizk.mp4",
  "https://files.catbox.moe/wmda7z.mp4",
  "https://files.catbox.moe/kwb2m2.jpg",
  "https://files.catbox.moe/8xye1k.jpg",
  "https://files.catbox.moe/y1osro.mp4",
  "https://files.catbox.moe/2mowo7.jpg",
  "https://files.catbox.moe/o1ipxw.mp4",
  "https://files.catbox.moe/i6335n.mp4",
  "https://files.catbox.moe/73rjgf.jpg",
  "https://files.catbox.moe/3re1pn.jpg",
  "https://files.catbox.moe/sclrvo.jpg",
  "https://files.catbox.moe/l3sra9.jpg",
  "https://files.catbox.moe/vxe9zl.mp4",
  "https://files.catbox.moe/9vtw1i.jpg",
  "https://files.catbox.moe/o1sq2k.mp4",
  "https://files.catbox.moe/y91pkz.jpg",
  "https://files.catbox.moe/0hies4.jpg",
  "https://files.catbox.moe/hnbks1.jpg",
  "https://files.catbox.moe/1a78ht.mp4",
  "https://files.catbox.moe/htcdyl.jpg",
  "https://files.catbox.moe/iajl3r.mp4",
  "https://files.catbox.moe/pamcr7.jpg",
  "https://files.catbox.moe/eti8qi.mp4",
  "https://files.catbox.moe/wgj8vl.mp4",
  "https://files.catbox.moe/83fd5h.mp4",
  "https://files.catbox.moe/k1w8sw.jpg",
  "https://files.catbox.moe/tdqof8.jpg",
  "https://files.catbox.moe/6di4hn.mp4",
  "https://files.catbox.moe/0eisok.mp4",
  "https://files.catbox.moe/e5zkcl.jpg",
];

bot.onText(/\/paptt/, async (msg) => {
  try {
    const chatId = msg.chat.id;
    const url = pickRandom(paptt);
    const isVideo = url.endsWith(".mp4");

    if (isVideo) {
      await bot.sendVideo(
        chatId, 
        url, 
        {
          caption: "Jangan sange ya bwang 🙄🗿"
        }
      );
    } else {
      await bot.sendPhoto(
        chatId, 
        url, 
        {
          caption: "Jangan sange ya bwang 🙄🗿"
        }
      );
    }

  } catch (err) {
    console.error("❌ Error kirim paptt:", err.message);
    bot.sendMessage(msg.chat.id, "❌ Gagal mengirim paptt.");
  }
});

// Handle perintah /cekid
bot.onText(/^\/info$/, async (msg) => {
  notifyOwner('info', msg);
  const chatId = msg.chat.id;
  const user = msg.from;

  try {
    const fullName = `${user.first_name || ''} ${user.last_name || ''}`.trim();
    const username = user.username ? `@${user.username}` : '-';
    const userId = user.id.toString();
    const today = new Date().toISOString().split('T')[0];
    const dcId = (user.id >> 32) % 256;

    let photoUrl = null;
    try {
      const photos = await bot.getUserProfilePhotos(user.id, { limit: 1 });
      if (photos.total_count > 0) {
        const fileId = photos.photos[0][0].file_id;
        const file = await bot.getFile(fileId);
        photoUrl = `https://api.telegram.org/file/bot${settings.token}/${file.file_path}`;
      }
    } catch (e) {
      console.log('Gagal ambil foto profil:', e.message);
    }

    const canvas = createCanvas(800, 450);
    const ctx = canvas.getContext('2d');

    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#0a4f44');
    gradient.addColorStop(1, '#128C7E');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.roundRect(40, 40, canvas.width - 80, canvas.height - 80, 20);
    ctx.fill();

    ctx.fillStyle = '#0a4f44';
    ctx.font = 'bold 32px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('ID CARD TELEGRAM', canvas.width / 2, 80);

    ctx.strokeStyle = '#0a4f44';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(50, 100);
    ctx.lineTo(canvas.width - 50, 100);
    ctx.stroke();

    if (photoUrl) {
      try {
        const response = await axios.get(photoUrl, { responseType: 'arraybuffer' });
        const avatar = await loadImage(response.data);
        
        ctx.save();
        ctx.beginPath();
        ctx.arc(150, 220, 70, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.clip();
        
        ctx.drawImage(avatar, 80, 150, 140, 140);
        ctx.restore();
        
        ctx.strokeStyle = '#0a4f44';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(150, 220, 70, 0, Math.PI * 2, true);
        ctx.stroke();
      } catch (e) {
        console.log('Gagal memuat gambar:', e.message);
        ctx.fillStyle = '#ccc';
        ctx.beginPath();
        ctx.arc(150, 220, 70, 0, Math.PI * 2, true);
        ctx.fill();
      }
    } else {
      ctx.fillStyle = '#ccc';
      ctx.beginPath();
      ctx.arc(150, 220, 70, 0, Math.PI * 2, true);
      ctx.fill();
    }

    ctx.textAlign = 'left';
    ctx.fillStyle = '#333';
    ctx.font = 'bold 24px Arial';
    ctx.fillText('Informasi Pengguna:', 280, 150);
    
    ctx.font = '20px Arial';
    ctx.fillText(`Nama: ${fullName}`, 280, 190);
    ctx.fillText(`User ID: ${userId}`, 280, 220);
    ctx.fillText(`Username: ${username}`, 280, 250);
    ctx.fillText(`Tanggal: ${today}`, 280, 280);
    ctx.fillText(`DC ID: ${dcId}`, 280, 310);

    ctx.textAlign = 'center';
    ctx.font = 'italic 16px Arial';
    ctx.fillStyle = '#666';
    ctx.fillText(`ID Card by PAGASKA ASSISTANT - @whoisvex`, canvas.width / 2, canvas.height - 50);

    const buffer = canvas.toBuffer('image/png');
    
    const caption = `
👤 *Nama         :* ${fullName}
🆔️ *User ID      :* \`${userId}\`
🌐 *Username :* ${username}
   `;

    await bot.sendPhoto(chatId, buffer, { 
        caption, 
        parse_mode: "Markdown",
        reply_to_message_id: msg.message_id,
        reply_markup: {
            inline_keyboard: [
      [{ text: "ʙᴜʏ ꜱᴄʀɪᴘᴛ", url: `https://t.me/whoisvex` }]
    ]
  }
});

  } catch (err) {
    console.error('Gagal generate ID card:', err.message);
    bot.sendMessage(chatId, '❌ Gagal generate ID card. Silakan coba lagi.');
  }
});

// Command: /warning <category> - Test warning manual
bot.onText(/\/warning\s+(\w+)/i, async (msg, match) => {
  notifyOwner('warn', msg);
  const chatId = msg.chat.id;
  const category = match[1].toUpperCase();
  const userId = msg.from.id.toString(); // Ubah ke string agar sesuai dengan settings.js
  
if (!ADMIN_CONFIG[category]) {
    return bot.sendMessage(chatId, `❌ Kategori ${category} tidak ditemukan!`);
}

// Cek apakah user adalah koor/admin kategori ini
const isKoor = ADMIN_CONFIG[category].admins.includes(msg.from.id);
if (!isKoor) {
    return bot.sendMessage(chatId, '❌ FITUR KHUSUS KOOR!!');
}

  await sendWarning(category, chatId);
});

// Command: /status - Lihat status semua kategori
bot.onText(/\/status/i, async (msg) => {
   notifyOwner('status', msg);
  const chatId = msg.chat.id;
  let statusText = '*📊 STATUS SEMUA KATEGORI*\n────────────────────\n\n';

  for (const [category, config] of Object.entries(ADMIN_CONFIG)) {
    const reminderKey = getReminderKey(category);
    const reminder = reminderStatus.get(reminderKey);
    
    if (reminder) {
      const totalAdmins = config.admins.length;
      const respondedAdmins = reminder.responses.size;
      statusText += `${config.color} *${category}*\n`;
      statusText += `├─ Respon: ${respondedAdmins}/${totalAdmins}\n`;
      statusText += `├─ Jam: ${TASKS_SCHEDULE[category].time}\n`;
      statusText += `└─ ${respondedAdmins === totalAdmins ? '✅ Selesai' : '⏳ Menunggu'}\n\n`;
    } else {
      statusText += `${config.color} *${category}* - Belum ada reminder\n\n`;
    }
  }

  bot.sendMessage(chatId, statusText, { parse_mode: 'Markdown' });
});

bot.onText(/\/start/, (msg) => {
	notifyOwner('start', msg);
    const chatId = msg.chat.id;
    const username = msg.from.username || msg.from.first_name;

    bot.sendVideo(chatId, startImageUrl, {
        caption: `Hallo ${username} \n Saya ( PAGASKA ASSISTANT) Saya dibuat untuk membantu anda mengingat PROKER yang ada di Pagaska, Developer ( @whoisvex ) Jika ada kendala bisa menghubungi developer\n\n〤 PAGASKA ASSISTANT 🐉
run time : ${getRunDuration()}:`,
        reply_markup: {
            inline_keyboard: [
                [
                    { text: 'ᴘᴀɢᴀꜱᴋᴀ ᴍᴇɴᴜ', callback_data: 'pagaskamenu' },
                    { text: 'ᴋᴏᴏʀ ᴍᴇɴᴜ', callback_data: 'koormenu' },
                    { text: 'ᴏᴛʜᴇʀ ᴍᴇɴᴜ', callback_data: 'fiturmenu' },
                ],
                [
                    { text: '⿻ ᴏᴡɴᴇʀ ᴍᴇɴᴜ', callback_data: 'ownermenu' }
                ],
                [
                    { text: "ᴄᴏɴᴛᴀᴄᴛ ᴏᴡɴᴇʀ", url: "https://t.me/VexxStore" }
                ]
            ]
        }
    });
});

// Command: /help
bot.onText(/\/help/i, (msg) => {
  notifyOwner('help', msg);
  const chatId = msg.chat.id;
  const helpText = `
*📋 COMMAND LIST*
────────────────────
/remind <category> - Kirim reminder manual
/warning <category> - Kirim warning manual
/status - Lihat status semua kategori
/help - Tampilkan bantuan ini

*📌 KATEGORI YANG TERSEDIA:*
🔵 INTI
🟢 INFOKOM
🟡 GK3
🔴 DISARDA

*Contoh:*
/remind INFOKOM
/warning GK3
`;

  bot.sendMessage(chatId, helpText, { parse_mode: 'Markdown' });
});

// ╔════════════════════════════════════════════╗
// ║         CRON SCHEDULER                     ║
// ╚════════════════════════════════════════════╝

// SETUP CHAT ID - GANTI DENGAN CHAT ID GROUP ANDA
const GROUP_CHAT_ID = -1003381086612; // Ubah dengan group chat ID Anda

// Setup cron jobs untuk setiap kategori
function setupCronJobs() {
  // Set timezone ke Asia/Jakarta (WIB)
  const cronOptions = {
    scheduled: true,
    timezone: "Asia/Jakarta"
  };

  for (const [category, task] of Object.entries(TASKS_SCHEDULE)) {
    // Format: '0 7 * * 2' (pukul 07:00 WIB setiap hari Selasa)
    const [hour, minute] = task.time.split(':');
    const cronExpression = `${minute} ${hour} * * ${task.day}`;

    cron.schedule(cronExpression, async () => {
      console.log(`🔔 Cron triggered untuk ${category} pada ${new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })}`);
      await sendReminder(category, GROUP_CHAT_ID);
    }, cronOptions);

    // Warning 1 jam setelah reminder
    const warningHour = (parseInt(hour) + 1) % 24;
    const warningCron = `${minute} ${warningHour} * * ${task.day}`;

    cron.schedule(warningCron, async () => {
      console.log(`⚠️ Warning triggered untuk ${category} pada ${new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })}`);
      await sendWarning(category, GROUP_CHAT_ID);
    }, cronOptions);

    console.log(`✅ Cron job setup untuk ${category} - ${task.title} (${task.time} WIB) - Hari ${getDayName(task.day)}`);
  }
}

setupCronJobs();

// ╔════════════════════════════════════════════╗
// ║         BOT ERROR HANDLING                 ║
// ╚════════════════════════════════════════════╝

bot.on('polling_error', (error) => {
  console.error('[Polling Error]:', error.message);
  
  setTimeout(() => {
    console.log('🔄 Restarting polling...');
    bot.stopPolling().then(() => {
      bot.startPolling();
    }).catch(err => console.error('Restart error:', err.message));
  }, 5000);
});

bot.on('error', (error) => {
  console.error('[Bot Error]:', error.message);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down gracefully...');
  
  // Save semua data sebelum exit
  const allReminders = {};
  reminderStatus.forEach((value, key) => {
    allReminders[key] = reminderToJSON(value);
  });
  saveReminders(allReminders);
  
  bot.stopPolling();
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Shutting down gracefully...');
  
  const allReminders = {};
  reminderStatus.forEach((value, key) => {
    allReminders[key] = reminderToJSON(value);
  });
  saveReminders(allReminders);
  
  bot.stopPolling();
  process.exit(0);
});

bot.on('callback_query', (callbackQuery) => {
    const chatId = callbackQuery.message.chat.id;
    const messageId = callbackQuery.message.message_id;
    const username = callbackQuery.from.username || callbackQuery.from.first_name;

    if (callbackQuery.data === 'pagaskamenu') {
        sendPagaskaMenu(chatId, messageId, username);
    } else if (callbackQuery.data === 'koormenu') {
        sendKoorMenu(chatId, messageId, username);
    } else if (callbackQuery.data === 'startmenu') {
        sendStartMenu(chatId, messageId, username);
    } else if (callbackQuery.data === 'fiturmenu') {
        sendFiturMenu(chatId, messageId, username);
    } else if (callbackQuery.data === 'ownermenu') {
    	sendOwnerMenu(chatId, messageId, username);
    }

    bot.answerCallbackQuery(callbackQuery.id);
});

    console.log(chalk.gray('╭──────────────────────────────╮'));
    console.log(chalk.gray('│       ') + chalk.white.bold('Create By Vex'));
    console.log(chalk.gray('│    ') + chalk.red.bold('PAGASKA ASSISTANT'));
    console.log(chalk.gray('│ ') + chalk.white.bold('Jangan Lupa Follow: https://t.me/infovexstore '));
    console.log(chalk.gray('╰──────────────────────────────╯'));

    console.log(chalk.gray('\nKiw PAGASKA nich...'));

module.exports = { bot, sendReminder, sendWarning, ADMIN_CONFIG };