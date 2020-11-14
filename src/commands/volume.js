const util = require("../util");

module.exports = {
    name: "volume",
    aliases: ["vol"],
    exec: async (msg, args) => {
        const { music } = msg.guild;
        const newVolume = args[0];
        if (!music.player || !music.player.playing) return msg.channel.send(util.embed().setDescription("❌ | Currently not playing anything."));
        try {
            if (!newVolume || isNaN(newVolume)) {
                msg.channel.send(util.embed().setDescription(`🔉 | Current volume \`${music.volume}\`.`));
            } else {
                if (!msg.member.voice.channel)
                    return msg.channel.send(util.embed().setDescription("❌ | You must be on a voice channel."));
                if (msg.guild.me.voice.channel && !msg.guild.me.voice.channel.equals(msg.member.voice.channel))
                    return msg.channel.send(util.embed().setDescription(`❌ | You must be on ${msg.guild.me.voice.channel} to use this command.`));

                await music.setVolume(newVolume);
                msg.channel.send(util.embed().setDescription(`🔉 | Volume set to \`${music.volume}\`.`));
            }
        } catch (e) {
            msg.channel.send(`An error occured: ${e.message}.`);
        }
    }
};
