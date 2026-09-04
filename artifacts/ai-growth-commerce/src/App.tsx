import { useMemo, useState } from 'react';
import type { FormEvent, ReactNode } from 'react';
import { QueryClient, QueryClientProvider, useQueryClient } from '@tanstack/react-query';
import { Link, Route, Router as WouterRouter, Switch, useLocation, useParams } from 'wouter';
import {
  ArrowRight, BarChart3, Bot, Check, ChevronDown, ChevronLeft, CircleAlert, Clock3,
  CreditCard, Filter, Gauge, Headphones, LayoutDashboard, Menu, Package,
  Plus, RefreshCw, Search, Send, Settings2, ShieldCheck, ShoppingBag, Sparkles,
  Star, Store, Target, TrendingUp, Users, X, Zap,
} from 'lucide-react';
import {
  getGetCartQueryKey, getGetProductQueryKey, getGetPolicyQueryKey,
  getGetMerchantSummaryQueryKey, getListApprovalsQueryKey, getListAuditLogsQueryKey,
  getListCampaignsQueryKey, getListProductsQueryKey, getListOpportunitiesQueryKey,
  useAddCartItem, useChatWithShoppingAgent, useConfirmCheckout, useCreateCampaign,
  useGetCart, useGetMerchantSummary, useGetPolicy, useGetProduct, useListApprovals,
  useListAuditLogs, useListCampaigns, useListOpportunities, useListProducts,
  useRemoveCartItem, useStartCheckout, useUpdateApproval, useUpdatePolicy, useVerifyPayment,
} from '@workspace/api-client-react';
import type {
  Approval, AuditLog, Campaign, ChatResponse, MerchantSummary, Opportunity,
  Policy, Product,
} from '@workspace/api-client-react';
import { ErrorBoundary } from '@/components/error-boundary';
import NotFound from '@/pages/not-found';
import './index.css';

const queryClient = new QueryClient();

const money = (n = 0) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);
const pct = (n = 0) => `${(n * 100).toFixed(1)}%`;
const initials = (name = '') => name.split(' ').map((part) => part[0]).slice(0, 2).join('').toUpperCase();

function Button({ children, onClick, variant = 'primary', type = 'button', disabled = false, className = '', testId }: {
  children: ReactNode; onClick?: () => void; variant?: 'primary' | 'dark' | 'quiet' | 'outline' | 'danger';
  type?: 'button' | 'submit'; disabled?: boolean; className?: string; testId?: string;
}) {
  const styles = {
    primary: 'bg-primary text-primary-foreground hover:opacity-90',
    dark: 'bg-secondary text-secondary-foreground hover:opacity-90',
    quiet: 'bg-muted text-foreground hover:bg-border',
    outline: 'border border-border bg-transparent text-foreground hover:bg-muted',
    danger: 'bg-destructive text-destructive-foreground hover:opacity-90',
  };
  return <button type={type} onClick={onClick} disabled={disabled} data-testid={testId} className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-50 ${styles[variant]} ${className}`}>{children}</button>;
}

function ProductImage({ product, className = '' }: { product: Product; className?: string }) {
  const [failed, setFailed] = useState(false);
  return failed || !product.image ? (
    <div className={`flex items-center justify-center bg-[hsl(var(--secondary))] text-3xl font-bold tracking-tight text-[hsl(var(--accent))] ${className}`} data-testid={`img-product-fallback-${product.id}`}>{initials(product.name)}</div>
  ) : <img src={product.image} alt={product.name} onError={() => setFailed(true)} className={`object-cover ${className}`} data-testid={`img-product-${product.id}`} />;
}

function StatusPill({ children, tone = 'neutral' }: { children: ReactNode; tone?: 'neutral' | 'green' | 'orange' | 'red' }) {
  const tones = { neutral: 'bg-muted text-muted-foreground', green: 'bg-primary/15 text-primary', orange: 'bg-accent/20 text-foreground', red: 'bg-destructive/15 text-destructive' };
  return <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-[.12em] ${tones[tone]}`}>{children}</span>;
}

function QueryState({ loading, error, onRetry, empty, children }: { loading?: boolean; error?: boolean; onRetry?: () => void; empty?: boolean; children: ReactNode }) {
  if (loading) return <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{[1, 2, 3].map((i) => <div className="h-64 rounded-2xl skeleton" key={i} />)}</div>;
  if (error) return <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-10 text-center"><CircleAlert className="mx-auto mb-3 text-destructive" /><p className="font-semibold">We could not load this view.</p><p className="mt-1 text-sm text-muted-foreground">The workspace is still here. Try the connection again.</p><Button onClick={onRetry} variant="outline" className="mt-5" testId="button-retry">Retry connection</Button></div>;
  if (empty) return <div className="rounded-2xl border border-dashed border-border bg-card p-12 text-center"><Package className="mx-auto mb-3 text-muted-foreground" /><p className="font-semibold">Nothing here yet</p><p className="mt-1 text-sm text-muted-foreground">New activity will appear in this space.</p></div>;
  return <>{children}</>;
}

