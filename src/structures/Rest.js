module.exports = class Rest extends require("lavacord").Rest {
    /**
     * @param {import("lavacord").LavalinkNode} node
     * @param {string} query
     * @param {import("lavasfy").LavasfyClient} lsClient
     * @returns {Promise<import("lavacord").TrackResponse>}
     */
    static async load(node, query, lsClient) {
        const spotify = lsClient ? lsClient.nodes.get(node.id) : undefined;
        return lsClient && lsClient.isValidURL(query) ? await spotify.load(query) : await super.load(node, query);
    }
};
