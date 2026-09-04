import { Router, type IRouter } from "express";
import {
  AddCartItemBody,
  ChatWithShoppingAgentBody,
  ConfirmCheckoutBody,
  CreateCampaignBody,
  GetCartResponse,
  GetMerchantSummaryResponse,
  GetPolicyResponse,
  GetProductParams,
  GetProductResponse,
  ListApprovalsResponse,
  ListAuditLogsResponse,
  ListCampaignsResponse,
  ListOpportunitiesResponse,
  ListProductsQueryParams,
  ListProductsResponse,
  RemoveCartItemQueryParams,
  StartCheckoutResponse,
  UpdateApprovalBody,
  UpdateApprovalParams,
  UpdateApprovalResponse,
  UpdatePolicyBody,
  UpdatePolicyResponse,
  VerifyPaymentBody,
  VerifyPaymentResponse,
} from "@workspace/api-zod";

type Product = {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  image: string;
  stock: number;
  rating: number;
  specs: Record<string, string>;
  tags: string[];
  useCases: string[];
};

type CartLine = { product: Product; quantity: number; lineTotal: number };

const products: Product[] = [
  {
    id: "aero-14-pro",
    name: "AeroBook 14 Pro",
    category: "laptops",
    description: "A precise, portable workstation for deep work and code.",
    price: 74990,
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=900&q=80",
    stock: 12,
    rating: 4.8,
    specs: { Processor: "Ryzen 7 7840U", RAM: "16 GB", Storage: "1 TB SSD", Display: '14" 2.8K' },
    tags: ["coding", "portable", "creator"],
    useCases: ["coding", "design", "productivity"],
  },
  {
    id: "nova-16-studio",
    name: "NovaBook 16 Studio",
    category: "laptops",
    description: "More headroom for builds, simulations, and creative sessions.",
    price: 89990,
    image: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&w=900&q=80",
    stock: 8,
    rating: 4.9,
    specs: { Processor: "Intel Core Ultra 7", RAM: "32 GB", Storage: "1 TB SSD", Display: '16" 3.2K' },
    tags: ["coding", "power", "creator", "upgrade"],
    useCases: ["coding", "video editing", "gaming"],
  },
  {
    id: "pixel-9a",
    name: "PixelArc 9A",
    category: "smartphones",
    description: "A camera-first phone with a bright display and all-day battery.",
    price: 29990,
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=900&q=80",
    stock: 18,
    rating: 4.7,
    specs: { Display: '6.4" OLED', Camera: "50 MP", Battery: "5100 mAh", Storage: "256 GB" },
    tags: ["camera", "battery", "everyday"],
    useCases: ["photography", "travel", "everyday"],
  },
  {
    id: "pulse-buds",
    name: "Pulse Buds ANC",
    category: "headphones",
    description: "Focused listening with adaptive noise cancellation.",
    price: 7990,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80",
    stock: 24,
    rating: 4.6,
    specs: { Battery: "32 hours", Type: "Over-ear", Connection: "Bluetooth 5.3", Weight: "248 g" },
    tags: ["focus", "travel", "audio"],
    useCases: ["travel", "work", "music"],
  },
  {
    id: "arc-mouse",
    name: "Arc Wireless Mouse",
    category: "mice",
    description: "Quiet clicks and a precise sensor for long build sessions.",
    price: 1490,
    image: "https://images.unsplash.com/photo-1527814050087-3793815479db?auto=format&fit=crop&w=900&q=80",
    stock: 42,
    rating: 4.5,
    specs: { Sensor: "16000 DPI", Battery: "70 days", Connection: "2.4 GHz + BT", Buttons: "6" },
    tags: ["coding", "ergonomic", "accessory"],
    useCases: ["coding", "productivity", "gaming"],
  },
  {
    id: "keychron-lite",
    name: "Keychron Lite 75",
    category: "keyboards",
    description: "A tactile compact keyboard that keeps your desk focused.",
    price: 4990,
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=900&q=80",
    stock: 27,
    rating: 4.7,
    specs: { Layout: "75%", Switches: "Hot-swap tactile", Connection: "USB-C + BT", Battery: "90 hours" },
    tags: ["coding", "desk", "accessory"],
    useCases: ["coding", "productivity"],
  },
  {
    id: "field-bag",
    name: "Field Laptop Bag",
    category: "laptop bags",
    description: "Weather-resistant carry with a dedicated 16-inch sleeve.",
    price: 2990,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=80",
    stock: 31,
    rating: 4.4,
    specs: { Material: "Recycled nylon", Capacity: "18 L", Sleeve: 'Up to 16"', Warranty: "2 years" },
    tags: ["travel", "protection", "accessory"],
    useCases: ["travel", "commuting", "work"],
  },
  {
    id: "dock-hub",
    name: "Dock USB-C Hub",
    category: "USB hubs",
    description: "One calm connection for displays, cards, power, and peripherals.",
    price: 3490,
    image: "https://images.unsplash.com/photo-1625842268584-8f3296236761?auto=format&fit=crop&w=900&q=80",
    stock: 19,
    rating: 4.6,
    specs: { Ports: "8-in-1", Output: "4K HDMI", Power: "100 W PD", Material: "Aluminium" },
    tags: ["desk", "coding", "accessory"],
    useCases: ["coding", "productivity", "travel"],
  },
  {
    id: "breeze-pad",
    name: "Breeze Cooling Pad",
    category: "cooling pads",
    description: "Quiet airflow that keeps demanding laptop sessions comfortable.",
    price: 2490,
    image: "https://images.unsplash.com/photo-1593640495253-23196b27a87f?auto=format&fit=crop&w=900&q=80",
    stock: 15,
    rating: 4.3,
    specs: { Fans: "5 silent fans", Compatibility: "Up to 17.3 inches", USB: "2 ports", Modes: "3" },
    tags: ["gaming", "coding", "thermal"],
    useCases: ["gaming", "coding", "video editing"],
  },
];

