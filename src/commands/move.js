const util = require("../util");

module.exports = {
    name: "move",
    aliases: ["mv"],
    exec: async (msg, args) => {
        const { music } = msg.guild;
        const from = args[0] ? parseInt(args[0], 10) : null;
        const to = args[1] ? parseInt(args[1], 10) : null;
        if (!music.player || !music.player.playing) return msg.channel.send(util.embed().setDescription("❌ | Currently not playing anything."));
        if (!music.queue.length) return msg.channel.send(util.embed().setDescription("❌ | Queue is empty."));

        if (!msg.member.voice.channel)
            return msg.channel.send(util.embed().setDescription("❌ | You must be on a voice channel."));
        if (msg.guild.me.voice.channel && !msg.guild.me.voice.channel.equals(msg.member.voice.channel))
            return msg.channel.send(util.embed().setDescription(`❌ | You must be on ${msg.guild.me.voice.channel} to use this command.`));

        if (from === null || to === null)
            return msg.channel.send(util.embed().setDescription(`❌ | Missing args. Example usage e.g. \`${msg.client.prefix}move 2 1\``));

        if (from === to || (isNaN(from) || from < 1 || from > music.queue.length) || (isNaN(to) || to < 1 || to > music.queue.length))
            return msg.channel.send(util.embed().setDescription("❌ | Number is invalid or exceeds queue length."));

        const moved = music.queue[from - 1];

        util.moveArrayElement(music.queue, from - 1, to - 1);

        msg.channel.send(util.embed().setDescription(`✅ | Moved **${moved.info.title}** to \`${to}\`.`));
    }
};
