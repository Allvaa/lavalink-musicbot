const util = require("../util");

module.exports = {
    name: "search",
    exec: async (ctx) => {
        const { music, args } = ctx;
        if (!ctx.member.voice.channel)
            return ctx.respond(util.embed().setDescription("❌ | You must be on a voice channel."));
        if (ctx.guild.me.voice.channel && !ctx.guild.me.voice.channel.equals(ctx.member.voice.channel))
            return ctx.respond(util.embed().setDescription(`❌ | You must be on ${ctx.guild.me.voice.channel} to use this command.`));

        const missingPerms = util.missingPerms(ctx.guild.me.permissionsIn(ctx.member.voice.channel), ["CONNECT", "SPEAK"]);
        if ((!music.player || !music.player.playing) && missingPerms.length)
            return ctx.respond(util.embed().setDescription(`❌ | I need ${missingPerms.length > 1 ? "these" : "this"} permission${missingPerms.length > 1 ? "s" : ""} on your voice channel: ${missingPerms.map(x => `\`${x}\``).join(", ")}.`));

        if (!music.node || !music.node.connected)
            return ctx.respond(util.embed().setDescription("❌ | Lavalink node not connected."));

        const query = args.join(" ");
        if (!query) return ctx.respond(util.embed().setDescription("❌ | Missing args."));

        try {
            let { tracks } = await music.load(`ytsearch:${query}`);
            if (!tracks.length) return ctx.respond(util.embed().setDescription("❌ | Couldn't find any results."));

            tracks = tracks.slice(0, 10);

            const resultMessage = await ctx.respond(util.embed()
                .setAuthor("Search Result", ctx.client.user.displayAvatarURL())
                .setDescription(tracks.map((x, i) => `\`${++i}.\` **${x.info.title}**`))
                .setFooter("Select from 1 to 10 or type \"cancel\" to cancel the command."));

            const collector = await awaitMessages();
            if (!collector) return resultMessage.edit(util.embed().setDescription("❌ | Time is up!"));
            const response = collector.first();

            if (response.deletable) response.delete();

            if (/^cancel$/i.exec(response.content))
                return resultMessage.edit(util.embed().setDescription("✅ | Cancelled."));

            const track = tracks[response.content - 1];
            track.requester = ctx.author;
            music.queue.push(track);

            if (music.player && music.player.playing) {
                resultMessage.edit(util.embed().setDescription(`✅ | **${track.info.title}** added to the queue.`));
            } else {
                resultMessage.delete();
            }

            if (!music.player) await music.join(ctx.member.voice.channel);
            if (!music.player.playing) await music.start();

            music.setTextCh(ctx.channel);
        } catch (e) {
            ctx.respond(`An error occured: ${e.message}.`);
        }

        async function awaitMessages() {
            try {
                const filter = (m) => m.author.equals(ctx.author) && (/^cancel$/i.exec(m.content) || (!isNaN(parseInt(m.content, 10)) && (m.content >= 1 && m.content <= 10))),

                const collector = await ctx.channel.awaitMessages(
                    {   
                        filter,
                        time: 10000,
                        max: 1,
                        errors: ["time"]
                    }
                );
                return collector;
            } catch {
                return null;
            }
        }
    }
};
