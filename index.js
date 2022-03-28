const botconfig = require("./management/botconfig.json");
const { Client, RichEmbed, Collection, Intents, DiscordAPIError } = require("discord.js");
const fs = require("fs");
const http = require('http');
const { token } = require('./config')
require ('dotenv/config');
const port = process.env.PORT || 3000; // Find the PORT or port 3000 if not
//This is a simple server
http.createServer().listen(port); // Allows the connection of the bot to the heroku server
//const drp = require('discord-rich-presence')('180984871685062656');
const prefix = botconfig.prefix;

//Allows the bot to mention.
const client = new Client({
    disableEveryone: false,
    intents: ["GUILDS", "GUILD_MESSAGES", "GUILD_MESSAGE_REACTIONS"]
});

// For use with the commands handler to ensure aliases such as !training can also be used as !post
client.commands = new Collection();
client.aliases = new Collection();

client.categories = fs.readdirSync("./commands/");

["command"].forEach(handler => {
    require(`./handlers/${handler}`)(client);
});

//client.mongoose = require('./Utils/mongo')


client.on("ready", () => {
    console.log(`Hi, ${client.user.username} is now online!`); // Once bot is online, this will log in console
    // Sets the status of the bot
    client.user.setActivity('Lyme Regis Community!', { type: 'WATCHING' })
    client.user.setStatus('idle')
});

client.on("messageCreate", async message => {
    // Sets prefix and takes off the command, e.g. !post, by slicing it.
    if (message.author.bot) return;
    if (!message.guild) return;
    if (!message.content.startsWith(prefix)) return;
    if (!message.member) message.member = await message.guild.fetchMember(message);
    // slices and changes the command to lower case.
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const cmd = args.shift().toLowerCase();
    // If there is not a command, e.g. "Hello barry", it will stop listening until the next piece of texts
    if (cmd.length === 0) return;
    let command = client.commands.get(cmd);
    if (!command) command = client.commands.get(client.aliases.get(cmd));
    if (command) 
        command.run(client, message, args);
});
//wont stop it
client.on('error', err => {
    console.log(err);
})
// Runs the bot when node . (. meaning current file) is run.
//client.mongoose.init();
client.login(token);