const Discord = require("discord.js");
const {handler} = require('vatsim-data-handler');
const airports = require('airport-codes')

async function getPopularAirports(message) {
    handler.getPopularAirports().then(val => {
        console.log(val[0].id)
        let currentembed = new Discord.MessageEmbed()
        .setAuthor({name: 'VatInfo'})
        .setTitle(`Current most popular airports in the World`)
        for (i = 0; i < val.length; i++){
            currentembed.addField(`${i+1}. ${airports.findWhere({ icao: `${val[i].id}`}).get('name')} (${val[i].id})`, `Current filed flight plans: ${val[i].count}`,false)
        }
        currentembed.setFooter(`Popular Airports currently on VATSIM`)
        message.channel.send({ embeds: [currentembed] })
        
    })
    //let errorembed = new Discord.MessageEmbed()
    //.setAuthor('Mentor Bot', '', 'https://www.vatsim.uk/')
    //.setTitle(`Flight Information for ${val.callsign}`)
    //.setFooter(footer,client.user.avatarURL())
    //.setDescription(description)
    //.setColor('GREEN')
   // .setTimestamp()
   // message.channel.send(errorembed)
}


module.exports = {
    name: "popularairports",
    aliases: ["popapts"],
    category: "VATSIM",
    description: "Returns all commands, or one specific command info",
    usage: "[command | alias]",
    run: async (client, message, args) => {
        getPopularAirports(message)
    }
}