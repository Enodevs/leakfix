<script lang="ts">
	import { fade } from 'svelte/transition';
	import { formatNaira, type Transaction } from '$lib/data/transactions';

	let {
		dataset,
		lostAmount,
		insight,
		onRecover,
	}: {
		dataset: Transaction[];
		lostAmount: number;
		insight: { label: string; text: string };
		onRecover: () => void;
	} = $props();

	let activeFilter = $state<'all' | 'failed' | 'abandoned' | 'success'>('all');

	const filtered = $derived(
		activeFilter === 'all' ? dataset : dataset.filter(t => t.status === activeFilter)
	);

	const statusCounts = $derived({
		all:       dataset.length,
		failed:    dataset.filter(t => t.status === 'failed').length,
		abandoned: dataset.filter(t => t.status === 'abandoned').length,
		success:   dataset.filter(t => t.status === 'success').length,
	});

	const lostFiltered = $derived(
		filtered.filter(t => t.status === 'failed' || t.status === 'abandoned').reduce((s, t) => s + t.amount, 0)
	);
</script>

<!-- Impact hero card -->
<div class="impact-card-wrap">
	<div class="impact-card">
		<p class="impact-eyebrow">Your scan is complete</p>
		<h2 class="impact-amount">{formatNaira(lostAmount)}<span class="impact-lost"> LOST</span></h2>
		<p class="impact-body">This was money you already earned… but never received.</p>
		<button class="btn-recover" onclick={onRecover}>Recover this money</button>
	</div>
</div>

<!-- Insight card -->
<div class="insight-wrap">
	<div class="insight-card">
		<span class="insight-label">
			<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/></svg>
			{insight.label}
		</span>
		<p class="insight-text">{insight.text}</p>
	</div>
</div>

