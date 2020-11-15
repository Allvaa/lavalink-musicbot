const util = require("../util");

module.exports = {
    name: "help",
    aliases: ["commands", "?"],
    exec: (msg) => {
        const commands = msg.client.commands
            .filter(c => c.name !== "eval")
            .map(c => `\`${c.name}\``);

        const embed = util.embed()
            .setAuthor("Command List", msg.client.user.displayAvatarURL())
            .setDescription(commands.join(", "))
            .setTimestamp();

        msg.channel.send(embed);
    }
};
