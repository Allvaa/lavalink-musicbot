const MusicClient = require("./structures/MusicClient");

const client = new MusicClient({
    disableMentions: "everyone"
});

client.build();