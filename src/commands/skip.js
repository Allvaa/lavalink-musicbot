const util = require("../util");

module.exports = {
    name: "skip",
    aliases: ["skipto"],
    exec: async (ctx) => {
        const { music, args } = ctx;
        const skipTo = args[0] ? parseInt(args[0], 10) : null;
        if (!music.player?.track) return ctx.respond(util.embed().setDescription("❌ | Currently not playing anything."));

        if (!ctx.member.voice.channel)
            return ctx.respond(util.embed().setDescription("❌ | You must be on a voice channel."));
        if (ctx.guild.me.voice.channel && !ctx.guild.me.voice.channel.equals(ctx.member.voice.channel))
            return ctx.respond(util.embed().setDescription(`❌ | You must be on ${ctx.guild.me.voice.channel} to use this command.`));

        if (skipTo !== null && (isNaN(skipTo) || skipTo < 1 || skipTo > music.queue.length))
            return ctx.respond(util.embed().setDescription("❌ | Invalid number to skip."));

        try {
            await music.skip(skipTo);
            ctx.react("⏭️").catch(e => e);
        } catch (e) {
            ctx.respond(`An error occured: ${e.message}.`);
        }
    }
};
