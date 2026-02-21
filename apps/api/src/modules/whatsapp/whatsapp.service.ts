import { Injectable } from '@nestjs/common';
import { SendWhatsappDto } from './dto/send-whatsapp.dto';
import { randomUUID } from 'crypto';

type WhatsappJobType = 'text' | 'media' | 'template';

export interface WhatsappJob {
  jobId: string;
  to: string;
  type: WhatsappJobType;
  status: 'queued' | 'sent' | 'failed';
  payload: Record<string, any>;
  createdAt: Date;
}

@Injectable()
export class WhatsappService {
  private readonly queue: WhatsappJob[] = [];

  send(dto: SendWhatsappDto): { jobId: string; type: WhatsappJobType; status: string } {
    const jobId = randomUUID();
    let type: WhatsappJobType = 'text';
    if (dto.templateName) type = 'template';
    else if (dto.mediaUrl) type = 'media';

    this.queue.push({
      jobId,
      to: dto.to,
      type,
      status: 'queued',
      payload: {
        message: dto.message,
        mediaUrl: dto.mediaUrl,
        templateName: dto.templateName,
        templateParams: dto.templateParams,
      },
      createdAt: new Date(),
    });

    return { jobId, type, status: 'queued' };
  }

  getQueue(): WhatsappJob[] {
    return this.queue.filter((j) => j.status === 'queued');
  }

  getJob(jobId: string): WhatsappJob | undefined {
    return this.queue.find((j) => j.jobId === jobId);
  }
}
