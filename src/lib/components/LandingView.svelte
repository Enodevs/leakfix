<script lang="ts">
	let { onScan }: { onScan: () => void } = $props();
</script>

<section class="hero">
	<div class="hero-badge">For Paystack merchants</div>
	<h1 class="hero-headline">Your payments<br>are leaking.</h1>
	<p class="hero-sub">Failed charges and abandoned checkouts drain 15–20% of revenue — silently, every day.</p>
	<div class="hero-actions">
		<button class="btn-primary" onclick={onScan}>Scan for leaks</button>
		<span class="hero-hint">Free · No card required · Takes 10 seconds</span>
	</div>
</section>

<section class="stats-row">
	<div class="stat-card">
		<span class="stat-value">₦2.4B</span>
		<span class="stat-label">Recovered for merchants</span>
	</div>
	<div class="stat-card">
		<span class="stat-value">18%</span>
		<span class="stat-label">Average revenue recovered</span>
	</div>
	<div class="stat-card">
		<span class="stat-value">&lt; 1hr</span>
		<span class="stat-label">Typical time to first recovery</span>
	</div>
</section>

<section class="features">
	<h2 class="section-title">Where your money goes missing</h2>
	<div class="feature-grid">
		<div class="card">
			<div class="card-icon">
				<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
			</div>
			<h3 class="card-title">Failed charges</h3>
			<p class="card-body">Insufficient funds, expired cards, and network drops fail silently — with no retry logic in place.</p>
		</div>
		<div class="card">
			<div class="card-icon">
				<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
			</div>
			<h3 class="card-title">Abandoned checkouts</h3>
			<p class="card-body">Customers drop off mid-payment. No follow-up, no recovery. That's revenue left on the table.</p>
		</div>
		<div class="card">
			<div class="card-icon">
				<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/></svg>
			</div>
			<h3 class="card-title">Subscription churn</h3>
			<p class="card-body">Recurring charges fail quietly. Subscribers lose access before they even know there was an issue.</p>
		</div>
	</div>
</section>

<section class="cta-strip">
	<div class="cta-inner">
		<h2 class="cta-title">See exactly what you're losing</h2>
		<p class="cta-body">Connect your Paystack account in 30 seconds. We'll surface every leak.</p>
		<button class="btn-primary" onclick={onScan}>Scan for leaks</button>
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
	.hero {
		padding: 96px 0 30px;
		text-align: center;
		max-width: 720px;
		margin: 0 auto;
	}
	.hero-badge {
		display: inline-block;
		font-family: 'Inter', sans-serif;
		font-size: 12px;
		font-weight: 500;
		color: #333333;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		background: #ffffff;
		border: 1px solid #d6d6d6;
		border-radius: 100px;
		padding: 6px 16px;
		margin-bottom: 28px;
	}
	.hero-headline {
		font-family: 'DM Sans', sans-serif;
		font-size: clamp(52px, 7vw, 88px);
		font-weight: 700;
		color: #000000;
		line-height: 1.05;
		letter-spacing: -2px;
		margin-bottom: 20px;
	}
	.hero-sub {
		font-family: 'Inter', sans-serif;
		font-size: 18px;
		color: #333333;
		line-height: 1.6;
		margin-bottom: 40px;
	}
	.hero-actions {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 12px;
	}
	.hero-hint {
		font-family: 'Inter', sans-serif;
		font-size: 13px;
		color: #888888;
	}
	.btn-primary {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		background: #f1ccff;
		color: #000000;
		font-family: 'DM Sans', sans-serif;
		font-size: 15px;
		font-weight: 700;
		border: none;
		border-radius: 12px;
		padding: 16px 36px;
		cursor: pointer;
		transition: background 0.15s, transform 0.12s;
		letter-spacing: -0.1px;
	}
	.btn-primary:hover { background: #e8b8ff; transform: translateY(-1px); }
	.btn-primary:active { transform: translateY(0); }

	.stats-row {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 16px;
		margin-top: 32px;
	}
	.stat-card {
		background: #ffffff;
		border-radius: 24px;
		padding: 40px;
		box-shadow: 0px 2px 8px rgba(0,0,0,0.04), 0px 0px 0px 1px rgba(0,0,0,0.03);
		display: flex;
		flex-direction: column;
		gap: 8px;
		transition: box-shadow 0.18s, transform 0.15s;
	}
	.stat-card:hover { box-shadow: 0px 8px 24px rgba(0,0,0,0.08); transform: translateY(-2px); }
	.stat-value {
		font-family: 'DM Sans', sans-serif;
		font-size: 42px;
		font-weight: 700;
		color: #000000;
		letter-spacing: -1.5px;
		line-height: 1;
	}
	.stat-label {
		font-family: 'Inter', sans-serif;
		font-size: 14px;
		color: #333333;
		line-height: 1.5;
	}

	.features { margin-top: 32px; }
	.section-title {
		font-family: 'DM Sans', sans-serif;
		font-size: 32px;
		font-weight: 700;
		color: #000000;
		letter-spacing: -0.8px;
		margin-bottom: 16px;
	}
	.feature-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 16px;
	}
	.card {
		background: #ffffff;
		border-radius: 24px;
		padding: 40px;
		box-shadow: 0px 2px 8px rgba(0,0,0,0.04), 0px 0px 0px 1px rgba(0,0,0,0.03);
		display: flex;
		flex-direction: column;
		gap: 16px;
		transition: box-shadow 0.18s, transform 0.15s;
	}
	.card:hover { box-shadow: 0px 8px 24px rgba(0,0,0,0.08); transform: translateY(-2px); }
	.card-icon {
		width: 44px;
		height: 44px;
		background: #f5f2f0;
		border-radius: 12px;
		display: flex;
		align-items: center;
		justify-content: center;
		color: #000000;
	}
	.card-title {
		font-family: 'DM Sans', sans-serif;
		font-size: 20px;
		font-weight: 600;
		color: #000000;
		letter-spacing: -0.3px;
	}
	.card-body {
		font-family: 'Inter', sans-serif;
		font-size: 14px;
		color: #333333;
		line-height: 1.65;
	}

	.cta-strip {
		margin-top: 32px;
		background: #ffffff;
		border-radius: 24px;
		box-shadow: 0px 2px 8px rgba(0,0,0,0.04), 0px 0px 0px 1px rgba(0,0,0,0.03);
		padding: 40px;
	}
	.cta-inner {
		max-width: 520px;
		display: flex;
		flex-direction: column;
		gap: 16px;
	}
	.cta-title {
		font-family: 'DM Sans', sans-serif;
		font-size: 28px;
		font-weight: 700;
		color: #000000;
		letter-spacing: -0.6px;
	}
	.cta-body {
		font-family: 'Inter', sans-serif;
		font-size: 15px;
		color: #333333;
		line-height: 1.6;
	}

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
		.stats-row, .feature-grid { grid-template-columns: 1fr; }
		.hero { padding: 64px 0 30px; }
	}
</style>
