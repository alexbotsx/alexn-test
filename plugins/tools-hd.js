import fetch from 'node-fetch'
import FormData from 'form-data'

let handler = async (m, { conn, command }) => {
  conn.hdr = conn.hdr || {}
  if (m.sender in conn.hdr) throw '𝚁𝚎𝚜𝚙𝚘𝚗𝚍𝚎 𝚊 𝚞𝚗𝚊 𝚒𝚖𝚊𝚐𝚎𝚗 𝚙𝚊𝚛𝚊 𝚖𝚎𝚓𝚘𝚛𝚊𝚛 𝚕𝚊 𝚌𝚊𝚕𝚒𝚍𝚊𝚍 📈'

  let q = m.quoted || m
  let mime = (q.msg || q).mimetype || q.mediaType || ''
  if (!mime) throw '𝚁𝚎𝚜𝚙𝚘𝚗𝚍𝚎 𝚊 𝚞𝚗𝚊 𝚒𝚖𝚊𝚐𝚎𝚗 𝚙𝚊𝚛𝚊 𝚖𝚎𝚓𝚘𝚛𝚊𝚛 𝚕𝚊 𝚌𝚊𝚕𝚒𝚍𝚊𝚍 📈'
  if (!/image\/(jpe?g|png)/.test(mime)) throw `Format ${mime} tidak didukung`

  conn.hdr[m.sender] = true
  await conn.sendMessage(m.chat, { react: { text: "♻️", key: m.key } })

  let img = await q.download?.()
  let error

  try {
    const imageUrl = await uploadToCatbox(img)
    const api = `https://fastrestapis.fasturl.cloud/aiimage/upscale?imageUrl=${encodeURIComponent(imageUrl)}&resize=4`
    const res = await fetch(api)
    const buffer = await res.buffer()
    await conn.sendFile(m.chat, buffer, 'hd.jpg', '𝙸𝚖𝚊𝚐𝚎𝚗 𝚎𝚗𝚝𝚛𝚎𝚐𝚊𝚍𝚊, 𝚐𝚛𝚊𝚌𝚒𝚊𝚜 𝚙𝚘𝚛 𝚎𝚜𝚙𝚎𝚛𝚊𝚛 🤗', m)
  } catch {
    error = true
  } finally {
    if (error) m.reply('Gagal memperbesar gambar.')
    delete conn.hdr[m.sender]
  }
}

handler.help = ['hd', 'remini']
handler.tags = ['upscaler']
handler.command = /^(hd|remini)$/i

export default handler

async function uploadToCatbox(buffer) {
  const form = new FormData()
  form.append('reqtype', 'fileupload')
  form.append('fileToUpload', buffer, 'image.jpg')
  const res = await fetch('https://catbox.moe/user/api.php', { method: 'POST', body: form })
  const url = await res.text()
  if (!url.startsWith('https://')) throw 'gagal upload ke Catbox'
  return url.trim()
}
