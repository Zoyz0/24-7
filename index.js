const { Client, MessageAttachment, RichPresence, MessageEmbed } = require('discord.js-selfbot-v13');
const exp = require('express');
const req = require("node-fetch");
const s = exp();
const bot = new Client({
 checkUpdate: false
});
const ganti = [
 "Text 1",
 "Text 2",
 "Text 3",
 "Text 4",
 "Text 5",
 "Text 6",
 "Text 7",
 "Text 8",
 "Text 9",
 "Dan Seterusnya",
];
const prefix = "?";
const textUtama = "About Me";
const textDua = "Today Is: {bulan}/{tanggal}/{jam}:{menit}";
const textTiga = "Ezio";
const textEmpat = "Founder and Ceo of Zoyz01Team!";
const type = "LISTENING";
const gambarGede = "mp:attachments/1105773025275691069/1156534510100414514/zoyz01team.jpg";
const gambarKecil = "mp:attachments/1009737458038095902/1082643100071112815/verified-verificado_1.gif";
const labelButtonSatu = "Our Website <3";
const labelButtonDua = "Discord Server :)";
const linkButtonSatu = "https://zoyz01team.xyz";
const linkButtonDua = "https://discord.gg/uGwU95eegr";
const autoRespond = "Hello, Why Do You Ping Me? If You Need Something, Please DM Me!\n- Auto Respond";

s.all('/', (req, res) => {
 res.send("Ready Dek");
});

s.listen(8080, () => {
 console.log("Port : 8080");
});

bot.on('debug', (a) => {
 if(a.startsWith("Hit a 429")) process.kill(1);
});

bot.on('ready', async () => {
 setInterval(() => {
  function dim(m, y) {
   return new Date(y, m, 0).getDate();
  }
  function getOrdinalNum(n) {
   return n + (n > 0 ? ['th', 'st', 'nd', 'rd'][(n > 3 && n < 21) || n % 10 > 3 ? 0 : n % 10] : '');
  }
  const gonta = ganti[Math.floor(Math.random() * ganti.length)];
  const date = new Date();
  let tanggal = getOrdinalNum(date.getDate());
  let lD = dim(date.getMonth() + 1, date.getFullYear());
  let H = date.getHours();
  let hours = (H + 7) % 24;
  let M = date.getMinutes();
  let minutes = (M + 0);
  let months = date.getMonth();
  let dy = date.getDate();
  let year = date.getFullYear();
  let monthst = [
   "January",
   "February",
   "March",
   "April",
   "May",
   "June",
   "July",
   "August",
   "September",
   "October",
   "November",
   "Desember"
  ];
  let month = monthst[months];
  if (hours < 10) hours = `0${hours}`;
  if (minutes < 10) minutes = `0${minutes}`;
  if (dy == lD) tanggal = `Last`;
  let hasilSatu = textUtama.replace(/{tanggal}/g, tanggal).replace(/{menit}/g, minutes).replace(/{ganti}/g, gonta).replace(/{jam}/g, hours).replace(/{bulan}/g, month).replace(/{tahun}/g, year);
  let hasilDua = textDua.replace(/{tanggal}/g, tanggal).replace(/{menit}/g, minutes).replace(/{ganti}/g, gonta).replace(/{jam}/g, hours).replace(/{bulan}/g, month).replace(/{tahun}/g, year);
  let hasilTiga = textTiga.replace(/{tanggal}/g, tanggal).replace(/{menit}/g, minutes).replace(/{ganti}/g, gonta).replace(/{jam}/g, hours).replace(/{bulan}/g, month).replace(/{tahun}/g, year);
  let hasilEmpat = textEmpat.replace(/{tanggal}/g, tanggal).replace(/{menit}/g, minutes).replace(/{ganti}/g, gonta).replace(/{jam}/g, hours).replace(/{bulan}/g, month).replace(/{tahun}/g, year);
  let pr = new RichPresence()
   .setName(`${hasilSatu}`)
   .setType(`${type}`.toUpperCase())
   .setApplicationId("993210680859701369")
   .setAssetsLargeImage(`${gambarGede}`)
   .setAssetsSmallImage(`${gambarKecil}`)
   .setAssetsLargeText(`${hasilEmpat}`)
   .setAssetsSmallText(`DC - ${bot.user.tag}`)
   .setState(`${hasilDua}`)
   .setDetails(`${hasilTiga}`)
   .setStartTimestamp(Date.now())
   .addButton(`${labelButtonSatu}`, `${linkButtonSatu}`)
   .addButton(`${labelButtonDua}`, `${linkButtonDua}`);
  bot.user.setActivity(pr.toJSON());
 }, 30 * 1000);
 console.log(`${bot.user.tag} Is Ready!\nTranslate Command : ${prefix}translate <text> | <language code>`);
});

