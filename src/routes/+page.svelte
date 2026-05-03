<script lang="ts">
        import { fade, fly } from 'svelte/transition';
        import { transactions, lostAmount, formatNaira } from '$lib/data/transactions';

        type View = 'landing' | 'scanning' | 'results';

        let view = $state<View>('landing');
        let activeFilter = $state<'all' | 'failed' | 'abandoned' | 'success'>('all');
        let scanProgress = $state(0);

        function startScan() {
                view = 'scanning';
                scanProgress = 0;
                const steps = [10, 30, 55, 72, 88, 100];
                steps.forEach((target, i) => {
                        setTimeout(() => {
                                scanProgress = target;
                                if (i === steps.length - 1) {
                                        setTimeout(() => { view = 'results'; }, 300);
                                }
                        }, i * 280 + 100);
                });
        }

        const filtered = $derived(
                activeFilter === 'all'
                        ? transactions
                        : transactions.filter(t => t.status === activeFilter)
        );

        const statusCounts = $derived({
                all:       transactions.length,
                failed:    transactions.filter(t => t.status === 'failed').length,
                abandoned: transactions.filter(t => t.status === 'abandoned').length,
                success:   transactions.filter(t => t.status === 'success').length,
        });

        const lostFiltered = $derived(
                filtered
                        .filter(t => t.status === 'failed' || t.status === 'abandoned')
                        .reduce((s, t) => s + t.amount, 0)
        );
</script>

