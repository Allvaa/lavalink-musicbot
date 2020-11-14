const util = require("../util");

module.exports = {
    name: "queue",
    aliases: ["q"],
    exec: (msg) => {
        const { music } = msg.guild;
        if (!music.player || !music.player.playing) return msg.channel.send(util.embed().setDescription("❌ | Currently not playing anything."));
        if (!music.queue.length) return msg.channel.send(util.embed().setDescription("❌ | Queue is empty."));

        const queue = music.queue.map((t, i) => `\`${++i}.\` **${t.info.title}** ${t.requester}`);
        const embed = util.embed()
            .setAuthor(`${msg.guild.name} music queue.`, msg.guild.iconURL())
            .setDescription(queue.join("\n"));

        msg.channel.send(embed);
    }
};
