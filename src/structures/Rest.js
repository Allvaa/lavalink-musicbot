const { Collection } = require("discord.js");
const { LavaSpotify } = require("lava-spotify");

const spotifyResolver = new Collection();

module.exports = class Rest extends require("lavacord").Rest {
    /**
     * @param {import("lavacord").LavalinkNode} node
     * @param {string} query
     * @returns {Promise<import("lavacord").TrackResponse>}
     */
    static async load(node, query) {
        if (process.env.ENABLE_SPOTIFY === "true" && !spotifyResolver.has(node.id)) {
            spotifyResolver.set(node.id, new LavaSpotify({
                host: node.host,
                port: node.port,
                password: node.password
            }, {
                clientID: process.env.SPOTIFY_ID,
                clientSecret: process.env.SPOTIFY_SECRET
            }));
            await spotifyResolver.get(node.id).requestToken();
        }
        const spotify = spotifyResolver.get(node.id);
        return process.env.ENABLE_SPOTIFY === "true" && spotify.isValidURL(query) ? await spotify.load(query) : await super.load(node, query);
    }
};
