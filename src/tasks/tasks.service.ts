import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { Task } from './task.entity';
import { TaskStatus } from './task-status.enum';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly tasksRepository: Repository<Task>,
  ) {}

  async create(dto: CreateTaskDto): Promise<Task> {
    try {
      const task = this.tasksRepository.create({
        title: dto.title,
        description: dto.description ?? null,
        status: TaskStatus.PENDING,
      });
      return await this.tasksRepository.save(task);
    } catch {
      throw new InternalServerErrorException('Failed to create task');
    }
  }

  async findAll(params: {
    status?: TaskStatus;
    page?: number;
    limit?: number;
  }): Promise<{ data: Task[]; total: number; page: number; limit: number }> {
    const page = params.page ?? 1;
    const limit = params.limit ?? 10;

    const where: FindOptionsWhere<Task> = {};
    if (params.status) where.status = params.status;

    const [data, total] = await this.tasksRepository.findAndCount({
      where,
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return { data, total, page, limit };
  }

  async findOne(id: string): Promise<Task> {
    const task = await this.tasksRepository.findOne({ where: { id } });
    if (!task) throw new NotFoundException(`Task with id "${id}" not found`);
    return task;
  }

  async update(id: string, dto: UpdateTaskDto): Promise<Task> {
    const task = await this.findOne(id);

    if (dto.title !== undefined) task.title = dto.title;
    if (dto.description !== undefined) task.description = dto.description;
    if (dto.status !== undefined) task.status = dto.status;

    try {
      return await this.tasksRepository.save(task);
    } catch {
      throw new BadRequestException('Failed to update task');
    }
  }

  async remove(id: string): Promise<void> {
    const task = await this.findOne(id);
    try {
      await this.tasksRepository.remove(task);
    } catch {
      throw new InternalServerErrorException('Failed to delete task');
    }
  }
}