let cart: CartLine[] = [];
let checkout: { status: string; paymentId?: string } = { status: "idle" };
let policy = {
  maxDiscount: 15,
  maxAutomatedAmount: 100000,
  approvalThreshold: 25000,
  allowedActions: ["search", "recommend", "upsell", "cross_sell", "cart", "checkout"],
  upsellEnabled: true,
  crossSellEnabled: true,
};
const audit: Array<Record<string, string | number>> = [
  { id: "audit-1", event: "POLICY_CHECKED", actor: "Commerce policy engine", timestamp: "Today, 10:42", status: "success", detail: "Automated order limit checked" },
  { id: "audit-2", event: "UPSELL_SUGGESTED", actor: "Growth agent", timestamp: "Today, 10:18", status: "success", detail: "NovaBook 16 Studio suggested to 18 shoppers" },
  { id: "audit-3", event: "CAMPAIGN_APPROVED", actor: "Maya Chen", timestamp: "Yesterday, 16:04", status: "success", detail: "Laptop + Arc Mouse bundle approved" },
  { id: "audit-4", event: "PAYMENT_SUCCESS", actor: "Razorpay Test Mode", timestamp: "Yesterday, 14:22", status: "success", detail: "Payment verified and order created" },
];
const approvals = [
  { id: "approval-1", title: "Bundle AeroBook + Arc Mouse", detail: "Offer a 7% bundle discount to coding shoppers. Expected to lift AOV by ₹1,120.", type: "Cross-sell", status: "PENDING", impact: 1120 },
  { id: "approval-2", title: "Upgrade path for creator laptops", detail: "Surface NovaBook 16 Studio after a customer views any laptop under ₹80k.", type: "Upsell", status: "PENDING", impact: 15400 },
  { id: "approval-3", title: "Weekend focus bundle", detail: "Pair Pulse Buds ANC with Field Laptop Bag for remote workers.", type: "Campaign", status: "APPROVED", impact: 6400 },
];
const campaigns = [
  { id: "campaign-1", name: "Build Better Bundle", type: "Product bundle", products: ["AeroBook 14 Pro", "Arc Wireless Mouse"], discount: 7, startDate: "2026-09-01", endDate: "2026-09-30", status: "ACTIVE" },
  { id: "campaign-2", name: "Focus, Anywhere", type: "Cross-sell", products: ["Pulse Buds ANC", "Field Laptop Bag"], discount: 10, startDate: "2026-09-06", endDate: "2026-09-21", status: "SCHEDULED" },
];

function getCart() {
  return {
    items: cart,
    subtotal: cart.reduce((sum, item) => sum + item.lineTotal, 0),
    itemCount: cart.reduce((sum, item) => sum + item.quantity, 0),
  };
}

function writeAudit(event: string, detail: string, status = "success", amount?: number) {
  audit.unshift({
    id: `audit-${Date.now()}-${audit.length}`,
    event,
    actor: "Growth commerce agent",
    timestamp: "Just now",
    status,
    detail,
    ...(amount === undefined ? {} : { amount }),
  });
}

