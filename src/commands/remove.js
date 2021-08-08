const util = require("../util");

module.exports = {
    name: "remove",
    aliases: ["rm"],
    exec: async (ctx) => {
        const { music, args } = ctx;
        if (!music.player || !music.player.playing) return ctx.respond(util.embed().setDescription("❌|  Currently not playing anything."));
        if (!music.queue.length) return ctx.respond(util.embed().setDescription("❌ | Queue is empty."));

        if (!ctx.member.voice.channel)
            return ctx.respond(util.embed().setDescription("❌ | You must be on a voice channel."));
        if (ctx.guild.me.voice.channel && !ctx.guild.me.voice.channel.equals(ctx.member.voice.channel))
            return ctx.respond(util.embed().setDescription(`❌ | You must be on ${ctx.guild.me.voice.channel} to use this command.`));

        if (!args[0]) return ctx.respond(util.embed().setDescription("❌ | Missing args."));

        let iToRemove = parseInt(args[0], 10);
        if (isNaN(iToRemove) || iToRemove < 1 || iToRemove > music.queue.length)
            return ctx.respond(util.embed().setDescription("❌ | Invalid number to remove."));

        const removed = music.queue.splice(--iToRemove, 1)[0];
        ctx.respond(util.embed().setDescription(`✅ | Removed **${removed.info.title}** from the queue.`));
    }
};
