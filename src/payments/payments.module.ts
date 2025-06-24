import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from './entities/payment.entity';
import { HttpModule } from '@nestjs/axios';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([Payment]),
    HttpModule, // Registrar a entidade aqui
    ClientsModule.register([
      {
        name: 'PAYMENT_NOTIFICATION_SERVICE', // Token de injeção para o nosso cliente
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://guest:guest@rabbitmq:5672'], // URL do container do RabbitMQ no Docker
          queue: 'payments_notifications_queue', // Nome da fila que vamos usar
          queueOptions: {
            durable: true, // A fila persistirá se o RabbitMQ reiniciar
          },
        },
      },
    ]),
  ],
  controllers: [PaymentsController],
  providers: [PaymentsService],
})
export class PaymentsModule {}
