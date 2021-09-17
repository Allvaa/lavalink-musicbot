const CommandContext = require("../structures/CommandContext");
const Util = require("../util");

module.exports = {
    name: "interactionCreate",
    exec: async (client, interaction) => {
        if (!interaction.isCommand()) return;
        const command = client.commands.get(interaction.commandName);

        if (command) {
            const options = {};
            for (const name in command.options ?? {}) {
                options[name] = Util.getOptionValue(interaction.options.data.find(x => x.name === name));
            }
            try {
                await interaction.deferReply();
                await command.exec(new CommandContext(command, interaction, options));
            } catch (e) {
                console.error(e);
            }
        }
    }
};
