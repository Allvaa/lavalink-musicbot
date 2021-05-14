const util = require("../util");

module.exports = {
    name: "removedupes",
    aliases: ["rdp"],
    description: "Removes All The Dupes In The Queue.",
    exec: (msg) => {
        const { music } = msg.guild;
        const seen = {};

        if (!music.player || !music.player.playing) return msg.channel.send(util.embed().setDescription("❌|  Currently not playing anything."));
        if (!music.queue.length) return msg.channel.send(util.embed().setDescription("❌ | Queue is empty."));

        if (!msg.member.voice.channel)
            return msg.channel.send(util.embed().setDescription("❌ | You must be on a voice channel."));
        if (msg.guild.me.voice.channel && !msg.guild.me.voice.channel.equals(msg.member.voice.channel))
            return msg.channel.send(util.embed().setDescription(`❌ | You must be on ${msg.guild.me.voice.channel} to use this command.`));
        try {
            for (const song of music.queue) {
                if (seen[song.info.indentifier] === undefined) seen[song.info.indentifier] = song;
            }
            
            music.queue = Object.values(seen);
            
            msg.channel.send(util.embed().setDescription("✅ | Removed all Dupes")).catch(e => e);
        } catch (e) {
            msg.channel.send(`An error occured: ${e.message}.`);
        }
    }
};
