import { Field, ObjectType } from 'type-graphql'
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm'
import { Message } from './message'
import { Team } from './team'

@ObjectType()
@Unique('Channel', ['teamId', 'name'])
@Entity()
export class Channel extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id!: number

  @Field()
  @Column()
  name!: string

  @Field()
  @Column({ default: true })
  public!: boolean

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @Column()
  teamId!: number

  @ManyToOne(() => Team, (team) => team.channels, { onDelete: 'CASCADE' })
  team: Team

  //@Field(() => [Message])
  @OneToMany(() => Message, (message) => message.channel)
  messages: Message[]

  // @Field(() => [Users], { nullable: true })
  // user: [Users]
}
