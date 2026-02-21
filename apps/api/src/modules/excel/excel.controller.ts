import { Controller, Get, Post, Body, UseGuards, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ExcelService } from './excel.service';
import { GenerateExcelDto } from './dto/generate-excel.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('excel')
@ApiBearerAuth()
@Controller('excel')
@UseGuards(JwtAuthGuard)
export class ExcelController {
  constructor(private readonly excelService: ExcelService) {}

  @Post('generate')
  @ApiOperation({ summary: 'Generate an Excel/CSV export' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Export generated' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  generate(@Body() dto: GenerateExcelDto) {
    return this.excelService.generate(dto);
  }

  @Get('rentals')
  @ApiOperation({ summary: 'Export rentals to CSV' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Rentals CSV' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  generateRentals() {
    return this.excelService.generateRentals();
  }

  @Get('financial')
  @ApiOperation({ summary: 'Export financial data to CSV' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Financial CSV' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  generateFinancial() {
    return this.excelService.generateFinancial();
  }

  @Get('fleet')
  @ApiOperation({ summary: 'Export fleet data to CSV' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Fleet CSV' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  generateFleet() {
    return this.excelService.generateFleet();
  }
}
