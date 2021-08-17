const util = require("../util");
module.exports = {
    name: "bassboost",
    description: "Set bassboost for player",
    aliases: ["bb"],
    exec: async (ctx) => {
        const { music, args } = ctx;
        if (!music.player?.track) return ctx.respond({
            embeds: [util.embed().setDescription("❌ | Currently not playing anything.")]
        });
        if (!ctx.member.voice.channel)
            return ctx.respond({
                embeds: [util.embed().setDescription("❌ | You must be on a voice channel.")]
            });
        if (ctx.guild.me.voice.channel && !ctx.guild.me.voice.channel.equals(ctx.member.voice.channel))
            return ctx.respond({
                embeds: [util.embed().setDescription(`❌ | You must be on ${ctx.guild.me.voice.channel} to use this command.`)]
            });

        if (!args[0]) {
            ctx.respond(util.embed().setDescription(`${music.filters.bassboost ? `✅ | BassBoost **${music.bassboost * 100}%**` : "❌ | BassBoost **off**"}`));
        } else if (args[0].toLowerCase() == "off") {
            music.setBassboost(0);
            ctx.react("✅").catch(e => e);
        } else {
            if (isNaN(args[0])) return ctx.respond(util.embed().setDescription("❌ | Specify a number"));
            if (args[0] < 1 || args[0] > 100) return ctx.respond(util.embed().setDescription("❌ | You can only set the bassboost from 1 to 100."));
            music.setBassboost(parseInt(args[0]));
            ctx.respond(util.embed().setDescription(`✅ | BassBoost set to **${music.bassboost * 100}%**`));
        }
    }
};
