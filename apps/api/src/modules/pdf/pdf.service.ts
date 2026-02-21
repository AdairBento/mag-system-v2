import { Injectable } from '@nestjs/common';
import { GeneratePdfDto, PdfTemplate } from './dto/generate-pdf.dto';
import { randomUUID } from 'crypto';

export interface PdfJob {
  jobId: string;
  template: PdfTemplate;
  resourceId: string;
  status: 'processing' | 'completed' | 'failed';
  estimatedUrl: string;
  createdAt: Date;
}

@Injectable()
export class PdfService {
  private readonly jobs = new Map<string, PdfJob>();

  generate(dto: GeneratePdfDto): { jobId: string; status: string; estimatedUrl: string } {
    const jobId = randomUUID();
    const estimatedUrl = `/pdf/files/${jobId}.pdf`;
    const job: PdfJob = {
      jobId,
      template: dto.template,
      resourceId: dto.resourceId,
      status: 'processing',
      estimatedUrl,
      createdAt: new Date(),
    };
    this.jobs.set(jobId, job);
    return { jobId, status: 'processing', estimatedUrl };
  }

  getStatus(jobId: string): PdfJob | undefined {
    return this.jobs.get(jobId);
  }

  getContractPdf(contractId: string) {
    return this.generate({ template: PdfTemplate.CONTRACT, resourceId: contractId });
  }

  getInvoicePdf(invoiceId: string) {
    return this.generate({ template: PdfTemplate.INVOICE, resourceId: invoiceId });
  }
}
