import { getManager, ObjectType, Repository } from "typeorm";

export default class Database<T> {
  repo: Repository<T>;
  constructor(entityClass: ObjectType<T>) {
    this.repo = getManager().getRepository(entityClass);
  }

  async save(entity: T) {
    try {
      await this.repo.save(entity);
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  async find(filter: object, relations: string[] = []) {
    try {
      return await this.repo.find({
        ...filter,
        relations,
      });
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  async findOne(filter: object, relations: string[] = []) {
    try {
      return await this.repo.findOne({
        ...filter,
        relations,
      });
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }

  async remove(entity: T) {
    try {
      await this.repo.remove(entity);
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }
  async removeMany(entities: T[]) {
    try {
      await this.repo.remove(entities);
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }
}
