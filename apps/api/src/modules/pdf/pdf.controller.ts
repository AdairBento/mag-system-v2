import { Controller, Get, Post, Body, Param, UseGuards, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { PdfService } from './pdf.service';
import { GeneratePdfDto } from './dto/generate-pdf.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('pdf')
@ApiBearerAuth()
@Controller('pdf')
@UseGuards(JwtAuthGuard)
export class PdfController {
  constructor(private readonly pdfService: PdfService) {}

  @Post('generate')
  @ApiOperation({ summary: 'Generate a PDF document' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'PDF generation started' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  generate(@Body() dto: GeneratePdfDto) {
    return this.pdfService.generate(dto);
  }

  @Get('status/:jobId')
  @ApiOperation({ summary: 'Get PDF generation status' })
  @ApiParam({ name: 'jobId', description: 'Job UUID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Job status' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  getStatus(@Param('jobId') jobId: string) {
    return this.pdfService.getStatus(jobId);
  }

  @Get('contract/:contractId')
  @ApiOperation({ summary: 'Generate contract PDF' })
  @ApiParam({ name: 'contractId', description: 'Contract UUID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'PDF job started' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  getContractPdf(@Param('contractId') contractId: string) {
    return this.pdfService.getContractPdf(contractId);
  }

  @Get('invoice/:invoiceId')
  @ApiOperation({ summary: 'Generate invoice PDF' })
  @ApiParam({ name: 'invoiceId', description: 'Invoice UUID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'PDF job started' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  getInvoicePdf(@Param('invoiceId') invoiceId: string) {
    return this.pdfService.getInvoicePdf(invoiceId);
  }
}
