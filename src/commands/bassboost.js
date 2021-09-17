const util = require("../util");
module.exports = {
    name: "bassboost",
    description: "Set bassboost for player",
    aliases: ["bb"],
    options: {
        value: {
            description: "Basboost value; 0 to disable",
            type: "INTEGER",
        }
    },
    exec: async (ctx) => {
        const { music, options } = ctx;
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

        if (!options.value) {
            ctx.respond(util.embed().setDescription(`${music.filters.bassboost ? `✅ | BassBoost **${music.bassboost * 100}%**` : "❌ | BassBoost **off**"}`));
        } else {
            if (isNaN(options.value)) return ctx.respond(util.embed().setDescription("❌ | Specify a number"));
            if (options.value < 1 || options.value > 100) return ctx.respond(util.embed().setDescription("❌ | You can only set the bassboost from 1 to 100."));
            music.setBassboost(parseInt(options.value));
            ctx.respond(util.embed().setDescription(`✅ | BassBoost set to **${ music.bassboost ? "off" : `${music.bassboost * 100}%` }**`));
        }
    }
};
