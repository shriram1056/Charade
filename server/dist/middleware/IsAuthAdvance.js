"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requiresDirectAuth = exports.requiresTeamAccess = void 0;
const channel_1 = require("../entities/channel");
const member_1 = require("../entities/member");
const createResolver = (resolver) => {
    const baseResolver = resolver;
    baseResolver.createResolver = (childResolver) => {
        const newResolver = (parent, args, context, info) => __awaiter(void 0, void 0, void 0, function* () {
            yield resolver(parent, args, context, info);
            return childResolver(parent, args, context, info);
        });
        return createResolver(newResolver);
    };
    return baseResolver;
};
exports.requiresTeamAccess = createResolver((parent, { channelId }, { connection }) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(channelId, connection.context);
    let { context: { userId }, } = connection;
    if (!userId) {
        throw new Error('Not authenticated');
    }
    const channel = yield channel_1.Channel.findOne({ where: { id: channelId } });
    const member = yield member_1.TeamMember.findOne({
        where: { teamId: channel.teamId, userId },
    });
    if (!member) {
        throw new Error("You have to be a member of the team to subcribe to it's messages");
    }
}));
exports.requiresDirectAuth = createResolver((parent, { receiverId, teamId }, { connection }) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    if (!((_a = connection === null || connection === void 0 ? void 0 : connection.context) === null || _a === void 0 ? void 0 : _a.userId)) {
        throw new Error('not authenticated');
    }
    console.log((_b = connection === null || connection === void 0 ? void 0 : connection.context) === null || _b === void 0 ? void 0 : _b.userId);
    const member = yield member_1.TeamMember.find({
        where: [
            { teamId, userId: connection.context.userId },
            { teamId, userId: receiverId },
        ],
    });
    if ((member === null || member === void 0 ? void 0 : member.length) !== 2) {
        throw new Error("You have to be a member of the team to subcribe to it's messages");
    }
}));
//# sourceMappingURL=IsAuthAdvance.js.map