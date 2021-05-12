const util = require("../util");

module.exports = {
    name: "speed",
    exec: async (msg,args) => {
        const { music } = msg.guild;
        const { player } = msg.guild.music;
        if (!music.player) return msg.channel.send(util.embed().setDescription("❌ | Currently not playing anything."));
        if (!msg.member.voice.channel)
            return msg.channel.send(util.embed().setDescription("❌ | You must be on a voice channel."));
        if (msg.guild.me.voice.channel && !msg.guild.me.voice.channel.equals(msg.member.voice.channel))
            return msg.channel.send(util.embed().setDescription(`❌ | You must be on ${msg.guild.me.voice.channel} to use this command.`));
      
        try {
            if (args.length !== 0 && args[0].toLowerCase() == "reset" || args.length !== 0 && args[0].toLowerCase() == "off") {
                player.node.send({
                    guildId: msg.guild.id || msg.guild,
                    op: "filters",
                    timescale: {speed: 1.0}
                });
                const embed =  util.embed()
                    .setDescription("✅ | Reseted **speed**");
                return msg.channel.send(embed);
            }
            if (isNaN(args[0])) return msg.channel.send(util.embed().setDescription("❌ |  Specify a number"));
       
          if (args[0] < 0.1) return msg.channel.send(util.embed().setDescription("❌ |  Speed must be greater than 0"));

          if (args[0] > 10) return msg.channel.send(util.embed().setDescription("❌ |  Speed must be less than 10"));
          
          player.node.send({
            guildId: msg.guild.id || msg.guild,
            op: "filters",
            timescale: { speed : args[0] },
          });
          msg.channel.send(util.embed().setDescription(`✅ | Set Speed To **${args[0]}**x`));
        } catch (e) {
          msg.channel.send(`An error occured: ${e.message}.`);
        }
    }
};
