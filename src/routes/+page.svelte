<script lang="ts">
        import { fade, fly } from 'svelte/transition';
        import { transactions, lostAmount, formatNaira } from '$lib/data/transactions';

        type View = 'landing' | 'scanning' | 'results' | 'recovering' | 'recovered';

        let view = $state<View>('landing');
        let activeFilter = $state<'all' | 'failed' | 'abandoned' | 'success'>('all');
        let scanProgress = $state(0);
        let recoverProgress = $state(0);
        let showModal = $state(false);

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

        function startRecovery() {
                view = 'recovering';
                recoverProgress = 0;
                const steps = [15, 40, 65, 85, 100];
                steps.forEach((target, i) => {
                        setTimeout(() => {
                                recoverProgress = target;
                                if (i === steps.length - 1) {
                                        setTimeout(() => { view = 'recovered'; }, 400);
                                }
                        }, i * 300 + 120);
                });
        }

        function goHome() {
                view = 'landing';
                activeFilter = 'all';
                scanProgress = 0;
                recoverProgress = 0;
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
                        {#if view === 'results' || view === 'recovered'}
                                <button class="btn-back" onclick={goHome} transition:fade={{ duration: 150 }}>
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
                                                <button class="btn-recover" onclick={startRecovery}>
                                                        Recover this money
                                                </button>
                                        </div>
                                </div>

                                <!-- Insight card -->
                                <div class="insight-wrap">
                                        <div class="insight-card">
                                                <span class="insight-label">Insight</span>
                                                <p class="insight-text">Customers who fail once are 2× more likely to complete payment within 6 hours.</p>
                                        </div>
                                </div>

                                <!-- Failed transactions list -->
                                <section class="failed-section">
                                        <h3 class="failed-title">Failed transactions</h3>
                                        <div class="failed-list">
                                                {#each transactions.filter(t => t.status === 'failed') as txn (txn.id)}
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

                <!-- RECOVERING VIEW -->
                {:else if view === 'recovering'}
                        <div class="recovering-view" transition:fade={{ duration: 180 }}>
                                <div class="recovering-inner">
                                        <div class="recover-icon-wrap">
                                                <div class="recover-pulse"></div>
                                                <div class="recover-icon">↑</div>
                                        </div>
                                        <h2 class="recover-title">Recovering your money…</h2>
                                        <p class="recover-sub">Sending reminders · Retrying payments</p>
                                        <div class="progress-track">
                                                <div class="progress-bar recover-bar" style="width: {recoverProgress}%"></div>
                                        </div>
                                        <span class="progress-label">{recoverProgress}%</span>
                                </div>
                        </div>

                <!-- RECOVERED VIEW -->
                {:else if view === 'recovered'}
                        <div class="recovered-view" transition:fly={{ y: 20, duration: 300, opacity: 0 }}>
                                <div class="success-card-wrap">
                                        <div class="success-card">
                                                <div class="success-icon">✓</div>
                                                <p class="success-eyebrow">Recovery complete</p>
                                                <h2 class="success-amount">₦32,000 recovered</h2>
                                                <p class="success-body">Reminders sent to 6 customers</p>
                                                <div class="success-actions">
                                                        <button class="btn-primary" onclick={() => showModal = true}>View messages</button>
                                                        <button class="btn-outline" onclick={goHome}>Back</button>
                                                </div>
                                        </div>
                                </div>
                        </div>

                {/if}

        </div>
</div>

{#if showModal}
        <div class="modal-backdrop" transition:fade={{ duration: 150 }} onclick={() => showModal = false} role="dialog" aria-modal="true">
                <div class="modal-card" transition:fly={{ y: 16, duration: 220, opacity: 0 }} onclick={(e) => e.stopPropagation()}>

                        <div class="modal-header">
                                <span class="modal-label">Recovery message</span>
                                <button class="modal-close" onclick={() => showModal = false} aria-label="Close">✕</button>
                        </div>

                        <!-- SMS bubble -->
                        <div class="sms-wrap">
                                <div class="sms-meta">LeakFix · SMS</div>
                                <div class="sms-bubble">
                                        <p>Hi, your payment didn't go through.</p>
                                        <p>Complete it here: <span class="sms-link">pay.link/example</span></p>
                                </div>
                                <div class="sms-time">Delivered · just now</div>
                        </div>

                </div>
        </div>
{/if}

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
                transition: opacity 0.15s;
        }

        .nav-logo:hover { opacity: 0.6; }

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
                border-radius: 10px;
                padding: 8px 16px;
                cursor: pointer;
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
        .success-actions .btn-primary { width: 100%; padding: 14px 24px; }

        /* Stats */
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
                box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.04), 0px 0px 0px 1px rgba(0,0,0,0.03);
                display: flex;
                flex-direction: column;
                gap: 8px;
                transition: box-shadow 0.18s, transform 0.15s;
        }

        .stat-card:hover {
                box-shadow: 0px 8px 24px rgba(0, 0, 0, 0.08), 0px 0px 0px 1px rgba(0,0,0,0.04);
                transform: translateY(-2px);
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
                box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.04), 0px 0px 0px 1px rgba(0,0,0,0.03);
                display: flex;
                flex-direction: column;
                gap: 16px;
                transition: box-shadow 0.18s, transform 0.15s;
        }

        .card:hover {
                box-shadow: 0px 8px 24px rgba(0, 0, 0, 0.08), 0px 0px 0px 1px rgba(0,0,0,0.04);
                transform: translateY(-2px);
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
                margin-top: 32px;
                background: #ffffff;
                border-radius: 24px;
                box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.04), 0px 0px 0px 1px rgba(0,0,0,0.03);
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

        /* ---- RECOVERING VIEW ---- */
        .recovering-view {
                display: flex;
                align-items: center;
                justify-content: center;
                min-height: calc(100vh - 64px);
                padding: 40px 24px;
        }

        .recovering-inner {
                text-align: center;
                max-width: 400px;
                width: 100%;
        }

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

        .recover-bar {
                background: #a855f7 !important;
        }

        /* ---- RECOVERED / SUCCESS VIEW ---- */
        .recovered-view {
                display: flex;
                align-items: center;
                justify-content: center;
                min-height: calc(100vh - 64px);
                padding: 40px 24px;
        }

        .success-card-wrap {
                display: flex;
                justify-content: center;
                width: 100%;
        }

        .success-card {
                background: #ffffff;
                border-radius: 24px;
                padding: 48px 40px;
                box-shadow: 0px 8px 24px rgba(0, 0, 0, 0.06);
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

        .success-body {
                font-family: 'Inter', sans-serif;
                font-size: 15px;
                color: #555555;
                margin: 0;
        }

        .success-actions {
                display: flex;
                flex-direction: column;
                gap: 12px;
                width: 100%;
                margin-top: 16px;
        }

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

        .btn-outline:hover {
                border-color: #aaaaaa;
                color: #000000;
                background: #faf9f8;
        }

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
                box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.04), 0px 0px 0px 1px rgba(0,0,0,0.03);
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

        /* ---- FAILED TRANSACTIONS ---- */
        .failed-section {
                max-width: 600px;
                margin: 0 auto 30px;
                width: 100%;
        }

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

        .failed-list {
                display: flex;
                flex-direction: column;
                gap: 10px;
        }

        .failed-item {
                background: #ffffff;
                border-radius: 14px;
                padding: 16px 20px;
                box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.04), 0px 0px 0px 1px rgba(0,0,0,0.03);
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 16px;
                transition: box-shadow 0.15s, transform 0.13s;
        }

        .failed-item:hover {
                box-shadow: 0px 6px 20px rgba(0, 0, 0, 0.07), 0px 0px 0px 1px rgba(0,0,0,0.04);
                transform: translateY(-1px);
        }

        .failed-left {
                display: flex;
                flex-direction: column;
                gap: 3px;
                min-width: 0;
        }

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

        /* ---- RESULTS SCREEN ---- */
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
                box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.04), 0px 0px 0px 1px rgba(0,0,0,0.03);
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
                border: 1px solid #e8e4e0;
                border-radius: 16px;
                padding: 16px 24px;
                box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.04), 0px 0px 0px 1px rgba(0,0,0,0.03);
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
                border-radius: 10px;
                padding: 7px 14px;
                cursor: pointer;
                transition: background 0.12s, border-color 0.12s, color 0.12s;
        }

        .filter-btn:hover { background: #f5f2f0; border-color: #bbbbbb; }

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
                box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.04), 0px 0px 0px 1px rgba(0,0,0,0.03);
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

        /* ---- INSIGHT CARD ---- */
        .insight-wrap {
                display: flex;
                justify-content: center;
                padding: 0 0 24px;
        }

        .insight-card {
                background: #91e0ff;
                border-radius: 24px;
                padding: 40px;
                max-width: 600px;
                width: 100%;
                display: flex;
                flex-direction: column;
                gap: 12px;
        }

        .insight-label {
                font-family: 'Inter', sans-serif;
                font-size: 11px;
                font-weight: 700;
                letter-spacing: 0.1em;
                text-transform: uppercase;
                color: #0369a1;
        }

        .insight-text {
                font-family: 'DM Sans', sans-serif;
                font-size: 17px;
                font-weight: 500;
                color: #0c2a3a;
                line-height: 1.55;
                margin: 0;
        }

        /* ---- MESSAGE MODAL ---- */
        .modal-backdrop {
                position: fixed;
                inset: 0;
                background: rgba(0, 0, 0, 0.32);
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
                max-width: 360px;
                box-shadow: 0 16px 40px rgba(0, 0, 0, 0.12);
        }

        .modal-header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                margin-bottom: 20px;
        }

        .modal-label {
                font-family: 'Inter', sans-serif;
                font-size: 12px;
                font-weight: 600;
                letter-spacing: 0.07em;
                text-transform: uppercase;
                color: #999999;
        }

        .modal-close {
                background: none;
                border: none;
                cursor: pointer;
                font-size: 14px;
                color: #aaaaaa;
                padding: 2px 6px;
                border-radius: 6px;
                transition: color 0.15s;
        }

        .modal-close:hover { color: #333333; }

        .sms-wrap {
                display: flex;
                flex-direction: column;
                gap: 8px;
        }

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

        .sms-link {
                color: #7c3aed;
                font-weight: 500;
                text-decoration: underline;
                text-underline-offset: 2px;
        }

        .sms-time {
                font-family: 'Inter', sans-serif;
                font-size: 11px;
                color: #cccccc;
                text-align: right;
        }
</style>
