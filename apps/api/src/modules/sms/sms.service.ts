import { Injectable, BadRequestException } from '@nestjs/common';
import { SendSmsDto } from './dto/send-sms.dto';
import { randomUUID } from 'crypto';

export interface SmsJob {
  jobId: string;
  to: string;
  message: string;
  sender?: string;
  status: 'queued' | 'sent' | 'failed';
  createdAt: Date;
}

@Injectable()
export class SmsService {
  private readonly queue: SmsJob[] = [];

  send(dto: SendSmsDto): { jobId: string; status: string } {
    if (dto.message.length > 160) {
      throw new BadRequestException('SMS message must be 160 characters or fewer');
    }
    const jobId = randomUUID();
    this.queue.push({
      jobId,
      to: dto.to,
      message: dto.message,
      sender: dto.sender,
      status: 'queued',
      createdAt: new Date(),
    });
    return { jobId, status: 'queued' };
  }

  getQueue(): SmsJob[] {
    return this.queue.filter((j) => j.status === 'queued');
  }

  getJob(jobId: string): SmsJob | undefined {
    return this.queue.find((j) => j.jobId === jobId);
  }
}
