let handler = async (m, { conn, isAdmin, isowner }) => {
    if (!(isAdmin || isowner)) return dfail('admin', m, conn)
    global.db.data.chats[m.chat].isBanned = true
    m.reply('🔒 Chat Baneado con exito.')
}
handler.help = ['banearbot']
handler.tags = ['group']
handler.command = ['banearbot', 'banchat']
handler.group = true 
export default handler
