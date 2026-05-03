<script lang="ts">
	let { progress }: { progress: number } = $props();
</script>

<div class="scanning-view">
	<div class="scanning-card">
		<div class="scan-icon-wrap">
			<div class="scan-pulse"></div>
			<div class="scan-icon">⟳</div>
		</div>

		<div class="scan-text">
			<h2 class="scan-title">Scanning your transactions</h2>
			<p class="scan-sub">Connecting to Paystack and analysing payment data</p>
		</div>

		<div class="scan-progress-block">
			<div class="scan-progress-row">
				<span class="progress-label">{progress}% complete</span>
			</div>
			<div class="progress-track">
				<div class="progress-bar" style="width: {progress}%"></div>
			</div>
		</div>

		<div class="scan-steps">
			<div class="scan-step" class:step-done={progress >= 30}>
				{#if progress >= 30}
					<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></svg>
				{:else}
					<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/></svg>
				{/if}
				<span>Fetching transactions</span>
			</div>
			<div class="scan-step" class:step-done={progress >= 55}>
				{#if progress >= 55}
					<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></svg>
				{:else}
					<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/></svg>
				{/if}
				<span>Detecting failures</span>
			</div>
			<div class="scan-step" class:step-done={progress >= 88}>
				{#if progress >= 88}
					<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></svg>
				{:else}
					<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/></svg>
				{/if}
				<span>Computing losses</span>
			</div>
		</div>
	</div>
</div>

<style>
	.scanning-view {
		display: flex;
		align-items: center;
		justify-content: center;
		min-height: calc(100vh - 64px);
		padding: 40px 24px;
	}
	.scanning-card {
		background: #ffffff;
		border-radius: 24px;
		padding: 48px 40px;
		box-shadow: 0px 2px 8px rgba(0,0,0,0.04), 0px 0px 0px 1px rgba(0,0,0,0.03);
		max-width: 440px;
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 32px;
	}
	.scan-icon-wrap {
		position: relative;
		width: 72px;
		height: 72px;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
	}
	.scan-pulse {
		position: absolute;
		inset: -8px;
		border-radius: 50%;
		background: #f1ccff;
		opacity: 0.4;
		animation: pulse 1.4s ease-in-out infinite;
	}
	@keyframes pulse {
		0%, 100% { transform: scale(1); opacity: 0.4; }
		50%       { transform: scale(1.18); opacity: 0.15; }
	}
	.scan-icon {
		width: 72px;
		height: 72px;
		background: #000000;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 28px;
		color: #ffffff;
		animation: spin 1.6s linear infinite;
		position: relative;
		z-index: 1;
	}
	@keyframes spin { to { transform: rotate(360deg); } }
	.scan-text { text-align: center; display: flex; flex-direction: column; gap: 8px; }
	.scan-title {
		font-family: 'DM Sans', sans-serif;
		font-size: 22px;
		font-weight: 700;
		color: #000000;
		letter-spacing: -0.4px;
		margin: 0;
	}
	.scan-sub {
		font-family: 'Inter', sans-serif;
		font-size: 14px;
		color: #888888;
		line-height: 1.5;
		margin: 0;
	}
	.scan-progress-block { width: 100%; display: flex; flex-direction: column; gap: 10px; }
	.scan-progress-row { display: flex; align-items: center; justify-content: space-between; }
	.progress-track {
		background: #e8e4e0;
		border-radius: 100px;
		height: 5px;
		overflow: hidden;
		width: 100%;
	}
	.progress-bar {
		height: 100%;
		background: #000000;
		border-radius: 100px;
		transition: width 0.25s ease;
	}
	.progress-label {
		font-family: 'Inter', sans-serif;
		font-size: 12px;
		font-weight: 500;
		color: #888888;
	}
	.scan-steps { width: 100%; display: flex; flex-direction: column; gap: 10px; }
	.scan-step {
		display: flex;
		align-items: center;
		gap: 10px;
		font-family: 'Inter', sans-serif;
		font-size: 13px;
		color: #cccccc;
		transition: color 0.3s;
	}
	.scan-step.step-done { color: #000000; }
	.scan-step :global(svg) { flex-shrink: 0; transition: opacity 0.2s; }
</style>