function CustomerHeader() {
  const [location] = useLocation();
  const { data: cart } = useGetCart({ query: { queryKey: getGetCartQueryKey(), staleTime: 15000 } });
  return <header className="sticky top-0 z-40 border-b border-border/80 bg-[hsl(var(--background)/.86)] backdrop-blur-xl">
    <div className="mx-auto flex h-16 max-w-[1320px] items-center justify-between px-4 sm:px-6">
      <Link href="/" className="flex items-center gap-3" data-testid="link-home">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-secondary text-accent"><Sparkles size={18} /></span>
        <span className="font-bold tracking-tight">ai growth <span className="text-primary">commerce</span></span>
      </Link>
      <nav className="hidden items-center gap-1 md:flex">
        <Link href="/catalog" data-testid="link-catalog" className={`rounded-lg px-3 py-2 text-sm font-medium ${location === '/catalog' ? 'bg-muted text-foreground' : 'text-muted-foreground hover:text-foreground'}`}>Catalog</Link>
        <Link href="/merchant" data-testid="link-merchant" className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground">Merchant cockpit</Link>
      </nav>
      <Link href="/cart" data-testid="link-cart" className="relative flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2 text-sm font-semibold hover:bg-muted"><ShoppingBag size={17} /><span className="hidden sm:inline">Cart</span>{(cart?.itemCount ?? 0) > 0 && <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-bold">{cart?.itemCount}</span>}</Link>
    </div>
  </header>;
}

function MerchantShell({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const [open, setOpen] = useState(false);
  const links = [
    { href: '/merchant', label: 'Overview', icon: LayoutDashboard },
    { href: '/merchant/approvals', label: 'Approvals', icon: ShieldCheck },
    { href: '/merchant/campaigns', label: 'Campaigns', icon: Target },
    { href: '/merchant/policy', label: 'Policy controls', icon: Settings2 },
    { href: '/merchant/audit', label: 'Audit trail', icon: Clock3 },
  ];
  return <div className="min-h-[100dvh] bg-background lg:flex">
    <button className="fixed right-4 top-4 z-50 rounded-xl bg-secondary p-3 text-secondary-foreground lg:hidden" onClick={() => setOpen(!open)} data-testid="button-toggle-menu"><Menu size={20} /></button>
    <aside className={`fixed inset-y-0 left-0 z-40 w-72 transform border-r border-sidebar-border bg-sidebar p-6 text-sidebar-foreground transition-transform lg:relative lg:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-sidebar-primary text-sidebar-primary-foreground"><Gauge size={20} /></span><div><div className="font-bold tracking-tight">Operator cockpit</div><div className="font-mono text-[10px] uppercase tracking-[.16em] text-sidebar-foreground/55">AI Growth Commerce</div></div></div>
      <div className="mt-12 text-[10px] font-bold uppercase tracking-[.2em] text-sidebar-foreground/40">Command center</div>
      <nav className="mt-3 grid gap-1">{links.map(({ href, label, icon: Icon }) => <Link key={href} href={href} onClick={() => setOpen(false)} data-testid={`link-${label.toLowerCase().replaceAll(' ', '-')}`} className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium ${location === href ? 'bg-sidebar-accent text-sidebar-accent-foreground' : 'text-sidebar-foreground/65 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground'}`}><Icon size={17} />{label}{href === '/merchant/approvals' && <span className="ml-auto rounded-full bg-accent px-2 py-0.5 text-[10px] font-bold text-accent-foreground">4</span>}</Link>)}</nav>
      <div className="absolute bottom-6 left-6 right-6 rounded-2xl border border-sidebar-border bg-sidebar-accent/70 p-4"><div className="flex items-center gap-2 text-xs font-semibold"><span className="h-2 w-2 rounded-full bg-sidebar-primary" />All systems nominal</div><div className="mt-2 text-xs leading-relaxed text-sidebar-foreground/50">Automation is operating within your current policy.</div></div>
    </aside>
    <main className="min-w-0 flex-1">{children}</main>
  </div>;
}

