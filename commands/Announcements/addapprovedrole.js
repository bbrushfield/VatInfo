const fs = require('fs')
const { MessageMentions: { ROLES_PATTERN }} = require('discord.js');
const Discord = require('discord.js');
const { Permissions } = require('discord.js');
const botconfig = require("./../../management/botconfig.json");

function amendJson(id){
    console.log(id)
    let listjson = fs.readFileSync("commands/Announcements/approvedRoles.json")
    let roles = JSON.parse(listjson)
    roles.push(id);
    console.log('roles: ', roles)
    listjson = JSON.stringify(roles);
    fs.writeFileSync('commands/Announcements/approvedRoles.json',listjson,'utf-8');
    return 'success'
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

function SuccessEmbed(role, message){
    const SuccEmbed = new Discord.MessageEmbed()
    .setColor('GREEN')
    .setTitle(`Success!`)
    .setThumbnail(botconfig.IconURL)
    .setDescription('The role has been added to the approval list!')
    .addField(`Role name:`, `${role.name}`)
    .addField(`Role ID`,`${role.id}`, true)
    .addField(`Requested by:`, `${message.author.username}`, true)
    .setFooter(botconfig.Footer, botconfig.IconURL)
    message.channel.send({ embeds: [SuccEmbed] })
}

function Error(message, errormsg){
    const ErrEmbed = new Discord.MessageEmbed()
    .setColor('RED')
    .setTitle(`Sorry!`)
    .setDescription("There has been an error completing this command! If you feel this is wrong, please contact a member of the development team!")
    .addField(`Unique Error Message:`, `${errormsg}`)
    .setFooter(botconfig.Footer, botconfig.IconURL)
    message.channel.send({ embeds: [ErrEmbed] })
}

module.exports = {
    name: "approve",
    aliases: ["addapprovedrole"],
    category: "Admin",
    description: "Adds an approved role to the list!",
    usage: "ping",
    run: async (client, message, args) => {
        if (!message.member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES)){
            Error(message, `You do not have the required permissions to complete this command!`)
            return 
        }

        if ( !args[0] ) {
            Error(message, `You have not given any role to process!`)
            return 
        }
        const matches = message.content.match(ROLES_PATTERN)
        if (!matches) {
            Error(message, `You have not mentioned a valid role!`)
            return;
            
        } 
        var str = matches[0].replaceAll('<@&','').replaceAll('>','')
        console.log(str)
        const role = message.guild.roles.cache.get(str)
        if (checkIfPresent(str) == true) {
            Error(message, `The role you have mentioned is already approved!`)
            return
        } else {
            if (amendJson(str) == 'success') {
                SuccessEmbed(role, message)
            }
        }

    }
}