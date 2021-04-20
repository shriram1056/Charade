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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.directMessage = void 0;
const apollo_server_express_1 = require("apollo-server-express");
const fs_1 = require("fs");
const graphql_upload_1 = require("graphql-upload");
const path_1 = __importDefault(require("path"));
const type_graphql_1 = require("type-graphql");
const typeorm_1 = require("typeorm");
const direct_message_1 = require("../entities/direct_message");
const user_1 = require("../entities/user");
const isAuth_1 = require("../middleware/isAuth");
const IsAuthAdvance_1 = require("../middleware/IsAuthAdvance");
let PaginatedDirectMessages = class PaginatedDirectMessages {
};
__decorate([
    type_graphql_1.Field(() => [direct_message_1.DirectMessage]),
    __metadata("design:type", Array)
], PaginatedDirectMessages.prototype, "Messages", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", Boolean)
], PaginatedDirectMessages.prototype, "hasMore", void 0);
PaginatedDirectMessages = __decorate([
    type_graphql_1.ObjectType()
], PaginatedDirectMessages);
const DIRECTMESSAGE = 'DIRECT_MESSAGE';
let directMessage = class directMessage {
    sender(message, { userLoader }) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = userLoader.load(message.senderId);
            return user;
        });
    }
    url(message) {
        return __awaiter(this, void 0, void 0, function* () {
            if (message.url) {
                return `http://localhost:4001/files/${message.url}`;
            }
            return null;
        });
    }
    createDirectMessages(receiverId, text, teamId, { req, pubsub }, file) {
        return __awaiter(this, void 0, void 0, function* () {
            let result;
            try {
                if (file) {
                    const { createReadStream, mimetype, filename } = yield file;
                    const realPath = path_1.default.join(__dirname, `../images/${filename}`);
                    const fileUpload = createReadStream()
                        .pipe(fs_1.createWriteStream(realPath))
                        .on('finish', () => {
                        console.log('finish');
                        return true;
                    })
                        .on('error', (err) => {
                        console.log(err);
                        return false;
                    });
                    if (fileUpload) {
                        console.log(mimetype);
                        result = yield typeorm_1.getConnection()
                            .createQueryBuilder()
                            .insert()
                            .into(direct_message_1.DirectMessage)
                            .values({
                            receiverId,
                            teamId,
                            senderId: req.userId,
                            fileType: mimetype,
                            url: filename,
                        })
                            .returning('*')
                            .execute();
                    }
                }
                else {
                    result = yield typeorm_1.getConnection()
                        .createQueryBuilder()
                        .insert()
                        .into(direct_message_1.DirectMessage)
                        .values({
                        text,
                        receiverId,
                        teamId,
                        senderId: req.userId,
                    })
                        .returning('*')
                        .execute();
                }
            }
            catch (err) {
                console.log(err);
                return false;
            }
            const message = result.generatedMaps[0];
            console.log(message);
            yield pubsub.publish(DIRECTMESSAGE, message);
            return true;
        });
    }
    DirectMessages(teamId, receiverId, cursor, { req }) {
        return __awaiter(this, void 0, void 0, function* () {
            let options = [
                { teamId, receiverId, senderId: req.userId },
                { receiverId: req.userId, senderId: receiverId, teamId },
            ];
            if (cursor) {
                options = [
                    {
                        teamId,
                        receiverId,
                        senderId: req.userId,
                        createdAt: typeorm_1.LessThan(new Date(cursor)),
                    },
                    {
                        receiverId: req.userId,
                        senderId: receiverId,
                        teamId,
                        createdAt: typeorm_1.LessThan(new Date(cursor)),
                    },
                ];
            }
            const message = yield direct_message_1.DirectMessage.find({
                take: 35,
                where: options,
                order: {
                    createdAt: 'DESC',
                },
            });
            console.log(message.length);
            let pagiantedMessages = {
                hasMore: message.length === 35 ? true : false,
                Messages: message,
            };
            return pagiantedMessages;
        });
    }
    getTeamMembers(teamId) {
        return __awaiter(this, void 0, void 0, function* () {
            const member = yield typeorm_1.getConnection()
                .query(`
    select 
 u.id,
 u.username,
u.email,
u.created_at "createdAt"
    from team_member tm
    inner join public.users u on u.id= tm.user_id
    where tm.team_id= $1;
    `, [teamId]);
            return member;
        });
    }
    newDirectMessage(payload, teamId, receiverId, { connection: { context } }) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(context);
            const { username } = context;
            payload.createdAt = new Date(payload.createdAt);
            payload.sender = { username };
            return payload;
        });
    }
};
__decorate([
    type_graphql_1.FieldResolver(() => user_1.Users),
    __param(0, type_graphql_1.Root()),
    __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [direct_message_1.DirectMessage, Object]),
    __metadata("design:returntype", Promise)
], directMessage.prototype, "sender", null);
__decorate([
    type_graphql_1.FieldResolver(),
    __param(0, type_graphql_1.Root()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [direct_message_1.DirectMessage]),
    __metadata("design:returntype", Promise)
], directMessage.prototype, "url", null);
__decorate([
    type_graphql_1.UseMiddleware(isAuth_1.isAuth),
    type_graphql_1.Mutation(() => Boolean),
    __param(0, type_graphql_1.Arg('receiverId', () => type_graphql_1.Int)),
    __param(1, type_graphql_1.Arg('text', { nullable: true })),
    __param(2, type_graphql_1.Arg('teamId', () => type_graphql_1.Int)),
    __param(3, type_graphql_1.Ctx()),
    __param(4, type_graphql_1.Arg('file', () => graphql_upload_1.GraphQLUpload, { nullable: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String, Number, Object, Object]),
    __metadata("design:returntype", Promise)
], directMessage.prototype, "createDirectMessages", null);
__decorate([
    type_graphql_1.UseMiddleware(isAuth_1.isAuth),
    type_graphql_1.Query(() => PaginatedDirectMessages),
    __param(0, type_graphql_1.Arg('teamId', () => type_graphql_1.Int)),
    __param(1, type_graphql_1.Arg('receiverId', () => type_graphql_1.Int)),
    __param(2, type_graphql_1.Arg('cursor', () => String, { nullable: true })),
    __param(3, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String, Object]),
    __metadata("design:returntype", Promise)
], directMessage.prototype, "DirectMessages", null);
__decorate([
    type_graphql_1.UseMiddleware(isAuth_1.isAuth),
    type_graphql_1.Query(() => [user_1.Users]),
    __param(0, type_graphql_1.Arg('teamId', () => type_graphql_1.Int)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], directMessage.prototype, "getTeamMembers", null);
__decorate([
    type_graphql_1.Subscription(() => direct_message_1.DirectMessage, {
        subscribe: IsAuthAdvance_1.requiresDirectAuth.createResolver(apollo_server_express_1.withFilter((_, __, { pubsub }) => pubsub.asyncIterator(DIRECTMESSAGE), (payload, { receiverId, teamId }, { connection: { context } }) => {
            console.log(receiverId);
            return (payload.teamId === teamId &&
                ((payload.senderId === context.userId &&
                    payload.receiverId === receiverId) ||
                    (payload.senderId === receiverId &&
                        payload.receiverId === context.userId)));
        })),
    }),
    __param(0, type_graphql_1.Root()),
    __param(1, type_graphql_1.Arg('teamId', () => type_graphql_1.Int)),
    __param(2, type_graphql_1.Arg('receiverId', () => type_graphql_1.Int)),
    __param(3, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [direct_message_1.DirectMessage, Number, Number, Object]),
    __metadata("design:returntype", Promise)
], directMessage.prototype, "newDirectMessage", null);
directMessage = __decorate([
    type_graphql_1.Resolver(direct_message_1.DirectMessage)
], directMessage);
exports.directMessage = directMessage;
//# sourceMappingURL=directMessage.js.map