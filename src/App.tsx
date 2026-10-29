import { useMemo, useState } from "react"
import {
  ArrowRight,
  ArrowLeft,
  ArrowUpRight,
  Banknote,
  Bell,
  Bookmark,
  Check,
  ChevronDown,
  ChevronRight,
  CircleHelp,
  ClipboardList,
  Clock3,
  CreditCard,
  CircleDollarSign,
  Grid2X2,
  Landmark,
  LayoutDashboard,
  LogOut,
  Menu,
  Minus,
  NotebookPen,
  PackageOpen,
  Plus,
  Printer,
  QrCode,
  ReceiptText,
  RefreshCw,
  RotateCcw,
  Save,
  Search,
  Share2,
  ShoppingBag,
  Target,
  Trash2,
  TrendingUp,
  UtensilsCrossed,
  Users,
  Wallet,
  WalletCards,
  X,
} from "lucide-react"

type Product = {
  id: number
  name: string
  category: string
  price: number
  image: string
  stock: number
  badge?: string
}

type SavedOrder = {
  id: string
  customer: string
  table?: number
  orderType: string
  cart: Record<number, number>
  savedAt: string
}

const products: Product[] = [
  {
    id: 1,
    name: "Dimsum Mentai",
    category: "Dimsum",
    price: 22000,
    stock: 18,
    badge: "Favorit",
    image:
      "https://images.unsplash.com/photo-1762418967889-10abec43c325?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: 2,
    name: "Cireng Ayam",
    category: "Gorengan",
    price: 10000,
    stock: 24,
    image:
      "https://images.unsplash.com/photo-1734330931856-77cdf1b5bba9?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: 3,
    name: "Pangsit Kuah",
    category: "Berkuah",
    price: 20000,
    stock: 12,
    badge: "Terlaris",
    image:
      "https://images.unsplash.com/photo-1496116155751-2833e0c42786?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: 4,
    name: "Dimsum Original",
    category: "Dimsum",
    price: 18000,
    stock: 30,
    image:
      "https://images.unsplash.com/photo-1779333277496-a5106680169c?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: 5,
    name: "Dumpling Chili Oil",
    category: "Dimsum",
    price: 24000,
    stock: 8,
    image:
      "https://images.unsplash.com/photo-1771574205140-ecb484045c36?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: 6,
    name: "Paket Berbagi",
    category: "Paket",
    price: 48000,
    stock: 15,
    badge: "Hemat",
    image:
      "https://images.unsplash.com/photo-1767298113547-11e95951608b?auto=format&fit=crop&w=900&q=85",
  },
]

const categories = [
  "Semua",
  "Favorit",
  "Dimsum",
  "Gorengan",
  "Berkuah",
  "Paket",
]
const orderTypes = [
  "Makan di tempat",
  "Bawa pulang",
  "ShopeeFood",
  "GrabFood",
  "GoFood",
  "Delivery internal",
]
const initialSavedOrders: SavedOrder[] = [
  {
    id: "ORD-1045",
    customer: "Budi Santoso",
    table: 3,
    orderType: "Makan di tempat",
    cart: { 1: 2, 4: 1 },
    savedAt: "Hari ini, 09:12",
  },
  {
    id: "ORD-1046",
    customer: "Sinta",
    orderType: "Bawa pulang",
    cart: { 2: 2, 5: 1 },
    savedAt: "Hari ini, 09:28",
  },
  {
    id: "ORD-1047",
    customer: "Pelanggan meja",
    table: 7,
    orderType: "Makan di tempat",
    cart: { 3: 1, 6: 1 },
    savedAt: "Hari ini, 09:41",
  },
]
const tables = Array.from({ length: 10 }, (_, index) => {
  const number = index + 1
  const occupied =
    number === 1
      ? { total: 32000, items: 2, orders: 1, startedAt: "09:46" }
      : number === 3
        ? { total: 58000, items: 4, orders: 1, startedAt: "09:47" }
        : null
  return { number, seats: 4, occupied }
})
const recentTransactions = [
  {
    id: "TRX-1044",
    time: "13:43",
    method: "QRIS",
    type: "Makan di tempat",
    status: "Selesai",
    total: 48000,
  },
  {
    id: "TRX-1043",
    time: "13:41",
    method: "QRIS",
    type: "Bawa pulang",
    status: "Selesai",
    total: 38000,
  },
  {
    id: "TRX-1042",
    time: "13:40",
    method: "Tunai",
    type: "Makan di tempat",
    status: "Selesai",
    total: 43000,
  },
  {
    id: "TRX-1041",
    time: "13:39",
    method: "QRIS",
    type: "ShopeeFood",
    status: "Selesai",
    total: 13000,
  },
  {
    id: "TRX-1040",
    time: "13:07",
    method: "Transfer",
    type: "GrabFood",
    status: "Selesai",
    total: 81000,
  },
]
const rupiah = (value: number) => `Rp ${value.toLocaleString("id-ID")}`

