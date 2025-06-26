const cooldowns = {}

let handler = async (m, { conn, usedPrefix, command }) => {
   let user = global.db.data.users[m.sender]
   
   if (!user.mascota) { // Verifica si el usuario tiene una mascota
      return m.reply('❌ No puedes usar este comando porque no tienes una mascota. Adopta una primero.')
   }

   let amount = Math.floor(Math.random() * (1000 - 100) + 100) // EXP entre 100 y 1000
   const tiempoEspera = 5 * 60 // 5 minutos de cooldown

   if (cooldowns[m.sender] && Date.now() - cooldowns[m.sender] < tiempoEspera * 1000) {
      const tiempoRestante = segundosAHMS(Math.ceil((cooldowns[m.sender] + tiempoEspera * 1000 - Date.now()) / 1000))
      return m.reply(`🕜 Espera *${tiempoRestante}* para volver a sacar a pasear a tu mascota.`)
   }

   let paseo = paseos.getRandom()
   user.exp = (user.exp || 0) + amount // Sumar EXP al usuario
   await m.reply(`🐾 ${paseo} y ganaste *${amount} EXP* 🏆.`)

   cooldowns[m.sender] = Date.now()
}

handler.help = ['paseo']
handler.tags = ['rpg']
handler.command = ['paseo', 'sacarpaseo']

export default handler

function segundosAHMS(segundos) {
   const minutos = Math.floor((segundos % 3600) / 60)
   const segundosRestantes = segundos % 60
   return `${minutos} minutos y ${segundosRestantes} segundos`
}

// Opciones de mensajes al pasear a la mascota
const paseos = [
   "Sacaste a tu mascota al parque y corrió muy feliz",
   "Tu mascota y tú dieron un paseo por la playa y disfrutaron del sol",
   "Fueron al bosque a explorar y encontraron cosas interesantes",
   "Paseaste por la ciudad y tu mascota conoció a nuevos amigos",
   "Llevaron a tu mascota a un campo abierto para correr libremente",
   "Exploraron una cueva misteriosa y vivieron una pequeña aventura",
   "Visitaron la montaña y disfrutaron de la vista panorámica",
   "Paseaste bajo la lluvia y tu mascota jugó en los charcos",
   "Fuiste a un parque temático y tu mascota se divirtió mucho",
   "Tu mascota descubrió un nuevo camino y lo exploraron juntos",
   "Hicieron senderismo y encontraron una cascada escondida",
   "Tu mascota persiguió mariposas durante el paseo",
   "Fueron a la feria y probaron algunas golosinas",
   "Salieron de noche y vieron las estrellas juntos",
   "Tu mascota hizo nuevos amigos en el parque para perros",
   "Visitaste una granja y tu mascota interactuó con otros animales",
   "Caminaron por un sendero rodeado de flores y disfrutaron del aroma",
   "Recorrieron la ciudad y encontraron un lugar secreto",
   "Tu mascota te llevó a su lugar favorito del barrio",
   "Caminaron por un lago y tu mascota jugó con los patos"
]
