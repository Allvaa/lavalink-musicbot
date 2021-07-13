/* eslint-disable linebreak-style */

const util = require("../util");

module.exports = {
    name: "rewind",
    aliases: ["rwd"],
    exec: async (msg, args) => {
        const { music } = msg.guild;
        if (!music.player || !music.player.playing) return msg.channel.send(util.embed().setDescription("❌ | Currently not playing anything."));
        if (!msg.member.voice.channel)
            return msg.channel.send(util.embed().setDescription("❌ | You must be on a voice channel."));

        if (msg.guild.me.voice.channel && !msg.guild.me.voice.channel.equals(msg.member.voice.channel))
            return msg.channel.send(util.embed().setDescription(`❌ | You must be on ${msg.guild.me.voice.channel} to use this command.`));
        if (!music.current.info.isSeekable)
            return msg.channel.send(util.embed().setDescription("❌ | Current track isn't seekable."));

        try {
            const rdnumber = 10;
            const duration = args[0];
            const durationMs = music.player.state.position - duration * 1000;
            if (duration && !isNaN(duration)) {
                if (music.player.state.position - duration * 1000 < music.current.info.length) {
                    music.player.seek(music.player.state.position - duration * 1000);
                    return msg.channel.send(util.embed().setDescription(`Rewinded to ${util.millisToDuration(durationMs)}`));
                } else {
                    return msg.channel.send(util.embed().setDescription("❌ | The duration you provide exceeds the duration of the current track."));                
                }
            } else if (duration && isNaN(duration)) {
                return msg.channel.send(util.embed().setDescription("❌ | You must provide duration to seek. Valid duration e.g. `50`."));
            }

            if (!duration) {
                if (music.player.state.position - rdnumber * 1000 < music.current.info.length) {
                    music.player.seek(music.player.state.position - rdnumber * 1000);
                    msg.react("⏪");
                } else {
                    return msg.channel.send(util.embed().setDescription("❌ | The duration you provide exceeds the duration of the current track."));                
                }
            }
        } catch (e) {
            msg.channel.send(`An error occured: ${e.message}.`);
        }
    }
};
