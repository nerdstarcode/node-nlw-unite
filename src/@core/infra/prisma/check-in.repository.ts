import { Prisma, PrismaClient, CheckIn } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';
import { AttendeeDTO, AttendeeSelectDTO } from 'src/@core/DTO/Attendees/attendees.dto';
import { CheckInInterface } from 'src/@core/domain/CheckIn/check-in.repository';
export class CheckInPrismaRepository implements CheckInInterface {
  private useOrmRepo: Prisma.CheckInDelegate<DefaultArgs>
  constructor() {
    const prisma: PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs> = new PrismaClient()
    this.useOrmRepo = prisma.checkIn
  }

  async create(checkIn: CheckIn): Promise<CheckIn> {
    return await this.useOrmRepo.create({ data: checkIn });
  }

  async findOne(id: number, select?: any): Promise<any> {
    return await this.useOrmRepo.findUnique({
      select: select!,
      where: { attendeeId: id },
    });
  }

  async findOneGeneric(where: AttendeeDTO): Promise<CheckIn> {
    return await this.useOrmRepo.findUnique({
      where: where as CheckIn
    });
  }

  async findAll(page: number, limit: number): Promise<CheckIn[]> {
    return await this.useOrmRepo.findMany({ skip: page * limit, take: limit });
  }

  async update(id: number, data: CheckIn): Promise<CheckIn | boolean> {
    const existUser = await this.findOne(id);

    if (!existUser) {
      return false;
    }
    await this.useOrmRepo.update({ where: { id: id }, data });

    const validateUpdate = await this.findOne(id);
    return validateUpdate;
  }

  async delete(id: number): Promise<boolean> {
    const existUser = await this.findOne(id);
    if (existUser) {
      return false;
    }
    await this.useOrmRepo.delete({ where: { id: id } });
    const validateSoftDelete = await this.findOne(id);
    if (validateSoftDelete[0].active) {
      return false;
    }

    return true;
  }

  async countTotal() {
    return await this.useOrmRepo.count();
  }

}
