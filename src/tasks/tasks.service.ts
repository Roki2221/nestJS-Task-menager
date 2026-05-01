import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './entities/task.entity';
import { TaskStatus } from './task-status.enum';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly repo: Repository<Task>,
  ) {}

  async create(dto: CreateTaskDto): Promise<Task> {
    const task = this.repo.create({
      ...dto,
      description: dto.description ?? null,
      status: TaskStatus.PENDING,
    });

    try {
      return await this.repo.save(task);
    } catch (e) {
      console.error(e);
      throw new InternalServerErrorException('Failed to create task');
    }
  }

  async findAll({
    status,
    page = 1,
    limit = 10,
  }: {
    status?: TaskStatus;
    page?: number;
    limit?: number;
  }) {
    const safeLimit = Math.min(limit, 50);

    const [data, total] = await this.repo.findAndCount({
      where: status ? { status } : {},
      order: { createdAt: 'DESC' },
      skip: (page - 1) * safeLimit,
      take: safeLimit,
    });

    return { data, total, page, limit: safeLimit };
  }

  async findOne(id: string): Promise<Task> {
    const task = await this.repo.findOneBy({ id });
    if (!task) {
      throw new NotFoundException(`Task with id "${id}" not found`);
    }
    return task;
  }

  async update(id: string, dto: UpdateTaskDto): Promise<Task> {
    const result = await this.repo.update(id, dto);

    if (result.affected === 0) {
      throw new NotFoundException(`Task with id "${id}" not found`);
    }

    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const result = await this.repo.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Task with id "${id}" not found`);
    }
  }
}