function ProductCard({ product, compact = false }: { product: Product; compact?: boolean }) {
  const qc = useQueryClient();
  const add = useAddCartItem();
  return <article className={`group overflow-hidden rounded-2xl border border-border bg-card ${compact ? 'flex gap-3 p-3' : 'lift transition-transform'}`} data-testid={`card-product-${product.id}`}>
    <Link href={`/product/${product.id}`} className={compact ? 'h-20 w-20 shrink-0 overflow-hidden rounded-xl' : 'block aspect-[1.1] overflow-hidden bg-muted'} data-testid={`link-product-${product.id}`}><ProductImage product={product} className="h-full w-full transition-transform duration-500 group-hover:scale-105" /></Link>
    <div className={compact ? 'min-w-0 flex-1' : 'p-4'}>
      <div className="flex items-start justify-between gap-2"><div><p className="font-mono text-[10px] uppercase tracking-[.14em] text-muted-foreground">{product.category}</p><Link href={`/product/${product.id}`} className="mt-1 block font-semibold leading-tight hover:text-primary" data-testid={`text-product-name-${product.id}`}>{product.name}</Link></div>{!compact && <span className="text-xs font-semibold text-primary">{product.stock} left</span>}</div>
      {!compact && <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">{product.description}</p>}
      <div className="mt-3 flex items-center justify-between gap-2"><span className="font-mono text-sm font-bold">{money(product.price)}</span><span className="flex items-center gap-1 text-xs text-muted-foreground"><Star size={12} className="fill-accent text-accent" />{product.rating.toFixed(1)}</span></div>
      {!compact && <Button onClick={() => add.mutate({ data: { productId: product.id, quantity: 1 } }, { onSuccess: () => qc.invalidateQueries({ queryKey: getGetCartQueryKey() }) })} disabled={add.isPending || product.stock < 1} className="mt-4 w-full" testId={`button-add-${product.id}`}>{add.isPending ? 'Adding…' : <><Plus size={16} />Add to cart</>}</Button>}
    </div>
  </article>;
}

function Home() {
  const { data: products, isLoading, isError, refetch } = useListProducts();
  const chat = useChatWithShoppingAgent();
  const [message, setMessage] = useState('');
  const [history, setHistory] = useState<{ role: string; content: string }[]>([]);
  const [response, setResponse] = useState<ChatResponse | null>(null);
  const submit = (text = message) => {
    if (!text.trim() || chat.isPending) return;
    const next = [...history, { role: 'user', content: text.trim() }];
    setHistory(next); setMessage('');
    chat.mutate({ data: { message: text.trim(), history: next } }, { onSuccess: (res) => { setResponse(res); setHistory((h) => [...h, { role: 'assistant', content: res.message }]); } });
  };
  const featured = products?.slice(0, 3) ?? [];
  return <><CustomerHeader /><main className="shell-grid min-h-[calc(100dvh-4rem)]"><section className="mx-auto grid max-w-[1320px] gap-10 px-4 pb-20 pt-10 sm:px-6 lg:grid-cols-[1.12fr_.88fr] lg:items-center lg:pt-20">
    <div className="fade-up"><div className="mb-5 flex items-center gap-2 font-mono text-[11px] font-medium uppercase tracking-[.2em] text-primary"><span className="h-2 w-2 animate-pulse rounded-full bg-primary" />Intelligence layer online</div><h1 className="max-w-3xl text-5xl font-bold leading-[.96] tracking-[-.06em] sm:text-7xl">Buy like you<br /><span className="text-primary">already know.</span></h1><p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">A commerce workspace that understands the job behind the search. Tell us what you are building, and we will map the right tech stack.</p>
      <div className="mt-8 flex flex-wrap gap-2">{['Build a quiet home office', 'Best camera for travel', 'Upgrade my setup'].map((s) => <button key={s} onClick={() => submit(s)} data-testid={`button-prompt-${s}`} className="rounded-full border border-border bg-card px-4 py-2 text-sm font-medium hover:border-primary hover:text-primary">{s}</button>)}</div>
    </div>
    <div className="fade-up-2 rounded-[28px] border border-border bg-card p-4 shadow-xl shadow-secondary/10 sm:p-6"><div className="flex items-center justify-between border-b border-border pb-4"><div className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground"><Bot size={20} /></span><div><div className="font-semibold">Ari, your buying copilot</div><div className="flex items-center gap-1 text-xs text-muted-foreground"><span className="h-1.5 w-1.5 rounded-full bg-primary" />ready to reason</div></div></div><Headphones size={18} className="text-muted-foreground" /></div>
      <div className="min-h-44 py-5">{history.length === 0 && !response ? <div className="flex gap-3"><span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-accent" /><p className="text-sm leading-relaxed text-muted-foreground">I can compare specs, translate use-cases into a shortlist, and carry your decision through a safe checkout. What are we solving today?</p></div> : <div className="space-y-4">{history.slice(-4).map((item, i) => <div key={`${item.role}-${i}`} className={item.role === 'user' ? 'ml-8 rounded-2xl rounded-tr-sm bg-secondary p-3 text-sm text-secondary-foreground' : 'rounded-2xl rounded-tl-sm bg-muted p-3 text-sm leading-relaxed'}>{item.content}</div>)}{chat.isPending && <div className="flex gap-1 px-3"><span className="h-2 w-2 animate-bounce rounded-full bg-primary" /><span className="h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:120ms]" /><span className="h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:240ms]" /></div>}</div>}</div>
      <form onSubmit={(e) => { e.preventDefault(); submit(); }} className="flex items-center gap-2 rounded-2xl border border-border bg-background p-2"><input value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Ask for a recommendation…" className="min-w-0 flex-1 bg-transparent px-3 text-sm outline-none" data-testid="input-chat" /><button className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground hover:opacity-90" type="submit" data-testid="button-send-chat"><Send size={16} /></button></form>
      {response?.products?.length ? <div className="mt-4 grid gap-2">{response.products.slice(0, 2).map((p) => <ProductCard key={p.id} product={p} compact />)}</div> : null}
    </div>
  </section><section className="mx-auto max-w-[1320px] px-4 pb-24 sm:px-6"><div className="mb-5 flex items-end justify-between"><div><p className="font-mono text-[11px] uppercase tracking-[.18em] text-muted-foreground">Signal-picked inventory</p><h2 className="mt-2 text-2xl font-bold tracking-tight">A sharper starting point</h2></div><Link href="/catalog" data-testid="link-view-catalog" className="flex items-center gap-2 text-sm font-semibold text-primary hover:gap-3">View all <ArrowRight size={15} /></Link></div><QueryState loading={isLoading} error={isError} onRetry={() => refetch()} empty={!isLoading && !featured.length}><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{featured.map((p) => <ProductCard key={p.id} product={p} />)}</div></QueryState></section></main></>;
}

function Catalog() {
  const [q, setQ] = useState('');
  const [category, setCategory] = useState('');
  const { data: products, isLoading, isError, refetch } = useListProducts({ q: q || undefined, category: category || undefined });
  const categories = useMemo(() => Array.from(new Set((products ?? []).map((p) => p.category))), [products]);
  return <><CustomerHeader /><main className="mx-auto max-w-[1320px] px-4 py-8 sm:px-6"><div className="flex flex-wrap items-end justify-between gap-5"><div><div className="font-mono text-[11px] uppercase tracking-[.2em] text-primary">The catalog / 01</div><h1 className="mt-2 text-4xl font-bold tracking-[-.04em] sm:text-5xl">Tools for the next move.</h1><p className="mt-3 max-w-xl text-muted-foreground">Technical products selected for people who care how the work gets done.</p></div><div className="font-mono text-xs text-muted-foreground">{products?.length ?? '—'} signals indexed</div></div>
    <div className="mt-8 flex flex-col gap-3 rounded-2xl border border-border bg-card p-3 sm:flex-row"><div className="flex flex-1 items-center gap-3 rounded-xl bg-muted px-4"><Search size={17} className="text-muted-foreground" /><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search products, use cases, specs…" className="h-11 min-w-0 flex-1 bg-transparent text-sm outline-none" data-testid="input-catalog-search" /></div><div className="flex items-center gap-2 overflow-x-auto"><Filter size={15} className="ml-2 text-muted-foreground" />{['', ...categories].map((c) => <button key={c || 'all'} onClick={() => setCategory(c)} data-testid={`button-filter-${c || 'all'}`} className={`whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium ${category === c ? 'bg-secondary text-secondary-foreground' : 'text-muted-foreground hover:bg-muted'}`}>{c || 'All products'}</button>)}</div></div>
    <div className="mt-8"><QueryState loading={isLoading} error={isError} onRetry={() => refetch()} empty={!isLoading && !products?.length}><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{products?.map((p) => <ProductCard key={p.id} product={p} />)}</div></QueryState></div>
  </main></>;
}

