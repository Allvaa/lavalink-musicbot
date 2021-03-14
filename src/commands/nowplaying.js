const util = require("../util");

const { porgressBar } = require("music-progress-bar");

module.exports = {
    name: "nowplaying",
    aliases: ["np", "nowplay"],
    exec: (msg) => {
        const { music } = msg.guild;
		msg.delete({ timeout: 000 /*time unitl delete in milliseconds*/});
		 if (!music.player || !music.player.playing) return msg.channel.send(util.embed().setDescription("❌ | Currently not playing anything.")		
		.setFooter(msg.author.username,  msg.author.displayAvatarURL({ dynamic: true }))
		.setTimestamp());
		
		const fillers = (music.current.info.length - music.player.state.position /1)
	const shipudden = util.millisToDuration(fillers);
		let nowPlaying = util.embed()
		.setTitle(`**${music.current.info.title}**.`)
		.setURL(`${music.current.info.uri}`)
		.setImage(`https://img.youtube.com/vi/${music.current.info.identifier}/maxresdefault.jpg`)
		.setAuthor(`🎶 | Now playing `, msg.client.user.displayAvatarURL())
				
		.setTimestamp()
		;		
		if (music.current.info.isStream) {
		nowPlaying.addField("\u200b", "**The Video Is Live ◉**")
		.setFooter(msg.author.username, msg.author.displayAvatarURL({ dynamic: true }))
		}
		else if 
		(music.player.state.position > 0) {
		nowPlaying.addField("\u200b", porgressBar({currentPositon:music.player.state.position ,endPositon:music.current.info.length,width:28,barStyle:"=",currentStyle:"🔘"}, {format:" [ <bar> ] <precent> <%>"}))
		.setFooter(`Time Remaining: ${shipudden} Mins`, msg.author.displayAvatarURL({ dynamic: true }))
		}
		else {
			nowPlaying.setFooter(msg.author.username, msg.author.displayAvatarURL({ dynamic: true }))
		}
		return msg.channel.send(nowPlaying);
		
}};
