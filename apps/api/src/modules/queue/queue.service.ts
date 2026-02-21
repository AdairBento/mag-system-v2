import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateJobDto, JobPriority } from './dto/create-job.dto';
import { randomUUID } from 'crypto';

export type JobStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'CANCELLED' | 'FAILED';

export interface Job {
  id: string;
  name: string;
  payload: Record<string, any>;
  priority: JobPriority;
  delay: number;
  retries: number;
  status: JobStatus;
  createdAt: Date;
  updatedAt: Date;
}

@Injectable()
export class QueueService {
  private readonly jobs = new Map<string, Job>();

  enqueue(dto: CreateJobDto): Job {
    const id = randomUUID();
    const job: Job = {
      id,
      name: dto.name,
      payload: dto.payload ?? {},
      priority: dto.priority ?? JobPriority.NORMAL,
      delay: dto.delay ?? 0,
      retries: dto.retries ?? 0,
      status: 'PENDING',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.jobs.set(id, job);
    return job;
  }

  process(id: string): Job {
    const job = this.getJob(id);
    job.status = 'PROCESSING';
    job.updatedAt = new Date();
    // simulate completion
    job.status = 'COMPLETED';
    job.updatedAt = new Date();
    return job;
  }

  getJob(id: string): Job {
    const job = this.jobs.get(id);
    if (!job) throw new NotFoundException(`Job ${id} not found`);
    return job;
  }

  listJobs(status?: JobStatus): Job[] {
    const all = Array.from(this.jobs.values());
    return status ? all.filter((j) => j.status === status) : all;
  }

  cancelJob(id: string): Job {
    const job = this.getJob(id);
    job.status = 'CANCELLED';
    job.updatedAt = new Date();
    return job;
  }
}
