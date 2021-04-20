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
exports.isSubscriptionAuth = exports.isAuth = void 0;
const channel_1 = require("../entities/channel");
const member_1 = require("../entities/member");
const isAuth = ({ context }, next) => {
    if (!context.req.userId) {
        throw new Error('not authenticated');
    }
    return next();
};
exports.isAuth = isAuth;
const isSubscriptionAuth = ({ context: { connection }, args: { channelId } }, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    console.log('adadsdasdas', connection === null || connection === void 0 ? void 0 : connection.context);
    if (!((_a = connection === null || connection === void 0 ? void 0 : connection.context) === null || _a === void 0 ? void 0 : _a.userId)) {
        throw new Error('not authenticated');
    }
    const channel = yield channel_1.Channel.findOne({ where: { id: channelId } });
    const member = yield member_1.TeamMember.findOne({
        where: { teamId: channel.teamId, userId: connection.context.userId },
    });
    console.log(member);
    if (!member) {
        throw new Error("You have to be a member of the team to subcribe to it's messages");
    }
    return next();
});
exports.isSubscriptionAuth = isSubscriptionAuth;
//# sourceMappingURL=isAuth.js.map