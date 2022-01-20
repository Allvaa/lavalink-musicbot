const util = require("../util");

module.exports = {
    name: "nowplaying",
    description: "Check what music is playing",
    aliases: ["np", "nowplay"],
    exec: (ctx) => {
        const { music } = ctx;
        if (!music.player?.track) return ctx.respond({ embeds: [util.embed().setDescription("❌ | Currently not playing anything.")] });
        const progress = util.progress(music.state.position, music.current.info.length);
        ctx.respond({
            embeds: [util.embed().setDescription(`🎶 | Now playing ${music.current.info.isStream ? "[**◉ LIVE**]" : ""}\n**${music.current.info.title}**.${music.current.info.isStream ? "" : `\n\n${util.millisToDuration(music.state.position)} ${progress.bar} ${util.millisToDuration(music.current.info.length)}`}`)]
        });
    }
};