function ProductDetail() {
  const { id = '' } = useParams<{ id: string }>();
  const { data: product, isLoading, isError, refetch } = useGetProduct(id, { query: { enabled: Boolean(id), queryKey: getGetProductQueryKey(id) } });
  const { data: recs } = useListProducts({ category: product?.category }, { query: { enabled: Boolean(product?.category), queryKey: getListProductsQueryKey({ category: product?.category }) } });
  const qc = useQueryClient(); const add = useAddCartItem();
  return <><CustomerHeader /><main className="mx-auto max-w-[1320px] px-4 py-8 sm:px-6"><Link href="/catalog" className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground" data-testid="link-back-catalog"><ChevronLeft size={16} />Back to catalog</Link><QueryState loading={isLoading} error={isError} onRetry={() => refetch()} empty={!product}><>{product && <><section className="grid gap-8 lg:grid-cols-[.9fr_1.1fr]"><div className="aspect-square overflow-hidden rounded-[28px] border border-border bg-muted"><ProductImage product={product} className="h-full w-full" /></div><div className="flex flex-col justify-center"><div className="font-mono text-[11px] uppercase tracking-[.2em] text-primary">{product.category}</div><h1 className="mt-3 text-4xl font-bold leading-tight tracking-[-.05em] sm:text-6xl">{product.name}</h1><div className="mt-4 flex items-center gap-3"><span className="flex items-center gap-1 text-sm font-semibold"><Star size={16} className="fill-accent text-accent" />{product.rating.toFixed(1)}</span><span className="text-sm text-muted-foreground">·</span><span className="text-sm text-muted-foreground">{product.stock} available</span></div><p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">{product.description}</p><div className="mt-8 flex flex-wrap items-center gap-4"><span className="font-mono text-3xl font-bold">{money(product.price)}</span><Button onClick={() => add.mutate({ data: { productId: product.id, quantity: 1 } }, { onSuccess: () => qc.invalidateQueries({ queryKey: getGetCartQueryKey() }) })} disabled={add.isPending || product.stock < 1} className="min-w-44" testId="button-add-detail"><ShoppingBag size={17} />{add.isPending ? 'Adding…' : 'Add to cart'}</Button></div><div className="mt-8 flex flex-wrap gap-2">{product.tags?.map((tag) => <StatusPill key={tag} tone="orange">{tag}</StatusPill>)}</div></div></section><section className="mt-20 grid gap-8 border-t border-border pt-10 md:grid-cols-2"><div><p className="font-mono text-[11px] uppercase tracking-[.18em] text-muted-foreground">Technical readout</p><div className="mt-4 divide-y divide-border rounded-2xl border border-border bg-card">{Object.entries(product.specs ?? {}).map(([key, value]) => <div key={key} className="flex items-center justify-between gap-5 px-4 py-3 text-sm"><span className="text-muted-foreground">{key}</span><span className="font-mono text-right font-medium">{value}</span></div>)}</div></div><div><p className="font-mono text-[11px] uppercase tracking-[.18em] text-muted-foreground">Built for</p><div className="mt-4 grid gap-2">{product.useCases?.map((use) => <div key={use} className="flex items-center gap-3 rounded-xl bg-muted px-4 py-3 text-sm"><Check size={16} className="text-primary" />{use}</div>)}</div></div></section><section className="mt-20 pb-20"><div className="mb-5 flex items-end justify-between"><div><p className="font-mono text-[11px] uppercase tracking-[.18em] text-muted-foreground">The smart stack</p><h2 className="mt-2 text-2xl font-bold">Pair it with your next win</h2></div></div><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{recs?.filter((p) => p.id !== product.id).slice(0, 3).map((p) => <ProductCard key={p.id} product={p} />)}</div></section></>}</></QueryState></main></>;
}

