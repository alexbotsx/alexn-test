let handler = async (m, { conn, usedPrefix, isrowner }) => {
    m.react('👤')
    let vcard = `BEGIN:VCARD\nVERSION:3.0\nN:Alexnn;;\nFN:Alexnn\nORG:Alexnn\nTITLE:\nitem1.TEL;waid=528125788206:528125788206\nitem1.X-ABLabel:Alexnn\nX-WA-BIZ-DESCRIPTION:\nX-WA-BIZ-NAME:Alexnn\nEND:VCARD`
    await conn.sendMessage(m.chat, { contacts: { displayName: 'Alexnn⁩', contacts: [{ vcard }] } }, { quoted: m })
}
handler.help = ['staff']
handler.tags = ['main']
handler.command = ['owner', 'dueño', 'creador']

export default handler
