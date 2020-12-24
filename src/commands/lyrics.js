const fetch = require("node-fetch");
const util = require("../util");

const getLyrics = async (query) => (await fetch(`https://some-random-api.ml/lyrics?title=${encodeURIComponent(query)}`)).json();

module.exports = {
    name: "lyrics",
    aliases: ["ly"],
    exec: async (msg, args) => {
        const query = args.join(" ");
        if (!query) return msg.channel.send(util.embed().setDescription(`❌ | Missing args.`));

        try {
            const res = await getLyrics(query);
            if (!res) return msg.channel.send(util.embed().setDescription(`❌ | Couldn't find any results.`));

            const splittedLyrics = util.chunk(res.lyrics, 2048);

            for (const lyrics of splittedLyrics) {
                const embed = util.embed();
                if (splittedLyrics.indexOf(lyrics) == 0) {
                    embed
                        .setAuthor(res.author)
                        .setTitle(res.title)
                        .setURL(res.links.genius)
                        .setThumbnail(res.thumbnail.genius);
                }
                if (splittedLyrics.indexOf(lyrics) == splittedLyrics.length - 1) {
                    embed.setFooter("Source: Genius\nAPI: Some Random Api", "https://vrlz.is-inside.me/fJlQ5xKB.jpg");
                }
                embed.setDescription(lyrics);
                await msg.channel.send(embed);
            }
        } catch (e) {
            msg.channel.send(`An error occured: ${e.message}.`);
        }
    }
};
