var handler = m => m
handler.before = async function (m, { conn, isAdmin, isBotAdmin, isROwner }) {

if (!m.isGroup) return !1
let chat = global.db.data.chats[m.chat]

if (isBotAdmin && chat.onlyLatinos && !isAdmin && !isROwner) {
let forbidPrefixes = ['234', '212', '213']

for (let prefix of forbidPrefixes) {
if (m.sender.startsWith(prefix)) {
m.reply('🚩 𝙀𝙡𝙞𝙢𝙞𝙣𝙖𝙣𝙙𝙤 𝙞𝙣𝙩𝙧𝙪𝙨𝙤 𝙁𝙖𝙠𝙚', m.sender)
await conn.groupParticipantsUpdate(m.chat, [m.sender], 'remove')
return false
}}}

return true

}

export default handler
