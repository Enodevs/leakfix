<script lang="ts">
	import { fade, fly } from 'svelte/transition';
	import { type Transaction } from '$lib/data/transactions';
	import { insights, smsTemplates } from '$lib/data/mockData';
	import favicon        from '$lib/assets/favicon.png';
	import LandingView    from '$lib/components/LandingView.svelte';
	import ConnectView    from '$lib/components/ConnectView.svelte';
	import ScanningView   from '$lib/components/ScanningView.svelte';
	import ResultsView    from '$lib/components/ResultsView.svelte';
	import RecoveringView from '$lib/components/RecoveringView.svelte';
	import RecoveredView  from '$lib/components/RecoveredView.svelte';
	import MessageModal   from '$lib/components/MessageModal.svelte';

	type View = 'landing' | 'connect' | 'scanning' | 'results' | 'recovering' | 'recovered';

	function pick<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)]; }
	function pickN<T>(arr: T[], n: number): T[] {
		return [...arr].sort(() => Math.random() - 0.5).slice(0, n);
	}

	// ── State ────────────────────────────────────────────────────────────────────
	let view          = $state<View>('landing');
	let scanProgress  = $state(0);
	let recoverProgress = $state(0);
	let showModal     = $state(false);
	let activeInsight = $state(insights[0]);
	let activeMessages = $state(smsTemplates.slice(0, 3));
	let activeDataset = $state<Transaction[]>([]);

	const lostAmount = $derived(
		activeDataset
			.filter(t => t.status === 'failed' || t.status === 'abandoned')
			.reduce((s, t) => s + t.amount, 0)
	);

	// ── Flow handlers ─────────────────────────────────────────────────────────
	function onConnect(dataset: Transaction[]) {
		activeDataset = dataset;
		activeInsight = pick(insights);
		view = 'scanning';
		scanProgress = 0;
		const steps = [10, 30, 55, 72, 88, 100];
		steps.forEach((target, i) => {
			setTimeout(() => {
				scanProgress = target;
				if (i === steps.length - 1) setTimeout(() => { view = 'results'; }, 300);
			}, i * 280 + 100);
		});
	}

	function onRecover() {
		view = 'recovering';
		recoverProgress = 0;
		const steps = [15, 40, 65, 85, 100];
		steps.forEach((target, i) => {
			setTimeout(() => {
				recoverProgress = target;
				if (i === steps.length - 1) setTimeout(() => { view = 'recovered'; }, 400);
			}, i * 300 + 120);
		});
	}

	function goHome() {
		view = 'landing';
		scanProgress = 0;
		recoverProgress = 0;
		activeDataset = [];
	}
</script>

<svelte:head>
	<title>Recoverly — Recover Failed Paystack Payments Automatically</title>
	<meta name="description" content="Recoverly helps Paystack merchants automatically recover failed charges and abandoned checkouts. Scan your transactions in 10 seconds and start recovering lost revenue today." />
	<meta name="keywords" content="Paystack, payment recovery, failed payments, abandoned checkout, Nigeria fintech, revenue recovery, Paystack merchants" />
	<meta name="robots" content="index, follow" />
	<meta name="author" content="Recoverly" />
	<link rel="canonical" href="https://recoverly.app/" />

	<!-- Open Graph -->
	<meta property="og:type"        content="website" />
	<meta property="og:url"         content="https://recoverly.app/" />
	<meta property="og:title"       content="Recoverly — Recover Failed Paystack Payments" />
	<meta property="og:description" content="Stop losing revenue to failed charges and abandoned checkouts. Recoverly scans your Paystack account and automatically sends recovery reminders." />
	<meta property="og:image"       content="https://recoverly.app/og-image.png" />
	<meta property="og:site_name"   content="Recoverly" />
	<meta property="og:locale"      content="en_NG" />

	<!-- Twitter Card -->
	<meta name="twitter:card"        content="summary_large_image" />
	<meta name="twitter:title"       content="Recoverly — Recover Failed Paystack Payments" />
	<meta name="twitter:description" content="Stop losing revenue to failed charges and abandoned checkouts. Recoverly scans your Paystack account and automatically sends recovery reminders." />
	<meta name="twitter:image"       content="https://recoverly.app/og-image.png" />

	<!-- Structured data -->
	{@html `<script type="application/ld+json">${JSON.stringify({
		"@context": "https://schema.org",
		"@type": "SoftwareApplication",
		"name": "Recoverly",
		"applicationCategory": "FinanceApplication",
		"description": "Automatically recover failed Paystack payments and abandoned checkouts for Nigerian merchants.",
		"operatingSystem": "Web",
		"offers": { "@type": "Offer", "price": "0", "priceCurrency": "NGN" },
		"url": "https://recoverly.app"
	})}<\/script>`}
