import { Injectable, NotFoundException } from '@nestjs/common';
import { Payment, PaymentStatus } from './entities/payment.entity';
import { v4 as uuidv4 } from 'uuid';

// Vamos definir o DTO aqui temporariamente. Depois moveremos para um arquivo.
interface CreatePaymentDto {
  merchantId: string;
  amount: number;
  currency: string;
}

@Injectable()
export class PaymentsService {
  // Nosso "banco de dados" de pagamentos em memória
  private readonly payments: Payment[] = [];

  async create(createPaymentDto: CreatePaymentDto): Promise<Payment> {
    const newPayment: Payment = {
      id: uuidv4(),
      ...createPaymentDto,
      status: PaymentStatus.PENDING, // Todo novo pagamento começa como pendente
      createdAt: new Date(),
    };
    this.payments.push(newPayment);
    return newPayment;
  }

  async findOne(id: string): Promise<Payment> {
    const payment = this.payments.find((p) => p.id === id);
    if (!payment) {
      throw new NotFoundException(`Payment with ID "${id}" not found`);
    }
    return payment;
  }
}
