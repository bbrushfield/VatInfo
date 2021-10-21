// If user is a part of the approved roles category, they can instigate a SSU without approval
//Otherwise, the approval goes to an approval channel where it can be reviewed and approved by those who have access to that channel
// Read the JSON to get a list of approved roles. 
module.exports = {
    name: "ssu",
    aliases: ["serverstartup"],
    category: "Announcements",
    description: "Allows for Server Startups to be hosted",
    usage: "ping",
    run: async (client, message, args) => {
        const msg = await message.channel.send(`pinging...`);
    
        msg.edit(`Pong\n Latency is ${Math.floor(msg.createdAt - message.createdAt)}ms\nAPI Latency is ${Math.round(client.ping)}ms`); 
    }
}