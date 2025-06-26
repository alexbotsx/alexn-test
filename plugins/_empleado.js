let temporizadores = {};

async function verificarVidaYAlimentarMascota(conn) {
  const usuarios = Object.keys(global.db.data.users);

  for (let i = 0; i < usuarios.length; i++) {
    let userId = usuarios[i];
    let user = global.db.data.users[userId];

    if (!user.mascota || !user.empleado) continue; // Ignorar si no tiene mascota o no tiene empleado

    // Verificar si la vida de la mascota es 60 o menos
    if (user.vida <= 60) {
      // Calcular cuántas comidas se necesitan para llegar a 100 de vida
      let vidaNecesaria = 100 - user.vida; // Cuántos puntos de vida necesita
      let comidasNecesarias = Math.ceil(vidaNecesaria / 10); // Cada comida otorga 10 puntos de vida

      // Verificar si tiene suficiente comida
      if (user.comida < comidasNecesarias) {
        // Si no tiene suficiente comida, informamos
        let mensaje = `⚠️ *No tienes suficiente comida para alimentar a tu mascota. Necesitas ${comidasNecesarias - user.comida} comidas más para que alcance los 100 puntos de vida.*`;
        let chatDestino = user.grupo || userId;
        await conn.sendMessage(chatDestino, { text: mensaje });
        continue;
      }

      // Reducir la comida necesaria
      user.comida -= comidasNecesarias;

      // Aumentar la vida de la mascota a 100
      user.vida = 100;

      // Restar 10 Creds por el cuidado de la mascota
      if (user.limit < 10) {
        // Si no tiene suficientes Creds, avisar
        let mensaje = `⚠️ *No tienes suficientes Creds para que tu empleado cuide a tu mascota. Necesitas 10 Creds.*`;
        let chatDestino = user.grupo || userId;
        await conn.sendMessage(chatDestino, { text: mensaje });
        continue;
      }

      // Restar 10 Creds por el cuidado
      user.limit -= 10;

      // Enviar mensaje confirmando que el empleado alimentó a la mascota
      let mensaje = `✅ *Tu empleado alimentó a tu mascota y la cuidó. Ha recuperado toda su vida.*\n💰 *Te he cobrado 10 Creds por sus cuidados.*`;
      let chatDestino = user.grupo || userId;
      await conn.sendMessage(chatDestino, { text: mensaje });
    }
  }
}

setInterval(() => {
  verificarVidaYAlimentarMascota(global.conn);
}, 60 * 1000); // Verificar cada minuto si alguna mascota tiene 60 de vida o menos
