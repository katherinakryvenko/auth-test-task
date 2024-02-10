import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { UserEntity } from './user.entity';

@Entity('refresh_tokens')
export class RefreshTokenEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', unique: true })
  token: string;

  @Column('timestamp')
  expiryDate: Date;

  @Column('timestamp')
  issuedAt: Date;

  @Column()
  userId: number;

  @ManyToOne(() => UserEntity, (user) => user.id)
  user: UserEntity;
}
