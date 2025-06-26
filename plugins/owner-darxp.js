var handler = async (m, { conn, text, usedPrefix, command }) => {
  let who;
  if (m.isGroup) who = m.mentionedJid[0];
  else who = m.chat;

  if (!who) throw `⚠️ *Debe etiquetar al usuario con *@tag* para usar este comando.*`;

  let txt = text.replace('@' + who.split`@`[0], '').trim();
  if (!txt) throw `⚠️ *Ingrese la cantidad de experiencia (EXP) que desea añadir.*`;

  if (isNaN(txt)) throw `⚠️ *Ingrese solo números, sin símbolos ni caracteres especiales.*`;

  try {
    let xp = parseInt(txt);
    if (xp < 1) throw `⚠️ *El número mínimo de experiencia (EXP) es 1.*`;

    let users = global.db.data.users;
    users[who].exp += xp;

    conn.reply(
      m.chat,
      `╭━[ *Experiencia Añadida 💫* ]━⬣\n` +
      `┃\n` +
      `┃ღ *Para:*\n` +
      `┃ღ @${who.split`@`[0]}\n` +
      `┃┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈\n` +
      `┃ღ *Se le añadió:*\n` +
      `┃ღ *${xp} EXP* 💫\n` +
      `┃\n` +
      `╰━━━━━━━━━━━━━━⬣`,
      m,
      { contextInfo: { mentionedJid: [who] } }
    );
  } catch (e) {
    await conn.reply(
      m.chat,
      `⚠️ *Ocurrió un error al ejecutar el comando. Intente nuevamente o reporte el problema.*\n\n` +
      `*Uso correcto:* ${usedPrefix + command} @usuario cantidad`,
      m
    );
    console.error(`❗ Error en el comando ${usedPrefix + command}:`, e);
  }
};

handler.help = ["darxp [@usuario]"];
handler.tags = ["owner"];
handler.command = ["añadirxp", "añadirexp", "darexperiencia", "darxp", "darexp"];
handler.group = true;
handler.rowner = true;

export default handler;

