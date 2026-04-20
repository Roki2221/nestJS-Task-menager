import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { GetTasksQueryDto } from './dto/get-tasks-query.dto';
import { Task } from './task.entity';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  createTask(@Body() dto: CreateTaskDto): Promise<Task> {
    return this.tasksService.create(dto);
  }
  @Get()
  getTasks(
    @Query() query: GetTasksQueryDto,
  ): Promise<{ data: Task[]; total: number; page: number; limit: number }> {
    return this.tasksService.findAll({
      status: query.status,
      page: query.page,
      limit: query.limit,
    });
  }

  @Get(':id')
  getTask(@Param('id', new ParseUUIDPipe()) id: string): Promise<Task> {
    return this.tasksService.findOne(id);
  }

  @Patch(':id')
  updateTask(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateTaskDto,
  ): Promise<Task> {
    return this.tasksService.update(id, dto);
  }

  @Delete(':id')
  async deleteTask(@Param('id', new ParseUUIDPipe()) id: string) {
    await this.tasksService.remove(id);
    return { ok: true };
  }
}
