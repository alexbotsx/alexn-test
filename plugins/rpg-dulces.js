let handler = async (m, { conn, usedPrefix }) => {
   let who = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : m.sender
   if (who == conn.user.jid) return m.error
   if (!(who in global.db.data.users)) return conn.reply(m.chat, 'El usuario no se encuentra en mi base de Datos.', m)
   let user = global.db.data.users[who]
   await m.reply(`${who == m.sender ? `Tienes *${user.limit} 🪙 Creds* en tu Cartera` : `El usuario @${who.split('@')[0]} tiene *${user.limit} 🪙 Creds* en su Cartera`}. `, null, { mentions: [who] })
}

handler.help = ['Creds']
handler.tags = ['rpg']
handler.command = ['wallet', 'cartera', 'Creds', 'bal', 'coins']
handler.register = true
export default handler
