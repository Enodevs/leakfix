import type { Transaction } from './transactions';

// ── Demo key constants ────────────────────────────────────────────────────────
export const DEMO_KEYS = ['sk_test_demo_alpha', 'sk_test_demo_beta', 'sk_test_demo_gamma'] as const;
export type DemoKey = typeof DEMO_KEYS[number];

export function isDemoKey(k: string): k is DemoKey {
	return (DEMO_KEYS as readonly string[]).includes(k);
}

// ── Per-key mock transaction datasets ────────────────────────────────────────
export const demoDatasets: Record<DemoKey, Transaction[]> = {
	'sk_test_demo_alpha': [
		{ id: 'TXN_A01', customer_email: 'amara.diallo@yahoo.com',     amount: 18000, status: 'failed'    },
		{ id: 'TXN_A02', customer_email: 'james.okafor@outlook.com',   amount: 12500, status: 'failed'    },
		{ id: 'TXN_A03', customer_email: 'priya.mehta@gmail.com',      amount: 9000,  status: 'abandoned' },
		{ id: 'TXN_A04', customer_email: 'chisom.eze@gmail.com',       amount: 15000, status: 'failed'    },
		{ id: 'TXN_A05', customer_email: 'lena.muller@gmail.com',      amount: 11000, status: 'failed'    },
		{ id: 'TXN_A06', customer_email: 'kevin.mensah@gmail.com',     amount: 8500,  status: 'abandoned' },
		{ id: 'TXN_A07', customer_email: 'sarah.chen@gmail.com',       amount: 45000, status: 'success'   },
		{ id: 'TXN_A08', customer_email: 'rafael.santos@gmail.com',    amount: 30000, status: 'success'   },
		{ id: 'TXN_A09', customer_email: 'yuki.tanaka@outlook.com',    amount: 10500, status: 'failed'    },
	],
	'sk_test_demo_beta': [
		{ id: 'TXN_B01', customer_email: 'david.nwosu@gmail.com',      amount: 25000, status: 'failed'    },
		{ id: 'TXN_B02', customer_email: 'fatima.al-rashid@gmail.com', amount: 18300, status: 'failed'    },
		{ id: 'TXN_B03', customer_email: 'marco.rossi@proton.me',      amount: 9500,  status: 'abandoned' },
		{ id: 'TXN_B04', customer_email: 'anna.johansson@proton.me',   amount: 14000, status: 'failed'    },
		{ id: 'TXN_B05', customer_email: 'kwame.asante@yahoo.com',     amount: 22000, status: 'failed'    },
		{ id: 'TXN_B06', customer_email: 'elena.popova@outlook.com',   amount: 11500, status: 'abandoned' },
		{ id: 'TXN_B07', customer_email: 'tom.nakamura@gmail.com',     amount: 16000, status: 'failed'    },
		{ id: 'TXN_B08', customer_email: 'sofia.pereira@gmail.com',    amount: 8000,  status: 'abandoned' },
		{ id: 'TXN_B09', customer_email: 'daniel.kowalski@gmail.com',  amount: 28000, status: 'success'   },
		{ id: 'TXN_B10', customer_email: 'sarah.chen@gmail.com',       amount: 55000, status: 'success'   },
		{ id: 'TXN_B11', customer_email: 'rafael.santos@gmail.com',    amount: 13000, status: 'failed'    },
		{ id: 'TXN_B12', customer_email: 'yuki.tanaka@outlook.com',    amount: 10000, status: 'failed'    },
	],
	'sk_test_demo_gamma': [
		{ id: 'TXN_G01', customer_email: 'priya.mehta@gmail.com',      amount: 19200, status: 'failed'    },
		{ id: 'TXN_G02', customer_email: 'james.okafor@outlook.com',   amount: 15500, status: 'abandoned' },
		{ id: 'TXN_G03', customer_email: 'chisom.eze@gmail.com',       amount: 12500, status: 'failed'    },
		{ id: 'TXN_G04', customer_email: 'sarah.chen@gmail.com',       amount: 45000, status: 'success'   },
		{ id: 'TXN_G05', customer_email: 'marco.rossi@proton.me',      amount: 62000, status: 'success'   },
		{ id: 'TXN_G06', customer_email: 'kevin.mensah@gmail.com',     amount: 17000, status: 'failed'    },
	],
};

// ── Insights ─────────────────────────────────────────────────────────────────
export const insights = [
	{ label: 'Insight',    text: 'Customers who fail once are 2× more likely to complete payment within 6 hours.' },
	{ label: 'Data point', text: 'SMS reminders sent within 30 minutes recover 3× more revenue than those sent the next day.' },
	{ label: 'Insight',    text: '67% of abandoned checkouts are recoverable — the customer wanted to pay, something just went wrong.' },
	{ label: 'Benchmark',  text: 'The average merchant using Recoverly recovers ₦180,000 in their first 7 days.' },
	{ label: 'Pattern',    text: 'Payment failures spike on Fridays. Most customers retry by Sunday if sent a single reminder.' },
	{ label: 'Data point', text: 'A well-timed payment reminder has a 34% open rate — higher than most marketing emails.' },
	{ label: 'Insight',    text: 'Card declines are often temporary. 1 in 3 customers retries successfully with the same card within 48 hours.' },
	{ label: 'Benchmark',  text: 'Merchants who follow up within 1 hour recover 58% of failed transactions on average.' },
];

// ── SMS / Email recovery message templates ────────────────────────────────────
export const smsTemplates = [
	{ from: 'Recoverly · SMS',   lines: ["Hi, your payment didn't go through.", 'Complete it here: pay.link/r8x2k'],          time: 'Delivered · just now' },
	{ from: 'Recoverly · SMS',   lines: ['Quick reminder — your order is waiting.', 'Retry your payment: pay.link/m3p9q'],     time: 'Delivered · just now' },
	{ from: 'Recoverly · Email', lines: ['We noticed your payment failed. No worries —', 'your spot is still reserved: pay.link/v7j1n'], time: 'Delivered · just now' },
	{ from: 'Recoverly · SMS',   lines: ['Hey! Your payment needs a moment of attention.', 'It only takes a second: pay.link/t5w4r'], time: 'Delivered · just now' },
	{ from: 'Recoverly · Email', lines: ["Your payment didn't complete, but we saved your cart.", 'Finish checkout here: pay.link/k2d8s'], time: 'Delivered · just now' },
	{ from: 'Recoverly · SMS',   lines: ['Still thinking it over? Your payment link is active.', 'Complete when ready: pay.link/b6f0y'], time: 'Delivered · just now' },
];
