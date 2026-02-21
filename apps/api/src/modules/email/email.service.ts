import { Injectable } from '@nestjs/common';
import { SendEmailDto } from './dto/send-email.dto';
import { randomUUID } from 'crypto';

export interface EmailJob {
  jobId: string;
  to: string;
  subject: string;
  renderedBody: string;
  status: 'queued' | 'sent' | 'failed';
  createdAt: Date;
}

@Injectable()
export class EmailService {
  private readonly queue: EmailJob[] = [];

  private renderTemplate(template: string, data: Record<string, any> = {}): string {
    return template.replace(/\{\{(\w+)\}\}/g, (_match, key) => String(data[key] ?? ''));
  }

  send(dto: SendEmailDto): { jobId: string; status: string } {
    const jobId = randomUUID();
    const renderedBody = this.renderTemplate(dto.template, dto.data ?? {});
    this.queue.push({
      jobId,
      to: dto.to,
      subject: dto.subject,
      renderedBody,
      status: 'queued',
      createdAt: new Date(),
    });
    return { jobId, status: 'queued' };
  }

  getQueue(): EmailJob[] {
    return this.queue.filter((j) => j.status === 'queued');
  }

  getJob(jobId: string): EmailJob | undefined {
    return this.queue.find((j) => j.jobId === jobId);
  }
}
