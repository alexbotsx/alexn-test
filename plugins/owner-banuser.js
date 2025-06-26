//import db from '../lib/database.js'

let handler = async (m, { conn, text, usedPrefix, command }) => {
    let who
    if (m.isGroup) who = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : false
    else who = m.chat

    if (!who) return m.reply(`🚩 Etiqueta a un usuario.`)

    let users = global.db.data.users

    // Verificar si el usuario existe en la base de datos
    if (!users[who]) {
        return m.reply(`🚩 El usuario no está registrado en la base de datos.`)
    }

    // Establecer la propiedad 'banned' a true
    users[who].banned = true

    // Responder con un mensaje de confirmación
    conn.reply(m.chat, `🚩 @${who.split`@`[0]} ha sido baneado con éxito, ya no podrá volver a usar mis comandos.`, m, { mentions: [who] })
}

handler.help = ['ban *@user*']
handler.tags = ['owner']
handler.command = /^ban$/i
handler.rowner = true

export default handler
