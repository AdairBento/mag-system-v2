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
import { RentalsService } from './rentals.service';
import { CreateRentalDto } from './dto/create-rental.dto';
import { UpdateRentalDto } from './dto/update-rental.dto';
import { FilterRentalDto } from './dto/filter-rental.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { Rental } from '@mag-system/database';
import { PaginatedResult } from '../../common/interfaces/paginated-result.interface';

@ApiTags('rentals')
@ApiBearerAuth()
@Controller('rentals')
@UseGuards(JwtAuthGuard)
export class RentalsController {
  constructor(private readonly rentalsService: RentalsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new rental' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Rental successfully created',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized - JWT token required',
  })
  create(@Body() createRentalDto: CreateRentalDto): Promise<Rental> {
    return this.rentalsService.create(createRentalDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all rentals with pagination' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of rentals retrieved successfully',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized - JWT token required',
  })
  findAll(@Query() filter: FilterRentalDto): Promise<PaginatedResult<Rental>> {
    return this.rentalsService.findAll(filter);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a rental by ID' })
  @ApiParam({ name: 'id', description: 'Rental UUID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Rental found',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Rental not found',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized - JWT token required',
  })
  findOne(@Param('id') id: string): Promise<Rental | null> {
    return this.rentalsService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a rental' })
  @ApiParam({ name: 'id', description: 'Rental UUID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Rental successfully updated',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Rental not found',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized - JWT token required',
  })
  update(@Param('id') id: string, @Body() updateRentalDto: UpdateRentalDto): Promise<Rental> {
    return this.rentalsService.update(id, updateRentalDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a rental' })
  @ApiParam({ name: 'id', description: 'Rental UUID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Rental successfully deleted',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Rental not found',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized - JWT token required',
  })
  remove(@Param('id') id: string): Promise<Rental> {
    return this.rentalsService.remove(id);
  }
}
