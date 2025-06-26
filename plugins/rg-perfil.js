import { xpRange } from '../lib/levelling.js'
import { createHash } from 'crypto'
import PhoneNumber from 'awesome-phonenumber'
import fetch from 'node-fetch'

let handler = async (m, { conn, usedPrefix, command }) => {
  // Obtener el usuario mencionado o el que envió el mensaje
  let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender
  let user = global.db.data.users[who]

  // Verificamos si el usuario está registrado en la base de datos
  if (!user) {
    global.db.data.users[who] = {
      exp: 0,
      limit: 0,
      name: 'Desconocido',
      level: 0
    }
    user = global.db.data.users[who]
  }

  let { exp, limit, name, level } = user
  let { min, xp, max } = xpRange(user.level, global.multiplier)

  // Obtener la foto de perfil
  let pp = await conn.profilePictureUrl(who, 'image').catch(_ => 'https://ibb.co/kgzVgK7K')
  let img = await (await fetch(pp)).buffer()

  // Determinar la insignia según el nivel
  let insignia = level >= 100 ? '👑 Leyenda' : level >= 50 ? '🔥 Élite' : '🌱 Novato'

  // Crear el mensaje del perfil
  let txt = `┏━━━〔 👤 *Perfil de Usuario* 〕━━━┓\n`
  txt += `┃ *🪴 Nombre:* ${name}\n`
  txt += `┃ *📞 Número:* ${PhoneNumber('+' + who.replace('@s.whatsapp.net', '')).getNumber('international')}\n`
  txt += `┃ *⭐ Insignia:* ${insignia}\n`
  txt += `┃ *💰 Creds:* ${limit} créditos\n`
  txt += `┃ *💫 Experiencia:* ${exp} XP\n`
  txt += `┃    ┗━ Progreso: ${user.exp - min}/${xp} XP\n`
  txt += `┃ *🚩 Nivel:* ${level}\n`
  txt += `┗━━━━━━━━━━━━━━━━━━━━━━┛`

  // Enviar el archivo con el mensaje
  let mentionedJid = [who]
  await conn.sendFile(m.chat, img, 'perfil.jpg', txt, m, false, { mentions: mentionedJid })
}

handler.help = ['perfil', 'perfil *@user*']
handler.tags = ['start']
handler.command = /^(perfil|profile)$/i

export default handler
