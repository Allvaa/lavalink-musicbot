const util = require("../util");

module.exports = class MusicHandler {
    /** @param {import("discord.js").Guild} guild */
    constructor(guild) {
        this.guild = guild;
        this.loop = 0; // 0 = none; 1 = track; 2 = queue;
        this.previous = null;
        this.current = null;
        this.queue = [];
        this.filters = {
            doubleTime: false,
            nightcore: false,
            vaporwave: false,
            "8d": false,
            bassboost: false
        };
        this.bassboost = 0;
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
        return this.client.shoukaku.players.get(this.guild.id);
    }

    get node() {
        return this.client.shoukaku.getNode();
    }

    get volume() {
        return this.player?.filters.volume * 100 ?? 100;
    }

    reset() {
        this.loop = 0;
        this.previous = null;
        this.current = null;
        this.queue = [];
        this.textChannel = null;
        for (const filter of Object.keys(this.filters)) {
            this.filters[filter] = false;
        }
        this.bassboost = 0;
    }

    /** @param {import("discord.js").VoiceChannel} voice */
    async join(voice) {
        if (this.player) return;
        await this.node.joinChannel({
            channelId: voice.id,
            guildId: this.guild.id,
            shardId: this.guild.shardId,
            deaf: true
        });

        this.player
            .on("start", () => {
                this.current = this.queue.shift();
                if (this.textChannel) this.textChannel.send({embeds:[util.embed().setDescription(`🎶 | Now playing **${this.current.info.title}**.`)]});
            })
            .on("end", (data) => {
                if (data.reason === "REPLACED") return;
                this.previous = this.current;
                this.current = null;

                if (this.loop === 1 && !this.shouldSkipCurrent) this.queue.unshift(this.previous);
                else if (this.loop === 2) this.queue.push(this.previous);

                if (this.shouldSkipCurrent) this.shouldSkipCurrent = false;

                if (!this.queue.length) {
                    this.node.leaveChannel(this.guild.id);
                    if (this.textChannel) this.textChannel.send({embeds:[util.embed().setDescription("✅ | Queue is empty. Leaving voice channel..")]});
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
        const spotify = this.client.spotify.getNode(this.node.name);
        if (this.client.spotify.isValidURL(query)) {
            const { loadType: type, tracks, playlistInfo: { name } } = await spotify.load(query);
            return {
                type,
                tracks,
                playlistName: name
            };
        }
        return this.node.rest.resolve(query);
    }

    start() {
        this.player?.playTrack(this.queue[0].track);
    }

    pause() {
        if (!this.player?.paused) this.player?.setPaused(true);
    }

    resume() {
        if (this.player?.paused) this.player?.setPaused(false);
    }

    skip(to = 1) {
        if (to > 1) {
            this.queue.unshift(this.queue[to - 1]);
            this.queue.splice(to, 1);
        }
        if (this.loop === 1 && this.queue[0]) this.shouldSkipCurrent = true;
        this.player?.stopTrack();
    }

    stop() {
        this.loop = 0;
        this.queue = [];
        this.skip();
    }

    setVolume(volume) {
        this.player?.setVolume(volume / 100);
    }

    setDoubleTime(val) {
        if (!this.player) return;
        this.filters.doubleTime = val;
        if (val) {
            this.filters.nightcore = false;
            this.filters.vaporwave = false;
        }
        this.player.setTimescale(val ? { speed: 1.5 } : null);
    }

    setNightcore(val) {
        if (!this.player) return;
        this.filters.nightcore = val;
        if (val) {
            this.filters.doubleTime = false;
            this.filters.vaporwave = false;
        }
        this.player.setTimescale(val ? { rate: 1.5 } : null);
    }

    setVaporwave(val) {
        if (!this.player) return;
        this.filters.vaporwave = val;
        if (val) {
            this.filters.doubleTime = false;
            this.filters.nightcore = false;
        }
        this.player.setTimescale(val ? { pitch: 0.5 } : null);
    }

    set8D(val) {
        if (!this.player) return;
        this.filters["8d"] = val;
        this.player.setRotation(val ? { rotationHz: 0.2 } : null);
    }

    setBassboost(val) {
        if (!this.player) return;
        this.filters.bassboost = !!val;
        this.bassboost = val / 100;
        this.player.setEqualizer(val ? Array(6).fill(0.22).map((x, i) => ({ band: i, gain: x * val })) : []);
    }
};
