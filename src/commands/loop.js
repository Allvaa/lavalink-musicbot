const util = require("../util");
module.exports = {
    name: "loop",
    aliases: ["repeat"],
    exec: (msg, args) => {
        const { music } = msg.guild;
		msg.delete({ timeout: 000 /*time unitl delete in milliseconds*/});
        if (!music.player) return msg.channel.send(util.embed().setDescription("❌ | Currently not playing anything.")                                  
			.setFooter(msg.author.username,  msg.author.displayAvatarURL({ dynamic: true }))
			.setTimestamp()).then(msg => msg.delete({ timeout: 10000 }));
        if (!msg.member.voice.channel)
            return msg.channel.send(util.embed().setDescription("❌ | You must be on a voice channel.")                                  
			.setFooter(msg.author.username,  msg.author.displayAvatarURL({ dynamic: true }))
			.setTimestamp()).then(msg => msg.delete({ timeout: 10000 }));
        if (msg.guild.me.voice.channel && !msg.guild.me.voice.channel.equals(msg.member.voice.channel))
            return msg.channel.send(util.embed().setDescription(`❌ | You must be on ${msg.guild.me.voice.channel} to use this command.`)                                  
			.setFooter(msg.author.username,  msg.author.displayAvatarURL({ dynamic: true }))
			.setTimestamp()).then(msg => msg.delete({ timeout: 10000 }));
if (args[0]) {if (args[0].toLowerCase() === "single" || args[0].toLowerCase() === "track" || args[0].toLowerCase() === "song" || args[0].toLowerCase() === "this" || args[0].toLowerCase() === "current" || args[0].toLowerCase() === "virgin") {		
	if (music.current) {music.current.loop = !music.current.loop;} 
music.queue.loop = null;
        msg.channel.send(util.embed().setDescription(`✅ | Single Song Loop ${music.current.loop ? "enabled" : "disabled"}.`)
       .setFooter(msg.author.username,  msg.author.displayAvatarURL({ dynamic: true }))
	.setTimestamp()).then(msg => msg.delete({ timeout: 10000 }));	
} else if (args[0].toLowerCase() === "all" || args[0].toLowerCase() === "every" || args[0].toLowerCase() === "queue" || args[0].toLowerCase() === "fuck" || args[0].toLowerCase() === "couple" || args[0].toLowerCase() === "sexy") {
	music.queue.loop = !music.queue.loop;
if (music.current) {music.current.loop = null;}
        msg.channel.send(util.embed().setDescription(`✅ | All Song Loop ${music.queue.loop ? "enabled" : "disabled"}.`)                                  
			.setFooter(msg.author.username,  msg.author.displayAvatarURL({ dynamic: true }))
			.setTimestamp()).then(msg => msg.delete({ timeout: 10000 }));}
else if (args[0].toLowerCase() === "off" || args[0].toLowerCase() === "none" || args[0].toLowerCase() === "nothing" || args[0].toLowerCase() === "sucks" || args[0].toLowerCase() === "dick" || args[0].toLowerCase() === "ass") {
	music.queue.loop = null;
if (music.current) {music.current.loop = null;}
        msg.channel.send(util.embed().setDescription(`⛔ | Loop disabled.`)                                  
			.setFooter(msg.author.username,  msg.author.displayAvatarURL({ dynamic: true }))
			.setTimestamp()).then(msg => msg.delete({ timeout: 10000 }));	
} else {msg.channel.send(util.embed().setDescription(` You Need to Specify Wheather you the Loop to Single/All/Off.`)
.setAuthor(`❌ | Nope`, msg.client.user.displayAvatarURL())
.addField(`For Example:`,`<@!${client.user.id}>loop Single`)
			.setFooter(msg.author.username,  msg.author.displayAvatarURL({ dynamic: true }))
.setTimestamp()).then(msg => msg.delete({ timeout: 10000 }));}}
else if (!music.queue.loop && !music.current.loop) {
	music.queue.loop = null;
	if (music.current) {music.current.loop = true;}
	msg.channel.send(util.embed().setDescription(`✅ | Looping Current Song.`)
       .setFooter(msg.author.username,  msg.author.displayAvatarURL({ dynamic: true }))
	.setTimestamp()).then(msg => msg.delete({ timeout: 10000 }));}
else if (music.current.loop) {	
	if (music.current) {music.current.loop = null;}
	music.queue.loop = true;
		msg.channel.send(util.embed().setDescription(`✅ | Looping the Queue.`)                                  
			.setFooter(msg.author.username,  msg.author.displayAvatarURL({ dynamic: true }))
			.setTimestamp()).then(msg => msg.delete({ timeout: 10000 }));}
else if (music.queue.loop) {
	music.queue.loop = null;
	if (music.current) {music.current.loop = null;}
        msg.channel.send(util.embed().setDescription(`⛔ | Loop disabled.`)                                  
			.setFooter(msg.author.username,  msg.author.displayAvatarURL({ dynamic: true }))
			.setTimestamp()).then(msg => msg.delete({ timeout: 10000 }));
}}};
