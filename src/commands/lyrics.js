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
    exec: async (msg, args) => {
        let query = args.join(" ");
        if (!query && !msg.guild.music.current) {
            return msg.channel.send(util.embed().setDescription("❌ | Missing args."));
        } else {
            const separatedArtistAndTitle = /(.+) - (.+)/.test(msg.guild.music.current.info.title);
            query = `${separatedArtistAndTitle ? "" : msg.guild.music.current.info.author} - ${msg.guild.music.current.info.title}`;
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

            const lyricsMsg = await msg.channel.send(embed);
            if (splittedLyrics.length > 1) await util.pagination(lyricsMsg, msg.author, splittedLyrics);
        } catch (e) {
            if (e.message === "Sorry I couldn't find that song's lyrics") msg.channel.send(util.embed().setDescription(`❌ | ${e.message}`));
            else msg.channel.send(`An error occured: ${e.message}.`);   
        }
    }
};
