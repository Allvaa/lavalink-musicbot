const fetch = require("node-fetch");
const util = require("../util");

const getLyrics = async (query) => {
    const body = await (await fetch(`https://some-random-api.ml/lyrics?title=${encodeURIComponent(query)}`)).json();
    if (body.error) throw Error(body.error);
    return body;
};

module.exports = {
    name: "lyrics",
    aliases: ["ly"],
    exec: async (ctx, args) => {
        let query;
        if (args.length) {
            query = args.join(" ");
        } else if (ctx.music.current) {
            const separatedArtistAndTitle = /(.+) - (.+)/.test(ctx.music.current.info.title);
            query = `${separatedArtistAndTitle ? ctx.music.current.info.title : ctx.music.current.info.author.replace(" - Topic", "")} - ${ctx.music.current.info.title}`;
        } else {
            return ctx.respond({ embeds: [util.embed().setDescription("❌ | Missing args.")] });
        }

        try {
            const res = await getLyrics(query);
            const splittedLyrics = util.chunk(res.lyrics, 1024);

            const embed = util.embed()
                .setAuthor(res.author)
                .setTitle(res.title)
                .setURL(res.links.genius)
                .setThumbnail(res.thumbnail.genius)
                .setDescription(splittedLyrics[0])
                .setFooter(`Page 1 of ${splittedLyrics.length}.`);

            const lyricsctx = await ctx.respond(embed);
            if (splittedLyrics.length > 1) await util.pagination(lyricsctx, ctx.author, splittedLyrics);
        } catch (e) {
            if (e.message === "Sorry I couldn't find that song's lyrics") ctx.respond({ embeds: [util.embed().setDescription(`❌ | ${e.message}`)] });
            else ctx.respond(`An error occured: ${e.message}.`);   
        }
    }
};
