const MusicClient = require("./structures/MusicClient");

new MusicClient({
    disableMentions: "everyone",
    presence: {
        activity: {
            name: `Type ${require("./config.json").prefix}help`
        }
    }
});