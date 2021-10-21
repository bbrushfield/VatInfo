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

function checkIfPresent(id){
    let listjson = fs.readFileSync("commands/Announcements/approvedRoles.json")
    let roles = JSON.parse(listjson)
    console.log(roles)
    for (i=0; i<roles.length; i++){
        if (roles[i] == id){
            return true;
        }
    }
    return false;
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

        var str = matches[0].replaceAll('<@&','').replaceAll('>','')
        str = parseInt(str)
        console.log(str)
        if (checkIfPresent(str) == true) {
            return message.channel.send('This is already an approved role!')
        } else {
            amendJson(str)
        }

    }
}