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
const apollo_server_express_1 = require("apollo-server-express");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const graphql_redis_subscriptions_1 = require("graphql-redis-subscriptions");
const graphql_upload_1 = require("graphql-upload");
const http_1 = __importDefault(require("http"));
const jsonwebtoken_1 = require("jsonwebtoken");
const path_1 = __importDefault(require("path"));
require("reflect-metadata");
const type_graphql_1 = require("type-graphql");
const typeorm_1 = require("typeorm");
const typeorm_naming_strategies_1 = require("typeorm-naming-strategies");
const auth_1 = require("./auth");
const constant_1 = require("./constant");
const channel_1 = require("./entities/channel");
const channel_member_1 = require("./entities/channel_member");
const direct_message_1 = require("./entities/direct_message");
const member_1 = require("./entities/member");
const message_1 = require("./entities/message");
const team_1 = require("./entities/team");
const user_1 = require("./entities/user");
const Channel_1 = require("./resolvers/Channel");
const directMessage_1 = require("./resolvers/directMessage");
const Message_1 = require("./resolvers/Message");
const Team_1 = require("./resolvers/Team");
const User_1 = require("./resolvers/User");
const channelLoader_1 = require("./utils/channelLoader");
const DirectMessageLoader_1 = require("./utils/DirectMessageLoader");
const userLoader_1 = require("./utils/userLoader");
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    yield typeorm_1.createConnection({
        type: 'postgres',
        database: 'slack',
        host: 'localhost',
        port: 5432,
        username: 'shriram',
        password: 'shriram1056',
        logging: true,
        synchronize: true,
        migrations: [path_1.default.join(__dirname, './migrations/*')],
        entities: [
            user_1.Users,
            team_1.Team,
            channel_1.Channel,
            message_1.Message,
            member_1.TeamMember,
            channel_member_1.channelMember,
            direct_message_1.DirectMessage,
        ],
        namingStrategy: new typeorm_naming_strategies_1.SnakeNamingStrategy(),
    });
    const app = express_1.default();
    const pubsub = new graphql_redis_subscriptions_1.RedisPubSub();
    app.use(cookie_parser_1.default());
    app.use(graphql_upload_1.graphqlUploadExpress({ maxFileSize: 52428800, maxFiles: 10 }));
    console.log(path_1.default.join(__dirname, 'images'));
    app.use('/files', express_1.default.static(path_1.default.join(__dirname, 'images')));
    app.use((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const refreshToken = req.cookies['refresh-token'];
        const accessToken = req.cookies['access-token'];
        if (!refreshToken && !accessToken) {
            console.log('refresh and access cookie expired');
            return next();
        }
        try {
            const data = jsonwebtoken_1.verify(accessToken, constant_1.SECRET2);
            req.userId = data.userId;
            req.username = data.username;
            return next();
        }
        catch (_a) {
            console.log('access token or cookie has expired');
        }
        if (!refreshToken) {
            console.log('refresh cookie expired');
            return next();
        }
        let data;
        try {
            data = jsonwebtoken_1.verify(refreshToken, constant_1.SECRET);
        }
        catch (_b) {
            console.log('refresh token expired');
            return next();
        }
        const user = yield user_1.Users.findOne(data.userId);
        if (!user || user.count !== data.count) {
            console.log('token is invalidated');
            return next();
        }
        const tokens = yield auth_1.createTokens(user);
        res.cookie('refresh-token', tokens.refreshToken, {
            maxAge: 1000 * 60 * 60 * 24 * 7,
        });
        res.cookie('access-token', tokens.accessToken, {
            maxAge: 1000 * 60 * 15,
        });
        req.userId = user.id;
        req.username = user.username;
        next();
    }));
    const server = new apollo_server_express_1.ApolloServer({
        uploads: false,
        subscriptions: {
            path: '/subscriptions',
            onConnect: (connectionParams) => __awaiter(void 0, void 0, void 0, function* () {
                const { authToken } = connectionParams;
                let user;
                console.log(connectionParams);
                if (connectionParams.authToken) {
                    try {
                        const payload = jsonwebtoken_1.verify(authToken.Atoken, constant_1.SECRET2);
                        user = { userId: payload.userId, username: payload.username };
                        return Object.assign({}, user);
                    }
                    catch (err) {
                        try {
                            const payload = jsonwebtoken_1.verify(authToken.Rtoken, constant_1.SECRET);
                            user = { userId: payload.userId, username: payload.username };
                            return Object.assign({}, user);
                        }
                        catch (err) {
                            throw new Error('not authenticated');
                        }
                    }
                }
                return null;
            }),
            onDisconnect: () => console.log('disconnect'),
        },
        schema: yield type_graphql_1.buildSchema({
            resolvers: [
                User_1.UserResolver,
                Team_1.TeamResolver,
                Channel_1.ChannelResolver,
                Message_1.MessageResolver,
                directMessage_1.directMessage,
            ],
            validate: false,
        }),
        context: ({ req, res, connection }) => ({
            pubsub,
            req,
            res,
            SECRET: constant_1.SECRET,
            connection,
            DirectMessageLoader: DirectMessageLoader_1.DirectMessageLoader(),
            SECRET2: constant_1.SECRET2,
            channelLoader: channelLoader_1.ChannelLoader(),
            userLoader: userLoader_1.userLoader(),
        }),
    });
    app.use(cors_1.default({ origin: 'http://localhost:3000', credentials: true }));
    server.applyMiddleware({ app, cors: false });
    const httpServer = http_1.default.createServer(app);
    server.installSubscriptionHandlers(httpServer);
    httpServer.listen({ port: 4001 }, () => console.log(`Server ready ${server.subscriptionsPath}`));
});
main().catch((err) => {
    console.log(err);
});
//# sourceMappingURL=index.js.map