module.exports = {
    name: "skip",
    run: async (client, message, args) => {
        const serverQueue = client.musicManager.queue.get(message.guild.id);
        if (!serverQueue) return message.channel.send("Queue is empty!");
        if (!serverQueue.playing) serverQueue.playing = true;
        serverQueue.skip();
        message.channel.send("Skipped!");
    }
};