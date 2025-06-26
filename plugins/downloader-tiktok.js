import Scraper from '@SumiFX/Scraper'
import axios from 'axios'
import fetch from 'node-fetch'

let handler = async (m, { conn, args, usedPrefix, command }) => {
    if (!args[0]) {
        return m.reply(`🚩 Ingresa un enlace del vídeo de TikTok junto al comando.\n\nEjemplo:\n${usedPrefix + command} https://vt.tiktok.com/ZS6H7ghCv/`)
    }

    // Validar que el enlace sea de TikTok
    const url = args[0];
    if (!url.includes('tiktok.com')) {
        return conn.reply(m.chat, '⚠️ El enlace proporcionado no es de TikTok.', m);
    }

    // Intentamos obtener los datos del video de TikTok
    try {
        let { title, published, quality, likes, commentCount, shareCount, views, dl_url, media_type } = await Scraper.tiktokdl(args[0]);

        // Si el tipo de medio es una imagen, responder con el mensaje adecuado
        if (media_type === 'image') {
            return conn.reply(m.chat, '⚠️ El enlace proporcionado no es un video de TikTok. Si es una imagen, usa el comando .tiktokimg para descargar imágenes.', m);
        }

        // Si es un video, lo descargamos
        let txt = `📥「 *𝚃𝚒𝚔𝚃𝚘𝚔 𝙳𝚘𝚠𝚗𝚕𝚘𝚊𝚍* 」\n`
        txt += `*🌀 𝚃𝚒́𝚝𝚞𝚕𝚘* : ${title}\n`
        txt += `*📅 𝙿𝚞𝚋𝚕𝚒𝚌𝚊𝚍𝚘* : ${published}\n`
        txt += `*👍🏻 𝙻𝚒𝚔𝚎𝚜* : ${likes}\n`
        txt += `*👀 𝚅𝚒𝚜𝚒𝚝𝚊𝚜* : ${views}\n`
        txt += `\n> @ꜱɪꜱᴋᴇᴅ - ʟᴏᴄᴀʟ - 𝟢𝟨`

        await conn.sendMessage(m.chat, { video: { url: dl_url }, caption: txt }, { quoted: m });
    } catch {
        // Si el Scraper falla, intentamos obtener el video usando otra API.
        try {
            const api = await fetch(`https://api-starlights-team.koyeb.app/api/tiktok?url=${args[0]}`)
            const data = await api.json()

            if (data.status) {
                const { author, view, comment, play, share, download, duration, title, video } = data.data;
                let txt = `╭─⬣「 *TikTok Download* 」⬣\n`
                txt += `│  ≡◦ *⭐ Título* : ${title}\n`
                txt += `│  ≡◦ *📚 Autor* : ${author.nickname}\n`
                txt += `│  ≡◦ *🕜 Duración* : ${duration} Segundos\n`
                txt += `│  ≡◦ *🌵 Descargas* : ${download}\n`
                txt += `│  ≡◦ *🗣 Comentarios* : ${comment}\n`
                txt += `│  ≡◦ *💫 Share* : ${share}\n`
                txt += `│  ≡◦ *🐢 Visitas* : ${play}\n`
                txt += `╰─⬣`

                await conn.sendMessage(m.chat, { video: { url: video }, caption: txt }, { quoted: m })
            }
        } catch {
            // Si fallamos con otra API, probamos una más.
            try {
                const api1 = await fetch(`https://delirius-api-oficial.vercel.app/api/tiktok?url=${args[0]}`)
                const data1 = await api1.json()

                if (data1.status) {
                    const { author, repro, like, share, comment, download, duration, title, meta, published } = data1.data
                    const publishedDate = formatDate(published)
                    const fileSize = convertBytesToMB(meta.media[0].size_org)

                    let txt = `╭─⬣「 *TikTok Download* 」⬣\n`
                    txt += `│  ≡◦ *⭐ Título* : ${title}\n`
                    txt += `│  ≡◦ *🐢 Autor* : ${author.nickname}\n`
                    txt += `│  ≡◦ *🕜 Duración* : ${duration} Segundos\n`
                    txt += `│  ≡◦ *📹 Reproducciones* : ${repro}\n`
                    txt += `│  ≡◦ *👍 Likes* : ${like}\n`;
                    txt += `│  ≡◦ *🗣 Comentarios* : ${comment}\n`
                    txt += `│  ≡◦ *📦 Descargas* : ${download}\n`
                    txt += `│  ≡◦ *💫 Share* : ${share}\n`
                    txt += `│  ≡◦ *📅 Publicado* : ${publishedDate}\n`
                    txt += `│  ≡◦ *🌵 Tamaño* : ${fileSize}\n`
                    txt += `╰─⬣`

                    await conn.sendMessage(m.chat, { video: { url: meta.media[0].org }, caption: txt }, { quoted: m })
                }
            } catch {
                // Si todo falla, informamos al usuario
                conn.reply(m.chat, '⚙️ Ocurrió un error al procesar el enlace.', m);
            }
        }
    }
}

handler.help = ['tiktok <url tt>']
handler.tags = ['downloader']
handler.command = ['tiktok', 'ttdl', 'tiktokdl', 'tiktoknowm']

export default handler

function convertBytesToMB(bytes) {
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB'
}

function formatDate(unixTimestamp) {
    const date = new Date(unixTimestamp * 1000)
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
}
