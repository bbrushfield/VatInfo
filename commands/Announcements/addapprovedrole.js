const fs = require('fs')
const { MessageMentions: { ROLES_PATTERN } } = require('discord.js');

function amendJson(id){
    console.log(id)
    let listjson = fs.readFileSync("commands/Announcements/approvedRoles.json")
    let roles = JSON.parse(listjson)
    roles.push(id);
    console.log('roles: ', roles)
    listjson = JSON.stringify(roles);
    fs.writeFileSync('commands/Announcements/approvedRoles.json',listjson,'utf-8');
}

module.exports = {
    name: "approve",
    aliases: ["addapprovedrole"],
    category: "Admin",
    description: "Adds an approved role to the list!",
    usage: "ping",
    run: async (client, message, args) => {
        if ( !args[0] ) {
            return message.channel.send('Sorry! Please mention a role to add, or get the id!')
        }
        const matches = message.content.match(ROLES_PATTERN)

        if (!matches) return message.channel.send('Please mention a role to add, or get the ID!')

        const id = matches[0]
        console.log(id)
        amendJson(id)

    }
}