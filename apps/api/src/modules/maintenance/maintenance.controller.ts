import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Query,
  UseGuards,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { MaintenanceService } from './maintenance.service';
import { CreateMaintenanceDto } from './dto/create-maintenance.dto';
import { UpdateMaintenanceDto } from './dto/update-maintenance.dto';
import { FilterMaintenanceDto } from './dto/filter-maintenance.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('maintenance')
@ApiBearerAuth()
@Controller('maintenance')
@UseGuards(JwtAuthGuard)
export class MaintenanceController {
  constructor(private readonly maintenanceService: MaintenanceService) {}

  @Post()
  @ApiOperation({ summary: 'Create a maintenance record' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Maintenance created' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  create(@Body() dto: CreateMaintenanceDto) {
    return this.maintenanceService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all maintenance records with pagination' })
  @ApiResponse({ status: HttpStatus.OK, description: 'List of maintenance records' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  findAll(@Query() filter: FilterMaintenanceDto) {
    return this.maintenanceService.findAll(filter);
  }

  @Get('vehicle/:vehicleId')
  @ApiOperation({ summary: 'Get maintenance records for a vehicle' })
  @ApiParam({ name: 'vehicleId', description: 'Vehicle UUID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Maintenance records for vehicle' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  findByVehicle(@Param('vehicleId') vehicleId: string, @Query() filter: FilterMaintenanceDto) {
    return this.maintenanceService.findByVehicle(vehicleId, filter);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a maintenance record by ID' })
  @ApiParam({ name: 'id', description: 'Maintenance UUID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Maintenance found' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Not found' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  findOne(@Param('id') id: string) {
    return this.maintenanceService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a maintenance record' })
  @ApiParam({ name: 'id', description: 'Maintenance UUID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Maintenance updated' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  update(@Param('id') id: string, @Body() dto: UpdateMaintenanceDto) {
    return this.maintenanceService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a maintenance record' })
  @ApiParam({ name: 'id', description: 'Maintenance UUID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Maintenance deleted' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  remove(@Param('id') id: string) {
    return this.maintenanceService.remove(id);
  }
}
