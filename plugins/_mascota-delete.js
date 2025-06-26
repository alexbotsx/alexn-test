let temporizadores = {};

async function verificarVidaYEliminarMascota(conn) {
  const usuarios = Object.keys(global.db.data.users);

  for (let i = 0; i < usuarios.length; i++) {
    let userId = usuarios[i];
    let user = global.db.data.users[userId];

    if (!user.mascota) continue;

    // Verificar si la vida de la mascota es 0
    if (user.vida === 0) {
      // Si ya existe un temporizador activo, no hacer nada
      if (temporizadores[userId]) continue;

      // Establecer el temporizador de 5 minutos para alimentar a la mascota
      temporizadores[userId] = setTimeout(async () => {
        let mensaje = `❌ *Has perdido a tu mascota* por falta de cuidados. Se ha ido debido a tu negligencia. Además, has perdido todo el progreso de nivel de tu mascota.`;
        let chatDestino = user.grupo || userId;
        await conn.sendMessage(chatDestino, { text: mensaje });

        // Eliminar la mascota y restablecer nivel
        delete user.mascota;
        user.vida = 100;
        user.mascotaNivel = 0; // Reiniciar el nivel de la mascota
        delete temporizadores[userId]; // Limpiar el temporizador
      }, 5 * 60 * 1000); // 5 minutos en milisegundos
    }
  }
}

setInterval(() => {
  verificarVidaYEliminarMascota(global.conn);
}, 60 * 1000); // Verificar cada minuto si hay mascotas con vida 0