function CartPage() {
  const qc = useQueryClient(); const { data: cart, isLoading, isError, refetch } = useGetCart({ query: { queryKey: getGetCartQueryKey() } });
  const remove = useRemoveCartItem(); const start = useStartCheckout(); const confirm = useConfirmCheckout(); const verify = useVerifyPayment();
  const [checkout, setCheckout] = useState<{ status: string; total: number; paymentId?: string } | null>(null);
  const [orderId, setOrderId] = useState('');
  const cartData = checkout ? undefined : cart;
  const begin = () => start.mutate(undefined, { onSuccess: (res) => setCheckout({ status: res.status, total: res.total }) });
  const pay = () => confirm.mutate({ data: { confirmed: true } }, { onSuccess: (res) => { setCheckout((c) => c ? { ...c, status: res.status, paymentId: res.paymentId } : c); verify.mutate({ data: { paymentId: res.paymentId, outcome: 'success' } }, { onSuccess: (result) => setOrderId(result.orderId) }); } });
  return <><CustomerHeader /><main className="mx-auto max-w-[1100px] px-4 py-10 sm:px-6"><div className="flex items-end justify-between"><div><div className="font-mono text-[11px] uppercase tracking-[.2em] text-primary">Your workspace / cart</div><h1 className="mt-2 text-4xl font-bold tracking-[-.05em]">Ready when you are.</h1></div></div><div className="mt-10"><QueryState loading={isLoading} error={isError} onRetry={() => refetch()} empty={!cart?.items?.length && !checkout}><div className="grid gap-8 lg:grid-cols-[1fr_360px]"><div className="space-y-3">{cartData?.items.map((item) => <div key={item.product.id} className="flex gap-4 rounded-2xl border border-border bg-card p-4" data-testid={`row-cart-${item.product.id}`}><ProductImage product={item.product} className="h-24 w-24 shrink-0 rounded-xl" /><div className="min-w-0 flex-1"><div className="font-semibold">{item.product.name}</div><div className="mt-1 text-sm text-muted-foreground">{money(item.product.price)} · Qty {item.quantity}</div><div className="mt-3 flex items-center gap-2"><Button onClick={() => remove.mutate({ params: { productId: item.product.id } }, { onSuccess: (next) => qc.setQueryData(getGetCartQueryKey(), next) })} variant="quiet" className="px-3 py-1.5 text-xs" testId={`button-remove-${item.product.id}`}><X size={14} />Remove</Button></div></div><div className="font-mono font-bold">{money(item.lineTotal)}</div></div>)}</div><aside className="h-fit rounded-2xl border border-border bg-secondary p-5 text-secondary-foreground"><div className="flex items-center gap-2 text-sm font-semibold"><ShieldCheck size={17} className="text-primary" />Protected checkout</div><p className="mt-3 text-sm leading-relaxed text-secondary-foreground/65">Your payment intent is calculated server-side and only confirmed when you say go.</p>{checkout ? <div className="mt-7"><div className="font-mono text-[11px] uppercase tracking-[.15em] text-secondary-foreground/50">Checkout status</div>{orderId ? <><div className="mt-3 text-2xl font-bold">Order confirmed.</div><p className="mt-2 text-sm text-secondary-foreground/65">Reference <span className="font-mono text-primary">{orderId}</span></p></> : <><div className="mt-3 text-2xl font-bold">{checkout.status}</div><div className="mt-3 flex items-center justify-between border-t border-secondary-foreground/15 pt-3 text-sm"><span>Total</span><span className="font-mono font-bold">{money(checkout.total)}</span></div><Button onClick={pay} disabled={confirm.isPending || verify.isPending} className="mt-5 w-full" testId="button-confirm-payment"><CreditCard size={16} />{confirm.isPending || verify.isPending ? 'Confirming…' : 'Confirm and pay'}</Button></>}</div> : <><div className="mt-7 flex items-center justify-between border-t border-secondary-foreground/15 pt-4 text-sm"><span>Subtotal</span><span className="font-mono">{money(cart?.subtotal)}</span></div><Button onClick={begin} disabled={start.isPending} className="mt-5 w-full" testId="button-start-checkout">{start.isPending ? 'Calculating…' : 'Continue to secure checkout'}<ArrowRight size={16} /></Button></>}</aside></div></QueryState></div></main></>;
}

function Metric({ label, value, sub, icon: Icon, accent = false }: { label: string; value: string; sub: string; icon: typeof TrendingUp; accent?: boolean }) {
  return <div className={`rounded-2xl border border-border p-5 ${accent ? 'bg-primary text-primary-foreground' : 'bg-card'}`}><div className="flex items-center justify-between"><span className={`text-xs font-medium ${accent ? 'text-primary-foreground/65' : 'text-muted-foreground'}`}>{label}</span><Icon size={17} className={accent ? 'text-primary-foreground/75' : 'text-primary'} /></div><div className="mt-5 text-3xl font-bold tracking-[-.04em]">{value}</div><div className={`mt-2 text-xs ${accent ? 'text-primary-foreground/65' : 'text-muted-foreground'}`}>{sub}</div></div>;
}

function Chart({ series }: { series: MerchantSummary['revenueSeries'] }) {
  const max = Math.max(...series.map((x) => x.value), 1);
  return <div className="flex h-52 items-end gap-2 sm:gap-4">{series.map((item, i) => <div key={item.label} className="group flex h-full flex-1 flex-col justify-end gap-2"><div className="relative flex flex-1 items-end"><div className={`w-full rounded-t-lg ${i === series.length - 1 ? 'bg-primary' : 'bg-primary/20 group-hover:bg-primary/45'}`} style={{ height: `${Math.max(7, item.value / max * 100)}%` }} title={money(item.value)} /></div><div className="truncate text-center font-mono text-[10px] text-muted-foreground">{item.label}</div></div>)}</div>;
}

