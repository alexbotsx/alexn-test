import fs from 'fs';
import similarity from 'similarity';
const threshold = 0.72;

let acertijos = JSON.parse(fs.readFileSync('./src/game/acertijo.json', 'utf-8'));
let tekateki = {};

let handler = async (m, { conn }) => {
    let acertijo = acertijos[Math.floor(Math.random() * acertijos.length)];
    
    let mensajeEnviado = await m.reply(`⭐ Acertijo:\n\n${acertijo.question}\n\n🕐 *Tiempo:* 60.00 Segundos\n🎁 *Premio:* 100 Experiencia 💫`);
    tekateki[m.chat] = {
        id: mensajeEnviado.id,
        question: acertijo.question,
        response: acertijo.response,
        points: 10, // Cambia los puntos si prefieres
        timer: setTimeout(() => {
            conn.sendMessage(
                m.chat, 
                { text: `⏰ Tiempo Finalizado.\n_Respuesta:_ *${acertijo.response}*` }
            );
            delete tekateki[m.chat];
        }, 60000) // Tiempo límite de 1 minuto (60000 ms)
    };
};

handler.help = ['acertijo']
handler.tags = ['fun']
handler.command = ['acertijo', 'adivinanza'];

handler.before = async function(m) {
    const id = m.chat;

    
    if (m.fromMe) return;
    if (
        tekateki[id] &&
        m.quoted && 
        m.quoted.fromMe && // Asegura que el mensaje citado sea del bot
        m.quoted.id === tekateki[id].id // Compara con el ID almacenado del mensaje de acertijo
    ) {
        const respuestaUsuario = m.text.toLowerCase().trim();
        const respuestaCorrecta = tekateki[id].response.toLowerCase().trim();

        if (respuestaUsuario === respuestaCorrecta) {
            global.db.data.users[m.sender].exp += 100;
            m.reply(`🌟 *Respuesta correcta!*\n+100 exp`);
            clearTimeout(tekateki[id].timer);
            delete tekateki[id];
        } 
        else if (similarity(respuestaUsuario, respuestaCorrecta) >= threshold) {
            m.reply('Casi lo logras!');
        } else {
            m.reply('_*Respuesta incorrecta!*_ ❌');
        }
    } 
    else if (m.quoted && tekateki[id] === undefined && m.quoted.fromMe && m.quoted.id in Object.values(tekateki).map(t => t.id)) {
        m.reply('✨ Ese acertijo ya ha terminado!');
    }
};

export default handler;
