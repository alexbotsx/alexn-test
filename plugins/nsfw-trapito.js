import fs from 'fs';
import path from 'path';

let handler = async (m, { conn }) => {
    // Verificar si el modo NSFW está habilitado
    if (!global.db.data.chats[m.chat].nsfw) return m.reply(`El grupo no admite contenido *NSFW.*`);

    // Reacción actualizada
    m.react('🔥');

    // Lista de imágenes actualizadas
    let imagenes = [
        "https://di.phncdn.com/videos/201911/04/259329852/original/(m=eaAaGwObaaaa)(mh=9JgBkg-AoNchh5jE)14.jpg",
        "https://cdn4.iporntv.net/videos/thumbsl/a6/6c/f2/a66cf219c251809b93c627a0fd849bea/a66cf219c251809b93c627a0fd849bea.4.jpg",
        "https://ei.phncdn.com/videos/202207/30/412713271/original/(m=eaAaGwObaaaa)(mh=uTSrMkdMugt1YO_T)11.jpg",
        "https://atto.scrolller.com/astolfo-getting-fucked-hard-zheng-3e30u9ptox-540x760.jpg",
        "https://cdn.donmai.us/original/9b/30/9b3007ba9bcbe6e52e5d5e72d9d834d1.jpg",
        "https://cdn.donmai.us/original/5c/0b/5c0bc38dfea988c19ac296d0a09375cc.jpg",
        "https://telegra.ph/file/1bb824b922cd25312874a.jpg",
        "https://telegra.ph/file/a0b4085c0e0c8c23a0398.jpg",
        "https://telegra.ph/file/94e365a992a547e076223.jpg",
        "https://telegra.ph/file/ff7fa1ed4b3974221191d.jpg",
        "https://telegra.ph/file/c7f4d741dbdf4e3411950.jpg",
        "https://telegra.ph/file/3cb0c8b45691f34055f3c.jpg",
        "https://telegra.ph/file/4c07ba64e40dd1e588923.jpg",
        "https://telegra.ph/file/a632be206ddd0b1d11742.jpg",
        "https://telegra.ph/file/f087dd0057dffb9236107.jpg"
    ];

    const imagen = imagenes[Math.floor(Math.random() * imagenes.length)]; // Selección aleatoria de imagen

    // Envío de la imagen sin mensaje ni mención
    await conn.sendMessage(m.chat, { 
        image: { url: imagen }
    }, { quoted: m });
};

handler.help = ['trapito'];
handler.tags = ['nsfw'];
handler.command = ['trapito'];
handler.group = true;

export default handler;
