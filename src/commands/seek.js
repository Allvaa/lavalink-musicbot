const util = require("../util");

const durationPattern = /^[0-5]?[0-9](:[0-5][0-9]){1,2}$/;

module.exports = {
    name: "seek",
    description: "Seeks to specified timestamp",
    exec: async (ctx) => {
        const { music, args } = ctx;
        if (!music.player?.track) return ctx.respond({ embeds: [util.embed().setDescription("❌ | Currently not playing anything.")] });
        if (!ctx.member.voice.channel)
            return ctx.respond({ embeds: [util.embed().setDescription("❌ | You must be on a voice channel.")] });
        if (ctx.guild.me.voice.channel && !ctx.guild.me.voice.channel.equals(ctx.member.voice.channel))
            return ctx.respond({ embeds: [util.embed().setDescription(`❌ | You must be on ${ctx.guild.me.voice.channel} to use this command.`)] });

        if (!music.current.info.isSeekable)
            return ctx.respond({ embeds: [util.embed().setDescription("❌ | Current track isn't seekable.")] });

        const duration = args[0];
        if (!duration)
            return ctx.respond({ embeds: [util.embed().setDescription("❌ | You must provide duration to seek. Valid duration e.g. `1:34`.")] });
        if (!durationPattern.test(duration))
            return ctx.respond({ embeds: [util.embed().setDescription("❌ | You provided an invalid duration. Valid duration e.g. `1:34`.")] });

        const durationMs = util.durationToMillis(duration);
        if (durationMs > music.current.info.length)
            return ctx.respond({ embeds: [util.embed().setDescription("❌ | The duration you provide exceeds the duration of the current track.")] });

        try {
            await music.player.seekTo(durationMs);
            ctx.respond({ embeds: [util.embed().setDescription(`✅ | Seeked to ${util.millisToDuration(durationMs)}.`)] });
        } catch (e) {
            ctx.respond(`An error occured: ${e.message}.`);
        }
    }
};
