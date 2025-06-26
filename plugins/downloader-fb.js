import { igdl } from 'ruhend-scraper';

const handler = async (m, { text, conn, args, usedPrefix, command }) => {
  if (!args[0]) {
    return conn.reply(m.chat, '𝙸𝚗𝚐𝚛𝚎𝚜𝚊 𝚄𝚗 𝙻𝚒𝚗𝚔 𝙳𝚎 𝙵𝚊𝚌𝚎𝚋𝚘𝚘𝚔', m);
  }

  // Validar si el enlace es de Facebook
  const url = args[0];
  if (!url.includes('facebook.com')) {
    return conn.reply(m.chat, '𝙴𝚕 𝚟𝚒́𝚍𝚎𝚘 𝚙𝚛𝚘𝚙𝚘𝚛𝚌𝚒𝚘𝚗𝚊𝚍𝚘 𝚗𝚘 𝚎𝚜 𝚍𝚎 𝙵𝚊𝚌𝚎𝚋𝚘𝚘𝚔', m);
  }

  let res;
  try {
    res = await igdl(url);
  } catch (error) {
    return conn.reply(m.chat, '𝙴𝚛𝚛𝚘𝚛 𝚊𝚕 𝚘𝚋𝚝𝚎𝚗𝚎𝚛 𝚍𝚊𝚝𝚘𝚜. 𝚅𝚎𝚛𝚒𝚏𝚒𝚌𝚊 𝚎𝚕 𝚎𝚗𝚕𝚊𝚌𝚎.', m);
  }

  let result = res.data;
  if (!result || result.length === 0) {
    return conn.reply(m.chat, '𝙽𝚘 𝚜𝚎 𝚎𝚗𝚌𝚘𝚗𝚝𝚛𝚊𝚛𝚘𝚗 𝚛𝚎𝚜𝚞𝚕𝚝𝚊𝚍𝚘𝚜.', m);
  }

  let data;
  try {
    data = result.find(i => i.resolution === "720p (HD)") || result.find(i => i.resolution === "360p (SD)");
  } catch (error) {
    return conn.reply(m.chat, 'Error al procesar los datos.', m);
  }

  if (!data) {
    return conn.reply(m.chat, 'No se encontró una resolución adecuada.', m);
  }

  let video = data.url;
  try {
    await conn.sendMessage(m.chat, { video: { url: video }, caption: null, fileName: 'fb.mp4', mimetype: 'video/mp4' }, { quoted: m });
  } catch (error) {
    return conn.reply(m.chat, '𝙴𝚛𝚛𝚘𝚛 𝚊𝚕 𝚎𝚗𝚟𝚒𝚊𝚛 𝚎𝚕 𝚟𝚒𝚍𝚎𝚘.', m);
  }
};

handler.command = /^(fb|facebook)$/i;

export default handler;
