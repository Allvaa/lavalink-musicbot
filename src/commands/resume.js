module.exports = {
    name: "resume",
    run: async (client, message, args) => {
        const serverQueue = client.musicManager.queue.get(message.guild.id);
        if (!serverQueue) return message.channel.send("Queue is empty!");
        if (serverQueue.playing) return message.channel.send("Queue is being played");
        serverQueue.resume();
        message.channel.send("Resumed!");
    }
};