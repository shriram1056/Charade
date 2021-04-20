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
exports.TeamMember = void 0;
const typeorm_1 = require("typeorm");
const team_1 = require("./team");
const user_1 = require("./user");
let TeamMember = class TeamMember extends typeorm_1.BaseEntity {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], TeamMember.prototype, "id", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], TeamMember.prototype, "userId", void 0);
__decorate([
    typeorm_1.ManyToOne(() => user_1.Users),
    __metadata("design:type", user_1.Users)
], TeamMember.prototype, "user", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], TeamMember.prototype, "teamId", void 0);
__decorate([
    typeorm_1.ManyToOne(() => team_1.Team, {
        onDelete: 'CASCADE',
    }),
    __metadata("design:type", team_1.Team)
], TeamMember.prototype, "team", void 0);
__decorate([
    typeorm_1.CreateDateColumn(),
    __metadata("design:type", Date)
], TeamMember.prototype, "createdAt", void 0);
__decorate([
    typeorm_1.Column({ default: false }),
    __metadata("design:type", Boolean)
], TeamMember.prototype, "admin", void 0);
__decorate([
    typeorm_1.UpdateDateColumn(),
    __metadata("design:type", Date)
], TeamMember.prototype, "updatedAt", void 0);
TeamMember = __decorate([
    typeorm_1.Entity(),
    typeorm_1.Unique('TeamMember', ['teamId', 'userId'])
], TeamMember);
exports.TeamMember = TeamMember;
//# sourceMappingURL=member.js.map