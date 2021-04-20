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
exports.DirectMessageLoader = void 0;
const dataloader_1 = __importDefault(require("dataloader"));
const typeorm_1 = require("typeorm");
const DirectMessageLoader = () => new dataloader_1.default((keys) => __awaiter(void 0, void 0, void 0, function* () {
    const teamIds = keys.map((t) => t.teamId);
    const users = yield typeorm_1.getConnection()
        .query(`
    select 
    distinct on (u.id,dm.team_id)
    u.id, u.username, dm.team_id "teamId"
    from users u
    inner join public.direct_message dm on (u.id= dm.sender_id) or (u.id= dm.receiver_id)
    where ($1 = dm.sender_id or $1 = dm.receiver_id) and dm.team_id = any($2);
    `, [keys[0].userId, teamIds]);
    const userObject = {};
    users.forEach((u) => {
        if (userObject[u.teamId]) {
            userObject[u.teamId].push(u);
        }
        else {
            userObject[u.teamId] = [u];
        }
    });
    return keys.map((u) => {
        let newObject;
        if (userObject[u.teamId]) {
            newObject = userObject[u.teamId].filter((u) => u.id !== keys[0].userId);
        }
        return newObject;
    });
}));
exports.DirectMessageLoader = DirectMessageLoader;
//# sourceMappingURL=DirectMessageLoader.js.map