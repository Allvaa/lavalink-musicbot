const util = require("../util");

module.exports = {
    name: "removedupes",
    aliases: ["rdp"],
    description: "Removes duplicated tracks from the queue.",
    exec: (ctx) => {
        const { music } = ctx;
        const seen = {};

        if (!music.player) return ctx.respond(util.embed().setDescription("❌|  Currently not playing anything."));
        if (!music.queue.length) return ctx.respond(util.embed().setDescription("❌ | Queue is empty."));

        if (!ctx.member.voice.channel)
            return ctx.respond(util.embed().setDescription("❌ | You must be on a voice channel."));
        if (ctx.guild.me.voice.channel && !ctx.guild.me.voice.channel.equals(ctx.member.voice.channel))
            return ctx.respond(util.embed().setDescription(`❌ | You must be on ${ctx.guild.me.voice.channel} to use this command.`));
            
        for (const song of music.queue) {
            if (seen[song.info.indentifier] === undefined) seen[song.info.indentifier] = song;
        }
        music.queue = Object.values(seen);
    
        ctx.respond(util.embed().setDescription("✅ | Removed all Dupes")).catch(e => e);
    }
};
