const util = require("../util");

module.exports = {
    name: "previous",
    aliases: ["prev"],
    exec: async (ctx) => {
        const { music } = ctx;
        if (!music.player) return ctx.respond({
            embeds: [util.embed().setDescription("❌ | Currently not playing anything.")]
        });
        if (!music.previous) return ctx.respond({
            embeds: [util.embed().setDescription("❌ | No previous track.")]
        });

        if (!ctx.member.voice.channel)
            return ctx.respond({
                embeds: [util.embed().setDescription("❌ | You must be on a voice channel.")]
            });
        if (ctx.guild.me.voice.channel && !ctx.guild.me.voice.channel.equals(ctx.member.voice.channel))
            return ctx.respond({
                embeds: [util.embed().setDescription(`❌ | You must be on ${ctx.guild.me.voice.channel} to use this command.`)]
            });

        try {
            music.queue.unshift(music.previous);
            await music.skip();
            ctx.react("⏮️").catch(e => e);
        } catch (e) {
            ctx.respond(`An error occured: ${e.message}.`);
        }
    }
};
