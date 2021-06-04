const util = require("../util");
module.exports = {
    name: "bassboost",
    description: "Set bassboost for player",
    aliases: ["bb"],
    exec: async(msg, args) => {
        const { music } = msg.guild;
        if (!music.player || !music.player.playing) return msg.channel.send(util.embed().setDescription("❌ | Currently not playing anything."));
        if (!msg.member.voice.channel)
            return msg.channel.send(util.embed().setDescription("❌ | You must be on a voice channel."));
        if (msg.guild.me.voice.channel && !msg.guild.me.voice.channel.equals(msg.member.voice.channel))
            return msg.channel.send(util.embed().setDescription(`❌ | You must be on ${msg.guild.me.voice.channel} to use this command.`));

        if (!args[0]) {
            msg.channel.send(util.embed().setDescription(`${music.filters.bassboost ? `✅ | BassBoost **${music.bassboost * 100}%**` : "❌ | BassBoost **off**"}`));
        } else if (args[0].toLowerCase() == "off") {
            music.setBassboost(0);
            msg.react("✅").catch(e => e);
        } else {
            if (isNaN(args[0])) return msg.channel.send(util.embed().setDescription("❌ | Specify a number"));
            if (args[0] < 1 || args[0] > 100) return msg.channel.send(util.embed().setDescription("❌ | You can only set the bassboost from 1 to 100."));
            music.setBassboost(parseInt(args[0]));
            msg.channel.send(util.embed().setDescription(`✅ | BassBoost set to **${music.bassboost * 100}%**`));
        }
    }
};
