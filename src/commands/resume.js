module.exports = {
    name: "resume",
    run: async (client, message, args) => {
        const serverQueue = client.musicManager.queue.get(message.guild.id);
        if (!serverQueue) return message.channel.send("Queue is empty!");
        if (serverQueue.playing) return message.channel.send("Queue is being played");
        serverQueue.player.pause(false);
        serverQueue.playing = true;
        message.channel.send("Resumed!");
    }
};