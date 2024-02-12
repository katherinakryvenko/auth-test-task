import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from 'src/entities/user.entity';
import { UserProfileDto } from './dtos/user-profile.dto';

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

  async getUserProfile(username: string): Promise<UserProfileDto> {
    const userEntity = await this.findByUsername(username);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userProfile } = userEntity;
    return userProfile;
  }
}
