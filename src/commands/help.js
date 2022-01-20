const util = require("../util");

const unlisted = ["eval"];

module.exports = {
    name: "help",
    description: "List of commands",
    aliases: ["commands", "?"],
    exec: (ctx) => {
        const commands = ctx.client.commands
            .filter(c => !unlisted.includes(c.name))
            .map(c => `\`${c.name}\``);

        const embed = util.embed()
            .setAuthor("Command List", ctx.client.user.displayAvatarURL())
            .setDescription(commands.join(", "))
            .setTimestamp();

        ctx.respond({ embeds: [embed] });
    }
};
