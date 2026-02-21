import { Injectable } from '@nestjs/common';
import { ExcelReport, ExcelFormat, GenerateExcelDto } from './dto/generate-excel.dto';

export interface ExcelResult {
  data: string;
  filename: string;
  mimeType: string;
}

@Injectable()
export class ExcelService {
  private readonly headers: Record<ExcelReport, string[]> = {
    [ExcelReport.RENTALS]: ['id', 'clientId', 'vehicleId', 'startDate', 'status', 'totalAmount'],
    [ExcelReport.FINANCIAL]: ['id', 'type', 'category', 'amount', 'date', 'status'],
    [ExcelReport.FLEET]: ['id', 'plate', 'brand', 'model', 'status', 'dailyRate'],
    [ExcelReport.CLIENTS]: ['id', 'name', 'document', 'phone', 'status'],
  };

  getHeaders(report: ExcelReport): string[] {
    return this.headers[report];
  }

  generate(dto: GenerateExcelDto): ExcelResult {
    const headers = this.getHeaders(dto.report);
    const csvData = [
      headers.join(','),
      '# No data available — connect to database for real data',
    ].join('\n');
    const filename = `${dto.report.toLowerCase()}_${Date.now()}.csv`;
    return { data: csvData, filename, mimeType: 'text/csv' };
  }

  generateRentals(): ExcelResult {
    return this.generate({ report: ExcelReport.RENTALS });
  }

  generateFinancial(): ExcelResult {
    return this.generate({ report: ExcelReport.FINANCIAL });
  }

  generateFleet(): ExcelResult {
    return this.generate({ report: ExcelReport.FLEET });
  }
}
