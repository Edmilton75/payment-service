export enum PaymentStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  FAILED = 'FAILED',
}

export interface Payment {
  id: string;
  merchantId: string; // ID do merchant que está recebendo
  amount: number; // Valor em centavos
  currency: string; // Ex: 'BRL', 'USD'
  status: PaymentStatus;
  createdAt: Date;
}
