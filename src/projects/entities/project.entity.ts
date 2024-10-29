import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  ManyToMany,
  JoinColumn,
  JoinTable,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from 'src/users/entities/user.entity';

@Entity({ name: 'projects' }) // table name explicitly
export class Project {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  description?: string; // Marking as optional

  @Column({ type: 'varchar', length: 100, nullable: true })
  location?: string; // Marking as optional

  @Column({ type: 'varchar', length: 50 })
  status: string; // Eg. 'Active', 'Completed', 'On Hold', 'Cancelled', etc.

  @Column({ type: 'date', nullable: true })
  startDate: Date;

  @Column({ type: 'date', nullable: true })
  endDate: Date;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'createdByUserId' })
  createdBy: User;

  @ManyToMany(() => User) // Users assigned to the project
  @JoinTable({
    name: 'project_assigned_users',
    joinColumn: { name: 'projectId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'userId', referencedColumnName: 'id' },
  })
  assignedUsers: User[];

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