<!-- Failed transactions list -->
<section class="failed-section">
	<h3 class="failed-title">Failed transactions</h3>
	<div class="failed-list">
		{#each dataset.filter(t => t.status === 'failed') as txn (txn.id)}
			<div class="failed-item">
				<div class="failed-left">
					<span class="failed-email">{txn.customer_email}</span>
					<span class="failed-amount">{formatNaira(txn.amount)}</span>
				</div>
				<span class="badge badge-{txn.status}">{txn.status}</span>
			</div>
		{/each}
	</div>
</section>

<!-- Summary strip -->
<div class="results-summary">
	<div class="summary-card alert">
		<span class="summary-label">Total lost</span>
		<span class="summary-value">{formatNaira(lostAmount)}</span>
	</div>
	<div class="summary-card">
		<span class="summary-label">Failed</span>
		<span class="summary-value">{statusCounts.failed} txns</span>
	</div>
	<div class="summary-card">
		<span class="summary-label">Abandoned</span>
		<span class="summary-value">{statusCounts.abandoned} txns</span>
	</div>
	<div class="summary-card success">
		<span class="summary-label">Successful</span>
		<span class="summary-value">{statusCounts.success} txns</span>
	</div>
</div>

<!-- Transaction table -->
<section class="txn-section">
	<div class="txn-header">
		<div>
			<h2 class="section-title" style="margin-bottom:4px">Scan results</h2>
			<p class="txn-subtitle">
				{filtered.length} of {dataset.length} transactions
				{#if activeFilter !== 'all'}· filtered by <strong>{activeFilter}</strong>{/if}
			</p>
		</div>
		{#if lostFiltered > 0}
			<div class="lost-badge">
				<span class="lost-label">Showing lost</span>
				<span class="lost-amount">{formatNaira(lostFiltered)}</span>
			</div>
		{/if}
	</div>

	<div class="txn-filters">
		{#each (['all', 'failed', 'abandoned', 'success'] as const) as f}
			<button
				class="filter-btn"
				class:active={activeFilter === f}
				onclick={() => activeFilter = f}
			>
				{f.charAt(0).toUpperCase() + f.slice(1)}
				<span class="filter-count">{statusCounts[f]}</span>
			</button>
		{/each}
	</div>

	<div class="txn-card">
		<table class="txn-table">
			<thead>
				<tr>
					<th>ID</th>
					<th>Customer</th>
					<th>Amount</th>
					<th>Status</th>
				</tr>
			</thead>
			<tbody>
				{#each filtered as txn (txn.id)}
					<tr transition:fade={{ duration: 120 }}>
						<td class="txn-id">{txn.id}</td>
						<td class="txn-email">{txn.customer_email}</td>
						<td class="txn-amount">{formatNaira(txn.amount)}</td>
						<td>
							<span class="status-pill status-{txn.status}">{txn.status}</span>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</section>

<footer class="footer">
	<span>© 2026 Recoverly. All rights reserved.</span>
	<div class="footer-links">
		<a href="/">Privacy</a>
		<a href="/">Terms</a>
		<a href="/">Contact</a>
	</div>
</footer>

<style>
	.impact-card-wrap { display: flex; justify-content: center; padding: 40px 0 30px; }
	.impact-card {
		background: #ffffff;
		border-radius: 24px;
		padding: 40px;
		box-shadow: 0px 2px 8px rgba(0,0,0,0.04), 0px 0px 0px 1px rgba(0,0,0,0.03);
		text-align: center;
		max-width: 600px;
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 12px;
	}
	.impact-eyebrow {
		font-family: 'Inter', sans-serif;
		font-size: 12px;
		font-weight: 500;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: #888888;
		margin: 0;
	}
	.impact-amount {
		font-family: 'DM Sans', sans-serif;
		font-size: clamp(48px, 6vw, 62px);
		font-weight: 800;
		color: #000000;
		line-height: 1.1;
		letter-spacing: -2px;
		margin: 4px 0 0;
	}
	.impact-lost { font-weight: 800; color: #c62828; }
	.impact-body {
		font-family: 'Inter', sans-serif;
		font-size: 17px;
		color: #333333;
		line-height: 1.65;
		max-width: 420px;
		font-style: italic;
		margin: 4px 0 0;
	}
	.btn-recover {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		background: #f1ccff;
		color: #000000;
		font-family: 'Inter', sans-serif;
		font-size: 15px;
		font-weight: 600;
		border: none;
		border-radius: 12px;
		padding: 16px 36px;
		cursor: pointer;
		transition: background 0.15s, transform 0.1s;
		margin-top: 4px;
	}
	.btn-recover:hover { background: #e8b8ff; transform: translateY(-1px); }
	.btn-recover:active { transform: translateY(0); }

	.insight-wrap { display: flex; justify-content: center; padding: 0 0 24px; }
	.insight-card {
		background: #91e0ff;
		border-radius: 16px;
		padding: 20px 24px;
		max-width: 600px;
		width: 100%;
		display: flex;
		flex-direction: column;
		gap: 8px;
	}
	.insight-label {
		font-family: 'Inter', sans-serif;
		font-size: 11px;
		font-weight: 700;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: #0369a1;
		display: flex;
		align-items: center;
		gap: 5px;
	}
	.insight-text {
		font-family: 'Inter', sans-serif;
		font-size: 14px;
		color: #0c2a3a;
		line-height: 1.6;
		margin: 0;
	}

	.failed-section { max-width: 600px; margin: 0 auto 30px; width: 100%; }
	.failed-title {
		font-family: 'DM Sans', sans-serif;
		font-size: 13px;
		font-weight: 600;
		letter-spacing: 0.07em;
		text-transform: uppercase;
		color: #888888;
		margin-bottom: 12px;
		padding: 0 4px;
	}
	.failed-list { display: flex; flex-direction: column; gap: 10px; }
	.failed-item {
		background: #ffffff;
		border-radius: 14px;
		padding: 16px 20px;
		box-shadow: 0px 2px 8px rgba(0,0,0,0.04), 0px 0px 0px 1px rgba(0,0,0,0.03);
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 16px;
		transition: box-shadow 0.15s, transform 0.13s;
	}
	.failed-item:hover { box-shadow: 0px 6px 20px rgba(0,0,0,0.07); transform: translateY(-1px); }
	.failed-left { display: flex; flex-direction: column; gap: 3px; min-width: 0; }
	.failed-email {
		font-family: 'Inter', sans-serif;
		font-size: 14px;
		color: #333333;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	.failed-amount {
		font-family: 'DM Sans', sans-serif;
		font-size: 15px;
		font-weight: 700;
		color: #000000;
		letter-spacing: -0.3px;
	}
	.badge {
		display: inline-flex;
		align-items: center;
		font-family: 'Inter', sans-serif;
		font-size: 11px;
		font-weight: 500;
		text-transform: capitalize;
		border-radius: 10px;
		border: 1px solid #d6d6d6;
		padding: 4px 10px;
		white-space: nowrap;
		flex-shrink: 0;
	}
	.badge-failed   { color: #c62828; background: #fdecea; border-color: #f5c6c6; }
	.badge-abandoned { color: #e65100; background: #fff8e1; border-color: #f5e0a6; }
	.badge-success  { color: #2e7d32; background: #e8f5e9; border-color: #b2dfb4; }

	.results-summary {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 16px;
		margin-top: 32px;
		margin-bottom: 32px;
	}
	.summary-card {
		background: #ffffff;
		border-radius: 20px;
		padding: 28px 24px;
		box-shadow: 0px 2px 8px rgba(0,0,0,0.04), 0px 0px 0px 1px rgba(0,0,0,0.03);
		display: flex;
		flex-direction: column;
		gap: 6px;
	}
	.summary-card.alert { border-top: 2px solid #e57373; }
	.summary-card.success { border-top: 2px solid #66bb6a; }
	.summary-label {
		font-family: 'Inter', sans-serif;
		font-size: 11px;
		font-weight: 500;
		letter-spacing: 0.07em;
		text-transform: uppercase;
		color: #888888;
	}
	.summary-value {
		font-family: 'DM Sans', sans-serif;
		font-size: 24px;
		font-weight: 700;
		color: #000000;
		letter-spacing: -0.5px;
		line-height: 1;
	}

	.txn-section { margin-top: 0; }
	.txn-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; margin-bottom: 16px; }
	.section-title {
		font-family: 'DM Sans', sans-serif;
		font-size: 32px;
		font-weight: 700;
		color: #000000;
		letter-spacing: -0.8px;
		margin-bottom: 16px;
	}
	.txn-subtitle { font-family: 'Inter', sans-serif; font-size: 14px; color: #888888; margin-top: 4px; }
	.txn-subtitle :global(strong) { color: #333333; font-weight: 600; }
	.lost-badge {
		background: #ffffff;
		border: 1px solid #e8e4e0;
		border-radius: 16px;
		padding: 16px 24px;
		box-shadow: 0px 2px 8px rgba(0,0,0,0.04);
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		gap: 4px;
		flex-shrink: 0;
	}
	.lost-label {
		font-family: 'Inter', sans-serif;
		font-size: 11px;
		font-weight: 500;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: #888888;
	}
	.lost-amount {
		font-family: 'DM Sans', sans-serif;
		font-size: 28px;
		font-weight: 700;
		color: #000000;
		letter-spacing: -0.8px;
		line-height: 1;
	}
	.txn-filters { display: flex; gap: 8px; margin-bottom: 12px; }
	.filter-btn {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		font-family: 'Inter', sans-serif;
		font-size: 13px;
		font-weight: 500;
		color: #333333;
		background: #ffffff;
		border: 1px solid #d6d6d6;
		border-radius: 10px;
		padding: 7px 14px;
		cursor: pointer;
		transition: background 0.12s, border-color 0.12s, color 0.12s;
	}
	.filter-btn:hover { background: #f5f2f0; border-color: #bbbbbb; }
	.filter-btn.active { background: #000000; border-color: #000000; color: #ffffff; }
	.filter-btn.active .filter-count { background: rgba(255,255,255,0.2); color: #ffffff; }
	.filter-count {
		background: #f5f2f0;
		color: #333333;
		font-size: 11px;
		font-weight: 600;
		border-radius: 100px;
		padding: 1px 7px;
		transition: background 0.12s, color 0.12s;
	}
	.txn-card {
		background: #ffffff;
		border-radius: 24px;
		box-shadow: 0px 2px 8px rgba(0,0,0,0.04), 0px 0px 0px 1px rgba(0,0,0,0.03);
		overflow: hidden;
	}
	.txn-table { width: 100%; border-collapse: collapse; }
	.txn-table thead tr { border-bottom: 1px solid #d6d6d6; }
	.txn-table th {
		font-family: 'Inter', sans-serif;
		font-size: 11px;
		font-weight: 600;
		letter-spacing: 0.07em;
		text-transform: uppercase;
		color: #888888;
		text-align: left;
		padding: 16px 24px;
	}
	.txn-table tbody tr { border-bottom: 1px solid #f0eeed; transition: background 0.1s; }
	.txn-table tbody tr:last-child { border-bottom: none; }
	.txn-table tbody tr:hover { background: #faf9f8; }
	.txn-table td { padding: 16px 24px; vertical-align: middle; }
	.txn-id { font-family: 'Inter', sans-serif; font-size: 13px; font-weight: 500; color: #888888; letter-spacing: 0.02em; }
	.txn-email { font-family: 'Inter', sans-serif; font-size: 14px; color: #000000; }
	.txn-amount { font-family: 'Inter', sans-serif; font-size: 14px; font-weight: 600; color: #000000; letter-spacing: -0.2px; }
	.status-pill {
		display: inline-block;
		font-family: 'Inter', sans-serif;
		font-size: 12px;
		font-weight: 500;
		border-radius: 100px;
		padding: 4px 12px;
		text-transform: capitalize;
	}
	.status-success  { background: #e8f5e9; color: #2e7d32; }
	.status-failed   { background: #fdecea; color: #c62828; }
	.status-abandoned { background: #fff8e1; color: #e65100; }

	.footer {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 30px 0 40px;
		margin-top: 30px;
		border-top: 1px solid #d6d6d6;
		font-family: 'Inter', sans-serif;
		font-size: 13px;
		color: #888888;
	}
	.footer-links { display: flex; gap: 24px; }
	.footer-links a { color: #888888; text-decoration: none; transition: color 0.15s; }
	.footer-links a:hover { color: #000000; }

	@media (max-width: 768px) {
		.results-summary { grid-template-columns: repeat(2, 1fr); }
	}
</style>
