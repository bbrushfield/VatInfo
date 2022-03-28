const Discord = require("discord.js");
const {handler} = require('vatsim-data-handler');
const airports = require('airport-codes')
const ratings = [[1, 'Observer'],[2, 'Student 1'],[3, 'Student 2'],[4, 'Student 3'],[5, 'Controller 1'],[6, 'Controller 2'],[7, 'Controller 3'],[8, 'Instructor 1'],[9, 'Instructor 2'],[10, 'Instructor 3']]
const facilities = [[1, 'Flight Service Station'],[2, 'Clearance/Delivery'],[3, 'Ground'],[4, 'Tower'],[5, 'Approach / Departure'],[6, 'Center']]

function findRating(ratingNumber){
    for (i = 0; i<ratings.length;i++){
        if (ratingNumber == ratings[i][0]){
            return ratings[i][1]
        }
    }
}

function findFacility(facilityNumber){
    for (i = 0; i< facilities.length;i++){
        if (facilityNumber == facilities[i][0]){
            return facilities[i][1]
        }
    }
}

function errorembed(message, type, desc){
    let errorembed = new Discord.MessageEmbed()
    .setAuthor('VATSIM UK','', 'https://www.vatsim.uk/')
    .setColor('RED')
    .setFooter(`Error type: ${type}`)
    .setDescription(desc)
    if (type == 'not_a_number'){
        errorembed.setTitle('The option you selected was not a number')
    } else if (type == 'selection_too_high'){
        errorembed.setTitle('The option you selected was not a valid option')
    } else if (type == 'facility_not_found') {
        errorembed.setTitle('The facility you wanted to select could not be found!')
    }
    message.channel.send({embed: [errorembed]})
    return;
}

function final(message, val) {
    const finalembed = new Discord.MessageEmbed()
    .setTitle(`Controller information for ${val.name} (${val.cid})`)
    .setDescription(`Callsign: ${val.callsign}`)
    .setFooter(`Details of ${val.name}`)
    .addField('Frequency',val.frequency,true)
    .addField('Facility',`${findFacility(val.facility)}`,true)
    .addField(`Rating`,`${findRating(val.rating)}`,true)
    if (val.text_atis[0] == null) {
    } else if (val.text_atis[1] == undefined) {
        finalembed.addField(`Controller Description`,`${val.text_atis[0]}`, true)
    } else if (val.text_atis[2] == undefined ) {
        finalembed.addField(`Controller Description`,`${val.text_atis[0]}, ${val.text_atis[1]}`, true)
    }
    message.channel.send({embeds: [finalembed]})
}


async function findController(message, input) {
    var list = []
    handler.getControllers().then(val => {
        //console.log(val)
        for (i=0; i < val.length; i++){
            //console.log(val[i].name.toUpperCase() + ' ' + input)
            if (val[i].name.toLowerCase().includes(input.toLowerCase())) {
                console.log(val[i])
                list.push(val[i].name)
            }
        }
        console.log(list)
        //If no person was found with that name, move onto searching for callsigns
        //THIS IS WHERE I NEED TO WORK ON FINDING CALLSIGNS
        if (list.length == 0){ 
            for (t=0; t < val.length; t++){
               // console.log(val[t].callsign.toUpperCase() + ' ' + input.toUpperCase())
                if (val[t].callsign.toUpperCase().includes(input.toUpperCase())) {
                    console.log('found')
                    final(message, val[t])
                }
            }
        } else if (list.length > 1){ //If there was more than one person with that name
            console.log('Else if')
            const temp = new Discord.MessageEmbed()
            .setTitle(`Which ${input} did you mean?`)
            .setDescription('Please input the single number of the option you would like to select, e.g. "1"')
            for (v = 0; v < list.length; v++){
                temp.addField(`Option ${v+1}`, `${list[v]}`)
            }

            message.channel.send({embeds: [temp]})
            const msg_filter = (m) => m.author.id === message.author.id;
            message.channel.awaitMessages({filter: msg_filter, max: 1})
                .then(messagecollected => {
                    let number = parseInt(messagecollected.first().content, 10)
                    console.log(messagecollected.first().content)
                    console.log(number)
                    if(number > list.length+1) { //The list length is one below the actual selected number
                        //If the list length is above the list length (+1 as the selection is one above)
                        errorembed(message, 'selection_too_high','Please re-try the command, making sure to put the exact option number')
                    } else if (number < 1){
                        errorembed(message, 'selecton_too_low','Please re-try the command, making sure to put the exact option number')
                    } else {
                        //Valid option
                        console.log(number-1)
                        console.log(list[number-1])
                        for (x=0; x < val.length; x++) {
                            if (val[x].name.toLowerCase().includes(list[number-1].toLowerCase())) {
                                console.log(val[x].name)
                                final(message, val[x]) 
                                return;              
                            }
                        }
                        errorembed(message, 'facility_not_found','Please try again with a valid connection to the network')
                    }
                })
            return;
        } else { //List value is equal to one, therefore we have found a single match
            console.log('Else')
            for (x=0; x < val.length; x++){
                if (val[x].name.toLowerCase().includes(input.toLowerCase())) {
                    console.log(val[x])
                    const finalembed = new Discord.MessageEmbed()
                    .setTitle(`Controller information for ${val[x].name} (${val[x].cid})`)
                    .setDescription(`Callsign: ${val[x].callsign}`)
                    .addField('Frequency',val[x].frequency,true)
                    .addField('Facility',`${findFacility(val[x].facility)}`,true)
                    .addField(`Rating`,`${findRating(val[x].rating)}`,true)
                    .addField(`Controller Description`,`${val[x].text_atis[0]}, ${val[x].text_atis[1]}, ${val[x].text_atis[2]}`, true)
                    message.channel.send({embeds: [finalembed]})
                }
            }
        }
    
    })
}


module.exports = {
    name: "findcontroller",
    aliases: ["findctr"],
    category: "VATSIM",
    description: "Returns all commands, or one specific command info",
    usage: "[command | alias]",
    run: async (client, message, args) => {
        console.log(args)
        let newargs = ''
        for (i = 0; i < args.length; i++){
            newargs = newargs + args[i]+' '
        }
        console.log(newargs)
        let input = newargs.toString()
        findController(message, input)
    }
}