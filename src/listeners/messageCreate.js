const CommandContext = require("../structures/CommandContext");
const Util = require("../util");

module.exports = {
    name: "messageCreate",
    exec: async (client, msg) => {
        if (!msg.guild) return;
        if (msg.author.bot) return;     

        const prefix = msg.content.toLowerCase().startsWith(client.prefix) ? client.prefix : `<@!${client.user.id}>`;
        if (!msg.content.toLowerCase().startsWith(prefix)) return;
        
        let [commandName, ...args] = msg.content.slice(prefix.length).trim().split(/ +/g);
        args = args.join(" ").trim().split(/; +/g);
        const command = client.commands.get(commandName) || client.commands.find(c => c.aliases && c.aliases.includes(commandName));

        if (command) {
            const options = {};
            for (const [name, { type }] of Object.entries(command.options ?? {})) {
                options[name] = Util.parseArg(msg.guild, type, args.shift());
            }
            try {
                await command.exec(new CommandContext(command, msg, options));
            } catch (e) {
                console.error(e);
            }
        }
    }
};
