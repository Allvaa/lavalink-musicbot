module.exports = {
    name: "ready",
    exec: (client) => {
        console.log(`Logged in as ${client.user.tag}`);
        client.manager.connect();
    }
};
