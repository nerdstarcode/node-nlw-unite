import { EventInterface } from 'src/@core/domain/Events/event.repository';
import { Prisma, PrismaClient, Event } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';
import { EventDTO, EventSelectDTO } from 'src/@core/DTO/Events/events.dto';
export class EventPrismaRepository implements EventInterface {
  private useOrmRepo: Prisma.EventDelegate<DefaultArgs>
  constructor() {
    const prisma: PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs> = new PrismaClient()
    this.useOrmRepo = prisma.event
  }

  async create(event: Event): Promise<Event> {
    return await this.useOrmRepo.create({ data: event });
  }

  async findOne(id: string, select?: EventSelectDTO): Promise<Event> {
    return await this.useOrmRepo.findUnique({
      select: select!,
      where: { id: id },
    });
  }
  async findOneGeneric(where: EventDTO): Promise<Event> {
    return await this.useOrmRepo.findUnique({
      where: where as Event
    });
  }

  async findAll(page: number, limit: number): Promise<Event[]> {
    return await this.useOrmRepo.findMany({ skip: page * limit, take: limit });
  }

  async update(id: string, data: Event): Promise<Event | boolean> {
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