function complementary(product: Product) {
  const categoryMap: Record<string, string[]> = {
    laptops: ["mice", "laptop bags", "USB hubs", "cooling pads", "keyboards"],
    smartphones: ["headphones", "USB hubs"],
    headphones: ["laptop bags"],
  };
  const wanted = categoryMap[product.category] ?? ["mice", "keyboards"];
  return products.filter((item) => wanted.includes(item.category)).slice(0, 3);
}

function bestUpgrade(product: Product) {
  return products
    .filter((item) => item.category === product.category && item.price > product.price)
    .sort((a, b) => a.price - b.price)[0];
}

function searchProducts(message: string) {
  const lower = message.toLowerCase();
  const budgetMatch = lower.match(/(?:under|below|within)\s*(?:₹|rs\.?\s*)?([\d,]+)/i);
  const budget = budgetMatch ? Number(budgetMatch[1].replace(/,/g, "")) : undefined;
  const category =
    lower.includes("laptop") ? "laptops" :
    lower.includes("phone") ? "smartphones" :
    lower.includes("headphone") || lower.includes("earbud") ? "headphones" :
    lower.includes("mouse") ? "mice" :
    lower.includes("keyboard") ? "keyboards" :
    lower.includes("bag") ? "laptop bags" :
    lower.includes("accessor") ? undefined : undefined;
  const useCase = lower.includes("cod") ? "coding" : lower.includes("game") ? "gaming" : lower.includes("travel") ? "travel" : undefined;
  return products.filter((item) => {
    const matchesCategory = category ? item.category === category : true;
    const matchesBudget = budget ? item.price <= budget : true;
    const matchesUseCase = useCase ? item.useCases.includes(useCase) || item.tags.includes(useCase) : true;
    const matchesText = [item.name, item.description, ...item.tags, ...item.useCases].join(" ").toLowerCase().includes(lower);
    return (matchesCategory && matchesBudget && matchesUseCase) || (!category && !budget && !useCase && matchesText);
  }).slice(0, 4);
}

async function generateGeminiNarrative(input: {
  message: string;
  history: Array<{ role: string; content: string }>;
  intent: string;
  products: Product[];
  crossSells: Product[];
  upsell: { product: Product; reason: string } | null;
}) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  const catalogContext = [...input.products, ...input.crossSells, ...(input.upsell ? [input.upsell.product] : [])]
    .filter((product, index, list) => list.findIndex((item) => item.id === product.id) === index)
    .map((product) => ({
      name: product.name,
      price: formatINR(product.price),
      category: product.category,
      description: product.description,
      specs: product.specs,
      useCases: product.useCases,
    }));
  const prompt = [
    "You are the conversational layer for a trustworthy Indian electronics storefront.",
    "Write one concise, warm answer to the shopper. Use only the supplied catalog facts; never invent stock, prices, discounts, delivery promises, or specifications.",
    "The server already decided the intent and structured recommendations. Do not tell the shopper that you are an AI model, and do not give payment or policy instructions.",
    "Mention at most two products by name. Keep the answer under 90 words and use ₹ for prices.",
    `Intent: ${input.intent}`,
    `Shopper message: ${input.message}`,
    `Recent conversation: ${JSON.stringify(input.history.slice(-4))}`,
    `Approved catalog context: ${JSON.stringify(catalogContext)}`,
    input.upsell ? `Approved upgrade suggestion: ${input.upsell.product.name} — ${input.upsell.reason}` : "",
  ].filter(Boolean).join("\n");
  try {
    for (const model of ["gemini-2.5-flash", "gemini-2.0-flash", "gemini-1.5-flash"]) {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          generationConfig: { maxOutputTokens: 8192, temperature: 0.35 },
        }),
      });
      if (!response.ok) {
        console.warn(`[Gemini] ${model} narrative request returned ${response.status}`);
        continue;
      }
      const data = await response.json() as { candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }> };
      const text = data.candidates?.[0]?.content?.parts?.map((part) => part.text ?? "").join("").trim();
      if (text) return text;
    }
    return null;
  } catch (error) {
    console.warn(`[Gemini] narrative request failed: ${error instanceof Error ? error.message : "unknown error"}`);
    return null;
  }
}

const router: IRouter = Router();

