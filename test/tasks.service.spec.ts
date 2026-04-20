import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import type { Repository } from 'typeorm';
import { Task } from '../src/tasks/task.entity';
import { TaskStatus } from '../src/tasks/task-status.enum';
import { TasksService } from '../src/tasks/tasks.service';

describe('TasksService', () => {
  let service: TasksService;
  let repo: Pick<Repository<Task>, 'findOne'>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: getRepositoryToken(Task),
          useValue: {
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    service = moduleRef.get(TasksService);
    repo = moduleRef.get(getRepositoryToken(Task));
  });

  describe('findOne', () => {
    it('returns task when found', async () => {
      const task: Task = {
        id: 'b4d0a6f5-0e44-4e4f-b708-2a2f7a8c0b91',
        title: 'Test task',
        description: null,
        status: TaskStatus.PENDING,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (repo.findOne as jest.Mock).mockResolvedValue(task);

      await expect(service.findOne(task.id)).resolves.toBe(task);
      expect(repo.findOne).toHaveBeenCalledWith({ where: { id: task.id } });
    });

    it('throws NotFoundException when task not found', async () => {
      (repo.findOne as jest.Mock).mockResolvedValue(null);

      await expect(service.findOne('b4d0a6f5-0e44-4e4f-b708-2a2f7a8c0b91')).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });
  });
});

