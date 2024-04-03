import { Attendee } from "@prisma/client";
import { AttendeeSchema, CreateAttendeeSchema } from "src/@core/DTO/Attendees/attendees.dto";
import { CreateEventSchema, EventSchema } from "src/@core/DTO/Events/events.dto";
import { v4 as uuidv4 } from 'uuid';

export class AttendeeEntity {
  private newAttendee: boolean
  private props: Attendee;

  constructor(props: Attendee, newEvent: boolean) {
    this.props = props;
  }
  static generateSlug(text: string) {
    return text
      .trim()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^\u\s-]/g, "")
      .replace(/\s*/g, "-")
  }
  static create(
    props: Omit<Attendee, "id" | "public_id">,
    newEvent = true,
  ) {
    CreateAttendeeSchema.parse(props)
    return new AttendeeEntity(
      props as Attendee,
      newEvent,
    );
  }

  static update(
    props: Attendee,
    newEvent = false,
    softDelete: boolean
  ) {
    AttendeeSchema.parse(props)
    return new AttendeeEntity(
      props,
      newEvent,
    );
  }

  get active(): boolean {
    return this.props.active;
  }

  set active(active: boolean) {
    this.props.active = active;
  }

  get id(): number {
    return this.props.id;
  }

  set id(id: number) {
    this.props.id = id;
  }

  get createdAt(): any {
    return this.props.createdAt;
  }

  set createdAt(createdAt: any) {
    this.props.createdAt = createdAt;
  }

  get discord(): string {
    return this.props.discord;
  }

  set discord(discord: string) {
    this.props.discord = discord;
  }

  get email(): string {
    return this.props.email;
  }

  set email(email: string) {
    this.props.email = email;
  }

  get eventId(): string {
    return this.props.eventId;
  }

  set eventId(eventId: string) {
    this.props.eventId = eventId;
  }

  get name(): string {
    return this.props.name;
  }

  set name(name: string) {
    this.props.name = name;
  }

  get nick(): string {
    return this.props.nick;
  }

  set nick(nick: string) {
    this.props.nick = nick;
  }

  get updatedAt(): any {
    return this.props.updatedAt;
  }

  set updatedAt(updatedAt: any) {
    this.props.updatedAt = updatedAt;
  }

  toJSON() {
    return {
      ...this.props,
    };
  }
}