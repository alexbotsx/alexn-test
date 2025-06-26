let partidaScrim = {}

let handler = async (m, { conn, args }) => {
  let plantilla = `
• 𝐒𝐂𝐑𝐈𝐌 •

⏱ 𝐇𝐎𝐑𝐀𝐑𝐈𝐎                       •
🇲🇽 𝐌𝐄𝐗𝐈𝐂𝐎 : 
🇨🇴 𝐂𝐎𝐋𝐎𝐌𝐁𝐈𝐀 :                

➥ 𝐌𝐎𝐃𝐀𝐋𝐈𝐃𝐀𝐃: ${args[0] || ''}
➥ 𝐉𝐔𝐆𝐀𝐃𝐎𝐑𝐄𝐒:

      𝗘𝗦𝗖𝗨𝗔𝗗𝗥𝗔 
    
    👑 ┇ 
    🥷🏻 ┇  
    🥷🏻 ┇ 
    🥷🏻 ┇  
    
    ʚ 𝐒𝐔𝐏𝐋𝐄𝐍𝐓𝐄𝐒:
    🥷🏻 ┇ 
    🥷🏻 ┇

(Reacciona con ❤️ o 👍🏻 para unirte)
  `.trim()

  let msg = await conn.sendMessage(m.chat, { text: plantilla }, { quoted: m })
  partidaScrim[msg.key.id] = {
    chat: m.chat,
    jugadores: [],
    suplentes: [],
    originalMsg: msg,
  }
}

handler.help = ['scrim']
handler.tags = ['freefire']
handler.command = /^(scrim)$/i
handler.group = true
handler.admin = true

export default handler;

conn.ev.on('messages.upsert', async ({ messages }) => {
  let m = messages[0]
  if (!m?.message?.reactionMessage) return

  let reaction = m.message.reactionMessage
  let key = reaction.key
  let emoji = reaction.text
  let sender = m.key.participant || m.key.remoteJid

  if (!['❤️', '👍🏻'].includes(emoji)) return
  if (!partidaScrim[key.id]) return

  let data = partidaScrim[key.id]

  // Evita duplicados
  if (data.jugadores.includes(sender) || data.suplentes.includes(sender)) return

  if (data.jugadores.length < 4) {
    data.jugadores.push(sender)
  } else if (data.suplentes.length < 2) {
    data.suplentes.push(sender)
  } else return

  let j = data.jugadores.map(u => `@${u.split('@')[0]}`)
  let s = data.suplentes.map(u => `@${u.split('@')[0]}`)

  let plantilla = `
• 𝐒𝐂𝐑𝐈𝐌 •

⏱ 𝐇𝐎𝐑𝐀𝐑𝐈𝐎                       •
🇲🇽 𝐌𝐄𝐗𝐈𝐂𝐎 : 
🇨🇴 𝐂𝐎𝐋𝐎𝐌𝐁𝐈𝐀 :                

➥ 𝐌𝐎𝐃𝐀𝐋𝐈𝐃𝐀𝐃: 
➥ 𝐉𝐔𝐆𝐀𝐃𝐎𝐑𝐄𝐒:

      𝗘𝗦𝗖𝗨𝗔𝗗𝗥𝗔 
    
    👑 ┇ ${j[0] || ''}
    🥷🏻 ┇ ${j[1] || ''}
    🥷🏻 ┇ ${j[2] || ''}
    🥷🏻 ┇ ${j[3] || ''}
    
    ʚ 𝐒𝐔𝐏𝐋𝐄𝐍𝐓𝐄𝐒:
    🥷🏻 ┇ ${s[0] || ''}
    🥷🏻 ┇ ${s[1] || ''}

(Reacciona con ❤️ o 👍🏻 para unirte)
  `.trim()

  await conn.sendMessage(data.chat, {
    text: plantilla,
    edit: data.originalMsg.key,
    mentions: [...data.jugadores, ...data.suplentes]
  })
})
                                      
