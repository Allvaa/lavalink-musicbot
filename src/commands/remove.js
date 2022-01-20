const util = require("../util");

module.exports = {
    name: "remove",
    description: "Remove track from queue",
    aliases: ["rm"],
    options: {
        toremove: {
            description: "Number of the song to remove",
            type: "INTEGER",
            required: true
        }
    },
    exec: async (ctx) => {
        const { music, options: { toremove: toRemove } } = ctx;
        if (!music.player?.track) return ctx.respond({ embeds: [util.embed().setDescription("❌ | Currently not playing anything.")] });
        if (!music.queue.length) return ctx.respond({ embeds: [util.embed().setDescription("❌ | Queue is empty.")] });

        if (!ctx.member.voice.channel)
            return ctx.respond({ embeds: [util.embed().setDescription("❌ | You must be on a voice channel.")] });
        if (ctx.guild.me.voice.channel && !ctx.guild.me.voice.channel.equals(ctx.member.voice.channel))
            return ctx.respond({ embeds: [util.embed().setDescription(`❌ | You must be on ${ctx.guild.me.voice.channel} to use this command.`)] });

        if (!toRemove) return ctx.respond({ embeds: [util.embed().setDescription("❌ | Missing args.")] });

        let iToRemove = parseInt(toRemove, 10);
        if (isNaN(iToRemove) || iToRemove < 1 || iToRemove > music.queue.length)
            return ctx.respond({ embeds: [util.embed().setDescription("❌ | Invalid number to remove.")] });

        const removed = music.queue.splice(--iToRemove, 1)[0];
        ctx.respond({ embeds: [util.embed().setDescription(`✅ | Removed **${removed.info.title}** from the queue.`)] });
    }
};
