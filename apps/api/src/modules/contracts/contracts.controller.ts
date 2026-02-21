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
import { ContractsService } from './contracts.service';
import { CreateContractDto } from './dto/create-contract.dto';
import { UpdateContractDto } from './dto/update-contract.dto';
import { FilterContractDto } from './dto/filter-contract.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('contracts')
@ApiBearerAuth()
@Controller('contracts')
@UseGuards(JwtAuthGuard)
export class ContractsController {
  constructor(private readonly contractsService: ContractsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new contract' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Contract created' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  create(@Body() dto: CreateContractDto) {
    return this.contractsService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all contracts with pagination' })
  @ApiResponse({ status: HttpStatus.OK, description: 'List of contracts' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  findAll(@Query() filter: FilterContractDto) {
    return this.contractsService.findAll(filter);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a contract by ID' })
  @ApiParam({ name: 'id', description: 'Contract UUID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Contract found' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Not found' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  findOne(@Param('id') id: string) {
    return this.contractsService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a contract' })
  @ApiParam({ name: 'id', description: 'Contract UUID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Contract updated' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  update(@Param('id') id: string, @Body() dto: UpdateContractDto) {
    return this.contractsService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a contract' })
  @ApiParam({ name: 'id', description: 'Contract UUID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Contract deleted' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  remove(@Param('id') id: string) {
    return this.contractsService.remove(id);
  }

  @Post(':id/sign')
  @ApiOperation({ summary: 'Sign a contract' })
  @ApiParam({ name: 'id', description: 'Contract UUID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Contract signed' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  sign(@Param('id') id: string) {
    return this.contractsService.sign(id);
  }
}