router.get("/products", (req, res) => {
  const parsed = ListProductsQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const { category, q, maxPrice } = parsed.data;
  let result = products;
  if (category) result = result.filter((product) => product.category === category);
  if (maxPrice !== undefined) result = result.filter((product) => product.price <= maxPrice);
  if (q) {
    const search = q.toLowerCase();
    result = result.filter((product) => [product.name, product.category, product.description, ...product.tags, ...product.useCases].join(" ").toLowerCase().includes(search));
  }
  res.json(ListProductsResponse.parse(result));
});

router.get("/products/:id", (req, res) => {
  const parsed = GetProductParams.safeParse(req.params);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const product = products.find((item) => item.id === parsed.data.id);
  if (!product) {
    res.status(404).json({ error: "Product not found" });
    return;
  }
  res.json(GetProductResponse.parse(product));
});

router.get("/cart", (_req, res) => {
  res.json(GetCartResponse.parse(getCart()));
});

router.post("/cart/items", (req, res) => {
  const parsed = AddCartItemBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const product = products.find((item) => item.id === parsed.data.productId);
  if (!product || product.stock < (parsed.data.quantity ?? 1)) {
    res.status(400).json({ error: "That product is unavailable or out of stock." });
    return;
  }
  const quantity = parsed.data.quantity ?? 1;
  const existing = cart.find((item) => item.product.id === product.id);
  if (existing) existing.quantity += quantity;
  else cart.push({ product, quantity, lineTotal: product.price * quantity });
  cart.forEach((item) => { item.lineTotal = item.product.price * item.quantity; });
  writeAudit("PRODUCT_ADDED_TO_CART", `${product.name} added to cart`);
  res.json(GetCartResponse.parse(getCart()));
});

router.delete("/cart/items", (req, res) => {
  const parsed = RemoveCartItemQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  cart = cart.filter((item) => item.product.id !== parsed.data.productId);
  res.json(GetCartResponse.parse(getCart()));
});

router.post("/ai/chat", async (req, res) => {
  const parsed = ChatWithShoppingAgentBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const message = parsed.data.message.trim();
  const lower = message.toLowerCase();
  const previous = parsed.data.history ?? [];
  const recommended = searchProducts(message);
  const fallback = previous.some((entry) => entry.content.toLowerCase().includes("laptop")) ? products.filter((item) => item.category === "laptops") : products;
  const found = recommended.length ? recommended : fallback.slice(0, 4);
  const selected = found[0];
  const needsAccessories = lower.includes("accessor") || lower.includes("complement") || lower.includes("bundle");
  const asksComparison = lower.includes("which") || lower.includes("compare") || lower.includes("better");
  const asksCart = lower.includes("add") || lower.includes("cart");
  const asksCheckout = lower.includes("checkout") || lower.includes("buy");
  let intent = "discovery";
  let messageText = "Tell me what you are building, your budget, or where you will use it. I will narrow the catalog to a few genuinely relevant options.";
  let crossSells: Product[] = [];
  let upsell: { product: Product; reason: string } | null = null;
  let checkoutResult: { status: string; total: number } | null = null;

  if (lower === "hi" || lower.startsWith("hello") || lower.startsWith("hey")) {
    messageText = "Hi, I’m your growth commerce guide. I can help you find the right setup, compare trade-offs, and build a cart without guessing.";
    intent = "greeting";
  } else if (asksCheckout) {
    intent = "checkout";
    const summary = getCart();
    checkout = { status: summary.itemCount ? "awaiting_confirmation" : "empty" };
    checkoutResult = { status: checkout.status, total: summary.subtotal };
    messageText = summary.itemCount
      ? `Your cart is ready with ${summary.itemCount} item${summary.itemCount === 1 ? "" : "s"} for ${formatINR(summary.subtotal)}. Say “yes” to review explicit payment confirmation.`
      : "Your cart is empty. Tell me what you are shopping for and I’ll help you start with a focused recommendation.";
  } else if (asksCart && selected) {
    intent = "cart";
    const already = cart.find((item) => item.product.id === selected.id);
    if (!already) {
      cart.push({ product: selected, quantity: 1, lineTotal: selected.price });
      writeAudit("PRODUCT_ADDED_TO_CART", `${selected.name} added by shopping agent`);
    }
    messageText = `${selected.name} is in your cart at ${formatINR(selected.price)}. I checked stock before adding it.`;
  } else if (needsAccessories) {
    intent = "cross_sell";
    const base = previous.some((entry) => entry.content.toLowerCase().includes("phone")) ? products.find((item) => item.category === "smartphones") : selected;
    crossSells = base ? complementary(base) : products.filter((item) => ["mice", "laptop bags", "USB hubs"].includes(item.category)).slice(0, 3);
    messageText = `For a setup that feels complete, I’d pair your ${base?.category === "smartphones" ? "phone" : "laptop"} with these practical add-ons. They solve the next friction point rather than adding noise.`;
    writeAudit("CROSSSELL_SUGGESTED", `${crossSells.length} complementary products suggested`);
  } else if (asksComparison && found.length > 1) {
    intent = "comparison";
    messageText = `${found[0].name} is the better value for focused work, while ${found[1].name} is the performance pick with more ${found[1].specs.RAM ?? "headroom"}. Based on your earlier request, I’d start with ${found[0].name}.`;
  } else {
    intent = "recommendation";
    const requirements = lower.includes("coding") ? "coding" : lower.includes("gaming") ? "gaming" : "your use case";
    messageText = found.length
      ? `I found ${found.length} ${found[0].category} option${found.length === 1 ? "" : "s"} for ${requirements}. ${found[0].name} is the best match because it balances capability, portability, and your stated constraints.`
      : "I could not find an in-stock match for those constraints. Try a broader budget or a different use case.";
    if (selected && policy.upsellEnabled) {
      const upgrade = bestUpgrade(selected);
      if (upgrade && upgrade.price - selected.price <= 20000) {
        upsell = { product: upgrade, reason: `For ${formatINR(upgrade.price - selected.price)} more, you get ${upgrade.specs.RAM ?? "more performance"}—useful for heavier ${selected.useCases[0]} sessions.` };
        writeAudit("UPSELL_SUGGESTED", `${upgrade.name} suggested after ${selected.name}`);
      }
    }
    if (selected && policy.crossSellEnabled) crossSells = complementary(selected);
    writeAudit("PRODUCT_RECOMMENDED", `${found.length} products recommended`);
  }
  if (["greeting", "recommendation", "comparison", "cross_sell"].includes(intent)) {
    messageText = await generateGeminiNarrative({
      message,
      history: previous,
      intent,
      products: found,
      crossSells,
      upsell,
    }) ?? messageText;
  }
  res.json({
    message: messageText,
    products: found,
    upsell,
    crossSells,
    intent,
    cart: getCart(),
    checkout: checkoutResult,
  });
});

