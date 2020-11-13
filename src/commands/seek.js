const util = require("../util");

const durationPattern = /^[0-5]?[0-9](:[0-5][0-9]+)$/;

module.exports = {
    name: "seek",
    exec: async (msg, args) => {
        const { music } = msg.guild;
        if (!msg.member.voice.channel)
            return msg.channel.send("You must be on a voice channel.");
        if (msg.guild.me.voice.channel && !msg.guild.me.voice.channel.equals(msg.member.voice.channel))
            return msg.channel.send(`You must be on ${msg.guild.me.voice.channel} to use this command.`);

        const duration = args[0];
        if (!durationPattern.test(duration))
            return msg.channel.send("Your inputted duration isn't valid. Valid duration eg. `1:34`.");

        const durationMs = util.durationToMillis(duration);
        try {
            await music.player.seek(durationMs);
        } catch (e) {
            msg.channel.send(`An error occured: ${e.message}`);
        }
    }
};
