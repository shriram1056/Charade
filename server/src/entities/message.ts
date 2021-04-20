import { Field, ObjectType } from 'type-graphql'
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { Channel } from './channel'
import { Users } from './user'

@ObjectType()
@Entity()
export class Message extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id!: number

  @Field({ nullable: true })
  @Column({ nullable: true })
  text: string

  @Field({ nullable: true })
  @Column({ nullable: true })
  url: string

  @Field({ nullable: true })
  @Column({ nullable: true })
  fileType: string

  @Column()
  userId!: number

  @Field(() => Users)
  @ManyToOne(() => Users, (user) => user.messages)
  user: Users

  @Field()
  @Index() // for faster look up
  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @Column()
  channelId!: number

  @Field(() => Channel)
  @ManyToOne(() => Channel, (channel) => channel.messages, {
    onDelete: 'CASCADE',
  })
  channel: Channel
}
