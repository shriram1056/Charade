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
exports.TeamResolver = exports.User = void 0;
const type_graphql_1 = require("type-graphql");
const typeorm_1 = require("typeorm");
const channel_1 = require("../entities/channel");
const member_1 = require("../entities/member");
const team_1 = require("../entities/team");
const user_1 = require("../entities/user");
const isAuth_1 = require("../middleware/isAuth");
const Errors_1 = require("../utils/Errors");
let TeamResponse = class TeamResponse {
};
__decorate([
    type_graphql_1.Field(() => Errors_1.FieldError, { nullable: true }),
    __metadata("design:type", Errors_1.FieldError)
], TeamResponse.prototype, "errors", void 0);
__decorate([
    type_graphql_1.Field(() => team_1.Team, { nullable: true }),
    __metadata("design:type", team_1.Team)
], TeamResponse.prototype, "team", void 0);
TeamResponse = __decorate([
    type_graphql_1.ObjectType()
], TeamResponse);
let User = class User {
};
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", Number)
], User.prototype, "id", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], User.prototype, "username", void 0);
User = __decorate([
    type_graphql_1.ObjectType()
], User);
exports.User = User;
let AddUserResponse = class AddUserResponse {
};
__decorate([
    type_graphql_1.Field(() => Errors_1.FieldError, { nullable: true }),
    __metadata("design:type", Errors_1.FieldError)
], AddUserResponse.prototype, "errors", void 0);
AddUserResponse = __decorate([
    type_graphql_1.ObjectType()
], AddUserResponse);
let TeamResolver = class TeamResolver {
    channels(team, { channelLoader, req }) {
        return __awaiter(this, void 0, void 0, function* () {
            let channel = yield channelLoader.load({
                teamId: team.id,
                userId: req.userId,
            });
            return channel;
        });
    }
    directMessageUsers(team, { req, DirectMessageLoader }) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield DirectMessageLoader.load({
                teamId: team.id,
                userId: req.userId,
            });
            return user;
        });
    }
    allTeam() {
        return team_1.Team.find();
    }
    createTeam(name, { req }) {
        return __awaiter(this, void 0, void 0, function* () {
            let response;
            try {
                response = yield typeorm_1.getConnection().transaction(() => __awaiter(this, void 0, void 0, function* () {
                    const result = yield typeorm_1.getConnection()
                        .createQueryBuilder()
                        .insert()
                        .into(team_1.Team)
                        .values({
                        name,
                    })
                        .returning('*')
                        .execute();
                    let team = result.raw[0];
                    typeorm_1.getConnection()
                        .createQueryBuilder()
                        .insert()
                        .into(channel_1.Channel)
                        .values({
                        name: 'general',
                        teamId: team.id,
                    })
                        .execute();
                    yield member_1.TeamMember.insert({
                        teamId: team.id,
                        userId: req.userId,
                        admin: true,
                    });
                    return team;
                }));
            }
            catch (err) {
                if (err.code === '23505' && err.detail.includes('name')) {
                    console.log(err);
                    return {
                        errors: {
                            field: 'name',
                            message: 'team already taken',
                        },
                    };
                }
            }
            return {
                team: response,
            };
        });
    }
    addTeamMember(email, teamId, { req }) {
        return __awaiter(this, void 0, void 0, function* () {
            const UserPromise = user_1.Users.findOne({ where: { email: email } });
            const teamPromise = member_1.TeamMember.findOne({
                where: { teamId, userId: req.userId },
            });
            const [UserToAdd, team] = yield Promise.all([UserPromise, teamPromise]);
            if (!(team === null || team === void 0 ? void 0 : team.admin)) {
                return {
                    errors: {
                        field: 'email',
                        message: 'You cannot add members to the team',
                    },
                };
            }
            if (!UserToAdd) {
                return {
                    errors: {
                        field: 'email',
                        message: 'Could not find user with this email',
                    },
                };
            }
            try {
                yield typeorm_1.getConnection()
                    .createQueryBuilder()
                    .insert()
                    .into(member_1.TeamMember)
                    .values({
                    userId: UserToAdd.id,
                    teamId,
                })
                    .returning('*')
                    .execute();
            }
            catch (err) {
                if ((err.code === '23505', err.detail.includes('Key (team_id, user_id'))) {
                    return {
                        errors: {
                            field: 'email',
                            message: 'user is already a memer',
                        },
                    };
                }
                return {
                    errors: {
                        field: 'unknown',
                        message: 'something went wrong',
                    },
                };
            }
            return null;
        });
    }
};
__decorate([
    type_graphql_1.FieldResolver(() => channel_1.Channel, { nullable: true }),
    __param(0, type_graphql_1.Root()), __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [team_1.Team, Object]),
    __metadata("design:returntype", Promise)
], TeamResolver.prototype, "channels", null);
__decorate([
    type_graphql_1.FieldResolver(() => User, { nullable: true }),
    __param(0, type_graphql_1.Root()),
    __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [team_1.Team, Object]),
    __metadata("design:returntype", Promise)
], TeamResolver.prototype, "directMessageUsers", null);
__decorate([
    type_graphql_1.Query(() => [team_1.Team]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TeamResolver.prototype, "allTeam", null);
__decorate([
    type_graphql_1.Mutation(() => TeamResponse),
    type_graphql_1.UseMiddleware(isAuth_1.isAuth),
    __param(0, type_graphql_1.Arg('name')),
    __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], TeamResolver.prototype, "createTeam", null);
__decorate([
    type_graphql_1.Mutation(() => AddUserResponse, { nullable: true }),
    type_graphql_1.UseMiddleware(isAuth_1.isAuth),
    __param(0, type_graphql_1.Arg('email')),
    __param(1, type_graphql_1.Arg('teamId', () => type_graphql_1.Int)),
    __param(2, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Object]),
    __metadata("design:returntype", Promise)
], TeamResolver.prototype, "addTeamMember", null);
TeamResolver = __decorate([
    type_graphql_1.Resolver(() => team_1.Team)
], TeamResolver);
exports.TeamResolver = TeamResolver;
//# sourceMappingURL=Team.js.map