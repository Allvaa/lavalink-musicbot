const util = require("../util");
module.exports = {
    name: "8d",
    aliases: ["8D","rotation"],
    exec: async (msg, args) => {

        const { music } = msg.guild;
        if (!music.player || !music.player.playing) return msg.channel.send(util.embed().setDescription("❌ | Currently not playing anything."));
        if (!msg.member.voice.channel)
            return msg.channel.send(util.embed().setDescription("❌ | You must be on a voice channel."));
        if (msg.guild.me.voice.channel && !msg.guild.me.voice.channel.equals(msg.member.voice.channel))
            return msg.channel.send(util.embed().setDescription(`❌ | You must be on ${msg.guild.me.voice.channel} to use this command.`));
      
        music.set8D(!music._8d);  
        msg.channel.send(util.embed().setDescription(` ${music._8d ? "✅ | **enabled**" : "❌ | **disabled**"} 8D`));

    }

};
