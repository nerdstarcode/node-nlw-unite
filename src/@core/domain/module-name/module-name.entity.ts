import { User } from "@prisma/client";
import { v4 as uuidv4 } from 'uuid';

export class UserEntity {
  private id?: string;
  private active?: boolean;
  private newUser: boolean
  private props: User;

  constructor(props: User, newUser: boolean, id?: string, softDelete?: boolean) {
    this.props = props;
    switch (true) {
      case (newUser): {
        this.id = uuidv4()
        this.props.startedDate = new Date()
      }
      case (!newUser): {
        this.id = id
      }
      case (softDelete): {
        this.active = false
      }
      case (!softDelete): {
        this.active = true
      }
      default: {
        this.props.updated_at = new Date()
      }
    }
  }

  static create(
    props: User,
    newUser = true,
  ) {
    // props.crq_situation = Situations.OPEN;
    return new UserEntity(
      props,
      newUser,
    );
  }

  static update(
    props: User,
    newUser = false,
    id: uuidv4,
    softDelete: boolean
  ) {
    // props.crq_situation = Situations.OPEN;
    return new UserEntity(
      props,
      newUser,
      id,
      softDelete
    );
  }

  // Getter for the 'name' property
  get getName(): string {
    return this.props.name;
  }

  // Setter for the 'name' property
  set setName(name: string) {
    this.props.name = name;
  }

  toJSON() {
    return {
      id: this.id,
      active: this.active,
      ...this.props,
      startedDate: this.props.startedDate,
      updated_at: this.props.updated_at,
    };
  }
}