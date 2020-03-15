module.exports = {
    name: "nowplaying",
    run: async (client, message, args) => {
        const serverQueue = client.musicManager.queue.get(message.guild.id);
        if (!serverQueue) return message.channel.send("Queue is empty!");
        if (!serverQueue.playing) return message.channel.send("Player paused.");
        const currSong = serverQueue.songs[0];
        message.channel.send(`Now playing: **${currSong.info.title}** by *${currSong.info.author}*`);
    }
};