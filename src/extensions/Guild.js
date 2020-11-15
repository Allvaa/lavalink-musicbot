const { Structures } = require("discord.js");
const MusicHandler = require("../structures/MusicHandler");

const Guild = Structures.get("Guild");

class MusicGuild extends Guild {
    constructor(client, data) {
        super(client, data);
        this.music = new MusicHandler(this);
    }
}

Structures.extend("Guild", () => MusicGuild);
