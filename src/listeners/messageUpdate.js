module.exports = {
    name: "messageUpdate",
    exec: async (client, oldMessage, newMessage) => {
		
	 if (newMessage.webhookID) return; // Check for webhook

 
  if (
    newMessage.member && 
    newMessage.id === newMessage.member.lastMessageID &&
    !oldMessage.command
  ) {
	 
    client.emit('message', newMessage);
  }
    }
};
