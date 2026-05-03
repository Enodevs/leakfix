<script lang="ts">
	let { progress }: { progress: number } = $props();
</script>

<div class="recovering-view">
	<div class="recovering-inner">
		<div class="recover-icon-wrap">
			<div class="recover-pulse"></div>
			<div class="recover-icon">↑</div>
		</div>
		<h2 class="recover-title">Recovering your money…</h2>
		<p class="recover-sub">Sending reminders · Retrying payments</p>
		<div class="progress-track">
			<div class="progress-bar" style="width: {progress}%"></div>
		</div>
		<span class="progress-label">{progress}%</span>
	</div>
</div>

<style>
	.recovering-view {
		display: flex;
		align-items: center;
		justify-content: center;
		min-height: calc(100vh - 64px);
		padding: 40px 24px;
	}
	.recovering-inner { text-align: center; max-width: 400px; width: 100%; }
	.recover-icon-wrap {
		position: relative;
		width: 64px;
		height: 64px;
		margin: 0 auto 28px;
	}
	.recover-pulse {
		position: absolute;
		inset: 0;
		border-radius: 50%;
		background: #f1ccff;
		animation: pulse 1.4s ease-in-out infinite;
	}
	@keyframes pulse {
		0%, 100% { transform: scale(1); opacity: 0.4; }
		50%       { transform: scale(1.18); opacity: 0.15; }
	}
	.recover-icon {
		position: relative;
		z-index: 1;
		width: 64px;
		height: 64px;
		border-radius: 50%;
		background: #000000;
		color: #f1ccff;
		font-size: 28px;
		display: flex;
		align-items: center;
		justify-content: center;
		font-weight: 700;
	}
	.recover-title {
		font-family: 'DM Sans', sans-serif;
		font-weight: 700;
		font-size: 26px;
		color: #000000;
		letter-spacing: -0.5px;
		margin-bottom: 8px;
	}
	.recover-sub {
		font-family: 'Inter', sans-serif;
		font-size: 14px;
		color: #888888;
		margin-bottom: 28px;
	}
	.progress-track {
		background: #e8e4e0;
		border-radius: 100px;
		height: 5px;
		overflow: hidden;
		width: 100%;
	}
	.progress-bar {
		height: 100%;
		background: #a855f7;
		border-radius: 100px;
		transition: width 0.25s ease;
	}
	.progress-label {
		font-family: 'Inter', sans-serif;
		font-size: 12px;
		font-weight: 500;
		color: #888888;
		display: block;
		margin-top: 10px;
	}
</style>
