module.exports = {
    name: "stop",
    run: async (client, message, args) => {
        const serverQueue = client.musicManager.queue.get(message.guild.id);
        if (!serverQueue) return message.channel.send("Queue is empty!");
        client.musicManager.player.leave(message.guild.id);
        client.musicManager.queue.delete(message.guild.id);
        message.channel.send("Disconnected!");
    }
};