import { UserInterface } from 'src/@core/domain/module-name/module-name.repository';
import { FindOptionsOrderValue, Repository } from 'typeorm';
import { UserEntity } from 'src/@core/domain/module-name/module-name.entity';
import { Prisma, PrismaClient, User } from '@prisma/client';
import { DefaultArgs, UserArgs } from '@prisma/client/runtime/library';
export class UserRepository implements UserInterface {
  private useOrmRepo: Prisma.UserDelegate<DefaultArgs>
  constructor() {
    const prisma: PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs> = new PrismaClient()
    this.useOrmRepo = prisma.user
  }

  async create(user: User): Promise<User> {
    return await this.useOrmRepo.create({ data: user });
  }

  async findOne(id: string): Promise<User> {
    return await this.useOrmRepo.findUnique({
      where: { id: id },
    });
  }

  async findAll(page: number, limit: number): Promise<User[]> {
    return await this.useOrmRepo.findMany({ skip: page * limit, take: limit });
  }

  async update(id: string, data: User): Promise<User | boolean> {
    const existUser = await this.findOne(id);

    if (!existUser) {
      return false;
    }
    await this.useOrmRepo.update({ where: { id: id }, data });

    const validateUpdate = await this.findOne(id);
    return validateUpdate;
  }

  async delete(id: string): Promise<boolean> {
    const existUser = await this.findOne(id);
    if (existUser) {
      return false;
    }
    await this.useOrmRepo.update({ where: { id: id }, data: { active: false } });
    const validateSoftDelete = await this.findOne(id);
    if (validateSoftDelete[0].active) {
      return false;
    }

    return true;
  }

  async countTotalActives() {
    return await this.useOrmRepo.count({ where: { active: true } });
  }

  async countTotal() {
    return await this.useOrmRepo.count();
  }
}
