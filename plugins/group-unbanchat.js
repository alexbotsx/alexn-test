let handler = async (m, { conn, isAdmin, isowner} ) => {
    if (!(isAdmin || isowner)) return dfail('admin', m, conn)
    global.db.data.chats[m.chat].isBanned = false
    m.reply('🔓 Bot activo en este grupo.')   
}
handler.help = ['desbanearbot']
handler.tags = ['group']
handler.command = ['desbanearbot', 'unbanchat']
handler.group = true 
export default handler
