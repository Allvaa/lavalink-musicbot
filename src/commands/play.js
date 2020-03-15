module.exports = {
    name: "play",
    run: async (client, message, args) => {
        if (!message.member.voice.channel) return message.channel.send("You must join a voice channel to use this command.");

        const track = args.join(" ");
        const song = await client.musicManager.getSongs(`ytsearch: ${track}`);
        if (!song[0]) return message.channel.send("Couldn't find any songs.");

        client.musicManager.handleVideo(message, message.member.voice.channel, song[0]);
    }
};