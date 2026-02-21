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
import { FinanceiroService } from './financeiro.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { FilterInvoiceDto } from './dto/filter-invoice.dto';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { FilterTransactionDto } from './dto/filter-transaction.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('financeiro')
@ApiBearerAuth()
@Controller('financeiro')
@UseGuards(JwtAuthGuard)
export class FinanceiroController {
  constructor(private readonly financeiroService: FinanceiroService) {}

  @Get('summary')
  @ApiOperation({ summary: 'Get financial summary' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Financial summary' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  getSummary() {
    return this.financeiroService.getSummary();
  }

  @Post('invoices')
  @ApiOperation({ summary: 'Create an invoice' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Invoice created' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  createInvoice(@Body() dto: CreateInvoiceDto) {
    return this.financeiroService.createInvoice(dto);
  }

  @Get('invoices')
  @ApiOperation({ summary: 'Get all invoices' })
  @ApiResponse({ status: HttpStatus.OK, description: 'List of invoices' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  findAllInvoices(@Query() filter: FilterInvoiceDto) {
    return this.financeiroService.findAllInvoices(filter);
  }

  @Get('invoices/:id')
  @ApiOperation({ summary: 'Get an invoice by ID' })
  @ApiParam({ name: 'id', description: 'Invoice UUID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Invoice found' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  findOneInvoice(@Param('id') id: string) {
    return this.financeiroService.findOneInvoice(id);
  }

  @Put('invoices/:id')
  @ApiOperation({ summary: 'Update an invoice' })
  @ApiParam({ name: 'id', description: 'Invoice UUID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Invoice updated' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  updateInvoice(@Param('id') id: string, @Body() dto: UpdateInvoiceDto) {
    return this.financeiroService.updateInvoice(id, dto);
  }

  @Delete('invoices/:id')
  @ApiOperation({ summary: 'Delete an invoice' })
  @ApiParam({ name: 'id', description: 'Invoice UUID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Invoice deleted' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  removeInvoice(@Param('id') id: string) {
    return this.financeiroService.removeInvoice(id);
  }

  @Post('transactions')
  @ApiOperation({ summary: 'Create a transaction' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Transaction created' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  createTransaction(@Body() dto: CreateTransactionDto) {
    return this.financeiroService.createTransaction(dto);
  }

  @Get('transactions')
  @ApiOperation({ summary: 'Get all transactions' })
  @ApiResponse({ status: HttpStatus.OK, description: 'List of transactions' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  findAllTransactions(@Query() filter: FilterTransactionDto) {
    return this.financeiroService.findAllTransactions(filter);
  }

  @Get('transactions/:id')
  @ApiOperation({ summary: 'Get a transaction by ID' })
  @ApiParam({ name: 'id', description: 'Transaction UUID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Transaction found' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  findOneTransaction(@Param('id') id: string) {
    return this.financeiroService.findOneTransaction(id);
  }

  @Put('transactions/:id')
  @ApiOperation({ summary: 'Update a transaction' })
  @ApiParam({ name: 'id', description: 'Transaction UUID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Transaction updated' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  updateTransaction(@Param('id') id: string, @Body() dto: UpdateTransactionDto) {
    return this.financeiroService.updateTransaction(id, dto);
  }

  @Delete('transactions/:id')
  @ApiOperation({ summary: 'Delete a transaction' })
  @ApiParam({ name: 'id', description: 'Transaction UUID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Transaction deleted' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  removeTransaction(@Param('id') id: string) {
    return this.financeiroService.removeTransaction(id);
  }
}
