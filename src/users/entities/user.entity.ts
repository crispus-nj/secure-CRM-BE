import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Role } from '../../roles/entities/role.entity';
import { Events } from 'src/events/entities/events.entity';

@Entity({ name: 'users' }) //  table name
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50 })
  firstName: string;

  @Column({ type: 'varchar', length: 50 })
  lastName: string;

  @Column({ type: 'varchar', length: 100, unique: true }) //  email uniqueness
  email: string;

  @Column({ type: 'varchar', length: 15 })
  phoneNumber: string;

  @Column({ type: 'varchar', length: 255 })
  address: string;

  @Column({ type: 'varchar', length: 20, unique: true }) //  KRA PIN uniqueness
  kraPin: string;

  @ManyToOne(() => Role, (role) => role.users, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'roleId' })
  role: Role;

  @Column({ type: 'json', nullable: true }) // storing multiple attachments URLs as JSON
  attachments: string[];

  @Column({ type: 'varchar', length: 255 })
  password: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  user: Promise<Role>;
  
  // Define a one-to-many relationship with Events
  @OneToMany(() => Events, (event) => event.createdBy)
  events: Events[];
}
