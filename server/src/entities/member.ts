import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm'
import { Team } from './team'
import { Users } from './user'

// m to n
// many to many
// user <-> posts
// user -> join table <- posts
// user -> updoot <- posts

@Entity()
@Unique('TeamMember', ['teamId', 'userId']) // unique rows
export class TeamMember extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  userId: number

  @ManyToOne(() => Users)
  user: Users

  @Column()
  teamId: number

  @ManyToOne(() => Team, {
    onDelete: 'CASCADE',
  })
  team: Team

  @CreateDateColumn()
  createdAt: Date

  @Column({ default: false })
  admin: boolean

  @UpdateDateColumn()
  updatedAt: Date
}
