module.exports = {
    name: "message",
    exec: async (client, msg) => {
        if (!msg.guild) return;
        if (msg.author.bot) return;
        if (!msg.content.startsWith(client.prefix)) return;

        const args = msg.content.slice(client.prefix.length).trim().split(/ +/g);
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
