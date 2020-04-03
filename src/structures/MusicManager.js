const { Collection } = require("discord.js");
const { Manager } = require("@lavacord/discord.js");
const { Rest } = require("lavacord");
const Queue = require("./Queue");

/**
 * @class MusicManager
 */
class MusicManager {
    /**
     * @param {import("./MusicClient")} client
     */
    constructor(client) {
        this.client = client;
        this.manager = new Manager(client, client.config.nodes,  {
            user: client.user.id,
            shards: client.shard ? client.shard.count : 1
        });
        this.manager.connect();
        
        this.queue = new Collection();
    }

    async handleVideo(message, voiceChannel, song) {
        const serverQueue = this.queue.get(message.guild.id);
        song.requestedBy = message.author;
        if (!serverQueue) {
            const queue = new Queue(this.client, {
                textChannel: message.channel,
                voiceChannel
            });
            queue.songs.push(song);
            this.queue.set(message.guild.id, queue);

            try {
                const player = await this.manager.join({
                    channel: voiceChannel.id,
                    guild: message.guild.id,
                    node: "default"
                }, {
                    selfdeaf: true
                });
                queue.setPlayer(player);
                this.play(message.guild, song);
            } catch (error) {
                console.error(`I could not join the voice channel: ${error}`);
                this.queue.delete(message.guild.id);
                this.manager.leave(message.guild.id);
                message.channel.send(`I could not join the voice channel: ${error.message}`);
            }
        } else {
            serverQueue.songs.push(song);
            message.channel.send(`Successfully added **${song.info.title}** to the queue!`);
        }
    }

    play(guild, song) {
        const serverQueue = this.queue.get(guild.id);
        if (!song) {
            serverQueue.textChannel.send("Queue is empty! Leaving voice channel..");
            this.manager.leave(guild.id);
            this.queue.delete(guild.id);
        } else {
            serverQueue.player.play(song.track);
            serverQueue.player
                .once("error", console.error)
                .once("end", data => {
                    if (data.reason === "REPLACED") return;
                    const shiffed = serverQueue.songs.shift();
                    if (serverQueue.loop === true) {
                        serverQueue.songs.push(shiffed);
                    }
                    this.play(guild, serverQueue.songs[0]);
                });
            serverQueue.player.volume(serverQueue.volume);
            serverQueue.textChannel.send(`Now playing: **${song.info.title}** by *${song.info.author}*`);
        }
    }

    async getSongs(query) {
        const node = this.manager.nodes.get("default");
        const result = await Rest.load(node, query);
        return result.tracks;
    }
}

module.exports = MusicManager;