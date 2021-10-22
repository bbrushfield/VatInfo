// If user is a part of the approved roles category, they can instigate a SSU without approval
//Otherwise, the approval goes to an approval channel where it can be reviewed and approved by those who have access to that channel
// Read the JSON to get a list of approved roles. 
const fs = require('fs')
const Discord = require('discord.js');
const botconfig = require("./../../management/botconfig.json");
const moment = require('moment');
const { duration } = require('moment');
var stored_time = 0
var cooldown = false
function Response(message){
    const Resp = new Discord.MessageEmbed()
    .setAuthor(botconfig.Footer, botconfig.IconURL)
    .setTitle('Your SSU has been put in for approval')
    .setDescription('Please wait while a member of the Lyme Regis Moderation Team review the request')
    .setThumbnail(botconfig.IconURL)
    .setColor('GREEN')
    .setFooter(`Requested by ${message.author.username}`, message.author.avatarURL())
    .setTimestamp()
    message.channel.send({ content: `${message.author}`, embeds: [Resp] })
}

function ApprovedCheck(message){
    let listjson = fs.readFileSync("commands/Announcements/approvedRoles.json")
    let roles = JSON.parse(listjson)
    for (i=0; i< roles.length; i++) {
        let currentrole = message.guild.roles.cache.find(role => role.id === roles[i])
        if (message.member.roles.cache.has(currentrole.id)) {
            console.log('Role Found!')
            return true
        }
    }
    console.log('They do not have an approved role')
    return false
}

function SSUEmbed(message){
    const SSU = new Discord.MessageEmbed()
    .setTitle('Server Start Up!')
    .setColor('PURPLE')
    .setAuthor(botconfig.Footer, botconfig.IconURL)
    .setThumbnail(botconfig.IconURL)
    .setImage(botconfig.SSUImage)
    .setDescription(`There is a Server Start Up requested by ${message.author}! \n \n Come down to experience an accurate roleplay experience!`)
    .addField(`Link`,`https://www.roblox.com/games/6144601849/Lyme-Regis-50-OFF-EVERYTHING`)
    .setTimestamp()
    .setFooter(`Requested by ${message.author.username}`, message.author.avatarURL())
    message.channel.send({ content: "@everyone", embeds: [SSU] })
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

function Approval(message,client) {
    let channel = message.guild.channels.cache.get(botconfig.ApprovalChannel)
    let now = new Date();
    moment.locale();
    var dateString = moment(now).format('llll')
    const ApprovalEmbed = new Discord.MessageEmbed()
    .setTitle('Server Start Up Request')
    .setColor('NAVY')
    .setAuthor(botconfig.Footer, botconfig.IconURL)
    .setThumbnail(botconfig.IconURL)
    .setDescription(`${message.author.username} is requesting a Server Startup!`)
    .addField('Request sent at', dateString)
    .setTimestamp()
    .setFooter(`Requested by ${message.author.username}`, message.author.avatarURL())
    channel.send({ content: '@here', embeds: [ApprovalEmbed] }).then(ApprovalSent => {
        const Filter = (reaction, user) => {
            return ['✅', '❌'].includes(reaction.emoji.name)
        };
        ApprovalSent.react('✅')
        ApprovalSent.react('❌')
        ApprovalSent.awaitReactions(Filter, {max: 1, time: 120000}).then(collected => {

            const reaction = collected.first()

            if (reaction.emoji.name === '✅') {
                // The SSU has been approved
            } else if (reaction.emoji.name === '❌') {
                //The SSU has been denied, a reason must be provided!
            } else {
                Error(message,'The emoji sent is not an approved emoji!')
            }
        })
    })
}

function unix_get(unix){
    var date = new Date(unix);

    var minutes = '0' + date.getMinutes();
    var seconds = '0' + date.getSeconds();

    var formatted = minutes.substr(-2) + ' minutes ' + seconds.substr(-2) + ' seconds';
    return formatted
}

module.exports = {
    name: "ssu",
    aliases: ["serverstartup"],
    category: "Announcements",
    description: "Allows for Server Startups to be hosted",
    usage: ".ssu",
    run: async (client, message, args) => {
        let unix_hour = 3600000
        cooldown == true
        if (stored_time == 0) {
            //The first time the command is run from when the bot starts, the command is good.
            stored_time = Date.now()
            const approvalcheck = ApprovedCheck(message)
                if (approvalcheck == true) {
                    // They have a role that do not require approval to launch a Server Startup
                } else if (approvalcheck == false) {
                    // They do not have a role and require approval to launch a SSU (THIS WILL NOT PING EVERYONE!!!!!!)
                    Response(message)
                    Approval(message,client)
                } else {
                    Error(message, 'There has been an unexpected error. Please send this error code in a bug report: SSU#ERRAPPROVAL')
                }
        } else {
            let new_time = Date.now()
            console.log(new_time - stored_time)
            if(new_time - stored_time < unix_hour) {
                //It has been under an hour since the last SSU
                let timesince = new_time - stored_time

                let format_date = unix_get(unix_hour - timesince)
                Error(message,`It has been under an hour since the last SSU. Please wait ${format_date}  `)
            } else {
                //It has been over an hour, and the message can be sent, and the cooldown must be reinstated
                const approvalcheck = ApprovedCheck(message)
                if (approvalcheck == true) {
                    // They have a role that do not require approval to launch a Server Startup
                } else if (approvalcheck == false) {
                    // They do not have a role and require approval to launch a SSU (THIS WILL NOT PING EVERYONE!!!!!!)
                    Response(message)
                    Approval(message,client)
                } else {
                    Error(message, 'There has been an unexpected error. Please send this error code in a bug report: SSU#ERRAPPROVAL')
                }
            }
        }
    }
}