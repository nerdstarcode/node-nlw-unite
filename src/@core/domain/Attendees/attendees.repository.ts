
import { Attendee } from '@prisma/client';
export interface AttendeeInterface {
  create(attendee: Attendee): Promise<any>;
  findAll(
    page: number,
    limit: number,
  ): Promise<Attendee[]>;
  findOne(id: number): Promise<any>;
  delete(id: number): Promise<boolean>;
  countTotal(): Promise<number>;
  update(id: number, data: Attendee): Promise<any | boolean>
}
