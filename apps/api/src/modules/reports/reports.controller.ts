import { Controller, Get, Query, UseGuards, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ReportsService } from './reports.service';
import { FilterReportDto } from './dto/filter-report.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('reports')
@ApiBearerAuth()
@Controller('reports')
@UseGuards(JwtAuthGuard)
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('dashboard')
  @ApiOperation({ summary: 'Get dashboard summary' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Dashboard data' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  getDashboard() {
    return this.reportsService.getDashboard();
  }

  @Get('rentals')
  @ApiOperation({ summary: 'Get rental report' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Rental report' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  getRentalReport(@Query() filter: FilterReportDto) {
    return this.reportsService.getRentalReport(filter);
  }

  @Get('fleet')
  @ApiOperation({ summary: 'Get fleet report' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Fleet report' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  getFleetReport() {
    return this.reportsService.getFleetReport();
  }

  @Get('financial')
  @ApiOperation({ summary: 'Get financial report' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Financial report' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  getFinancialReport(@Query() filter: FilterReportDto) {
    return this.reportsService.getFinancialReport(filter);
  }
}
