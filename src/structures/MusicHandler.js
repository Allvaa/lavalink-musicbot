const Rest = require("./Rest");
const util = require("../util");

module.exports = class MusicHandler {
    /** @param {import("discord.js").Guild} guild */
    constructor(guild) {
        this.guild = guild;
        this.volume = 100;
        this.loop = 0; // 0 = none; 1 = track; 2 = queue;
        this.previous = null;
        this.nightcore = false;
        this.vaporwave = false;
        this._8d = false;
        this.current = null;
        this.queue = [];
        /** @type {import("discord.js").TextChannel|null} */
        this.textChannel = null;
        this.shouldSkipCurrent = false;
    }

    get voiceChannel() {
        return this.guild.me.voice.channel;
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
        this.loop = 0;
        this.volume = 100;
        this.previous = null;
        this.current = null;
        this.queue = [];
        this.nightcore = false;
        this.vaporwave = false;
        this._8d = false;
        this.textChannel = null;
    }

    /** @param {import("discord.js").VoiceChannel} voice */
    async join(voice) {
        if (this.player) return;
        await this.client.manager.join({
            channel: voice.id,
            guild: this.guild.id,
            node: this.node.id
        }, { selfdeaf: true });

        this.player
            .on("start", () => {
                this.current = this.queue.shift();
                if (this.textChannel) this.textChannel.send(util.embed().setDescription(`🎶 | Now playing **${this.current.info.title}**.`));
            })
            .on("end", (data) => {
                if (data.reason === "REPLACED") return;
                this.previous = this.current;
                this.current = null;

                if (this.loop === 1 && !this.shouldSkipCurrent) this.queue.unshift(this.previous);
                else if (this.loop === 2) this.queue.push(this.previous);

                if (this.shouldSkipCurrent) this.shouldSkipCurrent = false;

                if (!this.queue.length) {
                    this.client.manager.leave(this.guild.id);
                    if (this.textChannel) this.textChannel.send(util.embed().setDescription("✅ | Queue is empty. Leaving voice channel.."));
                    this.reset();
                    return;
                }
                this.start();
            })
            .on("error", console.error);
    }

    /** @param {import("discord.js").TextChannel} text */
    setTextCh(text) {
        this.textChannel = text;
    }

    async load(query) {
        const res = await Rest.load(this.node, query, this.client.spotify);
        return res;
    }

    async start() {
        if (!this.player) return;
        await this.player.play(this.queue[0].track);
    }

    async pause() {
        if (!this.player) return;
        if (!this.player.paused) await this.player.pause(true);
    }

    async resume() {
        if (!this.player) return;
        if (this.player.paused) await this.player.pause(false);
    }

    async skip(to = 1) {
        if (!this.player) return;
        if (to > 1) {
            this.queue.unshift(this.queue[to - 1]);
            this.queue.splice(to, 1);
        }
        if (this.loop === 1 && this.queue[0]) this.shouldSkipCurrent = true;
        this.nightcore = false;
        await this.player.stop();
    }

    async stop() {
        if (!this.player) return;
        this.loop = 0;
        this.queue = [];
        this.vaporwave = false;
        this.nightcore = false;
        this._8d = false;
        await this.skip();
    }

    async setVolume(newVol) {
        if (!this.player) return;
        const parsed = parseInt(newVol, 10);
        if (isNaN(parsed)) return;
        await this.player.volume(parsed);
        this.volume = newVol;
    }
    async setNightcore(val) {
        if(val === true){
            this.vaporwave = false;
            this._8d = false;
            this.player.node.send({
                op: "filters",
                guildId: this.guild.id || this.guild,
                equalizer: [
                    { band: 1, gain: 0.3 },
                    { band: 0, gain: 0.3 },
                ],
                timescale: { pitch: 1.3999999523162842 },
                tremolo: { depth: 0.3, frequency: 14 }
            });
            this.nightcore = true;
        }
        else if(val === false){
            this.player.node.send({
                op: "filters",
                guildId: this.guild.id || this.guild,
                timescale: { pitch : 1 }
            });
            this.nightcore = false;
        }
        else return;
    }

    async setVaporwave(val) {
        if(val === true){
            this.nightcore = false;
            this._8d = false;
            this.player.node.send({
                op: "filters",
                guildId: this.guild.id || this.guild,
                equalizer: [
                    { band: 1, gain: 0.3 },
                    { band: 0, gain: 0.3 },
                ],
                timescale: { pitch: 0.5 },
                tremolo: { depth: 0.3, frequency: 14 },
            });
            this.vaporwave = true;
        }
        else if(val === false){
            this.player.node.send({
                op: "filters",
                guildId: this.guild.id || this.guild,
                timescale: { pitch : 1 }
            });
            this.vaporwave = false;
        }
        else return;
    }

    async set8D(val) {
        if(val === true){
            this.vaporwave = false;
            this.nightcore = false;
            this.player.node.send({
                op: "filters",
                guildId: this.guild.id || this.guild,
                rotation : { rotationHz: 0.29999 },
            });
            this._8d = true;
        }
        else if(val === false){
            this.player.node.send({
                op: "filters",
                guildId: this.guild.id || this.guild,
                rotation : { rotationHz: 0 },
            });
            this._8d = false;
        }
        else return;
    }
};
