<script lang="ts">
        import { transactions, lostAmount, formatNaira } from '$lib/data/transactions';

        let scanning = false;
        let activeFilter: 'all' | 'failed' | 'abandoned' | 'success' = 'all';

        function handleScan() {
                scanning = true;
                setTimeout(() => scanning = false, 2000);
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
</script>

<header class="navbar">
        <div class="navbar-inner">
                <div class="nav-logo">LeakFix</div>
                <button class="btn-demo">Demo</button>
        </div>
</header>

<div class="page">
        <div class="container">

                <!-- Hero -->
                <section class="hero">
                        <div class="hero-badge">Revenue recovery for Paystack merchants</div>
                        <h1 class="hero-headline">You're losing money.</h1>
                        <p class="hero-sub">Failed Paystack payments are silently eating your revenue.</p>
                        <div class="hero-actions">
                                <button class="btn-primary" onclick={handleScan} disabled={scanning}>
                                        {scanning ? 'Scanning…' : 'Scan for leaks'}
                                </button>
                                <span class="hero-hint">No credit card required</span>
                        </div>
                </section>

                <!-- Stats -->
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

                <!-- Features -->
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

                <!-- Transactions -->
                <section class="txn-section">
                        <div class="txn-header">
                                <div>
                                        <h2 class="section-title" style="margin-bottom:4px">Transaction scan results</h2>
                                        <p class="txn-subtitle">Showing {transactions.length} transactions from your Paystack account</p>
                                </div>
                                <div class="lost-badge">
                                        <span class="lost-label">Total lost</span>
                                        <span class="lost-amount">{formatNaira(lostAmount)}</span>
                                </div>
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
                                                {#each filtered as txn}
                                                        <tr>
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

                <!-- CTA strip -->
                <section class="cta-strip">
                        <div class="cta-inner">
                                <h2 class="cta-title">See exactly what you're losing</h2>
                                <p class="cta-body">Connect your Paystack account in 30 seconds. We'll surface every leak.</p>
                                <button class="btn-primary" onclick={handleScan} disabled={scanning}>
                                        {scanning ? 'Scanning…' : 'Scan for leaks'}
                                </button>
                        </div>
                </section>

                <!-- Footer -->
                <footer class="footer">
                        <span>© 2026 LeakFix. All rights reserved.</span>
                        <div class="footer-links">
                                <a href="/">Privacy</a>
                                <a href="/">Terms</a>
                                <a href="/">Contact</a>
                        </div>
                </footer>

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
                font-family: 'Playfair Display', serif;
                font-size: 20px;
                font-weight: 700;
                color: #000000;
                letter-spacing: -0.3px;
        }

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

        .btn-demo:hover {
                background: #222222;
                transform: translateY(-1px);
        }

        .btn-demo:active {
                transform: translateY(0);
        }

        .page {
                background: #f5f2f0;
                min-height: 100vh;
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
                font-family: 'Playfair Display', serif;
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
                font-weight: 400;
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

        /* Button */
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

        .btn-primary:hover:not(:disabled) {
                background: #e8b8ff;
                transform: translateY(-1px);
        }

        .btn-primary:active:not(:disabled) {
                transform: translateY(0);
        }

        .btn-primary:disabled {
                opacity: 0.6;
                cursor: not-allowed;
        }

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
                font-family: 'Playfair Display', serif;
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
        .features {
                margin-top: 30px;
        }

        .section-title {
                font-family: 'Playfair Display', serif;
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
                font-family: 'Playfair Display', serif;
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

        /* Transactions */
        .txn-section {
                margin-top: 30px;
        }

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
                font-family: 'Playfair Display', serif;
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

        .filter-btn:hover {
                background: #f5f2f0;
        }

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

        .txn-table thead tr {
                border-bottom: 1px solid #d6d6d6;
        }

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

        .txn-table tbody tr:last-child {
                border-bottom: none;
        }

        .txn-table tbody tr:hover {
                background: #faf9f8;
        }

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

        .status-success {
                background: #e8f5e9;
                color: #2e7d32;
        }

        .status-failed {
                background: #fdecea;
                color: #c62828;
        }

        .status-abandoned {
                background: #fff8e1;
                color: #e65100;
        }

        /* CTA Strip */
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
                font-family: 'Playfair Display', serif;
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

        .footer-links {
                display: flex;
                gap: 24px;
        }

        .footer-links a {
                color: #888888;
                text-decoration: none;
                transition: color 0.15s;
        }

        .footer-links a:hover {
                color: #000000;
        }

        /* Responsive */
        @media (max-width: 768px) {
                .stats-row,
                .feature-grid {
                        grid-template-columns: 1fr;
                }

                .nav-links a:not(.nav-cta) {
                        display: none;
                }

                .hero {
                        padding: 64px 0 30px;
                }
        }
</style>
