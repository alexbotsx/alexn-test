let handler = async (m, { conn, usedPrefix, text, command, isOwner }) => {
  if (isNaN(text) && !text.match(/@/g)) {
  } else if (isNaN(text)) {
    var number = text.split`@`[1];
  } else if (!isNaN(text)) {
    var number = text;
  }

  if (!text && !m.quoted)
    return conn.reply(
      m.chat,
      `🚩 Usa el comando correctamente\n\nEjemplo:\n> ${usedPrefix}${command} @usuario`,
      m
    );

  if (number.length > 13 || (number.length < 11 && number.length > 0))
    return conn.reply(m.chat, `🚩 El número ingresado es incorrecto. Por favor, verifica.`, m);

  try {
    if (text) {
      var user = number + "@s.whatsapp.net";
    } else if (m.quoted.sender) {
      var user = m.quoted.sender;
    } else if (m.mentionedJid) {
      var user = number + "@s.whatsapp.net";
    }
  } catch (e) {
  } finally {
    // Verificar si el usuario que ejecuta el comando es Owner o fue designado Dios por el Owner
    let isGod = global.db.data.users[m.sender]?.isGod || false;
    let givenByOwner = global.db.data.users[m.sender]?.givenByOwner || false;

    if (!isOwner && (!isGod || !givenByOwner))
      return conn.reply(
        m.chat,
        `❌ Este comando solo puede ser usado por el Owner o usuarios con el rol de "Dios" otorgado directamente por el Owner.`,
        m
      );

    if (command === "dargod") {
      let targetIsGod = global.db.data.users[user]?.isGod || false;
      if (targetIsGod)
        return conn.reply(m.chat, `🚩 Este usuario ya tiene el rol de "Dios".`, m);

      // Añadir el rol de Dios al usuario y marcar que fue dado por el Owner
      if (!global.db.data.users[user]) global.db.data.users[user] = {};
      global.db.data.users[user].isGod = true;
      global.db.data.users[user].givenByOwner = isOwner; // Solo marca como "dado por el Owner" si el Owner ejecuta el comando
      conn.reply(m.chat, `✅ El usuario ahora tiene el rol de "Dios".`, m);
    }

    if (command === "delgod") {
      let targetIsGod = global.db.data.users[user]?.isGod || false;
      if (!targetIsGod)
        return conn.reply(m.chat, `🚩 Este usuario no tiene el rol de "Dios".`, m);

      // Solo permite eliminar el rol si el usuario que ejecuta tiene permiso válido
      if (!isOwner && global.db.data.users[user]?.givenByOwner)
        return conn.reply(
          m.chat,
          `❌ No puedes eliminar el rol de "Dios" de un usuario que fue designado por el Owner.`,
          m
        );

      // Quitar el rol de Dios al usuario
      global.db.data.users[user].isGod = false;
      global.db.data.users[user].givenByOwner = false;
      conn.reply(m.chat, `✅ El usuario ya no tiene el rol de "Dios".`, m);
    }
  }
};

handler.help = ["@usuario*"].map((v) => ["dargod ", "delgod "].map((cmd) => cmd + v)).flat();
handler.tags = ["owner"];
handler.command = /^(dargod|delgod)$/i; // Comandos que activan este handler
handler.group = true; // Solo funciona en grupos
handler.admin = false; // No es necesario ser administrador
handler.botAdmin = true; // El bot debe ser administrador
handler.fail = null;

export default handler;
