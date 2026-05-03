export type TransactionStatus = 'success' | 'failed' | 'abandoned';

export interface Transaction {
	id: string;
	customer_email: string;
	amount: number;
	status: TransactionStatus;
}

export const transactions: Transaction[] = [
	{ id: 'TXN_001', customer_email: 'sarah.chen@gmail.com',        amount: 45000,  status: 'success'   },
	{ id: 'TXN_002', customer_email: 'james.okafor@outlook.com',    amount: 120000, status: 'failed'    },
	{ id: 'TXN_003', customer_email: 'priya.mehta@gmail.com',       amount: 75000,  status: 'abandoned' },
	{ id: 'TXN_004', customer_email: 'daniel.kowalski@gmail.com',   amount: 30000,  status: 'success'   },
	{ id: 'TXN_005', customer_email: 'amara.diallo@yahoo.com',      amount: 200000, status: 'failed'    },
	{ id: 'TXN_006', customer_email: 'marco.rossi@proton.me',       amount: 15000,  status: 'success'   },
	{ id: 'TXN_007', customer_email: 'fatima.al-rashid@gmail.com',  amount: 89500,  status: 'abandoned' },
	{ id: 'TXN_008', customer_email: 'kevin.mensah@gmail.com',      amount: 55000,  status: 'failed'    },
	{ id: 'TXN_009', customer_email: 'yuki.tanaka@outlook.com',     amount: 310000, status: 'success'   },
	{ id: 'TXN_010', customer_email: 'lena.muller@gmail.com',       amount: 62000,  status: 'abandoned' },
	{ id: 'TXN_011', customer_email: 'kwame.asante@yahoo.com',      amount: 18500,  status: 'failed'    },
	{ id: 'TXN_012', customer_email: 'sofia.pereira@gmail.com',     amount: 95000,  status: 'success'   },
	{ id: 'TXN_013', customer_email: 'david.nwosu@gmail.com',       amount: 140000, status: 'failed'    },
	{ id: 'TXN_014', customer_email: 'anna.johansson@proton.me',    amount: 47500,  status: 'abandoned' },
	{ id: 'TXN_015', customer_email: 'rafael.santos@gmail.com',     amount: 230000, status: 'success'   },
	{ id: 'TXN_016', customer_email: 'chisom.eze@gmail.com',        amount: 68000,  status: 'failed'    },
	{ id: 'TXN_017', customer_email: 'elena.popova@outlook.com',    amount: 42500,  status: 'abandoned' },
	{ id: 'TXN_018', customer_email: 'tom.nakamura@gmail.com',      amount: 175000, status: 'success'   },
];

export const lostAmount = transactions
	.filter(t => t.status === 'failed' || t.status === 'abandoned')
	.reduce((sum, t) => sum + t.amount, 0);

export function formatNaira(amount: number): string {
	return '₦' + amount.toLocaleString('en-NG');
}
