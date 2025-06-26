import { promises as fs } from 'fs';
import path from 'path';

const handler = async (m, { conn }) => {
  if (global.conn.user.jid !== conn.user.jid) {
    return conn.sendMessage(m.chat, { text: 'Este comando solo puede ejecutarse desde el número principal del bot.' }, { quoted: m });
  }

  const sessionPath = './BOSSBOT Session';
  const chatIds = m.isGroup ? [m.chat, m.sender] : [m.sender];
  const chatPatterns = chatIds.map(id => id.split('@')[0]);

  try {
    // Verificar si existe la carpeta
    const dirExists = await fs.stat(sessionPath).then(() => true).catch(() => false);
    if (!dirExists) {
      return conn.sendMessage(m.chat, { text: 'La carpeta de sesiones no existe.' }, { quoted: m });
    }

    // Leer archivos en bloques para directorios grandes
    const dir = await fs.opendir(sessionPath);
    let filesDeleted = 0;

    for await (const dirent of dir) {
      const file = dirent.name;
      if (chatPatterns.some(pattern => file.includes(pattern))) {
        await fs.unlink(path.join(sessionPath, file));
        filesDeleted++;
      }
    }

    if (filesDeleted > 0) {
      await conn.sendMessage(m.chat, { text: `✅ Se eliminaron *${filesDeleted}* archivos de sesión relacionados.` }, { quoted: m });
    } else {
      await conn.sendMessage(m.chat, { text: '⚠️ No se encontraron archivos de sesión para este chat.' }, { quoted: m });
    }

  } catch (err) {
    console.error('Error al eliminar sesiones:', err);
    await conn.sendMessage(m.chat, { text: '❌ Hubo un error al eliminar los archivos de sesión.' }, { quoted: m });
  }

  await conn.sendMessage(m.chat, { text: '👋 *¿Ya me pueden ver?*' }, { quoted: m });
};

handler.help = ['fixmsgespera']
handler.tags = ['group']
handler.command = /^(fixmsgespera)$/i;

export default handler;
