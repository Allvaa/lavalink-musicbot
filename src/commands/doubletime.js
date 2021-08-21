const util = require("../util");
module.exports = {
    name: "doubletime",
    description: "DT filter",
    aliases: ["dt"],
    exec: async (ctx) => {
        const { music } = ctx;
        if (!music.player?.track) return ctx.respond({ embded: [util.embed().setDescription("❌ | Currently not playing anything.")]});
        if (!ctx.member.voice.channel)
            return ctx.respond({
                embeds: [util.embed().setDescription("❌ | You must be on a voice channel.")]
            });
        if (ctx.guild.me.voice.channel && !ctx.guild.me.voice.channel.equals(ctx.member.voice.channel))
            return ctx.respond({
                embeds: [util.embed().setDescription(`❌ | You must be on ${ctx.guild.me.voice.channel} to use this command.`)]
            });
      
        music.setDoubleTime(!music.filters.doubleTime);  
        ctx.respond({
            embeds: [util.embed().setDescription(`✅ | ${music.filters.doubleTime ? "Enabled" : "Disabled"} **Double Time**`)]
        });
    }
};
