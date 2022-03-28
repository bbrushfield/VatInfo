const Discord = require("discord.js");
const {handler} = require('vatsim-data-handler');
const airports = require('airport-codes')

const cids = [1539559,1437950,1480436,1244258,1476870,1465482,1433686,1401881,1540280]

function errorembed(message, type, desc){
    let errorembed = new Discord.MessageEmbed()
    .setAuthor('Virtual RAF','', 'http://rafvirtual.uk/')
    .setColor('RED')
    .setFooter(`Error type: ${type}`)
    .setDescription(desc)
    if (type == 'not_found'){
        errorembed.setTitle('The flight you attempted to find was not found')
    }
    message.channel.send({embeds: [errorembed]})
    return;
}


async function getFlightandFormat(message) {
    for (i=0;i<cids.length;i++) {
        handler.getClientDetails(cids[i]).then(val => {
            if (val == undefined){
                console.log(val)
                return;
            }

            console.log(val)
            let currentembed = new Discord.MessageEmbed()
            .setAuthor('Virtual RAF', '', 'http://rafvirtual.uk/')
            .setTitle(`Flight Information for ${val.callsign}`)
            .setFooter(`Requested by ${message.author.username}`)
            .setDescription('The flight you requested, `' + val.name + '`, has been found on the network. Please see the following information')
            .addField('Arrival Airport', `${airports.findWhere({ icao: `${val.flight_plan.departure}`}).get('name')} (${val.flight_plan.departure})`, true)
            .addField('Arrival Airport', `${airports.findWhere({ icao: `${val.flight_plan.arrival}`}).get('name')} (${val.flight_plan.arrival})`, true)
            //.addField('True Position',`Lat: ${val.latitude}, Long: ${val.longitude}`,true)
            .addField('Current Altitude (STD)',`${val.altitude}ft`, true)
            .addField('True Ground Speed (kts)', `${val.groundspeed}kts`, true)
            .addField('True Heading',`${val.heading} degrees`, true)
            .addField('Aircraft Type', val.flight_plan.aircraft_short)
            let fr = ''
            if (val.flight_plan.flight_rules == 'I') {
                fr = 'Instrument Flight Rules'
            } else if (val.flight_plan.flight_rules == 'V') {
                fr = 'Visual Flight Rules'
            } else {
                fr = 'Unknown'
            }
            currentembed.addField('Flight Rules', fr, true)

            message.channel.send({embeds: [currentembed]})
            
        })
    }
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
    name: "online",
    aliases: ["o"],
    category: "VATSIM",
    description: "Returns a list of all active pilots currently registered with RAFv",
    usage: "command",
    run: async (client, message, args) => {
        console.log('h')
        getFlightandFormat(message)
    }
}