export default function App() {
  const [step, setStep] = useState<
    | "dashboard"
    | "catalog"
    | "savedOrders"
    | "tables"
    | "confirmation"
    | "payment"
    | "success"
  >("catalog")
  const [category, setCategory] = useState("Semua")
  const [query, setQuery] = useState("")
  const [orderType, setOrderType] = useState("Makan di tempat")
  const [cart, setCart] = useState<Record<number, number>>({ 1: 2, 2: 1 })
  const [notes, setNotes] = useState<Record<number, string>>({})
  const [customerName, setCustomerName] = useState("")
  const [discountRate, setDiscountRate] = useState(0)
  const [taxRate, setTaxRate] = useState(10)
  const [saved, setSaved] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState("Tunai")
  const [cashReceived, setCashReceived] = useState(0)
  const [selectedTable, setSelectedTable] = useState(8)
  const [tableFilter, setTableFilter] = useState<
    "Semua" | "Kosong" | "Ada Pesanan"
  >("Semua")
  const [tableQuery, setTableQuery] = useState("")
  const [savedOrders, setSavedOrders] =
    useState<SavedOrder[]>(initialSavedOrders)
  const [savedOrderQuery, setSavedOrderQuery] = useState("")
  const [notice, setNotice] = useState("")

  const filteredProducts = useMemo(() => {
    const normalized = query.toLowerCase().trim()
    return products.filter((product) => {
      const matchesCategory =
        category === "Semua" ||
        (category === "Favorit" && product.badge === "Favorit") ||
        product.category === category
      return matchesCategory && product.name.toLowerCase().includes(normalized)
    })
  }, [category, query])

  const cartItems = products
    .filter((product) => cart[product.id])
    .map((product) => ({ ...product, quantity: cart[product.id] }))
  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0)
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  )
  const discountAmount = Math.round(subtotal * (discountRate / 100))
  const taxableAmount = Math.max(0, subtotal - discountAmount)
  const taxAmount = Math.round(taxableAmount * (taxRate / 100))
  const grandTotal = taxableAmount + taxAmount
  const cashChange = cashReceived - grandTotal
  const canConfirmPayment =
    paymentMethod !== "Tunai" || cashReceived >= grandTotal
  const filteredTables = tables.filter((table) => {
    const matchesFilter =
      tableFilter === "Semua" ||
      (tableFilter === "Kosong" && !table.occupied) ||
      (tableFilter === "Ada Pesanan" && table.occupied)
    const matchesQuery = `meja ${String(table.number).padStart(2, "0")}`
      .toLowerCase()
      .includes(tableQuery.toLowerCase().trim())
    return matchesFilter && matchesQuery
  })
  const filteredSavedOrders = savedOrders.filter((order) => {
    const search = savedOrderQuery.toLowerCase().trim()
    return (
      order.customer.toLowerCase().includes(search) ||
      order.id.toLowerCase().includes(search) ||
      (order.table
        ? `meja ${String(order.table).padStart(2, "0")}`.includes(search)
        : false)
    )
  })

  const changeQuantity = (id: number, amount: number) => {
    setCart((current) => {
      const next = Math.max(0, (current[id] || 0) + amount)
      const updated = { ...current }
      if (next === 0) delete updated[id]
      else updated[id] = next
      return updated
    })
  }

  const showNotice = (message: string) => {
    setNotice(message)
    window.setTimeout(() => setNotice(""), 2200)
  }

  const startNewTransaction = () => {
    setCart({})
    setNotes({})
    setCustomerName("")
    setDiscountRate(0)
    setTaxRate(10)
    setOrderType("Makan di tempat")
    setPaymentMethod("Tunai")
    setCashReceived(0)
    setSaved(false)
    setStep("catalog")
  }

  const saveCurrentOrder = () => {
    if (saved) {
      showNotice("Pesanan ini sudah ada di daftar tersimpan")
      return
    }

    const nextNumber = 1045 + savedOrders.length
    setSavedOrders((current) => [
      {
        id: `ORD-${nextNumber}`,
        customer:
          customerName ||
          (orderType === "Makan di tempat"
            ? `Pelanggan meja ${String(selectedTable).padStart(2, "0")}`
            : "Pelanggan umum"),
        table: orderType === "Makan di tempat" ? selectedTable : undefined,
        orderType,
        cart: { ...cart },
        savedAt: "Baru saja",
      },
      ...current,
    ])
    setSaved(true)
    showNotice("Pesanan disimpan sebagai belum dibayar")
  }

  const continueSavedOrder = (order: SavedOrder) => {
    setCart(order.cart)
    setCustomerName(order.customer)
    setOrderType(order.orderType)
    if (order.table) setSelectedTable(order.table)
    setSaved(true)
    setStep("confirmation")
  }

  return (
    <div className="app-shell">
      {notice && (
        <div className="toast" role="status">
          <span className="toast-check">
            <Check size={15} strokeWidth={3} />
          </span>
          {notice}
        </div>
      )}

      <aside className="sidebar">
        <div className="brand-mark">C</div>
        <nav className="sidebar-nav" aria-label="Navigasi utama">
          <button
            className={step === "dashboard" ? "active" : ""}
            aria-label="Dashboard"
            onClick={() => setStep("dashboard")}
          >
            <LayoutDashboard />
          </button>
          <button
            className={step !== "dashboard" ? "active" : ""}
            aria-label="Kasir"
            onClick={() => setStep("catalog")}
          >
            <ShoppingBag />
            <span>Kasir</span>
          </button>
          <button aria-label="Produk">
            <Grid2X2 />
          </button>
          <button aria-label="Pesanan">
            <ClipboardList />
          </button>
          <button aria-label="Laporan">
            <ReceiptText />
          </button>
          <button aria-label="Keuangan">
            <WalletCards />
          </button>
        </nav>
        <div className="sidebar-bottom">
          <button aria-label="Bantuan">
            <CircleHelp />
          </button>
          <button aria-label="Keluar">
            <LogOut />
          </button>
        </div>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <div className="page-title">
            <button className="mobile-menu" aria-label="Buka menu">
              <Menu />
            </button>
            <div>
              <p>Workspace</p>
              <h1>
                {step === "catalog"
                  ? "Kasir"
                  : step === "dashboard"
                    ? "Dashboard kasir"
                  : step === "savedOrders"
                    ? "Pesanan tersimpan"
                  : step === "tables"
                    ? "Manajemen meja"
                  : step === "confirmation"
                    ? "Konfirmasi pesanan"
                    : step === "payment"
                      ? "Pembayaran"
                      : "Transaksi berhasil"}
              </h1>
            </div>
          </div>
          <div className="topbar-actions">
            <div className="shift-pill">
              <span className="status-dot" />
              Shift aktif
              <strong>08:00–16:00</strong>
            </div>
            <button className="icon-button" aria-label="Notifikasi">
              <Bell size={20} />
              <span className="notification-dot" />
            </button>
            <button className="user-menu">
              <span className="avatar">CA</span>
              <span>
                <strong>Candu</strong>
                <small>Kasir</small>
              </span>
              <ChevronDown size={16} />
            </button>
          </div>
        </header>

        <div
          className={`workspace ${step !== "catalog" ? "workspace-hidden" : ""}`}
        >
          <section className="catalog-panel">
            <div className="catalog-heading">
              <div>
                <p className="eyebrow">Pilih menu</p>
                <h2>Tambah pesanan</h2>
              </div>
              <button
                className="saved-order"
                onClick={() => setStep("savedOrders")}
              >
                <Bookmark size={18} />
                Pesanan tersimpan
                <span>{savedOrders.length}</span>
              </button>
            </div>

            <div className="search-row">
              <label className="search-box">
                <Search size={21} />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Cari nama produk..."
                  aria-label="Cari produk"
                />
                {query && (
                  <button
                    onClick={() => setQuery("")}
                    aria-label="Hapus pencarian"
                  >
                    <X size={17} />
                  </button>
                )}
                <kbd>F2</kbd>
              </label>
              <button
                className="table-button"
                onClick={() => setStep("tables")}
              >
                <UtensilsCrossed size={19} />
                <span>Meja</span>
                <strong>{String(selectedTable).padStart(2, "0")}</strong>
              </button>
            </div>

            <div className="category-list" aria-label="Kategori produk">
              {categories.map((item) => (
                <button
                  key={item}
                  className={category === item ? "active" : ""}
                  onClick={() => setCategory(item)}
                >
                  {item}
                </button>
              ))}
            </div>

            <div className="product-grid">
              {filteredProducts.map((product) => (
                <article className="product-card" key={product.id}>
                  <div className="product-image-wrap">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="product-image"
                    />
                    {product.badge && (
                      <span className="product-badge">{product.badge}</span>
                    )}
                    {cart[product.id] && (
                      <span className="in-cart">
                        {cart[product.id]} di pesanan
                      </span>
                    )}
                  </div>
                  <div className="product-details">
                    <div>
                      <span className="product-category">
                        {product.category}
                      </span>
                      <h3>{product.name}</h3>
                      <p>{rupiah(product.price)}</p>
                    </div>
                    <div className="product-quantity">
                      <button
                        className="remove-button"
                        onClick={() => changeQuantity(product.id, -1)}
                        aria-label={`Kurangi ${product.name}`}
                        disabled={!cart[product.id]}
                      >
                        <Minus size={22} strokeWidth={2.5} />
                      </button>
                      {cart[product.id] ? (
                        <strong>{cart[product.id]}</strong>
                      ) : null}
                      <button
                        className="add-button"
                        onClick={() => changeQuantity(product.id, 1)}
                        aria-label={`Tambah ${product.name}`}
                      >
                        <Plus size={25} strokeWidth={2.5} />
                      </button>
                    </div>
                  </div>
                  <div className="stock-line">
                    <span className={product.stock < 10 ? "low-stock" : ""} />
                    Stok {product.stock}
                  </div>
                </article>
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="empty-products">
                <PackageOpen size={40} />
                <h3>Produk tidak ditemukan</h3>
                <p>Coba kata kunci atau kategori lainnya.</p>
              </div>
            )}
          </section>

          <aside className="order-panel">
            <div className="order-header">
              <div>
                <p className="eyebrow">Ringkasan pesanan</p>
                <h2>Produk dipilih</h2>
              </div>
              <span className="item-count">{itemCount} item</span>
            </div>

            <div className="order-type">
              {orderTypes.map((type) => (
                <button
                  key={type}
                  className={orderType === type ? "active" : ""}
                  onClick={() => setOrderType(type)}
                >
                  {type}
                </button>
              ))}
            </div>

            <div className="cart-list">
              {cartItems.map((item) => (
                <div className="cart-item" key={item.id}>
                  <img src={item.image} alt="" />
                  <div className="cart-item-info">
                    <div className="cart-item-title">
                      <div>
                        <h3>{item.name}</h3>
                        <p>{rupiah(item.price)}</p>
                      </div>
                      <span className="quantity-badge">×{item.quantity}</span>
                    </div>
                    <label className="item-note">
                      <NotebookPen size={15} />
                      <input
                        value={notes[item.id] || ""}
                        onChange={(event) =>
                          setNotes((current) => ({
                            ...current,
                            [item.id]: event.target.value,
                          }))
                        }
                        placeholder="Tambah catatan kecil..."
                        aria-label={`Catatan untuk ${item.name}`}
                      />
                    </label>
                  </div>
                </div>
              ))}

              {!cartItems.length && (
                <div className="empty-cart">
                  <div>
                    <ShoppingBag size={32} />
                  </div>
                  <h3>Pesanan masih kosong</h3>
                  <p>Pilih produk dari katalog untuk mulai membuat pesanan.</p>
                </div>
              )}
            </div>

            <div className="order-footer">
              <button
                className="pay-button"
                disabled={!cartItems.length}
                onClick={() => {
                  setSaved(false)
                  setStep("confirmation")
                }}
              >
                <span>Lanjut</span>
                <strong>→</strong>
              </button>
            </div>
          </aside>
        </div>

        {step === "dashboard" && (
          <div className="dashboard-workspace">
            <section className="dashboard-hero">
              <div>
                <p className="eyebrow">Selasa, 29 Oktober 2026</p>
                <h2>Selamat datang kembali, Candu</h2>
                <p>
                  Berikut ringkasan performa shift dan aktivitas restoran hari
                  ini.
                </p>
              </div>
              <button
                className="share-shift-button"
                onClick={() => showNotice("Laporan shift siap dibagikan")}
              >
                <Share2 size={18} />
                Bagikan laporan shift
              </button>
            </section>

            <section className="dashboard-stats">
              <article className="dashboard-stat-card sales">
                <div className="stat-card-top">
                  <span>
                    <CircleDollarSign size={20} />
                  </span>
                  <small>Penjualan hari ini</small>
                  <em>
                    <TrendingUp size={13} /> 12,8%
                  </em>
                </div>
                <strong>{rupiah(306000)}</strong>
                <p>13 transaksi berhasil diselesaikan</p>
              </article>

              <article className="dashboard-stat-card">
                <div className="stat-card-top">
                  <span className="target">
                    <Target size={20} />
                  </span>
                  <small>Target penjualan</small>
                </div>
                <strong>{rupiah(5000000)}</strong>
                <div className="dashboard-progress">
                  <span className="progress-sales" />
                </div>
                <p>6% target bulanan tercapai</p>
              </article>

              <article className="dashboard-stat-card">
                <div className="stat-card-top">
                  <span className="transaction">
                    <ReceiptText size={20} />
                  </span>
                  <small>Target transaksi</small>
                </div>
                <strong>
                  13 <small>/ 50 transaksi</small>
                </strong>
                <div className="dashboard-progress transaction-progress">
                  <span className="progress-transactions" />
                </div>
                <p>26% target shift tercapai</p>
              </article>

              <article className="dashboard-stat-card shift">
                <div className="stat-card-top">
                  <span>
                    <Clock3 size={20} />
                  </span>
                  <small>Status shift</small>
                  <i>Aktif</i>
                </div>
                <strong>08:00–16:00</strong>
                <p>Berjalan selama 5 jam 43 menit</p>
              </article>
            </section>

            <section className="quick-access-section">
              <div className="section-heading">
                <div>
                  <p className="eyebrow">Akses cepat</p>
                  <h3>Mulai aktivitas</h3>
                </div>
                <p>Pilih aktivitas yang ingin dilakukan</p>
              </div>
              <div className="quick-access-grid">
                <button
                  className="quick-access-card pos"
                  onClick={() => setStep("catalog")}
                >
                  <span>
                    <ShoppingBag size={24} />
                  </span>
                  <div>
                    <strong>Kasir POS</strong>
                    <small>Buat transaksi baru</small>
                  </div>
                  <ArrowUpRight size={19} />
                </button>
                <button
                  className="quick-access-card table"
                  onClick={() => setStep("tables")}
                >
                  <span>
                    <UtensilsCrossed size={24} />
                  </span>
                  <div>
                    <strong>Manajemen meja</strong>
                    <small>8 meja siap digunakan</small>
                  </div>
                  <ArrowUpRight size={19} />
                </button>
                <button
                  className="quick-access-card saved"
                  onClick={() => setStep("savedOrders")}
                >
                  <span>
                    <Bookmark size={24} />
                  </span>
                  <div>
                    <strong>Pesanan tersimpan</strong>
                    <small>{savedOrders.length} belum dibayar</small>
                  </div>
                  <ArrowUpRight size={19} />
                </button>
                <button
                  className="quick-access-card shift-action"
                  onClick={() => showNotice("Panel buka dan tutup kasir dibuka")}
                >
                  <span>
                    <WalletCards size={24} />
                  </span>
                  <div>
                    <strong>Buka / tutup kasir</strong>
                    <small>Kelola shift dan kas</small>
                  </div>
                  <ArrowUpRight size={19} />
                </button>
              </div>
            </section>

            <section className="dashboard-bottom-grid">
              <div className="transactions-panel">
                <div className="panel-heading">
                  <div>
                    <p className="eyebrow">Aktivitas terkini</p>
                    <h3>Transaksi hari ini</h3>
                  </div>
                  <button onClick={() => showNotice("Semua transaksi dibuka")}>
                    Lihat semua <ChevronRight size={16} />
                  </button>
                </div>
                <div className="transaction-table">
                  <div className="transaction-table-head">
                    <span>Transaksi</span>
                    <span>Waktu</span>
                    <span>Metode</span>
                    <span>Tipe</span>
                    <span>Total</span>
                  </div>
                  {recentTransactions.map((transaction) => (
                    <div className="transaction-row" key={transaction.id}>
                      <span>
                        <i>
                          <ReceiptText size={15} />
                        </i>
                        <strong>{transaction.id}</strong>
                      </span>
                      <span>{transaction.time}</span>
                      <span className="payment-method-badge">
                        {transaction.method}
                      </span>
                      <span>{transaction.type}</span>
                      <strong>{rupiah(transaction.total)}</strong>
                    </div>
                  ))}
                </div>
              </div>

              <aside className="shift-summary-panel">
                <div className="shift-summary-head">
                  <span>
                    <Clock3 size={20} />
                  </span>
                  <div>
                    <p className="eyebrow">Shift aktif</p>
                    <h3>Shift pagi</h3>
                  </div>
                  <i>Berjalan</i>
                </div>
                <div className="shift-time">
                  <div>
                    <small>Mulai</small>
                    <strong>08:00</strong>
                  </div>
                  <span />
                  <div>
                    <small>Selesai</small>
                    <strong>16:00</strong>
                  </div>
                </div>
                <div className="shift-finance">
                  <div>
                    <span>Modal awal</span>
                    <strong>{rupiah(50000)}</strong>
                  </div>
                  <div>
                    <span>Pembayaran tunai</span>
                    <strong>{rupiah(124000)}</strong>
                  </div>
                  <div>
                    <span>Pembayaran digital</span>
                    <strong>{rupiah(182000)}</strong>
                  </div>
                </div>
                <button
                  onClick={() => showNotice("Ringkasan shift siap ditinjau")}
                >
                  Tinjau ringkasan shift
                  <ArrowRight size={17} />
                </button>
              </aside>
            </section>
          </div>
        )}

        {step === "savedOrders" && (
          <div className="saved-orders-workspace">
            <div className="saved-orders-heading">
              <div className="saved-orders-title">
                <button
                  className="back-button"
                  onClick={() => setStep("catalog")}
                >
                  <ArrowLeft size={18} />
                  Kembali
                </button>
                <div>
                  <p className="eyebrow">Pesanan belum dibayar</p>
                  <h2>Pesanan tersimpan</h2>
                  <p>
                    Temukan pesanan berdasarkan nama pelanggan atau nomor meja.
                  </p>
                </div>
              </div>
              <label className="saved-orders-search">
                <Search size={19} />
                <input
                  value={savedOrderQuery}
                  onChange={(event) => setSavedOrderQuery(event.target.value)}
                  placeholder="Cari nama, meja, atau nomor order..."
                />
                {savedOrderQuery && (
                  <button
                    onClick={() => setSavedOrderQuery("")}
                    aria-label="Hapus pencarian"
                  >
                    <X size={16} />
                  </button>
                )}
              </label>
            </div>

            <div className="saved-orders-stats">
              <div>
                <span className="saved-stat-icon">
                  <Bookmark size={19} />
                </span>
                <p>
                  Total tersimpan
                  <strong>{savedOrders.length} pesanan</strong>
                </p>
              </div>
              <div>
                <span className="saved-stat-icon table-source">
                  <UtensilsCrossed size={19} />
                </span>
                <p>
                  Pesanan meja
                  <strong>
                    {savedOrders.filter((order) => order.table).length} pesanan
                  </strong>
                </p>
              </div>
              <div>
                <span className="saved-stat-icon unpaid">
                  <WalletCards size={19} />
                </span>
                <p>
                  Nilai belum dibayar
                  <strong>
                    {rupiah(
                      savedOrders.reduce(
                        (sum, order) =>
                          sum +
                          products.reduce(
                            (orderTotal, product) =>
                              orderTotal +
                              product.price * (order.cart[product.id] || 0),
                            0,
                          ),
                        0,
                      ),
                    )}
                  </strong>
                </p>
              </div>
            </div>

            <div className="saved-orders-list">
              {filteredSavedOrders.map((order) => {
                const orderItems = products
                  .filter((product) => order.cart[product.id])
                  .map((product) => ({
                    ...product,
                    quantity: order.cart[product.id],
                  }))
                const orderItemCount = orderItems.reduce(
                  (sum, item) => sum + item.quantity,
                  0,
                )
                const orderTotal = orderItems.reduce(
                  (sum, item) => sum + item.price * item.quantity,
                  0,
                )

                return (
                  <article className="saved-order-card" key={order.id}>
                    <div className="saved-order-card-head">
                      <div className="saved-customer">
                        <span>{order.customer.slice(0, 2).toUpperCase()}</span>
                        <div>
                          <h3>{order.customer}</h3>
                          <p>
                            {order.table
                              ? `Meja ${String(order.table).padStart(2, "0")}`
                              : order.orderType}
                          </p>
                        </div>
                      </div>
                      <span className="unpaid-badge">Belum dibayar</span>
                    </div>

                    <div className="saved-order-meta">
                      <span>
                        <ReceiptText size={14} /> {order.id}
                      </span>
                      <span>
                        <Clock3 size={14} /> {order.savedAt}
                      </span>
                    </div>

                    <div className="saved-items">
                      {orderItems.slice(0, 3).map((item) => (
                        <div key={item.id}>
                          <span>
                            {item.quantity}× {item.name}
                          </span>
                          <strong>{rupiah(item.price * item.quantity)}</strong>
                        </div>
                      ))}
                    </div>

                    <div className="saved-order-total">
                      <span>{orderItemCount} item</span>
                      <strong>{rupiah(orderTotal)}</strong>
                    </div>

                    <div className="saved-order-actions">
                      <button
                        className="kitchen-print-button"
                        onClick={() =>
                          showNotice(`Struk dapur ${order.id} siap dicetak`)
                        }
                      >
                        <Printer size={17} />
                        Cetak dapur
                      </button>
                      <button
                        className="continue-order-button"
                        onClick={() => continueSavedOrder(order)}
                      >
                        Lanjut
                        <ChevronRight size={18} />
                      </button>
                    </div>
                  </article>
                )
              })}
            </div>

            {!filteredSavedOrders.length && (
              <div className="empty-saved-orders">
                <Bookmark size={36} />
                <h3>Pesanan tidak ditemukan</h3>
                <p>Coba gunakan nama pelanggan atau nomor meja lainnya.</p>
              </div>
            )}
          </div>
        )}

        {step === "tables" && (
          <div className="tables-workspace">
            <div className="tables-heading">
              <div className="tables-title-group">
                <span className="tables-title-icon">
                  <UtensilsCrossed size={22} />
                </span>
                <div>
                  <div className="tables-live-label">
                    <p className="eyebrow">Area layanan</p>
                    <span>
                      <i /> Live
                    </span>
                  </div>
                  <h2>Manajemen meja</h2>
                  <p>
                    Pantau ketersediaan dan pesanan seluruh meja secara
                    real-time.
                  </p>
                </div>
              </div>
              <div className="tables-heading-actions">
                <button
                  className="refresh-button"
                  onClick={() => showNotice("Status meja telah diperbarui")}
                >
                  <RefreshCw size={17} />
                  Perbarui
                </button>
                <button
                  className="open-pos-button"
                  onClick={() => setStep("catalog")}
                >
                  Buka layar POS
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>

            <div className="table-overview">
              <div className="overview-card overview-primary">
                <span className="overview-icon">
                  <Grid2X2 size={20} />
                </span>
                <div>
                  <small>Total meja</small>
                  <strong>10</strong>
                  <p>Area utama restoran</p>
                </div>
              </div>
              <div className="overview-card">
                <span className="overview-icon available">
                  <Check size={20} />
                </span>
                <div>
                  <small>Siap digunakan</small>
                  <strong>8</strong>
                  <p>80% meja tersedia</p>
                </div>
              </div>
              <div className="overview-card">
                <span className="overview-icon occupied">
                  <Users size={20} />
                </span>
                <div>
                  <small>Sedang terisi</small>
                  <strong>2</strong>
                  <p>20% tingkat okupansi</p>
                </div>
              </div>
              <div className="overview-card">
                <span className="overview-icon revenue">
                  <WalletCards size={20} />
                </span>
                <div>
                  <small>Tagihan aktif</small>
                  <strong>Rp90.000</strong>
                  <p>Dari 2 pesanan berjalan</p>
                </div>
              </div>
            </div>

            <div className="tables-toolbar">
              <div className="table-filters">
                {(["Semua", "Kosong", "Ada Pesanan"] as const).map(
                  (filter) => {
                    const count =
                      filter === "Semua"
                        ? tables.length
                        : filter === "Kosong"
                          ? tables.filter((table) => !table.occupied).length
                          : tables.filter((table) => table.occupied).length
                    return (
                      <button
                        key={filter}
                        className={tableFilter === filter ? "active" : ""}
                        onClick={() => setTableFilter(filter)}
                      >
                        {filter} <span>{count}</span>
                      </button>
                    )
                  },
                )}
                <strong>
                  Total tagihan:{" "}
                  {rupiah(
                    tables.reduce(
                      (sum, table) => sum + (table.occupied?.total || 0),
                      0,
                    ),
                  )}
                </strong>
              </div>
              <label className="table-search">
                <Search size={18} />
                <input
                  value={tableQuery}
                  onChange={(event) => setTableQuery(event.target.value)}
                  placeholder="Cari meja..."
                />
              </label>
            </div>

            <div className="tables-grid">
              {filteredTables.map((table) => (
                <article
                  className={`table-card ${table.occupied ? "occupied" : ""}`}
                  key={table.number}
                >
                  <div className="table-card-heading">
                    <div className="table-identity">
                      <span className="table-number">
                        {String(table.number).padStart(2, "0")}
                      </span>
                      <div>
                        <h3>Meja {String(table.number).padStart(2, "0")}</h3>
                      </div>
                    </div>
                    <span
                      className={`table-status ${
                        table.occupied ? "occupied" : "empty"
                      }`}
                    >
                      {table.occupied ? "Ada pesanan" : "Kosong"}
                    </span>
                  </div>

                  {table.occupied ? (
                    <>
                      <div className="table-bill">
                        <span>
                          Total tagihan
                          <strong>{rupiah(table.occupied.total)}</strong>
                        </span>
                        <small>
                          {table.occupied.orders} pesanan ·{" "}
                          {table.occupied.items} item
                        </small>
                        <small>
                          <Clock3 size={13} /> Mulai {table.occupied.startedAt}
                        </small>
                      </div>
                      <div className="occupied-table-actions">
                        <button
                          onClick={() => {
                            setSelectedTable(table.number)
                            setStep("catalog")
                          }}
                        >
                          <Plus size={17} /> Tambah
                        </button>
                        <button
                          className="table-pay-button"
                          onClick={() =>
                            showNotice(
                              `Membuka pembayaran meja ${String(table.number).padStart(2, "0")}`,
                            )
                          }
                        >
                          <WalletCards size={17} /> Bayar
                        </button>
                      </div>
                      <div className="table-secondary-actions">
                        <button
                          onClick={() =>
                            showNotice("Rincian pesanan meja dibuka")
                          }
                        >
                          <ReceiptText size={14} /> Rincian
                        </button>
                        <button
                          className="delete-table-order"
                          onClick={() =>
                            showNotice("Konfirmasi hapus pesanan dibuka")
                          }
                        >
                          <Trash2 size={14} /> Hapus
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="empty-table-actions">
                      <div className="table-ready-state">
                        <span>
                          <Check size={16} />
                        </span>
                        <div>
                          <strong>Siap digunakan</strong>
                          <small>Belum ada pesanan aktif</small>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setSelectedTable(table.number)
                          setOrderType("Makan di tempat")
                          setStep("catalog")
                          showNotice(
                            `Meja ${String(table.number).padStart(2, "0")} dipilih`,
                          )
                        }}
                      >
                        <Plus size={18} />
                        Input pesanan baru
                      </button>
                      <span>Belum ada tagihan</span>
                    </div>
                  )}
                </article>
              ))}
            </div>

            {!filteredTables.length && (
              <div className="empty-tables">
                <UtensilsCrossed size={34} />
                <h3>Meja tidak ditemukan</h3>
                <p>Coba ubah filter atau kata kunci pencarian.</p>
              </div>
            )}
          </div>
        )}

        {step === "confirmation" && (
          <div className="confirmation-workspace">
            <section className="confirmation-summary">
              <div className="confirmation-heading">
                <button
                  className="back-button"
                  onClick={() => setStep("catalog")}
                >
                  <ArrowLeft size={19} />
                  Kembali
                </button>
                <div>
                  <p className="eyebrow">Periksa kembali</p>
                  <h2>Ringkasan pesanan</h2>
                </div>
                {saved && (
                  <span className="saved-status">
                    <Check size={15} />
                    Tersimpan · Belum dibayar
                  </span>
                )}
              </div>

              <div className="summary-table">
                <div className="summary-table-head">
                  <span>Produk</span>
                  <span>Harga</span>
                  <span>Qty</span>
                  <span>Subtotal</span>
                </div>
                {cartItems.map((item) => (
                  <div className="summary-row" key={item.id}>
                    <div className="summary-product">
                      <img src={item.image} alt="" />
                      <div>
                        <h3>{item.name}</h3>
                        <p>{notes[item.id] || "Tanpa catatan"}</p>
                      </div>
                    </div>
                    <span>{rupiah(item.price)}</span>
                    <strong>{item.quantity}</strong>
                    <strong>{rupiah(item.price * item.quantity)}</strong>
                  </div>
                ))}
              </div>

              <div className="summary-total">
                <span>
                  Total produk
                  <strong>{itemCount} item</strong>
                </span>
                <span>
                  Subtotal
                  <strong>{rupiah(subtotal)}</strong>
                </span>
              </div>
            </section>

            <aside className="checkout-panel">
              <div className="checkout-heading">
                <p className="eyebrow">Detail transaksi</p>
                <h2>Konfirmasi pembayaran</h2>
              </div>

              <div className="checkout-form">
                <label>
                  <span>Tipe pesanan</span>
                  <div className="selected-order-type">
                    <UtensilsCrossed size={18} />
                    <strong>{orderType}</strong>
                    <Check size={17} />
                  </div>
                </label>

                <label>
                  <span>Nama pelanggan</span>
                  <input
                    value={customerName}
                    onChange={(event) => setCustomerName(event.target.value)}
                    placeholder="Masukkan nama pelanggan"
                  />
                </label>

                <div className="rate-fields">
                  <label>
                    <span>Diskon</span>
                    <div className="number-input">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={discountRate}
                        onChange={(event) =>
                          setDiscountRate(
                            Math.min(100, Math.max(0, Number(event.target.value))),
                          )
                        }
                      />
                      <span>%</span>
                    </div>
                  </label>
                  <label>
                    <span>Pajak</span>
                    <div className="number-input">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={taxRate}
                        onChange={(event) =>
                          setTaxRate(
                            Math.min(100, Math.max(0, Number(event.target.value))),
                          )
                        }
                      />
                      <span>%</span>
                    </div>
                  </label>
                </div>
              </div>

              <div className="payment-breakdown">
                <div>
                  <span>Subtotal</span>
                  <strong>{rupiah(subtotal)}</strong>
                </div>
                <div>
                  <span>Diskon ({discountRate}%)</span>
                  <strong className="discount-value">
                    − {rupiah(discountAmount)}
                  </strong>
                </div>
                <div>
                  <span>Pajak ({taxRate}%)</span>
                  <strong>{rupiah(taxAmount)}</strong>
                </div>
                <div className="amount-due">
                  <span>Jumlah yang harus dibayar</span>
                  <strong>{rupiah(grandTotal)}</strong>
                </div>
              </div>

              <div className="checkout-actions">
                <button
                  className="save-order-button"
                  onClick={saveCurrentOrder}
                >
                  <Save size={19} />
                  Simpan
                </button>
                <button
                  className="pay-now-button"
                  onClick={() => setStep("payment")}
                >
                  Bayar sekarang
                  <ChevronRight size={20} />
                </button>
              </div>
            </aside>
          </div>
        )}

        {step === "payment" && (
          <div className="payment-workspace">
            <button
              className="back-button"
              onClick={() => setStep("confirmation")}
            >
              <ArrowLeft size={19} />
              Kembali ke konfirmasi
            </button>
            <div className="payment-card">
              <div className="payment-card-header">
                <div>
                  <p className="eyebrow">Langkah terakhir</p>
                  <h2>Pilih metode pembayaran</h2>
                  <p className="payment-customer">
                    {customerName || "Pelanggan umum"} · {orderType}
                  </p>
                </div>
                <div className="payment-amount">
                  <span>Total pembayaran</span>
                  <strong>{rupiah(grandTotal)}</strong>
                </div>
              </div>
              <div className="payment-methods">
                <button
                  className={paymentMethod === "Tunai" ? "active" : ""}
                  onClick={() => setPaymentMethod("Tunai")}
                >
                  <Banknote size={21} />
                  Tunai
                </button>
                <button
                  className={paymentMethod === "QRIS" ? "active" : ""}
                  onClick={() => setPaymentMethod("QRIS")}
                >
                  <QrCode size={21} />
                  QRIS
                </button>
                <button
                  className={paymentMethod === "Transfer" ? "active" : ""}
                  onClick={() => setPaymentMethod("Transfer")}
                >
                  <Landmark size={21} />
                  Transfer
                </button>
                <button
                  className={paymentMethod === "E-Wallet" ? "active" : ""}
                  onClick={() => setPaymentMethod("E-Wallet")}
                >
                  <Wallet size={21} />
                  E-Wallet
                </button>
              </div>

              {paymentMethod === "Tunai" ? (
                <div className="cash-payment">
                  <label>
                    <span>Jumlah uang diterima</span>
                    <div className="cash-input">
                      <span>Rp</span>
                      <input
                        type="number"
                        min="0"
                        value={cashReceived || ""}
                        onChange={(event) =>
                          setCashReceived(Math.max(0, Number(event.target.value)))
                        }
                        placeholder="0"
                      />
                    </div>
                  </label>
                  <div className="quick-amounts">
                    <button onClick={() => setCashReceived(grandTotal)}>
                      Uang pas
                    </button>
                    {[50000, 100000, 200000].map((amount) => (
                      <button
                        key={amount}
                        onClick={() => setCashReceived(amount)}
                      >
                        {rupiah(amount).replace("Rp ", "")}
                      </button>
                    ))}
                  </div>
                  <div
                    className={`cash-change ${cashChange < 0 ? "insufficient" : ""}`}
                  >
                    <span>
                      {cashChange < 0 ? "Uang masih kurang" : "Kembalian"}
                    </span>
                    <strong>{rupiah(Math.abs(cashChange))}</strong>
                  </div>
                </div>
              ) : (
                <div className="digital-payment-info">
                  <CreditCard size={21} />
                  <div>
                    <strong>Pembayaran {paymentMethod}</strong>
                    <p>
                      Pastikan pembayaran pelanggan sudah diterima sebelum
                      dikonfirmasi.
                    </p>
                  </div>
                </div>
              )}

              <div className="payment-actions">
                <button
                  className="cancel-payment"
                  onClick={() => setStep("confirmation")}
                >
                  Batal
                </button>
                <button
                  className="confirm-payment"
                  disabled={!canConfirmPayment}
                  onClick={() => setStep("success")}
                >
                  Konfirmasi bayar
                  <ChevronRight size={19} />
                </button>
              </div>
            </div>
          </div>
        )}

        {step === "success" && (
          <div className="success-workspace">
            <div className="success-card">
              <div className="success-animation" aria-hidden="true">
                <span className="success-ring ring-one" />
                <span className="success-ring ring-two" />
                <span className="success-check">
                  <Check size={36} strokeWidth={3} />
                </span>
              </div>
              <p className="eyebrow">Pembayaran diterima</p>
              <h2>Pesanan berhasil dibayar</h2>
              <p className="success-description">
                Transaksi #TRX-1048 telah selesai dan tercatat menggunakan
                metode {paymentMethod}.
              </p>

              <div className="success-summary">
                <span>
                  Total pembayaran
                  <strong>{rupiah(grandTotal)}</strong>
                </span>
                <span>
                  Pelanggan
                  <strong>{customerName || "Pelanggan umum"}</strong>
                </span>
                <span>
                  Metode
                  <strong>{paymentMethod}</strong>
                </span>
                {paymentMethod === "Tunai" && (
                  <span>
                    Kembalian
                    <strong>{rupiah(Math.max(0, cashChange))}</strong>
                  </span>
                )}
              </div>

              <div className="receipt-actions">
                <button
                  onClick={() => showNotice("Struk pelanggan siap dicetak")}
                >
                  <Printer size={19} />
                  Cetak struk pelanggan
                </button>
                <button
                  onClick={() => showNotice("Struk dapur siap dicetak")}
                >
                  <ReceiptText size={19} />
                  Cetak struk dapur
                </button>
              </div>

              <button
                className="new-transaction-button"
                onClick={startNewTransaction}
              >
                <RotateCcw size={19} />
                Transaksi baru
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
