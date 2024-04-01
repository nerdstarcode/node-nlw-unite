
import { User } from '@prisma/client';
import { UserEntity } from './module-name.entity';

export interface UserInterface {
  create(user: User): Promise<any>;
  findAll(
    page: number,
    limit: number,
  ): Promise<User[]>;
  findOne(id: string): Promise<any>;
  delete(id: string): Promise<boolean>;
  countTotal(): Promise<number>;
  update(id: string, data: User): Promise<any | boolean>
}
