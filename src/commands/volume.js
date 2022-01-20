const util = require("../util");

module.exports = {
    name: "volume",
    description: "Check and set volume",
    aliases: ["vol"],
    options: {
        newvolume: {
            description: "New volume to set",
            type: "INTEGER",
        }
    },
    exec: async (ctx) => {
        const { music, options: { newvolume: newVolume } } = ctx;
        if (!music.player?.track) return ctx.respond({ embeds: [util.embed().setDescription("❌ | Currently not playing anything.")] });
        try {
            if (isNaN(newVolume)) {
                ctx.respond({ embeds: [util.embed().setDescription(`🔉 | Current volume \`${music.volume}\`.`)] });
            } else {
                if (!ctx.member.voice.channel)
                    return ctx.respond({ embeds: [util.embed().setDescription("❌ | You must be on a voice channel.")] });
                if (ctx.guild.me.voice.channel && !ctx.guild.me.voice.channel.equals(ctx.member.voice.channel))
                    return ctx.respond({ embeds: [util.embed().setDescription(`❌ | You must be on ${ctx.guild.me.voice.channel} to use this command.`)] });

                if (newVolume < 0 || newVolume > 150)
                    return ctx.respond({ embeds: [util.embed().setDescription("❌ | You can only set the volume from 0 to 150.")] });

                await music.setVolume(newVolume);
                ctx.respond({ embeds: [util.embed().setDescription(`🔉 | Volume set to \`${music.volume}\`.`)] });
            }
        } catch (e) {
            ctx.respond(`An error occured: ${e.message}.`);
        }
    }
};
