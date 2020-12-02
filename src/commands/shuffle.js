const util = require("../util");

module.exports = {
    name: "shuffle",
    aliases: ["sf"],
    exec: async (msg) => {
        const { music } = msg.guild;
        if (!music.player || !music.player.playing) return msg.channel.send(util.embed().setDescription("❌ | Currently not playing anything."));
        if (!music.queue.length) return msg.channel.send(util.embed().setDescription("❌ | Queue is empty."));
        if (!msg.member.voice.channel)
            return msg.channel.send(util.embed().setDescription("❌ | You must be on a voice channel."));
        if (msg.guild.me.voice.channel && !msg.guild.me.voice.channel.equals(msg.member.voice.channel))
            return msg.channel.send(util.embed().setDescription(`❌ | You must be on ${msg.guild.me.voice.channel} to use this command.`));

        music.queue = util.shuffleArray(music.queue);

        msg.channel.send(util.embed().setDescription(`✅ | Queue shuffled! Type \`${msg.client.prefix}queue\` to see changes.`));
    }
};
