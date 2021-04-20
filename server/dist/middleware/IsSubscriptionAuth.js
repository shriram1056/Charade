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
exports.IsSubscriptionAuth = void 0;
const channel_1 = require("../entities/channel");
const IsSubscriptionAuth = ({ args, context }, next) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(context, args);
    const channel = yield channel_1.Channel.findOne({ where: { id: args.channelId } });
    return next();
});
exports.IsSubscriptionAuth = IsSubscriptionAuth;
//# sourceMappingURL=IsSubscriptionAuth.js.map