import { Prisma, PrismaClient, Attendee } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';
import { AttendeeDTO, AttendeeSelectDTO } from 'src/@core/DTO/Attendees/attendees.dto';
import { AttendeeInterface } from 'src/@core/domain/Attendees/attendees.repository';
export class AttendeePrismaRepository implements AttendeeInterface {
  private useOrmRepo: Prisma.AttendeeDelegate<DefaultArgs>
  constructor() {
    const prisma: PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs> = new PrismaClient()
    this.useOrmRepo = prisma.attendee
  }

  async create(attendee: Attendee): Promise<Attendee> {
    return await this.useOrmRepo.create({ data: attendee });
  }

  async findOne(id: number, select?: AttendeeSelectDTO): Promise<Attendee> {
    return await this.useOrmRepo.findUnique({
      select: select!,
      where: { id: id },
    });
  }

  async findOneGeneric(where: AttendeeDTO): Promise<Attendee> {
    return await this.useOrmRepo.findUnique({
      where: where as Attendee
    });
  }

  async findAll(page: number, limit: number, select?: Attendee): Promise<any[]> {
    return await this.useOrmRepo.findMany(
      {
        select: {
          id: true,
          name: true,
          email: true,
          checkIn: { select: { createdAt: true } },
        },
        skip: (page - 1) * limit,
        take: limit,
        where: {
          ...select,
          name: { contains: select?.name! }!
        },
        orderBy: {
          createdAt: 'asc'
        }
      });
  }

  async update(id: number, data: Attendee): Promise<Attendee | boolean> {
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

  async countTotal(select?: Attendee) {
    return await this.useOrmRepo.count({
      where: {
        ...select,
        name: { contains: select?.name! }!
      }
    });
  }

  async countAmountOfAttendeesForEvent(eventId: string) {
    return await this.useOrmRepo.count({ where: { eventId } });
  }
}
