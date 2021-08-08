const util = require("../util");

const modes = ["none", "track", "queue"];
const aliases = {
    single: "track",
    track: "track",
    song: "track",
    this: "track",
    current: "track",
    all: "queue",
    every: "queue",
    queue: "queue",
    off: "none",
    none: "none",
    nothing: "none"
};

module.exports = {
    name: "loop",
    aliases: ["repeat"],
    exec: (ctx) => {
        const { music, args } = ctx;
        if (!music.player) return ctx.respond(util.embed().setDescription("❌ | Currently not playing anything."));
        if (args[0]) {
            if (!ctx.member.voice.channel)
                return ctx.respond(util.embed().setDescription("❌ | You must be on a voice channel."));
            if (ctx.guild.me.voice.channel && !ctx.guild.me.voice.channel.equals(ctx.member.voice.channel))
                return ctx.respond(util.embed().setDescription(`❌ | You must be on ${ctx.guild.me.voice.channel} to use this command.`));

            const loopMode = aliases[args[0].toLowerCase()];
            if (loopMode && modes.includes(loopMode)) {
                music.loop = modes.indexOf(loopMode);
                ctx.respond(util.embed().setDescription(music.loop === 0 ? "✅ | Loop disabled." : `✅ | Set loop to ${modes[music.loop]}.`));
            } else {
                ctx.respond(
                    util.embed()
                        .setDescription("❌ | Invalid loop mode. Try single/all/off.")
                );
            }
        } else {
            ctx.respond(util.embed().setDescription(`✅ | Current loop mode: ${modes[music.loop]}`));
        }
    }
};
