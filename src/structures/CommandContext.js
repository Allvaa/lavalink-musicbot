const { Message, CommandInteraction } = require("discord.js");
const MusicHandler = require("./MusicHandler");

module.exports = class CommandContext {
    constructor(command, from, options) {
        this.command = command;
        this.from = from;
        this.options = options;
    }

    get client() {
        return this.from.client;
    }

    get guild() {
        return this.from.guild;
    }

    get channel() {
        return this.from.channel;
    }

    get member() {
        return this.from.member;
    }

    get author() {
        return this.member.user;
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
        if (this.from instanceof Message) return this.from.reply(opt);
        else if (this.from instanceof CommandInteraction) return this.from.editReply(opt);
    }
};