router.post("/checkout", (_req, res) => {
  const summary = getCart();
  checkout = { status: summary.itemCount ? "awaiting_confirmation" : "empty" };
  if (summary.itemCount) writeAudit("CHECKOUT_STARTED", `Checkout started for ${formatINR(summary.subtotal)}`, "success", summary.subtotal);
  res.json(StartCheckoutResponse.parse({ status: checkout.status, cart: summary, total: summary.subtotal, requiresConfirmation: true }));
});

router.post("/checkout/confirm", (req, res) => {
  const parsed = ConfirmCheckoutBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const summary = getCart();
  if (!parsed.data.confirmed || !summary.itemCount) {
    writeAudit("POLICY_BLOCKED", "Payment blocked because explicit confirmation and a valid cart are required.", "blocked");
    res.status(400).json({ error: "Payment blocked because explicit customer confirmation is required." });
    return;
  }
  if (summary.subtotal > policy.maxAutomatedAmount) {
    writeAudit("POLICY_BLOCKED", "Payment blocked because the order exceeds the automated transaction limit.", "blocked", summary.subtotal);
    res.status(400).json({ error: "Payment blocked because this order requires merchant approval." });
    return;
  }
  const paymentId = `pay_test_${Date.now()}`;
  checkout = { status: "payment_created", paymentId };
  writeAudit("PAYMENT_CONFIRMATION_REQUESTED", `Customer explicitly confirmed ${formatINR(summary.subtotal)}`, "success", summary.subtotal);
  writeAudit("PAYMENT_CREATED", "Razorpay Test Mode payment session created", "success", summary.subtotal);
  res.json({ status: "created", paymentId, amount: summary.subtotal, mode: "test", keyId: null });
});

