import { WAMessageStubType } from '@whiskeysockets/baileys'
import fetch from 'node-fetch'

export async function before(m, { conn, participants, groupMetadata }) {
  if (!m.messageStubType || !m.isGroup) return !0;

  let chat = global.db.data.chats[m.chat] ??= {}
  chat.sWelcome ??= ''
  chat.sBye ??= ''
  chat.bienvenida ??= true

  let jid = m.messageStubParameters?.[0] || ''
  if (!jid) return

  let pp = await conn.profilePictureUrl(jid, 'image').catch(_ => 'https://cdn.russellxz.click/896b4f6c.PNG')
  let img = await (await fetch(pp)).buffer()

  let user = `@${jid.split('@')[0]}`
  let group = groupMetadata.subject
  let desc = groupMetadata.desc || 'sin descripción'

  const crearMensaje = (plantilla, defecto) => {
    return typeof plantilla === 'string' && plantilla
      ? plantilla
          .replace('@user', user)
          .replace('@group', group)
          .replace('@desc', desc)
      : defecto
  }

  if (chat.bienvenida && m.messageStubType === WAMessageStubType.GROUP_PARTICIPANT_ADD) {
    let bienvenida = crearMensaje(
      chat.sWelcome,
      `👋🏻 Bienvenido/a ${user}\n Le damos una cordial bienvenida al grupo: *${group}*.\n⚠️ Descripción del grupo:\n${desc}\n\n> 𝐙𝐞𝐫𝐰𝐚𝐲𝐛𝐨𝐭 🔥`
    )
    await conn.sendMessage(m.chat, { image: img, caption: bienvenida, mentions: [jid] })
  }

  if (chat.bienvenida && m.messageStubType === WAMessageStubType.GROUP_PARTICIPANT_LEAVE) {
    let bye = crearMensaje(
      chat.sBye,
      `👋🏻 El usuario ${user} ha abandonado el grupo *${group}*. Le deseamos lo mejor.`
    )
    await conn.sendMessage(m.chat, { image: img, caption: bye, mentions: [jid] })
  }

  if (chat.bienvenida && m.messageStubType === WAMessageStubType.GROUP_PARTICIPANT_REMOVE) {
    let kick = crearMensaje(
      chat.sBye,
      `🚫 El usuario ${user} ha sido *Eliminado* del grupo.`
    )
    await conn.sendMessage(m.chat, { image: img, caption: kick, mentions: [jid] })
  }
}
