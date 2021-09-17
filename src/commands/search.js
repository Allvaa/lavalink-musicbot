const { MessageActionRow, MessageSelectMenu } = require("discord.js");
const util = require("../util");

const emojiNumbers = ["1️⃣","2️⃣","3️⃣","4️⃣","5️⃣","6️⃣","7️⃣","8️⃣","9️⃣","🔟"];

module.exports = {
    name: "search",
    description: "Search song to play",
    options: {
        query: {
            description: "Song title",
            type: "STRING",
            required: true
        }
    },
    exec: async (ctx) => {
        const { music, options: { query } } = ctx;
        if (!ctx.member.voice.channel)
            return ctx.respond({ embeds: [util.embed().setDescription("❌ | You must be on a voice channel.")] });
        if (ctx.guild.me.voice.channel && !ctx.guild.me.voice.channel.equals(ctx.member.voice.channel))
            return ctx.respond({ embeds: [util.embed().setDescription(`❌ | You must be on ${ctx.guild.me.voice.channel} to use this command.`)] });

        const missingPerms = util.missingPerms(ctx.guild.me.permissionsIn(ctx.member.voice.channel), ["CONNECT", "SPEAK"]);
        if ((!music.player || !music.player.playing) && missingPerms.length)
            return ctx.respond({ embeds: [util.embed().setDescription(`❌ | I need ${missingPerms.length > 1 ? "these" : "this"} permission${missingPerms.length > 1 ? "s" : ""} on your voice channel: ${missingPerms.map(x => `\`${x}\``).join(", ")}.`)] });

        if (music.node?.state !== 1)
            return ctx.respond({ embeds: [util.embed().setDescription("❌ | Lavalink node is not connected yet.")] });

        if (!query) return ctx.respond({ embeds: [util.embed().setDescription("❌ | Missing args.")] });

        try {
            let { tracks } = await music.load(`ytsearch:${query}`);
            if (!tracks.length) return ctx.respond({ embeds: [util.embed().setDescription("❌ | Couldn't find any results.")] });

            tracks = tracks.slice(0, 10);

            const resultMessage = await ctx.respond({
                embeds: [util.embed()
                    .setAuthor("Song Selection", ctx.client.user.displayAvatarURL())
                    .setDescription("Pick one of the search results that you would like to add to the queue")
                    .setFooter("You can select \"cancel\" to cancel the command.")
                ],
                components: [
                    new MessageActionRow()
                        .addComponents(
                            new MessageSelectMenu()
                                .setCustomId("selected")
                                .setPlaceholder("Nothing selected")
                                .addOptions([
                                    ...tracks
                                        .map((x, i) => (
                                            {
                                                label: x.info.title,
                                                description: x.info.author,
                                                value: i.toString(),
                                                emoji: emojiNumbers[i]
                                            }
                                        )),
                                    ...[
                                        {
                                            label: "Cancel",
                                            description: "Cancel selection",
                                            value: "10",
                                            emoji: "❌"
                                        }
                                    ]
                                ])
                        )
                ]
            });

            const selected = await util.awaitSelection(resultMessage, interaction => interaction.user.equals(ctx.author));
            if (!selected) return resultMessage.edit({ embeds: [util.embed().setDescription("❌ | Time is up!")], components: [] });
            await selected.deferUpdate();

            if (selected.values[0] === "10")
                return selected.editReply({ embeds: [util.embed().setDescription("✅ | Cancelled.")], components: [] });

            const track = tracks[selected.values[0]];
            track.requester = ctx.author;
            music.queue.push(track);

            if (music.player?.track) {
                selected.editReply({ embeds: [util.embed().setDescription(`✅ | **${track.info.title}** added to the queue.`)], components: [] });
            } else {
                selected.deleteReply();
            }

            if (!music.player) await music.join(ctx.member.voice.channel);
            if (!music.player.playing) await music.start();

            music.setTextCh(ctx.channel);
        } catch (e) {
            ctx.respond(`An error occured: ${e.message}.`);
        }
    }
};
