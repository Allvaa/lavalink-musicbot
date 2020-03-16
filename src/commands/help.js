const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "help",
    run: async (client, message, args) => {
        const embed = new MessageEmbed()
        .setAuthor("Available Commands", client.user.displayAvatarURL({format: "png"}))
        .setDescription("`loop`, `nowplaying`, `pause`, `play`, `queue`, `resume`, `skip`, `stop`, `volume`")
        .setFooter("github:AlvvxL/lavalink-musicbot")
        .setColor("#7289DA");
        message.channel.send(embed);
    }
};