function MerchantOverview() {
  const { data, isLoading, isError, refetch } = useGetMerchantSummary({ query: { queryKey: getGetMerchantSummaryQueryKey() } });
  const { data: opportunities } = useListOpportunities({ query: { queryKey: getListOpportunitiesQueryKey() } });
  return <MerchantShell><MerchantTop title="Overview" subtitle="A live read on where the business is moving." /><main className="mx-auto max-w-[1400px] px-5 py-7 sm:px-8"><QueryState loading={isLoading} error={isError} onRetry={() => refetch()} empty={!data}><>{data && <><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"><Metric label="Revenue" value={money(data.revenue)} sub="vs. previous period" icon={TrendingUp} accent /><Metric label="Orders" value={data.orders.toLocaleString()} sub={`${pct(data.conversionRate)} conversion`} icon={ShoppingBag} /><Metric label="Average order" value={money(data.averageOrderValue)} sub={`${money(data.upsellRevenue)} from upsells`} icon={BarChart3} /><Metric label="Payment success" value={pct(data.paymentSuccessRate)} sub={`${money(data.crossSellRevenue)} cross-sell revenue`} icon={CreditCard} /></div><div className="mt-5 grid gap-5 xl:grid-cols-[1.4fr_.6fr]"><div className="rounded-2xl border border-border bg-card p-5 sm:p-6"><div className="flex items-center justify-between"><div><div className="font-mono text-[10px] uppercase tracking-[.2em] text-muted-foreground">Revenue pulse</div><h2 className="mt-2 text-lg font-bold">The last 8 signals</h2></div><StatusPill tone="green">Live</StatusPill></div><div className="mt-8"><Chart series={data.revenueSeries} /></div></div><div className="rounded-2xl border border-border bg-secondary p-5 text-secondary-foreground sm:p-6"><div className="flex items-center gap-2"><Sparkles size={17} className="text-accent" /><div className="font-mono text-[10px] uppercase tracking-[.2em] text-secondary-foreground/55">AI readout</div></div><h2 className="mt-5 text-2xl font-bold leading-tight">Your growth engine is leaving money on the table.</h2><p className="mt-4 text-sm leading-relaxed text-secondary-foreground/65">There are {(opportunities ?? []).filter((o) => o.status !== 'dismissed').length} live opportunities. Review the highest-confidence moves before the next campaign window.</p><Link href="/merchant/approvals" className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-primary" data-testid="link-review-opportunities">Review queue <ArrowRight size={15} /></Link></div></div><div className="mt-8"><div className="mb-4 flex items-end justify-between"><div><div className="font-mono text-[10px] uppercase tracking-[.2em] text-muted-foreground">Opportunity radar</div><h2 className="mt-2 text-xl font-bold">Decisions worth your attention</h2></div><Link href="/merchant/approvals" className="text-sm font-semibold text-primary" data-testid="link-all-opportunities">View queue</Link></div><div className="grid gap-3 md:grid-cols-3">{opportunities?.slice(0, 3).map((o) => <OpportunityCard key={o.id} opportunity={o} />)}</div></div></>}</></QueryState></main></MerchantShell>;
}

function MerchantTop({ title, subtitle }: { title: string; subtitle: string }) {
  return <header className="border-b border-border bg-card/60"><div className="mx-auto flex max-w-[1400px] items-center justify-between px-5 py-6 sm:px-8"><div><div className="font-mono text-[10px] uppercase tracking-[.2em] text-primary">Merchant intelligence</div><h1 className="mt-2 text-3xl font-bold tracking-[-.04em]">{title}</h1><p className="mt-1 text-sm text-muted-foreground">{subtitle}</p></div><div className="hidden items-center gap-3 sm:flex"><div className="rounded-xl border border-border bg-background px-3 py-2 text-xs text-muted-foreground"><span className="mr-2 inline-block h-2 w-2 rounded-full bg-primary" />Synced just now</div><div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent font-bold text-sm">AG</div></div></div></header>;
}

function OpportunityCard({ opportunity }: { opportunity: Opportunity }) {
  return <div className="rounded-2xl border border-border bg-card p-4"><div className="flex items-start justify-between gap-2"><StatusPill tone={opportunity.confidence > .8 ? 'green' : 'orange'}>{pct(opportunity.confidence)} confidence</StatusPill><span className="font-mono text-sm font-bold text-primary">+{money(opportunity.impact)}</span></div><h3 className="mt-4 font-semibold">{opportunity.title}</h3><p className="mt-2 text-sm leading-relaxed text-muted-foreground">{opportunity.explanation}</p><div className="mt-4 flex items-center justify-between border-t border-border pt-3 text-xs"><span className="text-muted-foreground">Suggested action</span><span className="font-semibold">{opportunity.action}</span></div></div>;
}

function Approvals() {
  const { data, isLoading, isError, refetch } = useListApprovals({ query: { queryKey: getListApprovalsQueryKey() } });
  const update = useUpdateApproval(); const qc = useQueryClient();
  const act = (id: string, status: string) => update.mutate({ id, data: { status } }, { onSuccess: () => qc.invalidateQueries({ queryKey: getListApprovalsQueryKey() }) });
  return <MerchantShell><MerchantTop title="Approval queue" subtitle="Keep automation fast, but never opaque." /><main className="mx-auto max-w-[1100px] px-5 py-7 sm:px-8"><div className="mb-7 flex items-center justify-between rounded-2xl border border-border bg-card p-5"><div><div className="font-semibold">Human-in-the-loop control</div><p className="mt-1 text-sm text-muted-foreground">Review proposals before they touch price, promotion, or customer experience.</p></div><StatusPill tone="orange">{data?.filter((a) => a.status.toLowerCase() === 'pending').length ?? 0} pending</StatusPill></div><QueryState loading={isLoading} error={isError} onRetry={() => refetch()} empty={!data?.length}><div className="space-y-3">{data?.map((a: Approval) => { const status = a.status.toLowerCase(); return <div key={a.id} className="rounded-2xl border border-border bg-card p-5" data-testid={`row-approval-${a.id}`}><div className="flex flex-col justify-between gap-4 sm:flex-row"><div className="flex gap-4"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-muted text-primary">{a.type.includes('price') ? <Target size={18} /> : <Sparkles size={18} />}</span><div><div className="flex flex-wrap items-center gap-2"><h2 className="font-semibold">{a.title}</h2><StatusPill tone={status === 'pending' ? 'orange' : status === 'approved' ? 'green' : 'neutral'}>{a.status}</StatusPill></div><p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">{a.detail}</p><div className="mt-3 font-mono text-xs text-primary">Estimated impact {money(a.impact)}</div></div></div>{status === 'pending' && <div className="flex shrink-0 items-center gap-2"><Button onClick={() => act(a.id, 'REJECTED')} variant="outline" disabled={update.isPending} testId={`button-reject-${a.id}`}><X size={15} />Reject</Button><Button onClick={() => act(a.id, 'APPROVED')} disabled={update.isPending} testId={`button-approve-${a.id}`}><Check size={15} />Approve</Button></div>}</div></div>; })}</div></QueryState></main></MerchantShell>;
}

