import { z } from "zod";
import { Logger } from "@nestjs/common";
import { RedisClientType, createClient } from "redis";
import { RedisClientOn } from "src/main";

type propsRedisBase = { expires?: number, timeout?: number }
const logger = new Logger('Redis Connection');

export class RedisClient {
  private props: propsRedisBase = {};
  public RedisClient: RedisClientType
  constructor(props: propsRedisBase) {
    try {
      this.props = props
      this.RedisClient = RedisClientOn
    } catch (err) {
      console.error(err)
      throw err.issues
    }
  }

  async setValue(key: string, value: string, expires?: number) {
    try {
      await this.RedisClient.set(key, value, { EX: Number(expires || this.props?.expires)! })
    } catch (err) {
      console.error(err)
    }
  }

  async setHashJsonValue(key: string, ObjectRef: any, expires?: number) {
    try {
      for (const Objectkey in ObjectRef) {
        if (Object.prototype.hasOwnProperty.call(ObjectRef, Objectkey)) {
          await this.RedisClient.hSet(key, Objectkey, JSON.stringify(ObjectRef[Objectkey]))
        }
      }
    } catch (err) {
      console.error(err)
    }
    // await this.RedisClient.set(key, JSON.stringify(value), { EX: expires || this.props?.expires! })
  }
  async getHashjJsonValue(key: string) {
    try {
      const ReturnRedis = await this.RedisClient.hGetAll(key)
      for (const key in ReturnRedis) {
        if (Object.prototype.hasOwnProperty.call(ReturnRedis, key)) {
          ReturnRedis[key] = JSON.parse(ReturnRedis[key]);
        }
      }
      return ReturnRedis
    } catch (err) {
      console.error(err)
    }
  }
  async setJSONValue(key: string, value: any, expires?: number) {
    try {
      await this.RedisClient.set(key, JSON.stringify(value), { EX: expires || this.props?.expires! })
    } catch (err) {
      console.error(err)
    }
  }

  async getValue(key: string) {
    try {
      await this.RedisClient.get(key)
    } catch (err) {
      console.error(err)
    }
  }

  async getJSONValue(key: string) {
    try {
      JSON.parse(await this.RedisClient.get(key))
    } catch (err) {
      console.error(err)
    }
  }

  static create(
    props: propsRedisBase,
  ): RedisClient {
    return new RedisClient(
      props,
    )
  }



  toJSON() {
    return this.props;
  }
}

