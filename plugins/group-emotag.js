const handler = async (m, { isOwner, isAdmin, conn, args }) => {
  if (!(isAdmin || isOwner)) {
    global.dfail('admin', m, conn);
    throw false;
  }

  const selectedEmoji = args[0] || '📈';
  for (let chatId in global.db.data.chats) {
    global.db.data.chats[chatId].emojiTag = selectedEmoji;
  }

  await conn.sendMessage(m.chat, { 
    text: `𝙴𝚖𝚘𝚓𝚒 𝚍𝚎 𝚖𝚎𝚗𝚌𝚒𝚘́𝚗 𝚊𝚌𝚝𝚞𝚊𝚕𝚒𝚣𝚊𝚍𝚘. °${selectedEmoji}°` 
  });
};

handler.help = ['emotag'];
handler.tags = ['group'];
handler.command = /^emotag$/i;
handler.owner = true;

export default handler;
