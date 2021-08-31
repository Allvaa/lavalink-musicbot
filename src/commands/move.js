const util = require("../util");

module.exports = {
    name: "move",
    description: "Move track position in queue",
    aliases: ["mv"],
    options: {
        from: {
            description: "Number of the song to move",
            type: "INTEGER",
            required: true
        },
        to: {
            description: "The new position",
            type: "INTEGER",
            required: true
        }
    },
    exec: async (ctx) => {
        const { music, options: { from, to } } = ctx;
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
