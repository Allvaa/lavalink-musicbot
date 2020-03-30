/**
 * @class Queue
 */
class Queue {
    /**
     * @param {import("./MusicClient")} client
     * @param {Object} data
     * @param {import("discord.js").TextChannel} data.textChannel
     * @param {import("discord.js").VoiceChannel} data.voiceChannel
     */
    constructor(client, data = {}) {
        this.client = client;
        this.textChannel = data.textChannel;
        this.voiceChannel = data.voiceChannel;
        this.player = null;
        this.songs = [];
        this.volume = 100;
        this.playing = true;
        this.loop = false;
    }

    /**
     * @param {import("lavacord").Player} player
     */
    setPlayer(player) {
        this.player = player;
    }

    async pause() {
        if (!this.playing) return false;
        await this.player.pause(true);
        this.playing = false;
        return true;
    }

    async resume() {
        if (this.playing) return false;
        await this.player.pause(false);
        this.playing = true;
        return true;
    }

    async skip() {
        return await this.player.stop();
    }

    async setVolume(value) {
        if (!value || isNaN(value)) return false;
        await this.player.volume(value);
        this.volume = parseInt(value);
        return true;
    }

    async destroy() {
        this.client.musicManager.queue.delete(this.textChannel.guild.id);
        await this.client.musicManager.manager.leave(this.textChannel.guild.id);
    }
}

module.exports = Queue;
