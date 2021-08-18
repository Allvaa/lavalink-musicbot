const { Intents } = require("discord.js");
const { GUILDS, GUILD_MESSAGES, GUILD_VOICE_STATES } = Intents.FLAGS;
const MusicClient = require("./structures/MusicClient");

const client = new MusicClient({
    intents: [GUILDS, GUILD_MESSAGES, GUILD_VOICE_STATES],
    allowedMentions: {
        parse: ["users", "roles"]
    }
});

client.build();