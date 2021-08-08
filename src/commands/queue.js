const util = require("../util");

module.exports = {
    name: "queue",
    aliases: ["q"],
    exec: async (ctx) => {
        const { music } = ctx;
        if (!music.player || !music.player.playing) return ctx.respond(util.embed().setDescription("❌ | Currently not playing anything."));
        if (!music.queue.length) return ctx.respond(util.embed().setDescription("❌ | Queue is empty."));

        const queue = music.queue.map((t, i) => `\`${++i}.\` **${t.info.title}** ${t.requester}`);
        const chunked = util.chunk(queue, 10).map(x => x.join("\n"));

        const embed = util.embed()
            .setAuthor(`${ctx.guild.name} Music Queue`, ctx.guild.iconURL({ dynamic: true }))
            .setDescription(chunked[0])
            .setFooter(`Page 1 of ${chunked.length}.`);

        try {
            const queuectx = await ctx.respond(embed);
            if (chunked.length > 1) await util.pagination(queuectx, ctx.author, chunked);
        } catch (e) {
            ctx.respond(`An error occured: ${e.message}.`);
        }
    }
};
