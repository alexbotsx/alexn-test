const handler = async (m, { isOwner, isAdmin, conn, text, participants, args }) => {
  let chat = global.db.data.chats[m.chat];

  if (!(isAdmin || isOwner)) {
    global.dfail('admin', m, conn);
    throw false;
  }

  const emoji = global.db.data.chats[m.chat]?.emojiTag || '🌿';
  const countryFlags = {
    '52': '🇲🇽', '57': '🇨🇴', '54': '🇦🇷', '34': '🇪🇸', '55': '🇧🇷',
    '1': '🇺🇸', '44': '🇬🇧', '91': '🇮🇳', '502': '🇬🇹', '56': '🇨🇱',
    '51': '🇵🇪', '58': '🇻🇪', '505': '🇳🇮', '593': '🇪🇨', '504': '🇭🇳',
    '591': '🇧🇴', '53': '🇨🇺', '503': '🇸🇻', '507': '🇵🇦', '595': '🇵🇾'
  };

    const getCountryFlag = (id) => {
    const phoneNumber = id.split('@')[0];
    const prefixes = [3, 2, 1];

    for (const length of prefixes) {
      const phonePrefix = phoneNumber.slice(0, length);
      if (countryFlags[phonePrefix]) return countryFlags[phonePrefix];
    }

    return '🏁';
  };

  const pesan = args.join` `;
  const groupMetadata = await conn.groupMetadata(m.chat);
  const groupName = groupMetadata.subject;
  let teks = `*${groupName}*\n\nhttps://chat.whatsapp.com/LbdiPrImAbI67gaA5Dyf3j\n`;
  teks += `𝙈𝙞𝙚𝙢𝙗𝙧𝙤𝙨: *${participants.length}*\n`;
  teks += `${pesan}\n┌━━━━━━━━━━━━━━━━━━━━⭓ 𝙇𝙞𝙨𝙩𝙖\n`;

  for (const mem of participants) {
    const flagOrEmoji = emoji === '🏁' ? getCountryFlag(mem.id) : emoji;
    teks += `${flagOrEmoji} @${mem.id.split('@')[0]}\n`;
  }

  teks += `└━━━━━━━━━━━━━━━━━━━━⭓\n\n> 𝑨𝒍𝒆𝒙𝒏𝑽𝒆𝒏𝒕𝒂T`;
  await conn.sendMessage(m.chat, { 
    text: teks,
    mentions: participants.map((a) => a.id)
  });
};

handler.help = ['tagall', 'todos'];
handler.tags = ['group'];
handler.command = /^(tagall|invocar|todos|invocación)$/i;
handler.admin = true;
handler.group = true;

export default handler;