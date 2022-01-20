module.exports = {
    name: "ready",
    exec: async (client) => {
        console.log(`Logged in as ${client.user.tag}`);

        if (client.spotify) await client.spotify.requestToken();
    }
};
