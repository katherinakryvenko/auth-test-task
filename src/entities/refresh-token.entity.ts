import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { UserEntity } from './user.entity';

@Entity()
export class RefreshToken {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'uuid', unique: true })
  token: string;

  @Column('bigint')
  expiresIn: number;

  @ManyToOne(() => UserEntity, (user) => user.id)
  user: UserEntity;
}
