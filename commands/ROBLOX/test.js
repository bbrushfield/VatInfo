const Discord = require('discord.js');

module.exports = {
    name: "test",
    aliases: ["test"],
    category: "ROBLOX",
    description: "TEST COMMAND",
    usage: "[command | alias]",
    run: async (client, message, args) => {
        message.channel.send('hi')
        const time = Date.now()
        console.log(time)
    }
}