<!-- Sticky navbar always visible -->
<header class="navbar">
        <div class="navbar-inner">
                <button class="nav-logo" onclick={() => { view = 'landing'; activeFilter = 'all'; }}>LeakFix</button>
                <div class="nav-right">
                        {#if view === 'results'}
                                <button class="btn-back" onclick={() => { view = 'landing'; activeFilter = 'all'; }} transition:fade={{ duration: 150 }}>
                                        ← Back
                                </button>
                        {/if}
                        <button class="btn-demo">Demo</button>
                </div>
        </div>
</header>

<div class="page">
        <div class="container">

                <!-- LANDING VIEW -->
                {#if view === 'landing'}
                        <div transition:fade={{ duration: 200 }}>

                                <section class="hero">
                                        <div class="hero-badge">Revenue recovery for Paystack merchants</div>
                                        <h1 class="hero-headline">You're losing money.</h1>
                                        <p class="hero-sub">Failed Paystack payments are silently eating your revenue.</p>
                                        <div class="hero-actions">
                                                <button class="btn-primary" onclick={startScan}>
                                                        Scan for leaks
                                                </button>
                                                <span class="hero-hint">No credit card required</span>
                                        </div>
                                </section>

                                <section class="stats-row">
                                        <div class="stat-card">
                                                <span class="stat-value">$2.4M</span>
                                                <span class="stat-label">Recovered for merchants</span>
                                        </div>
                                        <div class="stat-card">
                                                <span class="stat-value">18%</span>
                                                <span class="stat-label">Average revenue recovered</span>
                                        </div>
                                        <div class="stat-card">
                                                <span class="stat-value">72hrs</span>
                                                <span class="stat-label">Typical time to first recovery</span>
                                        </div>
                                </section>

                                <section class="features">
                                        <h2 class="section-title">Where your money goes missing</h2>
                                        <div class="feature-grid">
                                                <div class="card">
                                                        <div class="card-icon">↯</div>
                                                        <h3 class="card-title">Failed charges</h3>
                                                        <p class="card-body">Insufficient funds, expired cards, and network drops fail silently — with no retry logic in place.</p>
                                                </div>
                                                <div class="card">
                                                        <div class="card-icon">⊘</div>
                                                        <h3 class="card-title">Abandoned checkouts</h3>
                                                        <p class="card-body">Customers drop off mid-payment. No follow-up, no recovery. That's revenue left on the table.</p>
                                                </div>
                                                <div class="card">
                                                        <div class="card-icon">↺</div>
                                                        <h3 class="card-title">Subscription churn</h3>
                                                        <p class="card-body">Recurring charges fail quietly. Subscribers lose access before they even know there was an issue.</p>
                                                </div>
                                        </div>
                                </section>

                                <section class="cta-strip">
                                        <div class="cta-inner">
                                                <h2 class="cta-title">See exactly what you're losing</h2>
                                                <p class="cta-body">Connect your Paystack account in 30 seconds. We'll surface every leak.</p>
                                                <button class="btn-primary" onclick={startScan}>Scan for leaks</button>
                                        </div>
                                </section>

                                <footer class="footer">
                                        <span>© 2026 LeakFix. All rights reserved.</span>
                                        <div class="footer-links">
                                                <a href="/">Privacy</a>
                                                <a href="/">Terms</a>
                                                <a href="/">Contact</a>
                                        </div>
                                </footer>

                        </div>

                <!-- SCANNING VIEW -->
                {:else if view === 'scanning'}
                        <div class="scanning-view" transition:fade={{ duration: 180 }}>
                                <div class="scanning-inner">
                                        <div class="scan-icon-wrap">
                                                <div class="scan-pulse"></div>
                                                <div class="scan-icon">⟳</div>
                                        </div>
                                        <h2 class="scan-title">Scanning your transactions…</h2>
                                        <p class="scan-sub">Connecting to Paystack · Analysing payment data</p>

                                        <div class="progress-track">
                                                <div class="progress-bar" style="width: {scanProgress}%"></div>
                                        </div>
                                        <span class="progress-label">{scanProgress}%</span>

                                        <div class="scan-steps">
                                                <span class:done={scanProgress >= 30}>Fetching transactions</span>
                                                <span class="sep">·</span>
                                                <span class:done={scanProgress >= 55}>Detecting failures</span>
                                                <span class="sep">·</span>
                                                <span class:done={scanProgress >= 88}>Computing losses</span>
                                        </div>
                                </div>
                        </div>

                <!-- RESULTS VIEW -->
                {:else if view === 'results'}
                        <div transition:fly={{ y: 24, duration: 320, opacity: 0 }}>

                                <!-- Hero impact card -->
                                <div class="impact-card-wrap">
                                        <div class="impact-card">
                                                <p class="impact-eyebrow">Your scan is complete</p>
                                                <h2 class="impact-amount">{formatNaira(lostAmount)}<span class="impact-lost"> LOST</span></h2>
                                                <p class="impact-body">This was money you already earned… but never received.</p>
                                                <button class="btn-recover" onclick={() => { view = 'landing'; activeFilter = 'all'; }}>
                                                        Recover this money
                                                </button>
                                        </div>
                                </div>

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

                                <!-- Table -->
                                <section class="txn-section">
                                        <div class="txn-header">
                                                <div>
                                                        <h2 class="section-title" style="margin-bottom:4px">Scan results</h2>
                                                        <p class="txn-subtitle">
                                                                {filtered.length} of {transactions.length} transactions
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
                                                                                        <span class="status-pill status-{txn.status}">
                                                                                                {txn.status}
                                                                                        </span>
                                                                                </td>
                                                                        </tr>
                                                                {/each}
                                                        </tbody>
                                                </table>
                                        </div>
                                </section>

                                <footer class="footer">
                                        <span>© 2026 LeakFix. All rights reserved.</span>
                                        <div class="footer-links">
                                                <a href="/">Privacy</a>
                                                <a href="/">Terms</a>
                                                <a href="/">Contact</a>
                                        </div>
                                </footer>

                        </div>
                {/if}

        </div>
</div>

<style>
        /* Navbar */
        .navbar {
                position: sticky;
                top: 0;
                z-index: 100;
                background: #f5f2f0;
                box-shadow: 0px 1px 2px rgba(16, 24, 40, 0.05);
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
        }

        .nav-right {
                display: flex;
                align-items: center;
                gap: 10px;
        }

        .btn-back {
                font-family: 'Inter', sans-serif;
                font-size: 13px;
                font-weight: 500;
                color: #333333;
                background: none;
                border: 1px solid #d6d6d6;
                border-radius: 8px;
                padding: 8px 16px;
                cursor: pointer;
                transition: background 0.12s;
        }

        .btn-back:hover { background: #ffffff; }

        .btn-demo {
                background: #000000;
                color: #ffffff;
                font-family: 'Inter', sans-serif;
                font-size: 13px;
                font-weight: 500;
                border: none;
                border-radius: 8px;
                padding: 9px 20px;
                cursor: pointer;
                letter-spacing: 0.01em;
                transition: background 0.15s, transform 0.1s;
        }

        .btn-demo:hover { background: #222222; transform: translateY(-1px); }
        .btn-demo:active { transform: translateY(0); }

        /* Page shell */
        .page {
                background: #f5f2f0;
                min-height: calc(100vh - 64px);
                padding: 0 24px;
        }

        .container {
                max-width: 1200px;
                margin: 0 auto;
        }

        /* Hero */
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

        /* Buttons */
        .btn-primary {
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
                letter-spacing: -0.1px;
        }

        .btn-primary:hover { background: #e8b8ff; transform: translateY(-1px); }
        .btn-primary:active { transform: translateY(0); }

        /* Stats */
        .stats-row {
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                gap: 16px;
                margin-top: 30px;
        }

        .stat-card {
                background: #ffffff;
                border-radius: 24px;
                padding: 40px;
                box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.04);
                display: flex;
                flex-direction: column;
                gap: 8px;
        }

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

        /* Features */
        .features { margin-top: 30px; }

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
                box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.04);
                display: flex;
                flex-direction: column;
                gap: 16px;
        }

        .card-icon {
                font-size: 24px;
                color: #000000;
                width: 44px;
                height: 44px;
                background: #f5f2f0;
                border-radius: 12px;
                display: flex;
                align-items: center;
                justify-content: center;
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

        /* CTA */
        .cta-strip {
                margin-top: 30px;
                background: #ffffff;
                border-radius: 24px;
                box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.04);
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

        /* ---- SCANNING SCREEN ---- */
        .scanning-view {
                display: flex;
                align-items: center;
                justify-content: center;
                min-height: calc(100vh - 120px);
        }

        .scanning-inner {
                text-align: center;
                max-width: 480px;
                width: 100%;
                padding: 40px 0;
        }

        .scan-icon-wrap {
                position: relative;
                width: 72px;
                height: 72px;
                margin: 0 auto 28px;
                display: flex;
                align-items: center;
                justify-content: center;
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

        @keyframes spin {
                to { transform: rotate(360deg); }
        }

        .scan-title {
                font-family: 'DM Sans', sans-serif;
                font-size: 26px;
                font-weight: 700;
                color: #000000;
                letter-spacing: -0.5px;
                margin-bottom: 8px;
        }

        .scan-sub {
                font-family: 'Inter', sans-serif;
                font-size: 14px;
                color: #888888;
                margin-bottom: 32px;
        }

        .progress-track {
                background: #e8e4e0;
                border-radius: 100px;
                height: 6px;
                overflow: hidden;
                margin-bottom: 10px;
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
                font-weight: 600;
                color: #333333;
        }

        .scan-steps {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 8px;
                margin-top: 20px;
                font-family: 'Inter', sans-serif;
                font-size: 12px;
                color: #bbbbbb;
        }

        .scan-steps span { transition: color 0.3s; }
        .scan-steps .done { color: #000000; }
        .scan-steps .sep { color: #d6d6d6; }

        /* ---- IMPACT HERO CARD ---- */
        .impact-card-wrap {
                display: flex;
                justify-content: center;
                padding: 40px 0 30px;
        }

        .impact-card {
                background: #ffffff;
                border-radius: 24px;
                padding: 40px;
                box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.04);
                text-align: center;
                max-width: 600px;
                width: 100%;
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 20px;
        }

        .impact-eyebrow {
                font-family: 'Inter', sans-serif;
                font-size: 12px;
                font-weight: 500;
                letter-spacing: 0.1em;
                text-transform: uppercase;
                color: #888888;
        }

        .impact-amount {
                font-family: 'DM Sans', sans-serif;
                font-size: clamp(48px, 6vw, 62px);
                font-weight: 800;
                color: #000000;
                line-height: 1;
                letter-spacing: -2px;
        }

        .impact-lost {
                font-family: 'DM Sans', sans-serif;
                font-weight: 800;
                color: #c62828;
        }

        .impact-body {
                font-family: 'Inter', sans-serif;
                font-size: 17px;
                color: #333333;
                line-height: 1.65;
                max-width: 420px;
                font-style: italic;
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
                letter-spacing: -0.1px;
                margin-top: 4px;
        }

        .btn-recover:hover { background: #e8b8ff; transform: translateY(-1px); }
        .btn-recover:active { transform: translateY(0); }

        /* ---- RESULTS SCREEN ---- */
        .results-summary {
                display: grid;
                grid-template-columns: repeat(4, 1fr);
                gap: 16px;
                margin-top: 30px;
                margin-bottom: 30px;
        }

        .summary-card {
                background: #ffffff;
                border-radius: 20px;
                padding: 28px 24px;
                box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.04);
                display: flex;
                flex-direction: column;
                gap: 6px;
        }

        .summary-card.alert { border-top: 3px solid #c62828; }
        .summary-card.success { border-top: 3px solid #2e7d32; }

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

        /* Transactions */
        .txn-section { margin-top: 0; }

        .txn-header {
                display: flex;
                align-items: flex-start;
                justify-content: space-between;
                gap: 16px;
                margin-bottom: 16px;
        }

        .txn-subtitle {
                font-family: 'Inter', sans-serif;
                font-size: 14px;
                color: #888888;
                margin-top: 4px;
        }

        .txn-subtitle strong { color: #333333; font-weight: 600; }

        .lost-badge {
                background: #ffffff;
                border: 1px solid #d6d6d6;
                border-radius: 16px;
                padding: 16px 24px;
                box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.04);
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

        .txn-filters {
                display: flex;
                gap: 8px;
                margin-bottom: 12px;
        }

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
                border-radius: 8px;
                padding: 7px 14px;
                cursor: pointer;
                transition: background 0.12s, border-color 0.12s, color 0.12s;
        }

        .filter-btn:hover { background: #f5f2f0; }

        .filter-btn.active {
                background: #000000;
                border-color: #000000;
                color: #ffffff;
        }

        .filter-btn.active .filter-count {
                background: rgba(255, 255, 255, 0.2);
                color: #ffffff;
        }

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
                box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.04);
                overflow: hidden;
        }

        .txn-table {
                width: 100%;
                border-collapse: collapse;
        }

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

        .txn-table tbody tr {
                border-bottom: 1px solid #f0eeed;
                transition: background 0.1s;
        }

        .txn-table tbody tr:last-child { border-bottom: none; }
        .txn-table tbody tr:hover { background: #faf9f8; }

        .txn-table td {
                padding: 16px 24px;
                vertical-align: middle;
        }

        .txn-id {
                font-family: 'Inter', sans-serif;
                font-size: 13px;
                font-weight: 500;
                color: #888888;
                letter-spacing: 0.02em;
        }

        .txn-email {
                font-family: 'Inter', sans-serif;
                font-size: 14px;
                color: #000000;
        }

        .txn-amount {
                font-family: 'Inter', sans-serif;
                font-size: 14px;
                font-weight: 600;
                color: #000000;
                letter-spacing: -0.2px;
        }

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

        /* Footer */
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

        .footer-links a {
                color: #888888;
                text-decoration: none;
                transition: color 0.15s;
        }

        .footer-links a:hover { color: #000000; }

        /* Responsive */
        @media (max-width: 768px) {
                .stats-row, .feature-grid, .results-summary {
                        grid-template-columns: 1fr;
                }
                .hero { padding: 64px 0 30px; }
        }
</style>
