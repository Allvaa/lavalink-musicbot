const { readFileSync } = require("fs");

const fs = require("fs");
const Prefix = process.env.PREFIX;

module.exports = {
    name: "message",
    exec: async (client, msg) => {
        if (!msg.guild) return;
        if (msg.author.bot) return;
        
        let prefixes = JSON.parse(fs.readFileSync('./prefixes.json', "utf8"));
		
         if(!prefixes[msg.guild.id]){
			 prefixes[msg.guild.id] = {
				 prefix: process.env.PREFIX
			 }
		 }

		  let prefix  = prefixes[msg.guild.id].prefix;
        
        if (!msg.content.startsWith(prefix)) return;

        const args = msg.content.slice(prefix.length).trim().split(/ +/g);
        const commandName = args.shift().toLowerCase();
        const command = client.commands.get(commandName) || client.commands.find(c => c.aliases && c.aliases.includes(commandName));
        if (command) {
            try {
                await command.exec(msg, args);
            } catch (e) {
                console.error(e);
            }
        }
    }
};
