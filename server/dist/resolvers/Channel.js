"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
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
exports.ChannelResolver = exports.ChannelResponse = void 0;
const type_graphql_1 = require("type-graphql");
const typeorm_1 = require("typeorm");
const channel_1 = require("../entities/channel");
const channel_member_1 = require("../entities/channel_member");
const member_1 = require("../entities/member");
const isAuth_1 = require("../middleware/isAuth");
const Errors_1 = require("../utils/Errors");
let ChannelResponse = class ChannelResponse {
};
__decorate([
    type_graphql_1.Field(() => Errors_1.FieldError, { nullable: true }),
    __metadata("design:type", Errors_1.FieldError)
], ChannelResponse.prototype, "errors", void 0);
__decorate([
    type_graphql_1.Field(() => channel_1.Channel, { nullable: true }),
    __metadata("design:type", channel_1.Channel)
], ChannelResponse.prototype, "channel", void 0);
ChannelResponse = __decorate([
    type_graphql_1.ObjectType()
], ChannelResponse);
exports.ChannelResponse = ChannelResponse;
let ChannelResolver = class ChannelResolver {
    createChannel(name, teamId, access, members, { req }) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(name, members);
            const team = yield member_1.TeamMember.findOne({
                where: { teamId, userId: req.userId },
            });
            if (!(team === null || team === void 0 ? void 0 : team.admin)) {
                return {
                    errors: {
                        field: 'channelName',
                        message: 'permission denied',
                    },
                };
            }
            let channel;
            try {
                yield typeorm_1.getConnection().transaction(() => __awaiter(this, void 0, void 0, function* () {
                    let results = yield typeorm_1.getConnection()
                        .createQueryBuilder()
                        .insert()
                        .into(channel_1.Channel)
                        .values({
                        name: name,
                        public: access,
                        teamId: teamId,
                    })
                        .returning('*')
                        .execute();
                    channel = results.raw[0];
                    if (!access) {
                        const channelMembers = members.filter((m) => m !== req.userId);
                        channelMembers.push(req.userId);
                        yield channel_member_1.channelMember.insert(channelMembers.map((m) => ({ userId: m, channelId: channel.id })));
                    }
                }));
            }
            catch (err) {
                console.log(err);
            }
            return { channel };
        });
    }
};
__decorate([
    type_graphql_1.Mutation(() => ChannelResponse, { nullable: true }),
    type_graphql_1.UseMiddleware(isAuth_1.isAuth),
    __param(0, type_graphql_1.Arg('name')),
    __param(1, type_graphql_1.Arg('teamId', () => type_graphql_1.Int)),
    __param(2, type_graphql_1.Arg('public')),
    __param(3, type_graphql_1.Arg('members', () => [type_graphql_1.Int])),
    __param(4, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Boolean, Array, Object]),
    __metadata("design:returntype", Promise)
], ChannelResolver.prototype, "createChannel", null);
ChannelResolver = __decorate([
    type_graphql_1.Resolver()
], ChannelResolver);
exports.ChannelResolver = ChannelResolver;
//# sourceMappingURL=Channel.js.map