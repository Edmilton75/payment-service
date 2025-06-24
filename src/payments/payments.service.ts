import {
  BadRequestException,
  Inject, // NOVA IMPORTAÇÃO
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Payment } from './entities/payment.entity';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom } from 'rxjs';
import { ClientProxy } from '@nestjs/microservices'; // NOVA IMPORTAÇÃO

@Injectable()
export class PaymentsService {
  private readonly merchantServiceUrl = 'http://merchant-api:3001/merchants/';
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
    private readonly httpService: HttpService,
    // NOVO: Injetando o cliente do RabbitMQ
    @Inject('PAYMENT_NOTIFICATION_SERVICE')
    private readonly notificationClient: ClientProxy,
  ) {}

  async create(createPaymentDto: CreatePaymentDto): Promise<Payment> {
    // 1. Sua lógica atual de validação e criação
    await this.validateMerchant(createPaymentDto.merchantId);
    const newPaymentEntity = this.paymentRepository.create(createPaymentDto);
    const savedPayment = await this.paymentRepository.save(newPaymentEntity);

    console.log(
      `[Payment-Service] Pagamento salvo no DB: ID ${savedPayment.id}`,
    );

    // 2. NOVO: Enviar o evento para o RabbitMQ
    this.notificationClient.emit('payment_created', savedPayment);
    console.log(
      `[Payment-Service] Evento 'payment_created' emitido para a fila.`,
    );

    return savedPayment;
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
