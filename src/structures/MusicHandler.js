const { Rest } = require("lavacord");

module.exports = class MusicHandler {
    /** @param {import("discord.js").Guild} guild */
    constructor(guild) {
        this.guild = guild;
        this.volume = 100;
        this.loop = false;
        this.previous = null;
        this.current = null;
        this.queue = [];
        this.channel = {
            /** @type {import("discord.js").TextChannel|null} */
            text: null,
            /** @type {import("discord.js").VoiceChannel|null} */
            voice: null
        };
    }

    /** @returns {import("../structures/MusicClient")} */
    get client() {
        return this.guild.client;
    }

    get player() {
        return this.client.manager.players.get(this.guild.id) || null;
    }

    get node() {
        return this.client.manager.nodes.get("main");
    }

    reset() {
        this.loop = false;
        this.volume = 100;
        this.previous = null;
        this.current = null;
        this.queue = [];
        this.channel = {
            voice: null,
            text: null
        };
    }

    /** @param {import("discord.js").VoiceChannel} voice */
    async join(voice) {
        if (this.player) return;
        await this.client.manager.join({
            channel: voice.id,
            guild: this.guild.id,
            node: this.node.id
        }, { selfdeaf: true });
        this.channel.voice = voice;

        this.player
            .on("start", () => {
                this.current = this.queue.shift();
            })
            .on("end", (data) => {
                if (data.reason === "REPLACED") return;
                this.previous = this.current;
                this.current = null;
                if (this.loop) this.queue.push(this.previous);
                if (!this.queue.length) {
                    this.client.manager.leave(this.guild.id);
                    if (this.channel.text) this.channel.text.send("Queue is empty! Leaving voice channel..");
                    this.reset();
                    return;
                }
                this.start();
            });
    }

    /** @param {import("discord.js").TextChannel} text */
    setTextCh(text) {
        this.channel.text = text;
    }

    async load(query) {
        const res = await Rest.load(this.node, query);
        return res;
    }

    start() {
        if (!this.player) return;
        this.player.play(this.queue[0].track);
    }

    pause() {
        if (!this.player) return;
        if (!this.player.paused) this.player.pause(true);
    }

    resume() {
        if (!this.player) return;
        if (this.player.paused) this.player.pause(false);
    }

    skip() {
        if (!this.player) return;
        this.player.stop();
    }

    stop() {
        if (!this.player) return;
        this.loop = false;
        this.queue = [];
        this.skip();
    }

    setVolume(newVol) {
        if (!this.player) return;
        this.volume = newVol;
        this.player.volume(newVol);
    }
};
