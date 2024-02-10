import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from 'src/entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async create(username: string, password: string): Promise<UserEntity> {
    const newUser = this.userRepository.create({
      username,
      password: password,
    });

    await this.userRepository.save(newUser);
    return newUser;
  }

  async findByUsername(username: string): Promise<UserEntity> {
    const user = await this.userRepository.findOne({ where: { username } });
    return user;
  }
}
