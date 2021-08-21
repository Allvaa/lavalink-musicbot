const MusicHandler = require("./MusicHandler");

module.exports = class CommandContext {
    constructor(command, message, args) {
        this.command = command;
        this.message = message;
        this.args = args;
    }

    get client() {
        return this.message.client;
    }

    get guild() {
        return this.message.guild;
    }

    get channel() {
        return this.message.channel;
    }

    get member() {
        return this.message.member;
    }

    get author() {
        return this.message.author;
    }

    get music() {
        if (this.client.musics.has(this.guild.id)) {
            return this.client.musics.get(this.guild.id);
        }
        const musicHandler = new MusicHandler(this.guild);
        this.client.musics.set(this.guild.id, musicHandler);
        return musicHandler;
    }

    respond(opt) {
        return this.message.reply(opt);
    }
};
