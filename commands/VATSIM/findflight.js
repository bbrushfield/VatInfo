const Discord = require("discord.js");
const {handler} = require('vatsim-data-handler');
const airports = require('airport-codes')

function errorembed(message, type, desc){
    let errorembed = new Discord.MessageEmbed()
    .setAuthor('VATSIM UK','', 'https://www.vatsim.uk/')
    .setColor('RED')
    .setFooter(`Error type: ${type}`)
    .setDescription(desc)
    if (type == 'not_found'){
        errorembed.setTitle('The flight you attempted to find was not found')
    }
    message.channel.send({embeds: [errorembed]})
    return;
}


async function getFlightandFormat(input, message) {
    input = input.toUpperCase()
    console.log(input)
    handler.getFlightInfo(input).then(val => {
        if (val == undefined){
            errorembed(message, 'not_found','The flight you attempted to find was not found on the network. Please ensure it was spelt correctly and that they are currently connected live on the VATSIM network ')
            return;
        }
        let Arr = ''
        try {
            Arr = `${airports.findWhere({ icao: `${val.flight_plan.alternate}`}).get('name')} (${val.flight_plan.alternate})`
        } catch (error) {
            Arr = 'N/A'
        }

        console.log(val)
        let currentembed = new Discord.MessageEmbed()
        .setAuthor('VATSIM UK', '', 'https://www.vatsim.uk/')
        .setTitle(`Flight Information for ${val.callsign}`)
        .setFooter(`Requested by `)
        .setDescription('The flight you requested, `' + val.name + '`, has been found on the network. Please see the following information')
        .addField('Arrival Airport', `${airports.findWhere({ icao: `${val.flight_plan.departure}`}).get('name')} (${val.flight_plan.departure})`, true)
        .addField('Arrival Airport', `${airports.findWhere({ icao: `${val.flight_plan.arrival}`}).get('name')} (${val.flight_plan.arrival})`, true)
        .addField('Alternate Airport', Arr, true)
        .addField('True Position',`Lat: ${val.latitude}, Long: ${val.longitude}`,true)
        .addField('Current Altitude (STD)',`${val.altitude}ft`, true)
        .addField('True Ground Speed (kts)', `${val.groundspeed}kts`, true)
        .addField('True Heading',val.heading, true)
        .addField('Enroute Time Estimated at', val.flight_plan.enroute_time + 'z', true)
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
    name: "flightinfo",
    aliases: ["finfo"],
    category: "VATSIM",
    description: "Returns all commands, or one specific command info",
    usage: "[command | alias]",
    run: async (client, message, args) => {
        let input = args[0]
        getFlightandFormat(input, message)
    }
}