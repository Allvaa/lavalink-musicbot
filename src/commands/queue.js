const util = require("../util");

const emojis = ["◀", "⛔", "▶"];

module.exports = {
    name: "queue",
    aliases: ["q"],
    exec: async (msg) => {
        const { music } = msg.guild;
        if (!music.player || !music.player.playing) return msg.channel.send(util.embed().setDescription("❌ | Currently not playing anything."));
        if (!music.queue.length) return msg.channel.send(util.embed().setDescription("❌ | Queue is empty."));

        const queue = music.queue.map((t, i) => `\`${++i}.\` **${t.info.title}** ${t.requester}`);
        const chunked = util.chunk(queue, 10);
        let currPage = 0;
        
        const embed = util.embed()
            .setAuthor(`${msg.guild.name} Music Queue`, msg.guild.iconURL({ dynamic: true }))
            .setDescription(chunked[0].join("\n"))
            .setFooter(`Page 1 of ${chunked.length}.`);
                
        try {
            const queueMsg = await msg.channel.send(embed);

            if (chunked.length > 1) {
                for (const emoji of emojis) {
                    await queueMsg.react(emoji);
                }
                awaitReactions(queueMsg);
            }
        } catch (e) {
            msg.channel.send(`An error occured: ${e.message}.`);
        }

        function awaitReactions(queueMsg) {
            const collector = queueMsg.createReactionCollector((reaction, user) => {
                return emojis.includes(reaction.emoji.name) && user.id === msg.author.id;
            }, {
                max: 1,
                time: 30000
            });

            collector
                .on("collect", (reaction) => {
                    reaction.users.remove(msg.author);
    
                    const emoji = reaction.emoji.name;
                    if (emoji === emojis[0]) currPage--;
                    if (emoji === emojis[1]) return collector.stop();
                    if (emoji === emojis[2]) currPage++;
                    currPage = ((currPage % chunked.length) + chunked.length) % chunked.length;

                    const embed = queueMsg.embeds[0]
                        .setDescription(chunked[currPage].join("\n"))
                        .setFooter(`Page ${currPage + 1} of ${chunked.length}.`);

                    queueMsg.edit(embed);

                    awaitReactions(queueMsg);
                })
                .on("end", (_, reason) => {
                    if (["time", "user"].includes(reason)) queueMsg.reactions.removeAll();
                });
        }
    }
};
