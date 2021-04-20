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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Team = void 0;
const type_graphql_1 = require("type-graphql");
const typeorm_1 = require("typeorm");
const Team_1 = require("../resolvers/Team");
const channel_1 = require("./channel");
let Team = class Team extends typeorm_1.BaseEntity {
};
__decorate([
    type_graphql_1.Field(),
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], Team.prototype, "id", void 0);
__decorate([
    type_graphql_1.Field(),
    typeorm_1.Column({ unique: true }),
    __metadata("design:type", String)
], Team.prototype, "name", void 0);
__decorate([
    typeorm_1.CreateDateColumn(),
    __metadata("design:type", Date)
], Team.prototype, "createdAt", void 0);
__decorate([
    typeorm_1.UpdateDateColumn(),
    __metadata("design:type", Date)
], Team.prototype, "updatedAt", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", Boolean)
], Team.prototype, "admin", void 0);
__decorate([
    type_graphql_1.Field(() => [Team_1.User], { nullable: true }),
    __metadata("design:type", Array)
], Team.prototype, "directMessageUsers", void 0);
__decorate([
    type_graphql_1.Field(() => [channel_1.Channel], { nullable: true }),
    typeorm_1.OneToMany(() => channel_1.Channel, (channel) => channel.team),
    __metadata("design:type", Array)
], Team.prototype, "channels", void 0);
Team = __decorate([
    type_graphql_1.ObjectType(),
    typeorm_1.Entity()
], Team);
exports.Team = Team;
//# sourceMappingURL=team.js.map