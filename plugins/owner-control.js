let groupListCache = [];

const handler = async (m, { conn, args, isOwner, command }) => {
  if (!isOwner) return;

  if (command === 'cmd') {
    groupListCache = Object.entries(global.db.data.chats)
      .filter(([id]) => id.endsWith('@g.us'))
      .sort(([a], [b]) => a.localeCompare(b));

    const groups = groupListCache.map(([id], i) => {
      const name = conn.chats[id]?.metadata?.subject || 'Desconocido';
      return `${i + 1}: ${name}\nID: ${id}`;
    });

    m.reply(groups.length ? groups.join('\n\n') : 'No hay grupos registrados.');
    return;
  }

  if (command === 'limpiar') {
    if (groupListCache.length === 0) {
      groupListCache = Object.entries(global.db.data.chats)
        .filter(([id]) => id.endsWith('@g.us'))
        .sort(([a], [b]) => a.localeCompare(b));
    }

    const gruposEliminados = [];

    for (const [id] of groupListCache) {
      if (id.endsWith('@g.us')) {
        delete global.db.data.chats[id];
        gruposEliminados.push(id);
      }
    }

    groupListCache = [];

    m.reply(gruposEliminados.length
      ? `Se eliminaron ${gruposEliminados.length} grupos del registro.`
      : 'No había grupos que limpiar.');

    return;
  }

  if (command === 'cm') {
    const [action, ...rest] = args;

    if (!action) {
      return m.reply(`Uso:
.cm banchat [#grupo]
.cm unchat [#grupo]
.cm welcome [on/off] [#grupo]
.cm god [on/off] [#grupo]
.cm estado [#grupo]
.cm salir [#grupo]`);
    }

    const getGroupIdByIndex = (index) => {
      if (groupListCache.length === 0) {
        groupListCache = Object.entries(global.db.data.chats)
          .filter(([id]) => id.endsWith('@g.us'))
          .sort(([a], [b]) => a.localeCompare(b));
      }
      return groupListCache[index - 1]?.[0];
    };

    if (['banchat', 'unchat'].includes(action)) {
      const groupIndex = parseInt(rest[0]);
      const groupId = getGroupIdByIndex(groupIndex);
      if (!groupId) return m.reply('Número de grupo inválido.');
      let chat = global.db.data.chats[groupId] || {};
      chat.isBanned = action === 'banchat';
      global.db.data.chats[groupId] = chat;
      return m.reply(`Grupo ${groupId} ${action === 'banchat' ? 'baneado' : 'desbaneado'}.`);
    }

    if (action === 'welcome') {
      const value = rest[0];
      const groupIndex = parseInt(rest[1]);
      const groupId = getGroupIdByIndex(groupIndex);
      if (!['on', 'off'].includes(value) || !groupId) {
        return m.reply(`Uso: .cm ${action} [on/off] [#grupo]`);
      }
      let chat = global.db.data.chats[groupId] || {};
      chat.bienvenida = value === 'on';
      global.db.data.chats[groupId] = chat;
      return m.reply(`Bienvenida en ${groupId} ${value === 'on' ? 'activada' : 'desactivada'}.`);
    }

    if (action === 'god') {
      const value = rest[0];
      const groupIndex = parseInt(rest[1]);
      const groupId = getGroupIdByIndex(groupIndex);
      if (!['on', 'off'].includes(value) || !groupId) {
        return m.reply(`Uso: .cm god [on/off] [#grupo]`);
      }
      let chat = global.db.data.chats[groupId] || {};
      chat.onlyGod = value === 'on';
      global.db.data.chats[groupId] = chat;
      return m.reply(`Modo Dios en ${groupId} ${value === 'on' ? 'activado' : 'desactivado'}.`);
    }

    if (action === 'estado') {
      const groupIndex = parseInt(rest[0]);
      const groupId = getGroupIdByIndex(groupIndex);
      if (!groupId) return m.reply('Número de grupo inválido.');

      const chat = global.db.data.chats[groupId] || {};
      const estado = (prop) => chat[prop] ? '✅' : '❌';
      const msg = `*Estado del grupo ${groupId}:*\n
- Modo Admin: ${estado('modoadmin')}
- Bienvenida: ${estado('bienvenida')}
- Ban Chat: ${estado('isBanned')}
- Modo Dios: ${estado('onlyGod')}`;

      return m.reply(msg);
    }

    if (action === 'salir') {
      const groupIndex = parseInt(rest[0]);
      const groupId = getGroupIdByIndex(groupIndex);
      if (!groupId) return m.reply('Número de grupo inválido.');
      const mensaje = '𝙲𝚘́𝚖𝚘 𝚝𝚞́ 𝙿𝚊𝚙𝚊́, 𝚃𝚎 𝚊𝚋𝚊𝚗𝚍𝚘𝚗𝚘 🏃🏻‍♂️ Zerwaybot 🔥';
      await conn.sendMessage(groupId, { text: mensaje }, { quoted: m });
      await conn.groupLeave(groupId);
      return;
    }

    m.reply('Acción no reconocida.');
  }
};

handler.command = ['cm', 'cmd', 'limpiar'];
handler.rowner = true;

export default handler;