router.post("/payments/verify", (req, res) => {
  const parsed = VerifyPaymentBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const summary = getCart();
  if (parsed.data.outcome === "failed") {
    checkout = { status: "payment_failed", paymentId: parsed.data.paymentId };
    writeAudit("PAYMENT_FAILED", "Test payment declined. Cart preserved for retry.", "failed", summary.subtotal);
    res.json(VerifyPaymentResponse.parse({ status: "PAYMENT_FAILED", orderId: "", total: summary.subtotal, paymentId: parsed.data.paymentId }));
    return;
  }
  const orderId = `AC-${new Date().getFullYear()}-${String(audit.length + 104).padStart(4, "0")}`;
  checkout = { status: "paid", paymentId: parsed.data.paymentId };
  writeAudit("PAYMENT_SUCCESS", "Server-side payment verification passed", "success", summary.subtotal);
  writeAudit("ORDER_CREATED", `${orderId} created after payment verification`, "success", summary.subtotal);
  cart = [];
  res.json(VerifyPaymentResponse.parse({ status: "PAID", orderId, total: summary.subtotal, paymentId: parsed.data.paymentId }));
});

router.get("/merchant/summary", (_req, res) => {
  res.json(GetMerchantSummaryResponse.parse({
    revenue: 1284600,
    orders: 184,
    averageOrderValue: 6981,
    conversionRate: 0.084,
    upsellRevenue: 214800,
    crossSellRevenue: 164200,
    paymentSuccessRate: 0.968,
    revenueSeries: [
      { label: "Aug 29", value: 142000 }, { label: "Aug 30", value: 168000 }, { label: "Aug 31", value: 154000 },
      { label: "Sep 01", value: 201000 }, { label: "Sep 02", value: 188000 }, { label: "Sep 03", value: 231600 },
    ],
  }));
});

router.get("/merchant/opportunities", (_req, res) => {
  res.json(ListOpportunitiesResponse.parse([
        { id: "opp-1", title: "Make the coding setup a default bundle", explanation: "Customers buying a laptop add a wireless mouse 42% of the time. Make the pairing explicit at the decision moment.", impact: 84200, confidence: 0.92, status: "READY", action: "Create bundle" },
    { id: "opp-2", title: "Surface the NovaBook upgrade earlier", explanation: "Shoppers who compare 16 GB laptops often choose the 32 GB model when the difference is explained in use-case language.", impact: 61400, confidence: 0.86, status: "READY", action: "Review upgrade path" },
    { id: "opp-3", title: "Recover payment drop-offs", explanation: "Test-mode failure patterns show a retry window within 10 minutes. Preserve the cart and bring shoppers back to the same checkout state.", impact: 29700, confidence: 0.78, status: "WATCH", action: "View playbook" },
  ]));
});

router.get("/merchant/approvals", (_req, res) => {
  res.json(ListApprovalsResponse.parse(approvals));
});

router.patch("/merchant/approvals/:id", (req, res) => {
  const params = UpdateApprovalParams.safeParse(req.params);
  const body = UpdateApprovalBody.safeParse(req.body);
  if (!params.success || !body.success) {
    res.status(400).json({ error: "Invalid approval update." });
    return;
  }
  const approval = approvals.find((item) => item.id === params.data.id);
  if (!approval) {
    res.status(404).json({ error: "Approval not found." });
    return;
  }
  approval.status = body.data.status;
  writeAudit(approval.status === "APPROVED" ? "APPROVAL_APPROVED" : "APPROVAL_REJECTED", `${approval.title} marked ${approval.status}`);
  res.json(UpdateApprovalResponse.parse(approval));
});

router.get("/merchant/campaigns", (_req, res) => {
  res.json(ListCampaignsResponse.parse(campaigns));
});

router.post("/merchant/campaigns", (req, res) => {
  const parsed = CreateCampaignBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  if (parsed.data.discount > policy.maxDiscount) {
    res.status(400).json({ error: `Discount exceeds the ${policy.maxDiscount}% policy limit.` });
    return;
  }
  const campaign = { id: `campaign-${campaigns.length + 1}`, ...parsed.data, startDate: "2026-09-06", endDate: "2026-09-30", status: "DRAFT" };
  campaigns.push(campaign);
  writeAudit("CAMPAIGN_CREATED", `${campaign.name} created for review`);
  res.status(201).json(campaign);
});

router.get("/merchant/policy", (_req, res) => {
  res.json(GetPolicyResponse.parse(policy));
});

router.patch("/merchant/policy", (req, res) => {
  const parsed = UpdatePolicyBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  policy = { ...policy, ...parsed.data };
  writeAudit("POLICY_UPDATED", "Merchant policy settings updated");
  res.json(UpdatePolicyResponse.parse(policy));
});

router.get("/merchant/audit", (_req, res) => {
  res.json(ListAuditLogsResponse.parse(audit.slice(0, 20)));
});

function formatINR(value: number) {
  return `₹${value.toLocaleString("en-IN")}`;
}

export default router;