function Campaigns() {
  const { data, isLoading, isError, refetch } = useListCampaigns({ query: { queryKey: getListCampaignsQueryKey() } });
  const create = useCreateCampaign(); const qc = useQueryClient();
  const [form, setForm] = useState({ name: '', type: 'bundle', products: '', discount: '10' });
  const submit = (e: FormEvent) => { e.preventDefault(); if (!form.name.trim()) return; create.mutate({ data: { name: form.name, type: form.type, products: form.products.split(',').map((s) => s.trim()).filter(Boolean), discount: Number(form.discount) } }, { onSuccess: () => { setForm({ name: '', type: 'bundle', products: '', discount: '10' }); qc.invalidateQueries({ queryKey: getListCampaignsQueryKey() }); } }); };
  return <MerchantShell><MerchantTop title="Campaigns" subtitle="Turn good signals into controlled experiments." /><main className="mx-auto max-w-[1200px] px-5 py-7 sm:px-8"><div className="grid gap-7 lg:grid-cols-[.75fr_1.25fr]"><form onSubmit={submit} className="h-fit rounded-2xl border border-border bg-secondary p-5 text-secondary-foreground sm:p-6"><div className="flex items-center gap-2"><Plus size={17} className="text-primary" /><h2 className="font-semibold">Launch a campaign</h2></div><p className="mt-2 text-sm text-secondary-foreground/60">Keep the brief simple. Automation handles the mechanics.</p><label className="mt-6 block text-xs font-semibold text-secondary-foreground/65">Campaign name<input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Spring setup refresh" className="mt-2 w-full rounded-xl border border-secondary-foreground/15 bg-secondary-foreground/5 px-3 py-3 text-sm outline-none focus:border-primary" data-testid="input-campaign-name" /></label><label className="mt-4 block text-xs font-semibold text-secondary-foreground/65">Motion<select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="mt-2 w-full rounded-xl border border-secondary-foreground/15 bg-secondary-foreground/5 px-3 py-3 text-sm outline-none" data-testid="select-campaign-type"><option value="bundle">Bundle</option><option value="discount">Discount</option><option value="upsell">Upsell</option></select></label><label className="mt-4 block text-xs font-semibold text-secondary-foreground/65">Product IDs<input value={form.products} onChange={(e) => setForm({ ...form, products: e.target.value })} placeholder="tech-01, tech-02" className="mt-2 w-full rounded-xl border border-secondary-foreground/15 bg-secondary-foreground/5 px-3 py-3 text-sm outline-none" data-testid="input-campaign-products" /></label><label className="mt-4 block text-xs font-semibold text-secondary-foreground/65">Discount<input type="number" min="0" max="30" value={form.discount} onChange={(e) => setForm({ ...form, discount: e.target.value })} className="mt-2 w-full rounded-xl border border-secondary-foreground/15 bg-secondary-foreground/5 px-3 py-3 text-sm outline-none" data-testid="input-campaign-discount" /></label><Button type="submit" disabled={create.isPending} className="mt-6 w-full" testId="button-create-campaign">{create.isPending ? 'Creating…' : 'Create campaign'}<ArrowRight size={15} /></Button></form><div><div className="mb-4 flex items-end justify-between"><div><div className="font-mono text-[10px] uppercase tracking-[.2em] text-muted-foreground">Active programs</div><h2 className="mt-2 text-xl font-bold">Campaign control room</h2></div><span className="font-mono text-xs text-muted-foreground">{data?.length ?? 0} total</span></div><QueryState loading={isLoading} error={isError} onRetry={() => refetch()} empty={!data?.length}><div className="space-y-3">{data?.map((c: Campaign) => <div key={c.id} className="rounded-2xl border border-border bg-card p-5" data-testid={`row-campaign-${c.id}`}><div className="flex items-start justify-between gap-4"><div><div className="flex items-center gap-2"><h3 className="font-semibold">{c.name}</h3><StatusPill tone={c.status === 'active' ? 'green' : 'neutral'}>{c.status}</StatusPill></div><p className="mt-2 text-sm text-muted-foreground">{c.type} · {c.discount}% adjustment · {c.products.length} products</p></div><button className="rounded-lg p-2 text-muted-foreground hover:bg-muted" aria-label="Campaign options" data-testid={`button-campaign-menu-${c.id}`}><ChevronDown size={17} /></button></div><div className="mt-4 flex items-center justify-between border-t border-border pt-3 text-xs text-muted-foreground"><span>{c.startDate ? new Date(c.startDate).toLocaleDateString() : 'Ready to schedule'}</span><span className="font-mono">{c.id}</span></div></div>)}</div></QueryState></div></div></main></MerchantShell>;
}

