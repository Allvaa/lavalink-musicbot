const util = require("../util");
module.exports = {
    name: "nightcore",
    aliases: ["nc"],
    exec: async (msg) => {
        const { music } = msg.guild;
        if (!music.player || !music.player.playing) return msg.channel.send(util.embed().setDescription("❌ | Currently not playing anything."));
        if (!msg.member.voice.channel)
            return msg.channel.send(util.embed().setDescription("❌ | You must be on a voice channel."));
        if (msg.guild.me.voice.channel && !msg.guild.me.voice.channel.equals(msg.member.voice.channel))
            return msg.channel.send(util.embed().setDescription(`❌ | You must be on ${msg.guild.me.voice.channel} to use this command.`));
      
        music.setNightcore(!music.filters.nightcore);  
        msg.channel.send(util.embed().setDescription(`✅ | ${music.filters.nightcore ? "Enabled" : "Disabled"} **Nightcore**`));

    }
};
