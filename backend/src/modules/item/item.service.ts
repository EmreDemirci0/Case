import { Injectable } from '@nestjs/common';

@Injectable()
export class ItemService {
  // Örnek methodlar
  async findAll(): Promise<any> {
    // return this.itemRepository.find();
  }

  async findOne(id: string): Promise<any> {
    // return this.itemRepository.findOne({ where: { id } });
  }

  async create(data: any): Promise<any> {
    // return this.itemRepository.save(data);
  }

  async update(id: string, data: any): Promise<any> {
    // return this.itemRepository.update(id, data);
  }

  async delete(id: string): Promise<any> {
    // return this.itemRepository.delete(id);
  }
}
