const util = require("../util");

const getAttachmentURL = ctx => ctx.attachments.first()?.url;

module.exports = {
    name: "play",
    aliases: ["p"],
    exec: async (ctx) => {
        const { args, music } = ctx;
        if (!ctx.member.voice.channel)
            return ctx.respond(util.embed().setDescription("❌ | You must be on a voice channel."));
        if (ctx.guild.me.voice.channel && !ctx.guild.me.voice.channel.equals(ctx.member.voice.channel))
            return ctx.respond(util.embed().setDescription(`❌ | You must be on ${ctx.guild.me.voice.channel} to use this command.`));

        const missingPerms = util.missingPerms(ctx.guild.me.permissionsIn(ctx.member.voice.channel), ["CONNECT", "SPEAK"]);
        if ((!music.player || !music.player.playing) && missingPerms.length)
            return ctx.respond(util.embed().setDescription(`❌ | I need ${missingPerms.length > 1 ? "these" : "this"} permission${missingPerms.length > 1 ? "s" : ""} on your voice channel: ${missingPerms.map(x => `\`${x}\``).join(", ")}.`));

        if (!music.node || !music.node.connected)
            return ctx.respond(util.embed().setDescription("❌ | Lavalink node not connected."));

        const query = args.join(" ") || getAttachmentURL(ctx.message);
        if (!query) return ctx.respond(util.embed().setDescription("❌ | Missing args."));

        try {
            const { loadType, playlistInfo: { name }, tracks } = await music.load(util.isValidURL(query) ? query : `ytsearch:${query}`);
            if (!tracks.length) return ctx.respond(util.embed().setDescription("❌ | Couldn't find any results."));
            
            if (loadType === "PLAYLIST_LOADED") {
                for (const track of tracks) {
                    track.requester = ctx.author;
                    music.queue.push(track);
                }
                ctx.respond(util.embed().setDescription(`✅ | Loaded \`${tracks.length}\` tracks from **${name}**.`));
            } else {
                const track = tracks[0];
                track.requester = ctx.author;
                music.queue.push(track);
                if (music.player && music.player.playing)
                    ctx.respond(util.embed().setDescription(`✅ | **${track.info.title}** added to the queue.`));
            }
            
            if (!music.player) await music.join(ctx.member.voice.channel);
            if (!music.player.playing) await music.start();

            music.setTextCh(ctx.channel);
        } catch (e) {
            ctx.respond(`An error occured: ${e.message}.`);
        }
    }
};
