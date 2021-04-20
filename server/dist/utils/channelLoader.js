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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChannelLoader = void 0;
const dataloader_1 = __importDefault(require("dataloader"));
const typeorm_1 = require("typeorm");
const ChannelLoader = () => new dataloader_1.default((keys) => __awaiter(void 0, void 0, void 0, function* () {
    const teamIds = keys.map((t) => t.teamId);
    const channel = yield typeorm_1.getConnection()
        .query(`
    select 
    distinct on (c.id)
    c.*
    from channel c
    left join public.channel_member cm on (cm.channel_id= c.id)
    where c.team_id = any($1) and (c.public=true or (cm.user_id= $2 and cm.channel_id = c.id));
    `, [teamIds, keys[0].userId]);
    const channelObject = {};
    channel.forEach((u) => {
        if (channelObject[u.team_id]) {
            channelObject[u.team_id].push(u);
        }
        else {
            channelObject[u.team_id] = [u];
        }
    });
    return keys.map((key) => channelObject[key.teamId]);
}));
exports.ChannelLoader = ChannelLoader;
//# sourceMappingURL=channelLoader.js.map