const { Intents } = require("discord.js");
const MusicClient = require("./structures/MusicClient");

const client = new MusicClient({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_VOICE_STATES],
    allowedMentions: {
        parse: ["users", "roles"]
    }
});

client.build();