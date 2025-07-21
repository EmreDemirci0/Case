import { Injectable } from '@nestjs/common';

@Injectable()
export class ItemInstanceService {
  async findAll(): Promise<any> {}
  async findOne(id: string): Promise<any> {}
  async create(data: any): Promise<any> {}
  async update(id: string, data: any): Promise<any> {}
  async delete(id: string): Promise<any> {}
}
