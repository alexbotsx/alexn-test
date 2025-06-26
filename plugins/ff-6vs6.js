let partidasVS6 = {}

const handler = async (m, { conn, args }) => {
  if (args.length < 2) {
    conn.reply(m.chat, 'Debes proporcionar la hora (HH:MM) y el país (MX, CO, CL, AR, PE).', m)
    return
  }

  const horaRegex = /^([01]\d|2[0-3]):?([0-5]\d)$/
  if (!horaRegex.test(args[0])) {
    conn.reply(m.chat, 'Formato de hora incorrecto. Debe ser HH:MM en formato de 24 horas.', m)
    return
  }

  const horaUsuario = args[0]
  const pais = args[1].toUpperCase()

  const diferenciasHorarias = {
    MX: 0,
    CO: 1,
    CL: 2,
    AR: 3,
    PE: 1
  }

  if (!(pais in diferenciasHorarias)) {
    conn.reply(m.chat, 'País no válido. Usa MX, CO, CL, AR o PE.', m)
    return
  }

  const diferenciaHoraria = diferenciasHorarias[pais]
  const [hora, minutos] = horaUsuario.split(':').map(Number)

  const horaBase = new Date()
  horaBase.setHours(hora - diferenciaHoraria)
  horaBase.setMinutes(minutos)
  horaBase.setSeconds(0)
  horaBase.setMilliseconds(0)

  const formatTime = (date) => {
    const hours = date.getHours().toString().padStart(2, '0')
    const minutes = date.getMinutes().toString().padStart(2, '0')
    return `${hours}:${minutes}`
  }

  const horasPorPais = {}
  for (const [codigoPais, diferencia] of Object.entries(diferenciasHorarias)) {
    const nuevaHora = new Date(horaBase)
    nuevaHora.setHours(nuevaHora.getHours() + diferencia)
    horasPorPais[codigoPais] = formatTime(nuevaHora)
  }

  const horaActual = new Date()
  horaActual.setHours(horaActual.getHours() + diferenciaHoraria)
  const horaActualPais = formatTime(horaActual)

  let plantilla = `
𝟲 𝐕𝐄𝐑𝐒𝐔𝐒 𝟲

⏱ 𝐇𝐎𝐑𝐀𝐑𝐈𝐎                            •
🇲🇽 𝐌𝐄𝐗𝐈𝐂𝐎 : ${horasPorPais.MX}
🇨🇴 𝐂𝐎𝐋𝐎𝐌𝐁𝐈𝐀 : ${horasPorPais.CO}
🇨🇱 𝐂𝐇𝐈𝐋𝐄 : ${horasPorPais.CL}
🇦🇷 𝐀𝐑𝐆𝐄𝐍𝐓𝐈𝐍𝐀 : ${horasPorPais.AR}
🇵🇪 𝐏𝐄𝐑𝐔 : ${horasPorPais.PE}

𝐇𝐎𝐑𝐀 𝐀𝐂𝐓𝐔𝐀𝐋 𝐄𝐍 ${pais} : ${horaActualPais}

𝗘𝗦𝗖𝗨𝗔𝗗𝗥𝗔 1

👑 ┇  
🥷🏻 ┇  
🥷🏻 ┇ 
🥷🏻 ┇  
🥷🏻 ┇  
🥷🏻 ┇  

ʚ 𝐒𝐔𝐏𝐋𝐄𝐍𝐓𝐄:
🥷🏻 ┇ 
🥷🏻 ┇ 

(𝚁𝚎𝚊𝚌𝚌𝚒𝚘𝚗𝚊 𝚌𝚘𝚗 ❤️ 𝚙𝚊𝚛𝚊 𝚞𝚗𝚒𝚛𝚝𝚎 𝚢 😢 𝚙𝚊𝚛𝚊 𝚜𝚞𝚙𝚕𝚎𝚗𝚝𝚎)
    `.trim()

  let msg = await conn.sendMessage(m.chat, { text: plantilla }, { quoted: m })
  partidasVS6[msg.key.id] = {
    chat: m.chat,
    jugadores: [],
    suplentes: [],
    originalMsg: msg
  }

  conn.ev.on('messages.upsert', async ({ messages }) => {
    let m = messages[0]
    if (!m?.message?.reactionMessage) return

    let reaction = m.message.reactionMessage
    let key = reaction.key
    let emoji = reaction.text
    let sender = m.key.participant || m.key.remoteJid

    if (!['❤️', '👍🏻', '😢'].includes(emoji)) return
    if (!partidasVS6[key.id]) return

    let data = partidasVS6[key.id]

    // Evitar que el jugador se agregue si ya está en jugadores o suplentes
    if (data.jugadores.includes(sender) || data.suplentes.includes(sender)) return

    // Agregar a jugadores si hay espacio, si no, agregar a suplentes
    if (emoji === '❤️' && data.jugadores.length < 6) {
      data.jugadores.push(sender)
    } else if (emoji === '😢' && data.suplentes.length < 2) {
      data.suplentes.push(sender)
    } else if (emoji === '👍🏻' && data.jugadores.length < 6) {
      data.jugadores.push(sender)
    } else return

    let jugadores = data.jugadores.map(u => `@${u.split('@')[0]}`)
    let suplentes = data.suplentes.map(u => `@${u.split('@')[0]}`)

    let plantillaActualizada = `
𝟲 𝐕𝐄𝐑𝐒𝐔𝐒 𝟲

⏱ 𝐇𝐎𝐑𝐀𝐑𝐈𝐎                            •
🇲🇽 𝐌𝐄𝐗𝐈𝐂𝐎 : ${horasPorPais.MX}
🇨🇴 𝐂𝐎𝐋𝐎𝐌𝐁𝐈𝐀 : ${horasPorPais.CO}
🇨🇱 𝐂𝐇𝐈𝐋𝐄 : ${horasPorPais.CL}
🇦🇷 𝐀𝐑𝐆𝐄𝐍𝐓𝐈𝐍𝐀 : ${horasPorPais.AR}
🇵🇪 𝐏𝐄𝐑𝐔 : ${horasPorPais.PE}

𝗘𝗦𝗖𝗨𝗔𝗗𝗥𝗔 1

👑 ┇ ${jugadores[0] || ''}
🥷🏻 ┇ ${jugadores[1] || ''}
🥷🏻 ┇ ${jugadores[2] || ''}
🥷🏻 ┇ ${jugadores[3] || ''}
🥷🏻 ┇ ${jugadores[4] || ''}
🥷🏻 ┇ ${jugadores[5] || ''}

ʚ 𝐒𝐔𝐏𝐋𝐄𝐍𝐓𝐄:
🥷🏻 ┇ ${suplentes[0] || ''}
🥷🏻 ┇ ${suplentes[1] || ''}
        `.trim()

    await conn.sendMessage(data.chat, {
      text: plantillaActualizada,
      edit: data.originalMsg.key,
      mentions: [...data.jugadores, ...data.suplentes]
    })
  })
}

handler.help = ['6vs6']
handler.tags = ['freefire']
handler.command = /^(6vs6|vs6)$/i
handler.group = true
handler.admin = true

export default handler
