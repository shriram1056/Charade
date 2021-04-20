import { Field, ObjectType } from 'type-graphql'
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { User } from '../resolvers/Team'
import { Channel } from './channel'

@ObjectType()
@Entity()
export class Team extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id!: number

  @Field()
  @Column({ unique: true })
  name!: string

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @Field()
  admin: boolean

  @Field(() => [User], { nullable: true })
  directMessageUsers: User[]

  @Field(() => [Channel], { nullable: true })
  @OneToMany(() => Channel, (channel) => channel.team)
  channels: Channel[]
}
