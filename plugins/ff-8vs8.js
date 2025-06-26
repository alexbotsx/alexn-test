let partidasVS8 = {};

const handler = async (m, { conn, args }) => {
  if (args.length < 2) {
    conn.reply(m.chat, 'Debes proporcionar la hora (HH:MM) y el país (MX, CO, CL, AR, PE).', m);
    return;
  }

  const horaRegex = /^([01]\d|2[0-3]):?([0-5]\d)$/;
  if (!horaRegex.test(args[0])) {
    conn.reply(m.chat, 'Formato de hora incorrecto. Debe ser HH:MM en formato de 24 horas.', m);
    return;
  }

  const horaUsuario = args[0];
  const pais = args[1].toUpperCase();

  const diferenciasHorarias = {
    MX: 0,
    CO: 1,
    CL: 2,
    AR: 3,
    PE: 1
  };

  if (!(pais in diferenciasHorarias)) {
    conn.reply(m.chat, 'País no válido. Usa MX para México, CO para Colombia, CL para Chile, AR para Argentina o PE para Perú.', m);
    return;
  }

  const diferenciaHoraria = diferenciasHorarias[pais];
  const hora = parseInt(horaUsuario.split(':')[0], 10);
  const minutos = parseInt(horaUsuario.split(':')[1], 10);
  const horaBase = new Date();
  horaBase.setHours(hora - diferenciaHoraria);
  horaBase.setMinutes(minutos);
  horaBase.setSeconds(0);
  horaBase.setMilliseconds(0);

  const formatTime = (date) => {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const horasPorPais = {};
  for (const [codigoPais, diferencia] of Object.entries(diferenciasHorarias)) {
    const nuevaHora = new Date(horaBase);
    nuevaHora.setHours(nuevaHora.getHours() + diferencia);
    horasPorPais[codigoPais] = formatTime(nuevaHora);
  }

  const horaActual = new Date();
  horaActual.setHours(horaActual.getHours() + diferenciaHoraria);
  const horaActualPais = formatTime(horaActual);

  let plantilla = `
𝟖 𝐕𝐄𝐑𝐒𝐔𝐒 𝟖

⏱ 𝐇𝐎𝐑𝐀𝐑𝐈𝐎
🇲🇽 𝐌𝐄𝐗𝐈𝐂𝐎 : ${horasPorPais.MX}
🇨🇴 𝐂𝐎𝐋𝐎𝐌𝐁𝐈𝐀 : ${horasPorPais.CO}
🇨🇱 𝐂𝐇𝐈𝐋𝐄 : ${horasPorPais.CL}
🇦🇷 𝐀𝐑𝐆𝐄𝐍𝐓𝐈𝐍𝐀 : ${horasPorPais.AR}
🇵🇪 𝐏𝐄𝐑𝐔 : ${horasPorPais.PE}

𝐇𝐎𝐑𝐀 𝐀𝐂𝐓𝐔𝐀𝐋 𝐄𝐍 ${pais} : ${horaActualPais}

𝗘𝗦𝗖𝗨𝗔𝐃𝐑𝐀 1
👑 ┇  
🥷🏻 ┇  
🥷🏻 ┇  
🥷🏻 ┇  

𝗘𝗦𝗖𝗨𝗔𝐃𝐑𝐀 2
👑 ┇  
🥷🏻 ┇  
🥷🏻 ┇  
🥷🏻 ┇  

ʚ 𝐒𝐔𝐏𝐋𝐄𝐍𝐓𝐄𝐒:
🥷🏻 ┇  
🥷🏻 ┇  

(𝚁𝚎𝚊𝚌𝚌𝚒𝚘𝚗𝚊 𝚌𝚘𝚗 👍🏻 𝚙𝚊𝚛𝚊 𝚞𝚗𝚒𝚛𝚝𝚎 𝚎𝚜𝚌𝚞𝚊𝚍𝚛𝚊 1, ❤️ 𝚙𝚊𝚛𝚊 𝚞𝚗𝚒𝚛𝚝𝚎 𝚎𝚜𝚌𝚞𝚊𝚍𝚊 2, 😂 𝚙𝚊𝚛𝚊 𝚞𝚗𝚒𝚛𝚝𝚎 𝚜𝚞𝚙𝚕𝚎𝚗𝚝𝚎𝚜)
  `.trim();

  let msg = await conn.sendMessage(m.chat, { text: plantilla }, { quoted: m });
  partidasVS8[msg.key.id] = {
    chat: m.chat,
    escuadra1: [],
    escuadra2: [],
    suplentes: [],
    originalMsg: msg,
  };

  conn.ev.on('messages.upsert', async ({ messages }) => {
    let m = messages[0];
    if (!m?.message?.reactionMessage) return;

    let reaction = m.message.reactionMessage;
    let key = reaction.key;
    let emoji = reaction.text;
    let sender = m.key.participant || m.key.remoteJid;

    if (!['👍🏻', '❤️', '😂'].includes(emoji)) return;
    if (!partidasVS8[key.id]) return;

    let data = partidasVS8[key.id];

    if (data.escuadra1.includes(sender) || data.escuadra2.includes(sender) || data.suplentes.includes(sender)) return;
    if (emoji === '👍🏻' && data.escuadra1.length < 4) {
      data.escuadra1.push(sender);
    } else if (emoji === '❤️' && data.escuadra2.length < 4) {
      data.escuadra2.push(sender);
    } else if (emoji === '😂' && data.suplentes.length < 2) {
      data.suplentes.push(sender);
    } else return;

    let escuadra1 = data.escuadra1.map(u => `@${u.split('@')[0]}`);
    let escuadra2 = data.escuadra2.map(u => `@${u.split('@')[0]}`);
    let suplentes = data.suplentes.map(u => `@${u.split('@')[0]}`);

    let plantilla = `
𝟖 𝐕𝐄𝐑𝐒𝐔𝐒 𝟖

⏱ 𝐇𝐎𝐑𝐀𝐑𝐈𝐎
🇲🇽 𝐌𝐄𝐗𝐈𝐂𝐎 : ${horasPorPais.MX}
🇨🇴 𝐂𝐎𝐋𝐎𝐌𝐁𝐈𝐀 : ${horasPorPais.CO}
🇨🇱 𝐂𝐇𝐈𝐋𝐄 : ${horasPorPais.CL}
🇦🇷 𝐀𝐑𝐆𝐄𝐍𝐓𝐈𝐍𝐀 : ${horasPorPais.AR}
🇵🇪 𝐏𝐄𝐑𝐔 : ${horasPorPais.PE}

𝗘𝗦𝗖𝗨𝗔𝐃𝐑𝐀 1
👑 ┇ ${escuadra1[0] || ''}
🥷 ┇ ${escuadra1[1] || ''}
🥷 ┇ ${escuadra1[2] || ''}
🥷 ┇ ${escuadra1[3] || ''}

𝗘𝗦𝗖𝗨𝗔𝐃𝐑𝐀 2
👑 ┇ ${escuadra2[0] || ''}
🥷 ┇ ${escuadra2[1] || ''}
🥷 ┇ ${escuadra2[2] || ''}
🥷 ┇ ${escuadra2[3] || ''}

ʚ 𝐒𝐔𝐏𝐋𝐄𝐍𝐓𝐄𝐒:
🥷🏻 ┇ ${suplentes[0] || ''}
🥷🏻 ┇ ${suplentes[1] || ''}

(𝚁𝚎𝚊𝚌𝚌𝚒𝚘𝚗𝚊 𝚌𝚘𝚗 👍🏻 𝚙𝚊𝚛𝚊 𝚞𝚗𝚒𝚛𝚝𝚎 𝚎𝚜𝚌𝚞𝚊𝚍𝚛𝚊 1, ❤️ 𝚙𝚊𝚛𝚊 𝚞𝚗𝚒𝚛𝚝𝚎 𝚎𝚜𝚌𝚞𝚊𝚍𝚊 2, 😂 𝚙𝚊𝚛𝚊 𝚞𝚗𝚒𝚛𝚝𝚎 𝚜𝚞𝚙𝚕𝚎𝚗𝚝𝚎𝚜)
  `.trim();

    await conn.sendMessage(data.chat, {
      text: plantilla,
      edit: data.originalMsg.key,
      mentions: [...data.escuadra1, ...data.escuadra2, ...data.suplentes]
    });
  });
}

handler.help = ['8vs8'];
handler.tags = ['freefire'];
handler.command = /^(vs8|8vs8)$/i;
handler.group = true;
handler.admin = true;

export default handler;
