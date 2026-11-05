import { StatusBadge } from '@/components/panel-shell'
import { ORDER_STATUS } from '@/lib/format'
import type { OrderStatus } from '@/types/db'

const TONE: Record<OrderStatus, 'neutro' | 'ok' | 'atencao' | 'erro'> = {
  aguardando_pagamento: 'atencao',
  pago: 'ok',
  em_producao: 'ok',
  enviado: 'ok',
  entregue: 'neutro',
  cancelado: 'erro',
}

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return <StatusBadge tone={TONE[status]}>{ORDER_STATUS[status]}</StatusBadge>
}
