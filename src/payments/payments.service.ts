import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Payment } from './entities/payment.entity';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom } from 'rxjs';

@Injectable()
export class PaymentsService {
  private readonly merchantServiceUrl = 'http://merchant-api:3001/merchants/';
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
    private readonly httpService: HttpService,
  ) {}

  async create(createPaymentDto: CreatePaymentDto): Promise<Payment> {
    await this.validateMerchant(createPaymentDto.merchantId);

    const newPayment = this.paymentRepository.create(createPaymentDto);
    return this.paymentRepository.save(newPayment);
  }

  async findOne(id: string): Promise<Payment> {
    const payment = await this.paymentRepository.findOne({ where: { id } });
    if (!payment) {
      throw new NotFoundException(`Payment with ID "${id}" not found`);
    }
    return payment;
  }

  private async validateMerchant(merchantId: string) {
    const url = this.merchantServiceUrl + merchantId;

    console.log(`Validando merchant em: ${url}`);

    const { data } = await firstValueFrom(
      this.httpService.get(url).pipe(
        catchError((error) => {
          if (error.response?.status === 404) {
            throw new BadRequestException(`Merchant não encontrado`);
          }
          throw error;
        }),
      ),
    );

    console.log(`Merchant encontrado:`, data);
    return data;
  }
}
