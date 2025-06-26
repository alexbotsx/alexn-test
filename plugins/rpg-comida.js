let handler = async (m, {conn, usedPrefix}) => {
   let who = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : m.sender
   if (who == conn.user.jid) return m.error 
   if (!(who in global.db.data.users)) return conn.reply(m.chat, 'El usuario no se encuentra en mi base de Datos.', m)
   
   let user = global.db.data.users[who]
   let comida = user.comida || 0 // Asegura que la comida sea 0 si no existe en la base de datos

   await m.reply(`${who == m.sender ? `Tienes *${comida} 🍖 de Comida* en tu inventario.` : `El usuario @${who.split('@')[0]} tiene *${comida} 🍖 de Comida* en su inventario.`}`, null, { mentions: [who] })
}

handler.help = ['comida']
handler.tags = ['rpg']
handler.command = ['comida'] 
export default handler
