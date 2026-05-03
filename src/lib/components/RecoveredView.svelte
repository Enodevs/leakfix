<script lang="ts">
	import { formatNaira } from '$lib/data/transactions';

	let {
		lostAmount,
		onViewMessages,
		onBack,
	}: {
		lostAmount: number;
		onViewMessages: () => void;
		onBack: () => void;
	} = $props();

	// Recover ~38% of lost amount, rounded to nearest 500
	const recoveredAmount = $derived(Math.round((lostAmount * 0.38) / 500) * 500);
	const customerCount = $derived(Math.max(2, Math.round(lostAmount / 20000)));
</script>

<div class="recovered-view">
	<div class="success-card-wrap">
		<div class="success-card">
			<div class="success-icon">✓</div>
			<p class="success-eyebrow">Recovery complete</p>
			<h2 class="success-amount">{formatNaira(recoveredAmount)} recovered</h2>
			<p class="success-body">Reminders sent to {customerCount} customers</p>
			<div class="success-actions">
				<button class="btn-primary" onclick={onViewMessages}>View messages</button>
				<button class="btn-outline" onclick={onBack}>Back to home</button>
			</div>
		</div>
	</div>
</div>

<style>
	.recovered-view {
		display: flex;
		align-items: center;
		justify-content: center;
		min-height: calc(100vh - 64px);
		padding: 40px 24px;
	}
	.success-card-wrap { display: flex; justify-content: center; width: 100%; }
	.success-card {
		background: #ffffff;
		border-radius: 24px;
		padding: 48px 40px;
		box-shadow: 0px 8px 24px rgba(0,0,0,0.06);
		text-align: center;
		max-width: 480px;
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 12px;
	}
	.success-icon {
		width: 56px;
		height: 56px;
		border-radius: 50%;
		background: #f1ccff;
		color: #6b21a8;
		font-size: 24px;
		font-weight: 700;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-bottom: 8px;
	}
	.success-eyebrow {
		font-family: 'Inter', sans-serif;
		font-size: 12px;
		font-weight: 600;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: #888888;
	}
	.success-amount {
		font-family: 'DM Sans', sans-serif;
		font-weight: 800;
		font-size: 44px;
		letter-spacing: -1.5px;
		color: #000000;
		line-height: 1.1;
		margin: 4px 0 0;
	}
	.success-body { font-family: 'Inter', sans-serif; font-size: 15px; color: #555555; margin: 0; }
	.success-actions { display: flex; flex-direction: column; gap: 12px; width: 100%; margin-top: 16px; }
	.btn-primary {
		width: 100%;
		padding: 14px 24px;
		display: flex;
		align-items: center;
		justify-content: center;
		background: #f1ccff;
		color: #000000;
		font-family: 'DM Sans', sans-serif;
		font-size: 15px;
		font-weight: 700;
		border: none;
		border-radius: 12px;
		cursor: pointer;
		transition: background 0.15s, transform 0.12s;
	}
	.btn-primary:hover { background: #e8b8ff; transform: translateY(-1px); }
	.btn-primary:active { transform: translateY(0); }
	.btn-outline {
		width: 100%;
		padding: 14px 24px;
		border-radius: 12px;
		background: transparent;
		color: #333333;
		font-family: 'DM Sans', sans-serif;
		font-weight: 600;
		font-size: 15px;
		border: 1.5px solid #d6d6d6;
		cursor: pointer;
		transition: border-color 0.15s, color 0.15s, background 0.15s;
	}
	.btn-outline:hover { border-color: #aaaaaa; color: #000000; background: #faf9f8; }
</style>
