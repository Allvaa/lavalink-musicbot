const { MessageButton, MessageActionRow } = require("discord.js");
const util = require("../util");

module.exports = {
    name: "queue",
    aliases: ["q"],
    exec: async (ctx) => {
        const { music } = ctx;
        if (!music.player?.track) return ctx.respond({ embeds: [util.embed().setDescription("❌ | Currently not playing anything.")] });
        if (!music.queue.length) return ctx.respond({ embeds: [util.embed().setDescription("❌ | Queue is empty.")] });

        const queue = music.queue.map((t, i) => `\`${++i}.\` **${t.info.title}** ${t.requester}`);
        const chunked = util.chunk(queue, 10).map(x => x.join("\n"));

        const embed = util.embed()
            .setAuthor(`${ctx.guild.name} Music Queue`, ctx.guild.iconURL({ dynamic: true }))
            .setDescription(chunked[0])
            .setFooter(`Page 1 of ${chunked.length}.`);

        try {
            const queueMsg = await ctx.respond({
                embeds: [embed],
                components:
                    chunked.length > 1
                        ? [
                            new MessageActionRow()
                                .addComponents(
                                    ...util.paginationEmojis.map((x, i) =>
                                        new MessageButton()
                                            .setCustomId(x)
                                            .setEmoji(x)
                                            .setStyle(i === 1 ? "DANGER" : "PRIMARY")
                                    )
                                )
                        ]
                        : []
            });
            if (chunked.length > 1) util.pagination(queueMsg, ctx.author, chunked);
        } catch (e) {
            ctx.respond(`An error occured: ${e.message}.`);
        }
    }
};
