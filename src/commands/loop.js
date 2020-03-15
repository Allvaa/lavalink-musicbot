module.exports = {
    name: "loop",
    run: async (client, message, args) => {
        const serverQueue = client.musicManager.queue.get(message.guild.id);
        if (!serverQueue) return message.channel.send("Queue is empty!");
        serverQueue.loop = !serverQueue.loop;
        message.channel.send(`Loop has been ${serverQueue.loop ? "enabled" : "disabled"}`);
    }
};