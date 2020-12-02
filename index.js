const { randomInt } = require("crypto");
const { Client } = require("discord.js");
const { TIMEOUT } = require("dns");
const { Manager } = require("erela.js");
const { send } = require("process");
const { botPrefix } = require('./config.json');
const botToken = process.env.BOT_TOKEN;
const botHost = process.env.HOST;
const botPasswd = process.env.PASSWORD;
const botPort = 80;
const fs = require('fs');
const client = new Client();
client.manager = new Manager({
  nodes: [
    {
      host: botHost,
      port: botPort,
      password: botPasswd,
    },
  ],
  send(id, payload) {
    const guild = client.guilds.cache.get(id);
    if (guild) guild.shard.send(payload);
  },
})
  .on("nodeConnect", node => console.log(`Node ${node.options.identifier} connected`))
  .on("nodeError", (node, error) => console.log(`Node ${node.options.identifier} had an error: ${error.message}`))
  .on("trackStart", (player, track) => {
    client.channels.cache
      .get(player.textChannel)
      .send(`Çalınıyor: ${track.title}`);
  })
  .on("queueEnd", (player) => {
    client.channels.cache
      .get(player.textChannel)
      .send("Çalma Listesi Bitti.");

    player.destroy();
  });
var besNbirK = ['nerede','niçin','ne zaman','neden'];
var kufurList = ['amk','piç','aq','göt','göt lalesi','sikik','amına','amına koyim','amına koyayim','amcık'];

client.once("ready", () => {
  console.log("Bot " + client.user.username +" Olarak Bağlandı!");

  client.manager.init(client.user.id);
});

client.on("raw", (d) => client.manager.updateVoiceState(d));

