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
exports.UserResolver = exports.UserResponse = void 0;
const argon2_1 = __importDefault(require("argon2"));
const type_graphql_1 = require("type-graphql");
const typeorm_1 = require("typeorm");
const auth_1 = require("../auth");
const team_1 = require("../entities/team");
const user_1 = require("../entities/user");
const isAuth_1 = require("../middleware/isAuth");
const Errors_1 = require("../utils/Errors");
const regsiterTyps_1 = require("../utils/regsiterTyps");
const validateRegister_1 = require("../utils/validateRegister");
let UserResponse = class UserResponse {
};
__decorate([
    type_graphql_1.Field(() => Errors_1.FieldError, { nullable: true }),
    __metadata("design:type", Errors_1.FieldError)
], UserResponse.prototype, "errors", void 0);
__decorate([
    type_graphql_1.Field(() => user_1.Users, { nullable: true }),
    __metadata("design:type", user_1.Users)
], UserResponse.prototype, "user", void 0);
UserResponse = __decorate([
    type_graphql_1.ObjectType()
], UserResponse);
exports.UserResponse = UserResponse;
let UserResolver = class UserResolver {
    team({ req }) {
        return __awaiter(this, void 0, void 0, function* () {
            const teams = yield typeorm_1.getConnection()
                .query(`
    select 
    t.created_at "createdAt",
    t.updated_at "updatedAt",
    t.name,
    t.id,
    tm.admin "admin"
    from team_member tm
    inner join public.team t on t.id= tm.team_id
    where tm.user_id= $1;
    `, [req.userId]);
            return teams;
        });
    }
    allUser() {
        return user_1.Users.find();
    }
    User(id) {
        return user_1.Users.findOne(id);
    }
    createUser(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const errors = validateRegister_1.validateRegister(options);
            if (errors) {
                console.log(errors);
                return { errors };
            }
            const hashedPassword = yield argon2_1.default.hash(options.password);
            let user;
            try {
                const result = yield typeorm_1.getConnection()
                    .createQueryBuilder()
                    .insert()
                    .into(user_1.Users)
                    .values({
                    username: options.username,
                    email: options.email,
                    password: hashedPassword,
                })
                    .returning('*')
                    .execute();
                user = result.raw[0];
            }
            catch (err) {
                if (err.code === '23505' && err.detail.includes('username')) {
                    console.log(err);
                    return {
                        errors: {
                            field: 'username',
                            message: 'username already taken',
                        },
                    };
                }
                else if (err.code === '23505' && err.detail.includes('email')) {
                    return {
                        errors: {
                            field: 'email',
                            message: 'email already used',
                        },
                    };
                }
                console.log('message, ', err.message);
            }
            return {
                user,
            };
        });
    }
    Login(email, password, { res }) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield user_1.Users.findOne({ where: { email: email } });
            if (!user) {
                return {
                    errors: {
                        field: 'email',
                        message: 'you have not registered',
                    },
                };
            }
            let verify = yield argon2_1.default.verify(user.password, password);
            if (!verify) {
                return {
                    errors: {
                        field: 'password',
                        message: 'incorrect password',
                    },
                };
            }
            const { accessToken, refreshToken } = yield auth_1.createTokens(user);
            res.cookie('refresh-token', refreshToken);
            res.cookie('access-token', accessToken);
            return {
                user,
            };
        });
    }
    getUser({ req }) {
        if (!req.userId) {
            return null;
        }
        let user = user_1.Users.findOne(req.userId);
        return user;
    }
    me({ req }) {
        if (!req.userId) {
            return null;
        }
        return {
            id: req.userId,
        };
    }
};
__decorate([
    type_graphql_1.UseMiddleware(isAuth_1.isAuth),
    type_graphql_1.FieldResolver(() => [team_1.Team], { nullable: true }),
    __param(0, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "team", null);
__decorate([
    type_graphql_1.Query(() => [user_1.Users]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "allUser", null);
__decorate([
    type_graphql_1.Query(() => user_1.Users),
    __param(0, type_graphql_1.Arg('id', () => type_graphql_1.Int)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "User", null);
__decorate([
    type_graphql_1.Mutation(() => UserResponse),
    __param(0, type_graphql_1.Arg('options')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [regsiterTyps_1.UserCredentials]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "createUser", null);
__decorate([
    type_graphql_1.Mutation(() => UserResponse),
    __param(0, type_graphql_1.Arg('email')),
    __param(1, type_graphql_1.Arg('password')),
    __param(2, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "Login", null);
__decorate([
    type_graphql_1.Query(() => user_1.Users, { nullable: true }),
    __param(0, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], UserResolver.prototype, "getUser", null);
__decorate([
    type_graphql_1.Query(() => user_1.Users, { nullable: true }),
    __param(0, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], UserResolver.prototype, "me", null);
UserResolver = __decorate([
    type_graphql_1.Resolver(user_1.Users)
], UserResolver);
exports.UserResolver = UserResolver;
//# sourceMappingURL=User.js.map