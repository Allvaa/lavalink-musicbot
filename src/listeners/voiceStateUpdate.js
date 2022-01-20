module.exports = {
    name: "voiceStateUpdate",
    exec: async (client, oldState, newState) => {
        const music = client.musics.get(newState.guild.id);
        if (newState.member.user.equals(client.user) && !newState.channel && music?.player) {
            if (music.player.track) await music.stop();
            if (music.player) await music.node.leaveChannel(music.guild.id);
        }
    }
};
