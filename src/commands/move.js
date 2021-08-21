const util = require("../util");

module.exports = {
    name: "move",
    description: "Move track position in queue",
    aliases: ["mv"],
    exec: async (ctx) => {
        const { music, args } = ctx;
        const from = args[0] ? parseInt(args[0], 10) : null;
        const to = args[1] ? parseInt(args[1], 10) : null;
        if (!music.player?.track) return ctx.respond({
            embeds: [util.embed().setDescription("❌ | Currently not playing anything.")]
        });
        if (!music.queue.length) return ctx.respond({
            embeds: [util.embed().setDescription("❌ | Queue is empty.")]
        });

        if (!ctx.member.voice.channel)
            return ctx.respond({
                embeds: [util.embed().setDescription("❌ | You must be on a voice channel.")]
            });
        if (ctx.guild.me.voice.channel && !ctx.guild.me.voice.channel.equals(ctx.member.voice.channel))
            return ctx.respond({
                embeds: [util.embed().setDescription(`❌ | You must be on ${ctx.guild.me.voice.channel} to use this command.`)]
            });

        if (from === null || to === null)
            return ctx.respond({
                embeds: [util.embed().setDescription(`❌ | Missing args. Example usage e.g. \`${ctx.client.prefix}move 2 1\``)]
            });

        if (from === to || (isNaN(from) || from < 1 || from > music.queue.length) || (isNaN(to) || to < 1 || to > music.queue.length))
            return ctx.respond({
                embeds: [util.embed().setDescription("❌ | Number is invalid or exceeds queue length.")]
            });

        const moved = music.queue[from - 1];

        util.moveArrayElement(music.queue, from - 1, to - 1);

        ctx.respond({
            embeds: [util.embed().setDescription(`✅ | Moved **${moved.info.title}** to \`${to}\`.`)]
        });
    }
};
