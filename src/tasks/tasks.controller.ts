import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';

import { CreateTaskDto } from './dto/create-task-dto';
import { GetTaskFilterDto } from './dto/get-task-filter.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { Task } from './task.entity';
import { TasksService } from './tasks.service';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/user.entity';
@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
  private logger = new Logger('TasksController');

  constructor(private tasksService: TasksService) {}

  @Get()
  async getTasks(
    @Query() filterDto: GetTaskFilterDto,
    @GetUser() user: User,
  ): Promise<Task[]> {
    this.logger.verbose(`Get all task by user ${user.username}`);
    return await this.tasksService.getTasks(filterDto, user);
  }

  @Get('/:id')
  async getTaskById(
    @Param('id') id: string,
    @GetUser() user: User,
  ): Promise<Task> {
    return await this.tasksService.getTaskById(id, user);
  }

  @Post()
  async createTask(
    @Body() createTaskDto: CreateTaskDto,
    @GetUser() user: User,
  ) {
    return await this.tasksService.createTask(createTaskDto, user);
  }

  @Delete('/:id')
  async deleteTask(
    @Param('id') id: string,
    @GetUser() user: User,
  ): Promise<void> {
    return await this.tasksService.deleteTask(id, user);
  }

  @Patch('/:id/status')
  async updateTaskStatus(
    @Param('id') id: string,
    @Body() updateTaskStatusDto: UpdateTaskStatusDto,
    @GetUser() user: User,
  ): Promise<Task> {
    const { status } = updateTaskStatusDto;
    return await this.tasksService.updateTaskStatus(id, status, user);
  }
}
