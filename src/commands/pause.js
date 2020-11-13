module.exports = {
    name: "pause",
    exec: async (msg) => {
        const { music } = msg.guild;
        if (!music.player) return msg.channel.send("Currently not playing anything.");
        if (!msg.member.voice.channel)
            return msg.channel.send("You must be on a voice channel.");
        if (msg.guild.me.voice.channel && !msg.guild.me.voice.channel.equals(msg.member.voice.channel))
            return msg.channel.send(`You must be on ${msg.guild.me.voice.channel} to use this command.`);

        try {
            await music.pause();
            msg.react("⏸️").catch(e => e);
        } catch (e) {
            msg.channel.send(`An error occured: ${e.message}`);
        }
    }
};