function PolicyPage() {
  const { data, isLoading, isError, refetch } = useGetPolicy({ query: { queryKey: getGetPolicyQueryKey() } });
  const update = useUpdatePolicy(); const [draft, setDraft] = useState<Policy | null>(null);
  const policy = draft ?? data;
  const save = () => { if (policy) update.mutate({ data: { maxDiscount: Number(policy.maxDiscount), maxAutomatedAmount: Number(policy.maxAutomatedAmount), approvalThreshold: Number(policy.approvalThreshold), allowedActions: policy.allowedActions, upsellEnabled: policy.upsellEnabled, crossSellEnabled: policy.crossSellEnabled } }, { onSuccess: (next) => setDraft(next) }); };
  return <MerchantShell><MerchantTop title="Policy controls" subtitle="Define the edges of what automation can do." /><main className="mx-auto max-w-[900px] px-5 py-7 sm:px-8"><QueryState loading={isLoading} error={isError} onRetry={() => refetch()} empty={!policy}><>{policy && <div className="rounded-2xl border border-border bg-card p-5 sm:p-7"><div className="flex items-start gap-4 border-b border-border pb-6"><span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/15 text-primary"><ShieldCheck size={21} /></span><div><h2 className="font-bold">Automation guardrails</h2><p className="mt-1 text-sm text-muted-foreground">Changes apply to new AI actions immediately after saving.</p></div></div><div className="grid gap-5 py-7 sm:grid-cols-3">{[['maxDiscount', 'Max discount', '%'], ['maxAutomatedAmount', 'Max automated amount', '$'], ['approvalThreshold', 'Approval threshold', '$']].map(([key, label, suffix]) => <label key={key} className="text-xs font-semibold">{label}<div className="mt-2 flex items-center rounded-xl border border-border bg-background px-3"><input type="number" value={policy[key as keyof Policy] as number} onChange={(e) => setDraft({ ...policy, [key]: Number(e.target.value) })} className="h-11 min-w-0 flex-1 bg-transparent text-sm outline-none" data-testid={`input-policy-${key}`} /><span className="font-mono text-xs text-muted-foreground">{suffix}</span></div></label>)}</div><div className="divide-y divide-border rounded-xl border border-border">{[['upsellEnabled', 'Upsell recommendations', 'Allow Ari to suggest the next-best upgrade.'], ['crossSellEnabled', 'Cross-sell recommendations', 'Allow complementary product prompts at checkout.']].map(([key, label, detail]) => <label key={key} className="flex cursor-pointer items-center justify-between gap-4 p-4"><div><div className="text-sm font-semibold">{label}</div><div className="mt-1 text-xs text-muted-foreground">{detail}</div></div><input type="checkbox" checked={Boolean(policy[key as keyof Policy])} onChange={(e) => setDraft({ ...policy, [key]: e.target.checked })} className="h-5 w-5 accent-[hsl(var(--primary))]" data-testid={`checkbox-policy-${key}`} /></label>)}</div><div className="mt-6 flex justify-end"><Button onClick={save} disabled={update.isPending} testId="button-save-policy">{update.isPending ? 'Saving…' : 'Save policy'}<Check size={15} /></Button></div></div>}</></QueryState></main></MerchantShell>;
}

function AuditPage() {
  const { data, isLoading, isError, refetch } = useListAuditLogs({ query: { queryKey: getListAuditLogsQueryKey() } });
  return <MerchantShell><MerchantTop title="Audit trail" subtitle="A clear record of every decision made by the system." /><main className="mx-auto max-w-[1100px] px-5 py-7 sm:px-8"><div className="mb-5 flex items-center justify-between"><div className="font-mono text-[10px] uppercase tracking-[.2em] text-muted-foreground">System activity</div><Button onClick={() => refetch()} variant="outline" className="px-3 py-2 text-xs" testId="button-refresh-audit"><RefreshCw size={14} />Refresh</Button></div><QueryState loading={isLoading} error={isError} onRetry={() => refetch()} empty={!data?.length}><div className="overflow-hidden rounded-2xl border border-border bg-card"><div className="hidden grid-cols-[1.4fr_.6fr_.7fr_1.6fr] gap-4 border-b border-border bg-muted px-5 py-3 font-mono text-[10px] uppercase tracking-[.16em] text-muted-foreground sm:grid"><span>Event</span><span>Actor</span><span>Status</span><span>Detail</span></div>{data?.map((log: AuditLog) => <div key={log.id} className="grid gap-2 border-b border-border px-5 py-4 last:border-0 sm:grid-cols-[1.4fr_.6fr_.7fr_1.6fr] sm:items-center sm:gap-4" data-testid={`row-audit-${log.id}`}><div><div className="text-sm font-semibold">{log.event}</div><div className="mt-1 font-mono text-[10px] text-muted-foreground">{new Date(log.timestamp).toLocaleString()}</div></div><span className="text-xs text-muted-foreground">{log.actor}</span><StatusPill tone={log.status === 'success' ? 'green' : log.status === 'failed' ? 'red' : 'neutral'}>{log.status}</StatusPill><span className="text-sm text-muted-foreground">{log.detail}</span></div>)}</div></QueryState></main></MerchantShell>;
}

function Router() {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}><Switch><Route path="/" component={Home} /><Route path="/catalog" component={Catalog} /><Route path="/product/:id" component={ProductDetail} /><Route path="/cart" component={CartPage} /><Route path="/merchant" component={MerchantOverview} /><Route path="/merchant/approvals" component={Approvals} /><Route path="/merchant/campaigns" component={Campaigns} /><Route path="/merchant/policy" component={PolicyPage} /><Route path="/merchant/audit" component={AuditPage} /><Route component={NotFound} /></Switch></ErrorBoundary>;
}

function App() {
  return <QueryClientProvider client={queryClient}><WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}><Router /></WouterRouter></QueryClientProvider>;
}

export default App;