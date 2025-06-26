let handler = async (m, { conn, groupMetadata }) => {
    // Verificar si el mensaje es en un grupo
    if (!m.isGroup) return m.reply(`⚠️ Este comando solo se puede usar en grupos.`);

    // Verificar si el usuario que envió el comando es administrador
    let participant = groupMetadata.participants.find(p => p.id === m.sender);
    if (!participant || participant.admin !== 'admin' && participant.admin !== 'superadmin') {
        return m.reply(`⚠️ Este comando solo puede ser usado por administradores.`);
    }

    // Filtrar participantes (excluye al bot y a los administradores)
    let psmap = groupMetadata.participants
        .filter(v => v.id !== conn.user.jid && v.admin !== 'admin' && v.admin !== 'superadmin')
        .map(v => v.id);

    // Verificar si hay candidatos disponibles
    if (psmap.length === 0) return m.reply(`⚠️ No hay suficientes participantes válidos para la ruleta.`);

    // Elegir un usuario al azar
    let user = psmap[Math.floor(Math.random() * psmap.length)];

    // Formatear menciones
    let format = a => '@' + a.split('@')[0];

    // Notificar al usuario elegido
    m.reply(`*${format(user)} ☠️ Serás ejecutado, di tus últimas palabras ☠️*\n *Tienes 10 Segundos* ⏳`, null, { mentions: [user] });

    // Esperar 10 segundos antes de eliminar al usuario
    await delay(10000);
    await conn.groupParticipantsUpdate(m.chat, [user], 'remove');
};

handler.command = /^(ruletaban)$/i;
handler.group = true;
handler.tags = ['group'];
handler.help = ['ruletaban']
handler.admin = true; // Solo administradores pueden ejecutar
handler.botAdmin = true; // El bot debe ser administrador
export default handler;

// Función delay para esperar un tiempo
const delay = time => new Promise(res => setTimeout(res, time));