function mesajContent(mesaj){
  mesaj = mesaj.toLowerCase();
  return mesaj;
}
client.on("message", async (message) => {
  if (mesajContent(message.content) == (`${botPrefix}help`)){
    message.channel.send("BBT-BOT Komutları: \n $ping -> BBT-Bot'un çalışıp çalışmadığını görmek için kullanılır. \n $amirban -> Amir yetkisi olan kişiler için 'Ban' yetkisi. \n $amirkick -> Amir yetkisi olan kişiler için 'Kick' yetkisi. \n /***********************************************\ \n $play -> Müzik çalma sistemini aktifleştirir. [Kullanım: $play [url] veya $play [müzik ismi]]\n $pause -> Müzik duraklatır.\n $resume -> Müziği devam ettirir. \n $stop -> Müziği durdurur. \n $next -> Bir sonraki şarkıyı çalar\n/************* Sunucu Yetersizliğinden Dolayı Devre Dışı *************\.\n\n Mamdinden Mesaj: BOT üzerinde Easter-Egg'ler vardır. Keşfedin.");
  }
  if (mesajContent(message.content).startsWith(`${botPrefix}ban`)){
    let user = message.mentions.members.first();
    let banner = message.member.user;
    message.channel.send(`${banner} isimli Amir, ${user} isimli kullanıcıyı banladı!`);
    message.channel.send('https://i.hizliresim.com/O8UIiE.gif');
  }
  if (mesajContent(message.content) == (botPrefix + "ping")){
    message.channel.send('PONG!!');
  } else if ((message.content).toLowerCase() == "merhaba") {
    message.channel.send('Merhaba :raised_back_of_hand_tone1:');
  } 
  for (let index = 0; index < kufurList.length; index++) {
    if ((message.content).toLowerCase().includes(kufurList[index])){
      message.channel.bulkDelete(1).then(messages => message.channel.send(`KUFRETME ISTE ZINDIK ${message.member.user}`).catch(console.error));
      message.channel.send('https://i.hizliresim.com/keZwMY.gif');
    }
  }for (let index = 0; index < besNbirK.length; index++) {
    if ((message.content).toLowerCase().includes(besNbirK[index])){
      message.channel.send('Allah bilir..');
    }
  }
  if ((mesajContent(message.content).startsWith(`${botPrefix}amirban`))){
    if (!message.member.hasPermission("ADMINISTRATOR")){
      message.channel.send("Bu komut için yetkiniz yok?!")
    }else{
      let user = message.mentions.members.first();
      let banner = message.member.user;
      user.ban();
      message.channel.send(`${banner} isimli Amir, ${user} isimli kullanıcıyı banladı!`); 
      message.channel.send('https://i.hizliresim.com/O8UIiE.gif');
    }
  }
  if ((mesajContent(message.content).startsWith(`${botPrefix}amirkick`))){
    if (!message.member.hasPermission("ADMINISTRATOR")){
      message.channel.send("Bu komut için yetkiniz yok?!")
    }else{
      let user = message.mentions.members.first();
      let banner = message.member.user;
      user.kick();
      message.channel.send(`${banner} isimli Amir, ${user} isimli kullanıcıyı kickledi!`);
    }
  /*
  if (message.content.startsWith(botPrefix + "play")) {
    const res = await client.manager.search(
      message.content.slice(6),
      message.author
    );
    const player = client.manager.create({
      guild: message.guild.id,
      voiceChannel: message.member.voice.channelID,
      textChannel: message.channel.id,
    });
    player.connect();
    player.queue.add(res.tracks[0]);
    if (!player.playing && !player.paused && !player.queue.size){
      player.play();
    }
  } else if (mesajContent(message.content) == (botPrefix + "stop")) {
    const res = await client.manager.search(
      message.content.slice(6),
      message.author
    );
    const player = client.manager.create({
      guild: message.guild.id,
      voiceChannel: message.member.voice.channelID,
      textChannel: message.channel.id,
    });
    if(player.playing){
      player.stop();
      player.setVolume(1);
      message.channel.send('Müzik durduruldu.');
    }else{
      message.channel.send('Müzik zaten çalmıyor?!');
    }
  } else if (mesajContent(message.content) == `${botPrefix}leave`) {
    const res = await client.manager.search(
      message.content.slice(6),
      message.author
    );
    const player = client.manager.create({
      guild: message.guild.id,
      voiceChannel: message.member.voice.channelID,
      textChannel: message.channel.id,
    });
    player.disconnect();
  } else if (mesajContent(message.content) == `${botPrefix}next`){
    const res = await client.manager.search(
      message.content.slice(6),
      message.author
    );
    const player = client.manager.create({
      guild: message.guild.id,
      voiceChannel: message.member.voice.channelID,
      textChannel: message.channel.id,
    });
    player.play();
  } else if (mesajContent(message.content) == (botPrefix + "pause")){
    const res = await client.manager.search(
      message.content.slice(6),
      message.author
    );
    const player = client.manager.create({
      guild: message.guild.id,
      voiceChannel: message.member.voice.channelID,
      textChannel: message.channel.id,
    });
    if(player.playing){
      player.pause(true);
      message.channel.send('Müzik duraklatıldı.');
    } else {
      message.channel.send('Müzik zaten çalmıyor?!');
    }
  } else if (mesajContent(message.content) == (botPrefix + "resume")){
    const res = await client.manager.search(
      message.content.slice(6),
      message.author
    );
    const player = client.manager.create({
      guild: message.guild.id,
      voiceChannel: message.member.voice.channelID,
      textChannel: message.channel.id,
    });
    if (player.paused){
      player.pause(false);
    } else {
      message.channel.send('Müzik zaten çalıyor?!');
    }*/
  } else if (mesajContent(message.content) == "siyah"){
    message.channel.send('BEYAZ!');
  } else if (mesajContent(message.content) == "en büyük"){
    message.channel.send('BBT!');
  } else if (mesajContent(message.content) == "benim adım erşan kuneri" || mesajContent(message.content) == "ben erşan kuneri"){
    message.channel.send('Adaletten Kaçılmaz :neutral_face:');
  } else if (mesajContent(message.content) == "harf devrimi"){
    message.channel.send('Bir gecede cahil galdık yiğen.');
  } else if (mesajContent(message.content) == "napim"){
    message.channel.send('Yazılım öğren.');
  } else if (mesajContent(message.content) == "bugün cuma"){
    message.channel.send("Hayırlı Cumalar.");
    message.channel.send('https://i.hizliresim.com/69NpcF.jpg');
  } else if (mesajContent(message.content) == "slm" || mesajContent(message.content) == "selam"){
    message.channel.send('Bana da selam?');
  } else if (mesajContent(message.content) == "ne biçim vuruyo lan"){
    message.channel.send('ŞEREFSİZ SAFFET');
    message.channel.send('https://i.hizliresim.com/XknRpT.png');
  } else if (mesajContent(message.content) == "kılık kıyafet kanunu"){
    message.channel.send('BATININ OYUNU.');
  } else if (mesajContent(message.content) == "sırrı"){
    message.channel.send('DEDEM FIKRET');
    message.channel.send('https://i.hizliresim.com/SvxQjr.png');
  } else if (mesajContent(message.content) == "bizde r yok"){
    message.channel.send('BIZDE GERI VITES YOK YANI');
    message.channel.send('https://i.hizliresim.com/f2z7uW.png');
  } else if (mesajContent(message.content).startsWith(botPrefix + "clear")){
    var args = message.content.split(" ");
    if (!message.member.hasPermission("MANAGE_MESSAGES") || !message.member.hasPermission("ADMINISTRATOR")) return message.channel.send("Bu komt için yetkiniz yok?!");
    if (isNaN(args[1])) return message.channel.send("Lütfen bir sayı girin.");
    if (args[1] > 101) return message.channel.send("Silinecek mesaj sayısı 100 den fazla olamaz!");
    if (args[1] < 1) return (message.channel.send("SENIN KAFANI ...."),message.channel.send('https://i.hizliresim.com/uLX819.jpg'));

    message.channel.bulkDelete(args[1])
      .then(messages => message.channel.send(`${messages.size} mesaj silindi.`))
      .catch(console.error);
    } else if (mesajContent(message.content) == "sait kim"){
      message.channel.send('Sait: ');
      message.channel.send('https://i.hizliresim.com/Nl5HGl.jpg');
    } else if (mesajContent(message.content) == "mali kim"){
      message.channel.send('Mali: ');
      message.channel.send('https://i.hizliresim.com/u0Oopp.jpg');
    } else if (mesajContent(message.content) == "yunus kim"){
      message.channel.send('Yunus: ');
      message.channel.send('https://i.hizliresim.com/6HkrJU.jpg');
    } else if (mesajContent(message.content) == "ncan kim"){
      message.channel.send('Ncan: ');
      message.channel.send('https://i.hizliresim.com/BkJ3vH.png');
    } else if (mesajContent(message.content) == "apo kim"){
      message.channel.send('Apo: ');
      message.channel.send('https://i.hizliresim.com/RP76NP.png');
    } else if (mesajContent(message.content) == "berkay kim"){
      message.channel.send('Berkay: ');
      message.channel.send('https://i.hizliresim.com/hNMM0X.jpg');
    } else if (mesajContent(message.content) == "alos kim"){
      message.channel.send('Alos: ');
      message.channel.send('https://i.hizliresim.com/T7RSeJ.jpg');
    } else if (mesajContent(message.content) == "merve kim" || mesajContent(message.content) == "daşkapı kim"){
      message.channel.send('Merve: ');
      message.channel.send('https://i.hizliresim.com/EnOzR3.jpg');
    } else if (mesajContent(message.content) == "tesla kim"){
      message.channel.send('Tesla: ');
      message.channel.send('https://i.hizliresim.com/YD3o6a.jpg');
    } else if (mesajContent(message.content) == "tüp"){
      message.channel.send('MUSTERI ALMADI: ');
      message.channel.send('https://i.hizliresim.com/i0oEgK.jpg');
    } else if (mesajContent(message.content) == "sözelci"){
      message.channel.send('https://i.hizliresim.com/uzKNIz.png');
    } else if (mesajContent(message.content) == "şaka şaka"){
      message.channel.send('https://tenor.com/boIil.gif');
    }
});

client.login(botToken);
