export async function before(m, { conn, isAdmin, isBotAdmin, isOwner, isROwner }) {
  if (m.isBaileys && m.fromMe) return !0;
  if (m.isGroup) return !1;
  if (!m.message) return !0;
  if (m.text.includes('PIEDRA') || m.text.includes('PAPEL') || m.text.includes('TIJERA') || m.text.includes('serbot') || m.text.includes('jadibot')) return !0;
  const chat = global.db.data.chats[m.chat];
  const bot = global.db.data.settings[this.user.jid] || {};
  if (bot.antiPrivate && !isOwner && !isROwner) {
    await m.reply(`> "𝙐𝙨𝙪𝙖𝙧𝙞𝙤 👤 @${m.sender.split`@`[0]}", 𝙀𝙨𝙩𝙖́ 𝙥𝙧𝙤𝙝𝙞𝙗𝙞𝙙𝙤 𝙚𝙨𝙘𝙧𝙞𝙗𝙞𝙧 𝙖𝙡 𝙥𝙧𝙞𝙫𝙖𝙙𝙤 ⚠️ 𝙔 𝙨𝙚𝙧𝙖́𝙨 𝙗𝙡𝙤𝙦𝙪𝙚𝙖𝙙@ 𝙖𝙪𝙩𝙤𝙢𝙖́𝙩𝙞𝙘𝙖𝙢𝙚𝙣𝙩𝙚\n\n> 𝙎𝙞 𝙜𝙪𝙨𝙩𝙖𝙨 𝙙𝙚 𝙖𝙡𝙜𝙪́𝙣 𝙨𝙚𝙧𝙫𝙞𝙘𝙞𝙤 𝙘𝙤𝙣𝙩𝙖𝙘𝙩𝙖𝙢𝙚:\n\n\n [ Alexnn : wa.me/528125788206 ]`, false, { mentions: [m.sender] });
    await this.updateBlockStatus(m.chat, 'block');
  }
  return !1;
}
