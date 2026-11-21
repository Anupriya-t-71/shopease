import { useEffect, useMemo, useState } from 'react'
import {
  ArrowRight, Search, ShoppingBag, Heart, Star, Plus, Minus,
  X, Menu, Check, SlidersHorizontal, Sparkles
} from 'lucide-react'
import { products } from './data/products'

const money = (amount) => `₹${amount.toLocaleString('en-IN')}`

function App() {
  const [cart, setCart] = useState(() => {
    try { return JSON.parse(localStorage.getItem('shopease-cart') || '{}') }
    catch { return {} }
  })
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All')
  const [sort, setSort] = useState('featured')
  const [selected, setSelected] = useState(null)
  const [cartOpen, setCartOpen] = useState(false)
  const [mobileMenu, setMobileMenu] = useState(false)
  const [notice, setNotice] = useState('')
  const [saved, setSaved] = useState([])

  useEffect(() => {
    localStorage.setItem('shopease-cart', JSON.stringify(cart))
  }, [cart])

  const categories = ['All', 'Fashion', 'Home', 'Accessories', 'Lifestyle']
  const visibleProducts = useMemo(() => {
    let result = products.filter((product) => {
      const matchesCategory = category === 'All' || product.category === category
      const matchesQuery = `${product.name} ${product.category}`.toLowerCase().includes(query.toLowerCase())
      return matchesCategory && matchesQuery
    })
    if (sort === 'low') result = [...result].sort((a, b) => a.price - b.price)
    if (sort === 'high') result = [...result].sort((a, b) => b.price - a.price)
    if (sort === 'rating') result = [...result].sort((a, b) => b.rating - a.rating)
    return result
  }, [category, query, sort])

  const cartItems = products.filter((product) => cart[product.id] > 0)
  const cartCount = Object.values(cart).reduce((sum, qty) => sum + qty, 0)
  const subtotal = cartItems.reduce((sum, product) => sum + product.price * cart[product.id], 0)

  const addToCart = (product) => {
    setCart((current) => ({ ...current, [product.id]: (current[product.id] || 0) + 1 }))
    setNotice(`${product.name} added to your bag`)
    window.setTimeout(() => setNotice(''), 2400)
  }

  const changeQty = (id, amount) => {
    setCart((current) => {
      const next = { ...current, [id]: (current[id] || 0) + amount }
      if (next[id] <= 0) delete next[id]
      return next
    })
  }

  const toggleSaved = (id) => {
    setSaved((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id])
  }

  const scrollToShop = () => {
    document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' })
    setMobileMenu(false)
  }

  return (
    <div className="app-shell">
      <div className="announcement">A little something for your everyday — free delivery on orders over ₹1,999</div>
      <header className="site-header">
        <button className="icon-button mobile-menu-button" aria-label="Open menu" onClick={() => setMobileMenu(!mobileMenu)}><Menu size={21} /></button>
        <a className="brand" href="#" onClick={(event) => { event.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }) }}>shop<span>ease.</span></a>
        <nav className={`main-nav ${mobileMenu ? 'nav-open' : ''}`}>
          <button onClick={() => { setCategory('All'); scrollToShop() }}>Shop all</button>
          <button onClick={() => { setCategory('Fashion'); scrollToShop() }}>Fashion</button>
          <button onClick={() => { setCategory('Home'); scrollToShop() }}>Home & living</button>
          <button onClick={() => { setCategory('Accessories'); scrollToShop() }}>Accessories</button>
        </nav>
        <div className="header-actions">
          <button className="icon-button search-shortcut" aria-label="Go to search" onClick={scrollToShop}><Search size={20} /></button>
          <button className="icon-button bag-button" aria-label="Open shopping bag" onClick={() => setCartOpen(true)}>
            <ShoppingBag size={20} /><span className="bag-count">{cartCount}</span>
          </button>
        </div>
      </header>

      <main>
        <section className="hero">
          <div className="hero-copy">
            <div className="eyebrow"><Sparkles size={14} /> THE EVERYDAY EDIT</div>
            <h1>Find your<br /><em>everyday</em> favourite.</h1>
            <p>Good things, thoughtfully picked. Discover little upgrades that make every day feel a bit more you.</p>
            <button className="primary-button" onClick={scrollToShop}>Explore the collection <ArrowRight size={17} /></button>
            <div className="hero-footnote"><span className="tiny-stars">★★★★★</span> Loved by 2,000+ happy customers</div>
          </div>
          <div className="hero-image-wrap">
            <img className="hero-image" src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1400&q=90" alt="A curated collection of everyday fashion essentials" />
            <div className="image-note"><span>01 / 04</span><strong>Made for your kind of day.</strong></div>
          </div>
          <div className="hero-side-label">THOUGHTFUL FINDS · GOOD EVERYDAY</div>
        </section>

        <section className="trust-strip">
          <div><span className="trust-icon">✳</span><span>Thoughtfully selected</span></div>
          <div><span className="trust-icon">♡</span><span>Made for everyday</span></div>
          <div><span className="trust-icon">↗</span><span>Easy, happy shopping</span></div>
        </section>

        <section className="shop-section" id="shop">
          <div className="section-heading">
            <div><div className="eyebrow">A GOOD PLACE TO START</div><h2>Little things. <em>Big joy.</em></h2></div>
            <p>Pieces you'll reach for, use often, and love having around.</p>
          </div>

          <div className="shop-toolbar">
            <div className="category-tabs">
              {categories.map((item) => <button key={item} className={category === item ? 'active' : ''} onClick={() => setCategory(item)}>{item}</button>)}
            </div>
            <div className="toolbar-right">
              <label className="search-box"><Search size={17} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search products..." /></label>
              <label className="sort-box"><SlidersHorizontal size={16} /><select value={sort} onChange={(event) => setSort(event.target.value)} aria-label="Sort products"><option value="featured">Featured</option><option value="low">Price: low to high</option><option value="high">Price: high to low</option><option value="rating">Top rated</option></select></label>
            </div>
          </div>

          <div className="product-grid">
            {visibleProducts.map((product) => (
              <article className="product-card" key={product.id}>
                <div className="product-image-wrap" onClick={() => setSelected(product)} role="button" tabIndex={0} onKeyDown={(event) => event.key === 'Enter' && setSelected(product)}>
                  <img src={product.image} alt={product.name} loading="lazy" />
                  {product.tag && <span className="product-tag">{product.tag}</span>}
                  <button className={`save-button ${saved.includes(product.id) ? 'is-saved' : ''}`} aria-label="Save product" onClick={(event) => { event.stopPropagation(); toggleSaved(product.id) }}><Heart size={17} fill={saved.includes(product.id) ? 'currentColor' : 'none'} /></button>
                  <button className="quick-add" onClick={(event) => { event.stopPropagation(); addToCart(product) }}><Plus size={16} /> Quick add</button>
                </div>
                <div className="product-info">
                  <div className="product-category">{product.category}</div>
                  <div className="product-name-row"><button className="product-name" onClick={() => setSelected(product)}>{product.name}</button><span className="rating"><Star size={12} fill="currentColor" /> {product.rating}</span></div>
                  <div className="price-row"><strong>{money(product.price)}</strong>{product.oldPrice && <del>{money(product.oldPrice)}</del>}</div>
                </div>
              </article>
            ))}
          </div>
          {visibleProducts.length === 0 && <div className="empty-state"><Search size={28} /><h3>No matches just yet</h3><p>Try another search or choose a different category.</p><button className="text-button" onClick={() => { setQuery(''); setCategory('All') }}>Clear filters</button></div>}
          <div className="results-note">Showing {visibleProducts.length} of {products.length} thoughtfully picked finds</div>
        </section>

        <section className="newsletter">
          <div><div className="eyebrow">A NOTE FROM US</div><h2>Good things are<br /><em>worth sharing.</em></h2><p>New finds, little inspirations, and the occasional treat. No noise, just the good stuff.</p></div>
          <form className="newsletter-form" onSubmit={(event) => { event.preventDefault(); setNotice('Thanks for joining the ShopEase list!'); event.currentTarget.reset(); window.setTimeout(() => setNotice(''), 3000) }}>
            <label htmlFor="email">Your email address</label><div className="email-input"><input id="email" type="email" placeholder="you@example.com" required /><button aria-label="Subscribe"><ArrowRight size={19} /></button></div>
            <small>By subscribing, you agree to receive occasional updates from ShopEase.</small>
          </form>
        </section>
      </main>

      <footer className="site-footer"><a className="brand" href="#">shop<span>ease.</span></a><p>Find your everyday favourite.</p><span>© 2026 ShopEase. Made for practice.</span></footer>

      {notice && <div className="toast"><Check size={17} />{notice}</div>}

      {selected && <div className="modal-backdrop" onClick={() => setSelected(null)}><div className="product-modal" onClick={(event) => event.stopPropagation()}><button className="close-button" aria-label="Close" onClick={() => setSelected(null)}><X /></button><img src={selected.image} alt={selected.name} /><div className="modal-copy"><div className="product-category">{selected.category}</div><h2>{selected.name}</h2><div className="rating modal-rating"><Star size={14} fill="currentColor" /> {selected.rating} · Customer favourite</div><div className="modal-price">{money(selected.price)} {selected.oldPrice && <del>{money(selected.oldPrice)}</del>}</div><p>{selected.description}</p><button className="primary-button full-button" onClick={() => addToCart(selected)}>Add to bag <ShoppingBag size={17} /></button><small>Free delivery on orders over ₹1,999</small></div></div></div>}

      {cartOpen && <div className="drawer-backdrop" onClick={() => setCartOpen(false)}><aside className="cart-drawer" onClick={(event) => event.stopPropagation()}><div className="drawer-heading"><div><div className="eyebrow">YOUR PICKS</div><h2>Your bag <span>({cartCount})</span></h2></div><button className="close-button" aria-label="Close cart" onClick={() => setCartOpen(false)}><X /></button></div>
        {cartItems.length === 0 ? <div className="cart-empty"><ShoppingBag size={35} /><h3>Your bag is taking a break.</h3><p>Find something lovely to bring home.</p><button className="primary-button" onClick={() => { setCartOpen(false); scrollToShop() }}>Explore the shop <ArrowRight size={16} /></button></div> :
          <><div className="cart-list">{cartItems.map((product) => <div className="cart-item" key={product.id}><img src={product.image} alt={product.name} /><div className="cart-item-info"><strong>{product.name}</strong><span>{money(product.price)}</span><div className="quantity-control"><button aria-label="Decrease quantity" onClick={() => changeQty(product.id, -1)}><Minus size={13} /></button><span>{cart[product.id]}</span><button aria-label="Increase quantity" onClick={() => changeQty(product.id, 1)}><Plus size={13} /></button></div></div><strong className="line-total">{money(product.price * cart[product.id])}</strong></div>)}</div><div className="cart-summary"><div><span>Subtotal</span><strong>{money(subtotal)}</strong></div><p>Shipping and taxes calculated at checkout.</p><button className="primary-button full-button" onClick={() => setNotice('Checkout is a demo — no payment will be collected.')}>Continue to checkout <ArrowRight size={17} /></button></div></>}
      </aside></div>}
    </div>
  )
}

export default App
