export const EXCHANGE_RATE_HTG_TO_USD = 130;
export const DEPOSIT_FEE_PERCENT = 3;
export const WITHDRAWAL_FEE_PERCENT = 10;
export const REFERRAL_COMMISSION_PERCENT = 10;
export const PRO_ADMIN_REWARD_REFERRALS = 12;
export const PRO_ADMIN_REWARD_AMOUNT = 50;
export const TICKET_PRICE_USD = 1;

export const PAYMENT_METHODS = {
  usdt_trc20: 'USDT TRC20',
  moncash: 'MonCash',
  natcash: 'NatCash',
} as const;

export const WITHDRAWAL_PROCESSING_TIME = '24 to 48 hours';

export function convertHTGtoUSD(htgAmount: number): number {
  return htgAmount / EXCHANGE_RATE_HTG_TO_USD;
}

export function calculateDepositFee(amountUSD: number): number {
  return amountUSD * (DEPOSIT_FEE_PERCENT / 100);
}

export function calculateWithdrawalFee(amount: number): number {
  return amount * (WITHDRAWAL_FEE_PERCENT / 100);
}

export function calculateNetWithdrawal(amount: number): number {
  return amount - calculateWithdrawalFee(amount);
}