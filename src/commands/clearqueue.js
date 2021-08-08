const util = require("../util");

module.exports = {
    name: "clearqueue",
    description:"Clean up the queue.",
    aliases: ["clr", "clear"],
    exec: (ctx) => {
        const { music } = ctx;
        if (!music.player) return ctx.respond(util.embed().setDescription("❌|  Currently not playing anything."));
        if (!music.queue.length) return ctx.respond(util.embed().setDescription("❌ | Queue is empty."));

        if (!ctx.member.voice.channel)
            return ctx.respond(util.embed().setDescription("❌ | You must be on a voice channel."));
        if (ctx.guild.me.voice.channel && !ctx.guild.me.voice.channel.equals(ctx.member.voice.channel))
            return ctx.respond(util.embed().setDescription(`❌ | You must be on ${ctx.guild.me.voice.channel} to use this command.`));
            
        music.queue.splice(0, 1);
        ctx.respond(util.embed().setDescription("✅ | Cleared the queue.")).catch(e => e);
    }
};
