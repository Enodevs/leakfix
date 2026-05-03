<script lang="ts">
	import { fade } from 'svelte/transition';
	import { DEMO_KEYS, isDemoKey, demoDatasets } from '$lib/data/mockData';
	import type { Transaction } from '$lib/data/transactions';

	let {
		onConnect,
	}: {
		onConnect: (dataset: Transaction[]) => void;
	} = $props();

	let apiKeyInput = $state('');
	let connectError = $state('');

	function handleConnect() {
		connectError = '';
		const key = apiKeyInput.trim();
		if (!isDemoKey(key)) {
			connectError = 'Invalid key. Use a demo key.';
			return;
		}
		onConnect(demoDatasets[key]);
	}
</script>

<div class="connect-view">
	<div class="connect-card">

		<div class="connect-header">
			<h1 class="connect-heading">Connect your Paystack</h1>
			<p class="connect-sub">Enter your secret key to scan for failed payments.</p>
		</div>

		<div class="connect-field">
			<input
				class="connect-input"
				class:input-error={!!connectError}
				type="password"
				placeholder="sk_test_xxxxxxxxx"
				bind:value={apiKeyInput}
				onkeydown={(e) => e.key === 'Enter' && handleConnect()}
				autocomplete="off"
				spellcheck={false}
			/>
			{#if connectError}
				<p class="connect-error" transition:fade={{ duration: 120 }}>{connectError}</p>
			{/if}
		</div>

		<div class="demo-section">
			<p class="demo-label">No key? Use a demo account:</p>
			<div class="demo-pills">
				{#each DEMO_KEYS as key}
					<button
						class="demo-pill"
						class:demo-pill-active={apiKeyInput === key}
						onclick={() => { apiKeyInput = key; connectError = ''; }}
					>
						{key}
					</button>
				{/each}
			</div>
		</div>

		<button class="btn-connect" onclick={handleConnect}>
			Connect Paystack
		</button>

	</div>
</div>

<style>
	.connect-view {
		display: flex;
		align-items: center;
		justify-content: center;
		min-height: calc(100vh - 64px);
		padding: 40px 24px;
	}
	.connect-card {
		background: #ffffff;
		border-radius: 24px;
		padding: 40px;
		box-shadow: 0px 8px 16px rgba(0,0,0,0.04), 0px 0px 0px 1px rgba(0,0,0,0.03);
		width: 100%;
		max-width: 460px;
		display: flex;
		flex-direction: column;
		gap: 28px;
	}
	.connect-header { display: flex; flex-direction: column; gap: 8px; }
	.connect-heading {
		font-family: 'DM Sans', sans-serif;
		font-size: 28px;
		font-weight: 700;
		color: #000000;
		letter-spacing: -0.6px;
		line-height: 1.15;
		margin: 0;
	}
	.connect-sub {
		font-family: 'Inter', sans-serif;
		font-size: 16px;
		color: #333333;
		line-height: 1.55;
		margin: 0;
	}
	.connect-field { display: flex; flex-direction: column; gap: 8px; }
	.connect-input {
		width: 100%;
		font-family: 'Inter', sans-serif;
		font-size: 14px;
		color: #000000;
		background: #ffffff;
		border: 1px solid #d6d6d6;
		border-radius: 10px;
		padding: 13px 14px;
		outline: none;
		transition: border-color 0.15s, box-shadow 0.15s;
		box-sizing: border-box;
	}
	.connect-input::placeholder { color: #bbbbbb; }
	.connect-input:focus { border-color: #aaaaaa; box-shadow: 0 0 0 3px rgba(0,0,0,0.05); }
	.connect-input.input-error { border-color: #e57373; box-shadow: 0 0 0 3px rgba(229,115,115,0.12); }
	.connect-error {
		font-family: 'Inter', sans-serif;
		font-size: 13px;
		color: #c62828;
		margin: 0;
	}
	.demo-section { display: flex; flex-direction: column; gap: 10px; }
	.demo-label {
		font-family: 'Inter', sans-serif;
		font-size: 13px;
		color: #7b7b7b;
		margin: 0;
	}
	.demo-pills { display: flex; flex-wrap: wrap; gap: 8px; }
	.demo-pill {
		font-family: 'Inter', sans-serif;
		font-size: 12px;
		font-weight: 500;
		color: #333333;
		background: #ffffff;
		border: 1px solid #d6d6d6;
		border-radius: 10px;
		padding: 6px 12px;
		cursor: pointer;
		transition: background 0.12s, border-color 0.12s, color 0.12s;
		letter-spacing: 0.01em;
	}
	.demo-pill:hover { background: #f5f2f0; border-color: #bbbbbb; }
	.demo-pill.demo-pill-active { background: #f5f2f0; border-color: #888888; color: #000000; }
	.btn-connect {
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		background: #f1ccff;
		color: #000000;
		font-family: 'DM Sans', sans-serif;
		font-size: 15px;
		font-weight: 700;
		border: none;
		border-radius: 10px;
		padding: 15px 24px;
		cursor: pointer;
		transition: background 0.15s, transform 0.12s;
		letter-spacing: -0.1px;
	}
	.btn-connect:hover { background: #e8b8ff; transform: translateY(-1px); }
	.btn-connect:active { transform: translateY(0); }
</style>
