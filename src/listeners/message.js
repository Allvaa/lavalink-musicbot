module.exports = {
    name: "message",
    exec: async (client, msg) => {
        if (!msg.guild) return;
        if (msg.author.bot) return;     

    const prefixMention = new RegExp(`^<@!?${client.user.id}> `);
    const newPrefix = msg.content.match(prefixMention) ? msg.content.match(prefixMention)[0]: client.prefix;

    const getPrefix = new RegExp(`^<@!?${client.user.id}>( |)$`); 
        if (msg.content.match(getPrefix)) return msg.channel.send(`Current Prefix: \`${client.prefix}\`.`);
        if (msg.content.indexOf(newPrefix) !== 0) return;

    const args = msg.content.slice(newPrefix.length).trim().split(/ +/g);
        
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
