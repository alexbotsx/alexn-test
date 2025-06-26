let partidaInterna = {}

let handler = async (m, { conn, args }) => {
  let plantilla = `
• 𝐈𝐍𝐓𝐄𝐑𝐍𝐀 •

⏱ 𝐇𝐎𝐑𝐀𝐑𝐈𝐎                  •
🇲🇽 𝐌𝐄𝐗𝐈𝐂𝐎 : 
🇨🇴 𝐂𝐎𝐋𝐎𝐌𝐁𝐈𝐀 : 

➥ 𝐌𝐎𝐃𝐀𝐋𝐈𝐃𝐀𝐃: ${args[0] || ''}
➥ 𝐉𝐔𝐆𝐀𝐃𝐎𝐑𝐄𝐒:

         𝗘𝗦𝗖𝗨𝗔𝗗𝗥𝗔 1
    
    👑 ┇  
    🥷🏻 ┇  
    🥷🏻 ┇ 
    🥷🏻 ┇ 
          
         𝗘𝗦𝗖𝗨𝗔𝗗𝗥𝗔 2
    
    👑 ┇ 
    🥷🏻 ┇ 
    🥷🏻 ┇ 
    🥷🏻 ┇ 
    
    ㅤʚ 𝐒𝐔𝐏𝐋𝐄𝐍𝐓𝐄𝐒:
    🥷🏻 ┇ 
    🥷🏻 ┇

(Reacciona con ❤️ para Escuadra 1 y con 👍🏻 para Escuadra 2)
  `.trim()

  let msg = await conn.sendMessage(m.chat, { text: plantilla }, { quoted: m })
  partidaInterna[msg.key.id] = {
    chat: m.chat,
    escuadra1: [],
    escuadra2: [],
    suplentes: [],
    originalMsg: msg,
  }
}

handler.help = ['interna']
handler.tags = ['freefire']
handler.command = /^(interna|practica)$/i
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
  if (!partidaInterna[key.id]) return

  let data = partidaInterna[key.id]


  if (data.escuadra1.includes(sender) || data.escuadra2.includes(sender) || data.suplentes.includes(sender)) return

  if (emoji === '❤️' && data.escuadra1.length < 4) {
    data.escuadra1.push(sender)
  } else if (emoji === '👍🏻' && data.escuadra2.length < 4) {
    data.escuadra2.push(sender)
  } else if (data.suplentes.length < 2) {
    data.suplentes.push(sender)
  } else return

  let e1 = data.escuadra1.map(u => `@${u.split('@')[0]}`)
  let e2 = data.escuadra2.map(u => `@${u.split('@')[0]}`)
  let s = data.suplentes.map(u => `@${u.split('@')[0]}`)

  let plantilla = `
• 𝐈𝐍𝐓𝐄𝐑𝐍𝐀 •

⏱ 𝐇𝐎𝐑𝐀𝐑𝐈𝐎                  •
🇲🇽 𝐌𝐄𝐗𝐈𝐂𝐎 : 
🇨🇴 𝐂𝐎𝐋𝐎𝐌𝐁𝐈𝐀 : 

➥ 𝐌𝐎𝐃𝐀𝐋𝐈𝐃𝐀𝐃: 
➥ 𝐉𝐔𝐆𝐀𝐃𝐎𝐑𝐄𝐒:

         𝗘𝗦𝗖𝗨𝗔𝗗𝗥𝗔 1
    
    👑 ┇ ${e1[0] || ''}
    🥷🏻 ┇ ${e1[1] || ''}
    🥷🏻 ┇ ${e1[2] || ''}
    🥷🏻 ┇ ${e1[3] || ''}
          
         𝗘𝗦𝗖𝗨𝗔𝗗𝗥𝗔 2
    
    👑 ┇ ${e2[0] || ''}
    🥷🏻 ┇ ${e2[1] || ''}
    🥷🏻 ┇ ${e2[2] || ''}
    🥷🏻 ┇ ${e2[3] || ''}
    
    ㅤʚ 𝐒𝐔𝐏𝐋𝐄𝐍𝐓𝐄𝐒:
    🥷🏻 ┇ ${s[0] || ''}
    🥷🏻 ┇ ${s[1] || ''}

(Reacciona con ❤️ para Escuadra 1 y con 👍🏻 para Escuadra 2)
  `.trim()

  await conn.sendMessage(data.chat, {
    text: plantilla,
    edit: data.originalMsg.key,
    mentions: [...data.escuadra1, ...data.escuadra2, ...data.suplentes]
  })
})
         
