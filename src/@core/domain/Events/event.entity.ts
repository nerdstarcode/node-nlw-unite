import { Event } from "@prisma/client";
import { CreateEventSchema, EventSchema } from "src/@core/DTO/Events/events.dto";
import { v4 as uuidv4 } from 'uuid';

export class EventEntity {
  private newEvent: boolean
  private props: Event;

  constructor(props: Event, newEvent: boolean) {
    this.props = props;
    this.slug = this.title.toLowerCase().replace(' ', '-')
  }

  static create(
    props: Pick<Event, "title" | "details" | "maximumAttendees" | "slug">,
    newEvent = true,
  ) {
    CreateEventSchema.parse(props)
    return new EventEntity(
      props as Event,
      newEvent,
    );
  }

  static update(
    props: Event,
    newEvent = false,
    softDelete: boolean
  ) {
    EventSchema.parse(props)
    return new EventEntity(
      props,
      newEvent,
    );
  }

  get details(): string {
    return this.props.details;
  }

  set details(details: string) {
    this.props.details = details;
  }

  get id(): string {
    return this.props.id;
  }

  set id(id: string) {
    this.props.id = id;
  }

  get public_id(): number {
    return this.props.public_id;
  }

  set public_id(public_id: number) {
    this.props.public_id = public_id;
  }

  get maximumAttendees(): number {
    return this.props.maximumAttendees;
  }

  set maximumAttendees(maximumAttendees: number) {
    this.props.maximumAttendees = maximumAttendees;
  }

  get title(): string {
    return this.props.title;
  }

  set title(title: string) {
    this.props.title = title;
  }

  get slug(): string {
    return this.props.slug;
  }

  set slug(slug: string) {
    this.props.slug = slug;
  }

  toJSON() {
    return {
      ...this.props,
    };
  }
}