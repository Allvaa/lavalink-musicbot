const util = require("../util");
module.exports = {
    name: "ping",
    exec: (msg) => {		
    const latency = `\`\`\`ini\n ${Math.floor(Date.now() - msg.createdTimestamp)}ms \`\`\``;
    const apiLatency = `\`\`\`ini\n ${Math.round(msg.client.ws.ping)}ms \`\`\``;
         msg.channel.send(util.embed()
		.setAuthor(`OKAY (。_。)` , msg.client.user.displayAvatarURL())		
		.setTitle(`Ping Results -`)
		.setDescription('')
        .addField('Latency', latency, true)
        .addField('API Latency', apiLatency, true)
		.setFooter('(x_x)')
		.setTimestamp());
}
};
