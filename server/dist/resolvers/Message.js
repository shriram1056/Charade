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
exports.MessageResolver = void 0;
const apollo_server_express_1 = require("apollo-server-express");
const fs_1 = require("fs");
const graphql_redis_subscriptions_1 = require("graphql-redis-subscriptions");
const graphql_upload_1 = require("graphql-upload");
const path_1 = __importDefault(require("path"));
const type_graphql_1 = require("type-graphql");
const typeorm_1 = require("typeorm");
const channel_1 = require("../entities/channel");
const channel_member_1 = require("../entities/channel_member");
const message_1 = require("../entities/message");
const user_1 = require("../entities/user");
const isAuth_1 = require("../middleware/isAuth");
const IsAuthAdvance_1 = require("../middleware/IsAuthAdvance");
const pubsub = new graphql_redis_subscriptions_1.RedisPubSub();
let PaginatedMessages = class PaginatedMessages {
};
__decorate([
    type_graphql_1.Field(() => [message_1.Message]),
    __metadata("design:type", Array)
], PaginatedMessages.prototype, "Messages", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", Boolean)
], PaginatedMessages.prototype, "hasMore", void 0);
PaginatedMessages = __decorate([
    type_graphql_1.ObjectType()
], PaginatedMessages);
const CHANNEL_MESSAGE = 'NEW_CHANNEL_MESSAGE';
let MessageResolver = class MessageResolver {
    user(message, { userLoader }) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = userLoader.load(message.userId);
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
    createMessage(text, file, channelId, { req: { userId } }) {
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
                            .into(message_1.Message)
                            .values({
                            channelId,
                            userId,
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
                        .into(message_1.Message)
                        .values({
                        text,
                        channelId,
                        userId,
                    })
                        .returning('*')
                        .execute();
                }
            }
            catch (err) {
                console.log(err);
            }
            let message = result.generatedMaps[0];
            yield pubsub.publish(CHANNEL_MESSAGE, message);
            return message;
        });
    }
    Messages(channelId, cursor, { req }) {
        return __awaiter(this, void 0, void 0, function* () {
            const channel = yield channel_1.Channel.findOne({
                where: {
                    id: channelId,
                },
            });
            if (!(channel === null || channel === void 0 ? void 0 : channel.public)) {
                const member = yield channel_member_1.channelMember.findOne({
                    where: {
                        userId: req.userId,
                    },
                });
                if (!member) {
                    throw new Error('not authorized');
                }
            }
            let options = { channelId };
            if (cursor) {
                console.log(cursor, new Date(cursor));
                options = {
                    channelId,
                    createdAt: typeorm_1.LessThan(new Date(cursor)),
                };
            }
            let message = yield message_1.Message.find({
                take: 35,
                where: options,
                order: {
                    createdAt: 'DESC',
                },
            });
            let pagiantedMessages = {
                hasMore: message.length === 35 ? true : false,
                Messages: message,
            };
            return pagiantedMessages;
        });
    }
    newChannelMessage(payload, args, { userLoader }) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield userLoader.load(payload.userId);
            payload.user = user;
            payload.createdAt = new Date(payload.createdAt);
            return payload;
        });
    }
    addPicture(file, channelId) {
        return __awaiter(this, void 0, void 0, function* () {
            const { createReadStream, filename } = yield file;
            console.log(filename);
            return new Promise((resolve) => createReadStream()
                .pipe(fs_1.createWriteStream(path_1.default.join(__dirname, `../images/${filename}`)))
                .on('finish', () => {
                console.log('finish');
                return resolve(true);
            })
                .on('error', (err) => {
                console.log(err);
                return resolve(false);
            }));
        });
    }
};
__decorate([
    type_graphql_1.FieldResolver(() => user_1.Users),
    __param(0, type_graphql_1.Root()), __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [message_1.Message, Object]),
    __metadata("design:returntype", Promise)
], MessageResolver.prototype, "user", null);
__decorate([
    type_graphql_1.FieldResolver(),
    __param(0, type_graphql_1.Root()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [message_1.Message]),
    __metadata("design:returntype", Promise)
], MessageResolver.prototype, "url", null);
__decorate([
    type_graphql_1.Mutation(() => message_1.Message),
    type_graphql_1.UseMiddleware(isAuth_1.isAuth),
    __param(0, type_graphql_1.Arg('text', { nullable: true })),
    __param(1, type_graphql_1.Arg('file', () => graphql_upload_1.GraphQLUpload, { nullable: true })),
    __param(2, type_graphql_1.Arg('channelId', () => type_graphql_1.Int)),
    __param(3, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Number, Object]),
    __metadata("design:returntype", Promise)
], MessageResolver.prototype, "createMessage", null);
__decorate([
    type_graphql_1.Query(() => PaginatedMessages),
    type_graphql_1.UseMiddleware(isAuth_1.isAuth),
    __param(0, type_graphql_1.Arg('channelId', () => type_graphql_1.Int)),
    __param(1, type_graphql_1.Arg('cursor', () => String, { nullable: true })),
    __param(2, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String, Object]),
    __metadata("design:returntype", Promise)
], MessageResolver.prototype, "Messages", null);
__decorate([
    type_graphql_1.Subscription(() => message_1.Message, {
        subscribe: IsAuthAdvance_1.requiresTeamAccess.createResolver(apollo_server_express_1.withFilter(() => pubsub.asyncIterator(CHANNEL_MESSAGE), (payload, args) => payload.channelId === args.channelId)),
    }),
    __param(0, type_graphql_1.Root()),
    __param(1, type_graphql_1.Arg('channelId', () => type_graphql_1.Int)),
    __param(2, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [message_1.Message, Number, Object]),
    __metadata("design:returntype", Promise)
], MessageResolver.prototype, "newChannelMessage", null);
__decorate([
    type_graphql_1.Mutation(() => Boolean),
    __param(0, type_graphql_1.Arg('picture', () => graphql_upload_1.GraphQLUpload)),
    __param(1, type_graphql_1.Arg('channelId', () => type_graphql_1.Int)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], MessageResolver.prototype, "addPicture", null);
MessageResolver = __decorate([
    type_graphql_1.Resolver(message_1.Message)
], MessageResolver);
exports.MessageResolver = MessageResolver;
//# sourceMappingURL=Message.js.map