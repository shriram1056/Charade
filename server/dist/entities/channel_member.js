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
exports.channelMember = void 0;
const typeorm_1 = require("typeorm");
const channel_1 = require("./channel");
const user_1 = require("./user");
let channelMember = class channelMember extends typeorm_1.BaseEntity {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], channelMember.prototype, "id", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], channelMember.prototype, "userId", void 0);
__decorate([
    typeorm_1.ManyToOne(() => user_1.Users),
    __metadata("design:type", user_1.Users)
], channelMember.prototype, "user", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], channelMember.prototype, "channelId", void 0);
__decorate([
    typeorm_1.CreateDateColumn(),
    __metadata("design:type", Date)
], channelMember.prototype, "createdAt", void 0);
__decorate([
    typeorm_1.UpdateDateColumn(),
    __metadata("design:type", Date)
], channelMember.prototype, "updatedAt", void 0);
__decorate([
    typeorm_1.ManyToOne(() => channel_1.Channel, {
        onDelete: 'CASCADE',
    }),
    __metadata("design:type", channel_1.Channel)
], channelMember.prototype, "channel", void 0);
channelMember = __decorate([
    typeorm_1.Entity()
], channelMember);
exports.channelMember = channelMember;
//# sourceMappingURL=channel_member.js.map