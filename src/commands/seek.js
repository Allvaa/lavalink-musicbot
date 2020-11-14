const util = require("../util");

const durationPattern = /^[0-5]?[0-9](:[0-5][0-9]{2})$/;

module.exports = {
    name: "seek",
    exec: async (msg, args) => {
        const { music } = msg.guild;
        if (!music.player) return msg.channel.send("Currently not playing anything.");
        if (!msg.member.voice.channel)
            return msg.channel.send("You must be on a voice channel.");
        if (msg.guild.me.voice.channel && !msg.guild.me.voice.channel.equals(msg.member.voice.channel))
            return msg.channel.send(`You must be on ${msg.guild.me.voice.channel} to use this command.`);

        const duration = args[0];
        if (!durationPattern.test(duration))
            return msg.channel.send("You provided an invalid duration. Valid duration e.g. `1:34`.");

        const durationMs = util.durationToMillis(duration);
        if (durationMs > music.current.info.length)
            return msg.channel.send("The duration you provide exceeds the duration of the current track.");

        try {
            await music.player.seek(durationMs);
            msg.channel.send(`Seeked to ${util.millisToDuration(durationMs)}.`);
        } catch (e) {
            msg.channel.send(`An error occured: ${e.message}`);
        }
    }
};
clearTimeout();