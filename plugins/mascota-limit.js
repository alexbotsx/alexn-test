const usados = new Set() // Almacena los usuarios que ya usaron el comando

let handler = async (m, { conn }) => {
  if (usados.has(m.sender)) {
    m.reply("❌ Ya has usado este comando, solo puedes usarlo una vez.")
    return
  }

  // Recompensas fijas
  const exp = 5000
  const Creds = 5000
  const comida = 20

  let user = global.db.data.users[m.sender]
  if (!user) {
    m.reply("❌ No se encontró tu perfil en la base de datos.")
    return
  }

  user.exp = (user.exp || 0) + exp
  user.limit = (user.limit || 0) + Creds  // Guardamos los Creds en la propiedad "limit"
  user.comida = (user.comida || 0) + comida

  m.reply(`🎉 ¡Has recibido tu recompensa única!\n\n🎖️ *${exp}* de experiencia\n🪙 *${Creds}* Creds\n🍖 *${comida}* de comida`)

  usados.add(m.sender) // Marcar usuario como ya utilizado
}

handler.help = ['masc']
handler.tags = ['masc']
handler.command = ['masc']

export default handler
