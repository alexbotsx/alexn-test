import fs from 'fs';
import FormData from 'form-data';
import axios from 'axios';

let handler = async (m, { conn }) => {
  let q = m.quoted ? m.quoted : m;
  let mime = (q.msg || q).mimetype || '';

  if (!mime.startsWith('image/')) {
    return m.reply('⚡ Responde a una *Imagen.*');
  }
  
  await m.react('👻');
  
  let media = await q.download();
  if (!media) {
    return m.reply('⚡ No se pudo descargar la imagen. Intenta nuevamente.');
  }
  
  let fileSizeInMB = Buffer.byteLength(media) / (1024 * 1024);
  if (fileSizeInMB > 32) {
    return m.reply('⚡ El archivo supera el límite de 32 MB permitido por ImgBB.');
  }

  let formData = new FormData();
  formData.append('image', media, { filename: 'file.jpg' });

  try {
    let api = await axios.post('https://api.imgbb.com/1/upload?key=10604ee79e478b08aba6de5005e6c798', formData, {
      headers: {
        ...formData.getHeaders()
      }
    });

    if (api.data.data) {
      let txt = '`- I B B  -  U P L O A D E R`\n\n';
      txt += `  *Titulo* : ${q.filename || 'x'}\n`;
      txt += `  *Id* : ${api.data.data.id}\n`;
      txt += `  *Enlace* : ${api.data.data.url}\n`;
      txt += `  *Directo* : ${api.data.data.url_viewer}\n`;
      txt += `  *Mime* : ${mime}\n`;
      txt += `  *File* : ${q.filename || 'x.jpg'}\n`;
      txt += `  *Extension* : ${api.data.data.image.extension}\n`;
      txt += `  *Delete* : ${api.data.data.delete_url}\n\n`;
      txt += `> 🐾 *${textbot}*`;
      
      await conn.sendFile(m.chat, api.data.data.url, 'ibb.jpg', txt, m);
      await m.react('✅');
    }
  } catch (error) {
    console.error('Error en la solicitud:', error.response?.data || error.message);
    await m.react('✖️');
    m.reply('❌ Ocurrió un error al subir la imagen. Verifica el archivo o intenta más tarde.');
  }
};

handler.tags = ['tools'];
handler.help = ['ibb'];
handler.command = /^(ibb)$/i;
export default handler;
