let handler = async (m, { conn, usedPrefix, isOwner }) => {
    m.react('👤')
    let vcard = `BEGIN:VCARD\nVERSION:3.0\nN:Owner;;\nFN:Owner\nORG:Owner\nTITLE:\nitem1.TEL;waid=5218125788206:5218125788206\nitem1.X-ABLabel:Owner\nX-WA-BIZ-DESCRIPTION:\nX-WA-BIZ-NAME:Owner\nEND:VCARD`
    await conn.sendMessage(m.chat, { contacts: { displayName: 'Owner⁩', contacts: [{ vcard }] } }, { quoted: m })
}
handler.help = ['staff']
handler.tags = ['main']
handler.command = ['owner', 'dueño', 'creador']

export default handler
