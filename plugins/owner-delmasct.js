let handler = async (m, { conn }) => {
  const user = global.db.data.users[m.sender];
  let target;

  if (m.mentionedJid && m.mentionedJid[0]) {
    
    target = global.db.data.users[m.mentionedJid[0]];
  } else if (m.replyMessage) {
    target = global.db.data.users[m.replyMessage.sender];
  } else {
    m.reply("Por favor, menciona a un usuario o responde a un mensaje para eliminar su mascota.");
    return;
  }

  if (!target.mascota) {
    m.reply(`El usuario no tiene ninguna mascota para eliminar.`);
    return;
  }

  target.mascota = null;
  m.reply(`¡La mascota del usuario ha sido eliminada exitosamente!`);
};

handler.help = ['delmascota'];
handler.tags = ['rpg'];
handler.command = ['delmascota', 'delmas'];
handler.owner = true;  // Solo el dueño del bot puede ejecutar este comando

export default handler;
