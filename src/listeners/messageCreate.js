const CommandContext = require("../structures/CommandContext");
const { Collection } = require("discord.js");
const cooldowns = new Map();
module.exports = {
    name: "messageCreate",
    exec: async (client, msg) => {
        if (!msg.guild || msg.author.bot) return;
        if (!msg.channel.permissionsFor(msg.guild.me).has('SEND_MESSAGES')) return;
        const prefix = msg.content.toLowerCase().startsWith(client.prefix) ? client.prefix : `<@!${client.user.id}>`;
         if (msg.content.match(`<@!${client.user.id}>`)) return msg.channel.send({ embeds: [util.embed().setDescription(`♦ | Use This Prefix To Access Commands =  ${client.prefix.toUpperCase()}`)		
            .setFooter(msg.author.username,  msg.author.displayAvatarURL({ dynamic: true }))
            .setTimestamp()]});
        if (!msg.content.toLowerCase().startsWith(prefix)) return;        
        const args = msg.content.slice(prefix.length).trim().split(/ +/g);
        const commandName = args.shift().toLowerCase();
        const command = client.commands.get(commandName) || client.commands.find(c => c.aliases && c.aliases.includes(commandName));
        if (command) {
            if (!isNaN(command.timeout)) {
             if(!cooldowns.has(command.name)){
                    cooldowns.set(command.name, new Collection());
                }    
                const current_time = Date.now();
                const time_stamps = cooldowns.get(command.name);
                const cooldown_amount =  command.timeout;      
                if(time_stamps.has(msg.author.id)){
                    const expiration_time = time_stamps.get(msg.author.id) + cooldown_amount;        
                    if(current_time < expiration_time){
                        const time_left = (expiration_time - current_time) / 1000;  
                        return msg.reply({ embeds: [util.embed().setDescription(`Please wait ${time_left.toFixed(1)} more seconds before using ${command.name} Command Again.`)		
                            .setFooter(msg.author.username,  msg.author.displayAvatarURL({ dynamic: true }))
                            .setTimestamp()]});
                    }
                }
                time_stamps.set(msg.author.id, current_time);
                setTimeout(() => time_stamps.delete(msg.author.id), cooldown_amount); 
            }
            try {
                await command.exec(new CommandContext(command, msg, args));
            } catch (e) {
                console.error(e);
            }
        }
    }
};
