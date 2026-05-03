export type TransactionStatus = 'success' | 'failed' | 'abandoned';

export interface Transaction {
	id: string;
	customer_email: string;
	amount: number;
	status: TransactionStatus;
}

export const transactions: Transaction[] = [
	{ id: 'TXN_001', customer_email: 'ada.okafor@gmail.com',      amount: 45000,  status: 'success'   },
	{ id: 'TXN_002', customer_email: 'emeka.nwosu@yahoo.com',     amount: 120000, status: 'failed'    },
	{ id: 'TXN_003', customer_email: 'bola.adesanya@outlook.com', amount: 75000,  status: 'abandoned' },
	{ id: 'TXN_004', customer_email: 'chidi.eze@gmail.com',       amount: 30000,  status: 'success'   },
	{ id: 'TXN_005', customer_email: 'ngozi.ibrahim@gmail.com',   amount: 200000, status: 'failed'    },
	{ id: 'TXN_006', customer_email: 'tunde.bello@proton.me',     amount: 15000,  status: 'success'   },
	{ id: 'TXN_007', customer_email: 'amara.obi@gmail.com',       amount: 89500,  status: 'abandoned' },
	{ id: 'TXN_008', customer_email: 'seun.adeyemi@gmail.com',    amount: 55000,  status: 'failed'    },
	{ id: 'TXN_009', customer_email: 'kemi.taiwo@outlook.com',    amount: 310000, status: 'success'   },
	{ id: 'TXN_010', customer_email: 'femi.lawal@gmail.com',      amount: 62000,  status: 'abandoned' },
	{ id: 'TXN_011', customer_email: 'olu.adebayo@yahoo.com',     amount: 18500,  status: 'failed'    },
	{ id: 'TXN_012', customer_email: 'zainab.usman@gmail.com',    amount: 95000,  status: 'success'   },
	{ id: 'TXN_013', customer_email: 'ifeanyi.okeke@gmail.com',   amount: 140000, status: 'failed'    },
	{ id: 'TXN_014', customer_email: 'halima.garba@proton.me',    amount: 47500,  status: 'abandoned' },
	{ id: 'TXN_015', customer_email: 'dele.ogunleye@gmail.com',   amount: 230000, status: 'success'   },
];

export const lostAmount = transactions
	.filter(t => t.status === 'failed' || t.status === 'abandoned')
	.reduce((sum, t) => sum + t.amount, 0);

export function formatNaira(amount: number): string {
	return '₦' + amount.toLocaleString('en-NG');
}