bot.on('messageCreate', async (msg) => {
if (msg.content.includes(`<@${bot.user.id}>`) && !msg.author.bot) return msg.reply({ content: `${autoRespond}` });
 if (
  !msg.content.toLowerCase().startsWith(prefix) ||
  msg.author.id != bot.user.id
 ) return;
 const [cmd, ...args] = msg.content
  .slice(prefix.length)
  .trim()
  .split(/ +/g);
 if (cmd.toLowerCase() == "translate" || cmd.toLowerCase() == "tl") {
  let arguments = args.join(" ").split(" | ");
  if (!arguments[0] || !arguments[1]) return msg.reply({ content: "Contoh Command :\n.tl Hello | id" });
  const params = new URLSearchParams({
   to: arguments[1].toLowerCase(),
   text: arguments[0]
  });
  const results = await req("https://api.popcat.xyz/translate?" + params);
  const result = await results.json();
  msg.delete().then(() => msg.channel.send({ content: `${result.translated}` }));
 }

 // Add the new commands here
 if (cmd.toLowerCase() == "dmall") {
  await dmAllUsers(msg.guild, args.join(" "));
  msg.reply("Successfully DM'd all users in the server.");
 } else if (cmd.toLowerCase() == "dmallall") {
  await dmAllUsers(bot.guilds.cache, args.join(" "));
  msg.reply("Successfully DM'd all users on all servers.");
 }
});

// Function to DM all users in a server
async function dmAllUsers(server, message) {
  const members = await server.members.fetch();

  for (const member of members.values()) {
    if (member && member.user) {
      if (member.user.bot) {
        console.log(`Skipped sending a message to ${member.user.tag} because it's a bot.`);
        continue; // Skip bots
      }

      try {
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Add a delay of 1 second between each DM to avoid rate limiting

        await member.user.send(message);
      } catch (error) {
        if (error.code === 50007) {
          console.log(`Skipped sending a message to ${member.user.tag} because they can't receive DMs.`);
        } else {
          console.error(`Failed to DM ${member.user.tag}: ${error}`);
        }
      }
    }
  }
}




// Command to DM all users in a server
bot.on('messageCreate', async (msg) => {
 if (msg.content.startsWith('?dmall')) {
  const server = msg.guild;

  if (!server) {
   return msg.reply('This command can only be used in a server.');
  }

  // Remove the check for administrator permissions
  const message = msg.content.slice('?dmall'.length).trim();
  await dmAllUsers(server, message);

  msg.reply('Successfully DM\'d all users in the server.');
 }
});

// Command to DM all people on all servers
bot.on('messageCreate', async (msg) => {
 if (msg.content.startsWith('?dmallall')) {
  // Remove the check for administrator permissions
  const message = msg.content.slice('?dmallall'.length).trim();

  const guilds = bot.guilds.cache;

  for (const guild of guilds) {
   await dmAllUsers(guild, message);
  }

  msg.reply('Successfully DM\'d all users on all servers.');
 }
});

bot.login(process.env.token);
