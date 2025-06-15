import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { PaymentsService } from './payments.service';
// Importe O DTO do arquivo que criamos
import { CreatePaymentDto } from './dto/create-payment.dto';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentService: PaymentsService) {}

  @Post()
  async create(@Body() createPaymentDto: CreatePaymentDto) {
    // Delega a criação para o service
    return this.paymentService.create(createPaymentDto);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    // Delega a busca para o service
    return this.paymentService.findOne(id);
  }
}
