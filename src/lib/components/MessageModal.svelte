<script lang="ts">
	import { fade, fly } from 'svelte/transition';

	let {
		messages,
		onClose,
	}: {
		messages: { from: string; lines: string[]; time: string }[];
		onClose: () => void;
	} = $props();
</script>

<div
	class="modal-backdrop"
	transition:fade={{ duration: 150 }}
	onclick={onClose}
	onkeydown={(e) => e.key === 'Escape' && onClose()}
	role="presentation"
>
	<div
		class="modal-card"
		transition:fly={{ y: 16, duration: 220, opacity: 0 }}
		onclick={(e) => e.stopPropagation()}
		onkeydown={(e) => e.stopPropagation()}
		role="dialog"
		aria-modal="true"
		aria-label="Recovery messages"
		tabindex="-1"
	>
		<div class="modal-header">
			<div>
				<span class="modal-label">Recovery messages</span>
				<p class="modal-sub">Sent to {messages.length} customers</p>
			</div>
			<button class="modal-close" onclick={onClose} aria-label="Close">
				<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
			</button>
		</div>

		<div class="sms-list">
			{#each messages as msg, i}
				<div class="sms-wrap" style="animation-delay: {i * 60}ms">
					<div class="sms-meta">{msg.from}</div>
					<div class="sms-bubble">
						{#each msg.lines as line, j}
							<p>{#if j === msg.lines.length - 1}{@html line.replace(/(pay\.link\/\w+)/, '<span class="sms-link">$1</span>')}{:else}{line}{/if}</p>
						{/each}
					</div>
					<div class="sms-time">{msg.time}</div>
				</div>
			{/each}
		</div>
	</div>
</div>

<style>
	.modal-backdrop {
		position: fixed;
		inset: 0;
		background: rgba(0,0,0,0.32);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 999;
		padding: 24px;
	}
	.modal-card {
		background: #ffffff;
		border-radius: 20px;
		padding: 24px;
		width: 100%;
		max-width: 380px;
		box-shadow: 0 16px 40px rgba(0,0,0,0.12);
	}
	.modal-header { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 20px; }
	.modal-label {
		font-family: 'DM Sans', sans-serif;
		font-size: 15px;
		font-weight: 700;
		color: #000000;
		letter-spacing: -0.2px;
	}
	.modal-sub { font-family: 'Inter', sans-serif; font-size: 12px; color: #999999; margin: 3px 0 0; }
	.modal-close {
		background: none;
		border: none;
		cursor: pointer;
		color: #aaaaaa;
		padding: 2px 6px;
		border-radius: 6px;
		transition: color 0.15s;
	}
	.modal-close:hover { color: #333333; }
	.sms-list { display: flex; flex-direction: column; gap: 16px; }
	.sms-wrap { display: flex; flex-direction: column; gap: 8px; }
	.sms-meta {
		font-family: 'Inter', sans-serif;
		font-size: 11px;
		font-weight: 600;
		color: #bbbbbb;
		letter-spacing: 0.04em;
	}
	.sms-bubble {
		background: #f5f2f0;
		border-radius: 4px 16px 16px 16px;
		padding: 14px 16px;
		display: flex;
		flex-direction: column;
		gap: 4px;
	}
	.sms-bubble p {
		font-family: 'Inter', sans-serif;
		font-size: 15px;
		color: #111111;
		line-height: 1.5;
		margin: 0;
	}
	.sms-bubble :global(.sms-link) {
		color: #7c3aed;
		font-weight: 500;
		text-decoration: underline;
		text-underline-offset: 2px;
	}
	.sms-time { font-family: 'Inter', sans-serif; font-size: 11px; color: #cccccc; text-align: right; }
</style>
