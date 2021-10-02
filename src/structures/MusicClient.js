const { Client, Collection } = require("discord.js");
const { promises: { readdir } } = require("fs");
const { join } = require("path");
const { LavasfyClient } = require("lavasfy");
const { Shoukaku, Libraries } = require("shoukaku");

module.exports = class MusicClient extends Client {
    /** @param {import("discord.js").ClientOptions} [opt] */
    constructor(opt) {
        super(opt);
        this.musics = new Collection();
        this.commands = new Collection();
        this.shoukaku = new Shoukaku(new Libraries.DiscordJS(this), [
            {
                name: "main",
                url: `${process.env.LAVA_HOST}:${process.env.LAVA_PORT}`,
                auth: process.env.LAVA_PASS,
                secure: process.env.LAVA_SECURE === "true"
            }
        ]);
        this.spotify = process.env.ENABLE_SPOTIFY === "true"
            ? new LavasfyClient({
                clientID: process.env.SPOTIFY_ID,
                clientSecret: process.env.SPOTIFY_SECRET,
                playlistLoadLimit: process.env.SPOTIFY_PLAYLIST_PAGE_LIMIT,
                audioOnlyResults: true,
                useSpotifyMetadata: true,
                autoResolve: true
            }, [
                {
                    id: "main",
                    host: process.env.LAVA_HOST,
                    port: process.env.LAVA_PORT,
                    password: process.env.LAVA_PASS,
                    secure: process.env.LAVA_SECURE === "true"
                }
            ])
            : null;

        this.prefix = process.env.PREFIX.toLowerCase();
        this.timeout = 10; //timeout in second can use process.env also for storing it
    }

    build() {
        this.loadCommands();
        this.loadEventListeners();
        this.login(process.env.TOKEN);

        this.shoukaku
            .on("ready", (node, reconnect) => console.log(`Node ${node} is now ready.${reconnect ? " (reconnected)": ""}`))
            .on("disconnect", node => console.log(`Node ${node} disconnected.`))
            .on("close", (node, code, reason) => console.log(`Node ${node} closed. Code: ${code}. Reason: ${reason}.`))
            .on("error", (node, error) => console.log(`Encountered an error in node ${node}.`, error));
    }

    /** @private */
    async loadCommands() {
        const commands = await readdir(join(__dirname, "..", "commands"));
        for (const commandFile of commands) {
            const command = require(`../commands/${commandFile}`);
            this.commands.set(command.name, command);
        }
    }

    /** @private */
    async loadEventListeners() {
        const listeners = await readdir(join(__dirname, "..", "listeners"));
        for (const listenerFile of listeners) {
            const listener = require(`../listeners/${listenerFile}`);
            this.on(listener.name, (...args) => listener.exec(this, ...args));
        }
    }
};
