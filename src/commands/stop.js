module.exports = {
    name: "stop",
    run: async (client, message, args) => {
        const serverQueue = client.musicManager.queue.get(message.guild.id);
        if (!serverQueue) return message.channel.send("Queue is empty!");
        serverQueue.destroy();
        message.channel.send("Disconnected!");
    }
};