</svelte:head>

<!-- Navbar -->
<header class="navbar">
	<div class="navbar-inner">
		<button class="nav-logo" onclick={goHome}>
			<img src={favicon} alt="Recoverly logo" class="nav-logo-img" />
			Recoverly
		</button>
		<div class="nav-right">
			{#if view === 'connect' || view === 'results' || view === 'recovered'}
				<button class="btn-back" onclick={goHome} transition:fade={{ duration: 150 }}>
					<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5"/><path d="m12 19-7-7 7-7"/></svg>
					Back
				</button>
			{/if}
			<button class="btn-demo" onclick={() => view = 'connect'}>Try Demo</button>
		</div>
	</div>
</header>

<div class="page">
	<div class="container">

		{#if view === 'landing'}
			<div transition:fade={{ duration: 200 }}>
				<LandingView onScan={() => view = 'connect'} />
			</div>

		{:else if view === 'connect'}
			<div transition:fly={{ y: 20, duration: 260, opacity: 0 }}>
				<ConnectView {onConnect} />
			</div>

		{:else if view === 'scanning'}
			<div transition:fade={{ duration: 180 }}>
				<ScanningView progress={scanProgress} />
			</div>

		{:else if view === 'results'}
			<div transition:fly={{ y: 24, duration: 320, opacity: 0 }}>
				<ResultsView
					dataset={activeDataset}
					{lostAmount}
					insight={activeInsight}
					{onRecover}
				/>
			</div>

		{:else if view === 'recovering'}
			<div transition:fade={{ duration: 180 }}>
				<RecoveringView progress={recoverProgress} />
			</div>

		{:else if view === 'recovered'}
			<div transition:fly={{ y: 20, duration: 300, opacity: 0 }}>
				<RecoveredView
					{lostAmount}
					onViewMessages={() => { activeMessages = pickN(smsTemplates, 3); showModal = true; }}
					onBack={goHome}
				/>
			</div>
		{/if}

	</div>
</div>

{#if showModal}
	<MessageModal messages={activeMessages} onClose={() => showModal = false} />
{/if}

<style>
	.navbar {
		position: sticky;
		top: 0;
		z-index: 100;
		background: #f5f2f0;
		box-shadow: 0px 1px 2px rgba(16,24,40,0.05);
	}
	.navbar-inner {
		max-width: 1200px;
		margin: 0 auto;
		padding: 0 24px;
		height: 64px;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	.nav-logo {
		font-family: 'DM Sans', sans-serif;
		font-size: 20px;
		font-weight: 700;
		color: #000000;
		letter-spacing: -0.3px;
		background: none;
		border: none;
		cursor: pointer;
		padding: 0;
		display: flex;
		align-items: center;
		gap: 8px;
		transition: opacity 0.15s;
	}
	.nav-logo-img {
		width: 28px;
		height: 28px;
		border-radius: 7px;
		object-fit: cover;
		flex-shrink: 0;
	}
	.nav-logo:hover { opacity: 0.6; }
	.nav-right { display: flex; align-items: center; gap: 10px; }
	.btn-back {
		font-family: 'Inter', sans-serif;
		font-size: 13px;
		font-weight: 500;
		color: #333333;
		background: none;
		border: 1px solid #d6d6d6;
		border-radius: 10px;
		padding: 8px 16px;
		cursor: pointer;
		display: inline-flex;
		align-items: center;
		gap: 6px;
		transition: background 0.12s, border-color 0.12s, color 0.12s;
	}
	.btn-back:hover { background: #ffffff; border-color: #bbbbbb; color: #000000; }
	.btn-demo {
		background: #000000;
		color: #ffffff;
		font-family: 'DM Sans', sans-serif;
		font-size: 13px;
		font-weight: 600;
		border: none;
		border-radius: 10px;
		padding: 9px 20px;
		cursor: pointer;
		letter-spacing: -0.1px;
		transition: background 0.15s, transform 0.12s;
	}
	.btn-demo:hover { background: #222222; transform: translateY(-1px); }
	.btn-demo:active { transform: translateY(0); }
	.page {
		background: #f5f2f0;
		min-height: calc(100vh - 64px);
		padding: 0 24px;
	}
	.container { max-width: 1200px; margin: 0 auto; }
</style>
