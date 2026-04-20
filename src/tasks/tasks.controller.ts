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
import { ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { GetTasksQueryDto } from './dto/get-tasks-query.dto';
import { Task } from './task.entity';

@ApiTags('tasks')
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @ApiResponse({ status: 201, type: Task })
  createTask(@Body() dto: CreateTaskDto): Promise<Task> {
    return this.tasksService.create(dto);
  }
  @Get()
  @ApiQuery({ name: 'status', required: false })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
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
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiResponse({ status: 200, type: Task })
  @ApiResponse({ status: 404, description: 'Task not found' })
  getTask(@Param('id', new ParseUUIDPipe()) id: string): Promise<Task> {
    return this.tasksService.findOne(id);
  }

  @Patch(':id')
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiResponse({ status: 200, type: Task })
  @ApiResponse({ status: 404, description: 'Task not found' })
  updateTask(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateTaskDto,
  ): Promise<Task> {
    return this.tasksService.update(id, dto);
  }

  @Delete(':id')
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiResponse({ status: 200, schema: { example: { ok: true } } })
  @ApiResponse({ status: 404, description: 'Task not found' })
  async deleteTask(@Param('id', new ParseUUIDPipe()) id: string) {
    await this.tasksService.remove(id);
    return { ok: true };
  }
}
