module.exports = {
    name: "voiceStateUpdate",
    exec: async (client, oldState, newState) => {
        const music = client.musics.get(newState.guild.id);
        if (newState.member.user.equals(client.user) && !newState.channel && music?.player) {
            if (music.player.playing) await music.stop();
            if (music.player) await client.manager.leave(music.guild.id);
        }
    }
};
