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
import { DriversService } from './drivers.service';
import { CreateDriverDto } from './dto/create-driver.dto';
import { UpdateDriverDto } from './dto/update-driver.dto';
import { FilterDriverDto } from './dto/filter-driver.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { Driver } from '@mag-system/database';
import { PaginatedResult } from '../../common/interfaces/paginated-result.interface';

@ApiTags('drivers')
@ApiBearerAuth()
@Controller('drivers')
@UseGuards(JwtAuthGuard)
export class DriversController {
  constructor(private readonly driversService: DriversService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new driver' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Driver successfully created',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized - JWT token required',
  })
  create(@Body() createDriverDto: CreateDriverDto): Promise<Driver> {
    return this.driversService.create(createDriverDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all drivers with pagination' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of drivers retrieved successfully',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized - JWT token required',
  })
  findAll(@Query() filter: FilterDriverDto): Promise<PaginatedResult<Driver>> {
    return this.driversService.findAll(filter);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a driver by ID' })
  @ApiParam({ name: 'id', description: 'Driver UUID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Driver found',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Driver not found',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized - JWT token required',
  })
  findOne(@Param('id') id: string): Promise<Driver | null> {
    return this.driversService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a driver' })
  @ApiParam({ name: 'id', description: 'Driver UUID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Driver successfully updated',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Driver not found',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized - JWT token required',
  })
  update(@Param('id') id: string, @Body() updateDriverDto: UpdateDriverDto): Promise<Driver> {
    return this.driversService.update(id, updateDriverDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a driver' })
  @ApiParam({ name: 'id', description: 'Driver UUID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Driver successfully deleted',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Driver not found',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized - JWT token required',
  })
  remove(@Param('id') id: string): Promise<Driver> {
    return this.driversService.remove(id);
  }
}
