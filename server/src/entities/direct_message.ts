import { Field, ObjectType } from 'type-graphql'
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { Team } from './team'
import { Users } from './user'

@ObjectType()
@Entity()
export class DirectMessage extends BaseEntity {
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

  @Field()
  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @Field()
  @Column()
  receiverId: number

  @ManyToOne(() => Users) // many to one without mapping
  receiver: Users

  @Column()
  senderId: number

  @Field()
  @ManyToOne(() => Users) // many to one without mapping
  sender: Users

  @Column()
  teamId: number

  @Field()
  @ManyToOne(() => Team, {
    onDelete: 'CASCADE',
  }) // many to one without mapping
  team: Team
}
