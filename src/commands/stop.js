module.exports = {
    name: "play",
    aliases: ["p"],
    exec: async (msg) => {
        if (!msg.member.voice.channel)
            return msg.channel.send("You must be on a voice channel.");
        if (msg.guild.me.voice.channel && !msg.guild.me.voice.channel.equals(msg.member.voice.channel))
            return msg.channel.send(`You must be on ${msg.guild.me.voice.channel} to use this command.`);

        const { music } = msg.guild;
        try {
            //
        } catch (e) {
            //
        }
    }
};
