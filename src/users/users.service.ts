import { Injectable } from '@nestjs/common';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';

@Injectable()
export class UsersService {
  users = [
    {
      id: 1,
      username: 'John',
      password: 'not-secure',
    },
    {
      id: 2,
      username: 'Doe',
      password: 'not-secure',
    },
  ];

  async create(createUserInput: CreateUserInput) {
    const user = {
      ...createUserInput,
      id: this.users.length + 1,
    };

    this.users.push(user);

    return user;
  }

  async findAll() {
    return this.users;
  }

  async findOne(username: string) {
    return this.users.find((user) => user.username === username);
  }

  async update(id: number, updateUserInput: UpdateUserInput) {
    return `This action updates a #${id} user`;
  }

  async remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
