const { Client } = require("discord.js");
const MusicManager = require("./MusicManager");

/**
 * @class MusicClient
 * @extends {Client}
 */
class MusicClient extends Client {
    /**
     * @param {import("discord.js").ClientOptions} [opt]
     */
    constructor(opt) {
        super(opt);
        this.config = require("../config.json");
        this.musicManager = null;

        this.login(this.config.token);

        this
        .on("ready", () => {
            this.musicManager = new MusicManager(this);
            console.log("Bot is online!");
        })
        .on("message", async message => {
            if (message.author.bot || !message.guild) return;
            if (!message.content.startsWith(this.config.prefix)) return;
            const args = message.content.slice(this.config.prefix.length).trim().split(/ +/g);
            const command = args.shift().toLowerCase();

            try {
                const cmd = require(`../commands/${command}`);
                if (!cmd) return;
                await cmd.run(this, message, args);
            } catch (e) {
                if (e.message.startsWith("Cannot find module")) return;
                console.error(e.stack);
            }
        });
    }
}

module.exports = MusicClient;