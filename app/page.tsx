"use client"

import { useState, useCallback, useEffect, useRef } from "react"
import { products, categories } from "@/lib/data"
import type { Product } from "@/lib/types"
import { CartProvider } from "@/lib/cart-context"
import { StoreHeader } from "@/components/delivery/store-header"
import { SearchBar } from "@/components/delivery/search-bar"
import { CategoryNav } from "@/components/delivery/category-nav"
import { FeaturedProductCard } from "@/components/delivery/featured-product-card"
import { CompactProductCard } from "@/components/delivery/compact-product-card"
import { ReviewsSection } from "@/components/delivery/reviews-section"
import { CartButton } from "@/components/delivery/cart-button"
import { CartDrawer } from "@/components/delivery/cart-drawer"
import { ProductDetail } from "@/components/delivery/product-detail"
import { LocationPopup } from "@/components/delivery/location-popup"
import { HighlightProducts } from "@/components/delivery/category-showcase"
import { PromoTimer } from "@/components/delivery/promo-timer"
import { AboutUs } from "@/components/delivery/about-us"
import { Footer } from "@/components/delivery/footer"
import { BannerCarousel } from "@/components/delivery/banner-carousel"
import { PendingOrdersButton, PendingOrdersModal } from "@/components/delivery/pending-orders"
import { UpsellCombo } from "@/components/delivery/upsell-combo"
import { PriceFilter, sortProducts, type SortOrder } from "@/components/delivery/price-filter"
import { useCart } from "@/lib/cart-context"
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react"

const HOME_PRODUCTS_LIMIT = 6

function DeliveryApp() {
  const { addCombo } = useCart()
  const [activeCategory, setActiveCategory] = useState("promocao")
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [showLocationPopup, setShowLocationPopup] = useState(false)
  const [userAddress, setUserAddress] = useState<string | null>(null)
  const [showPendingOrders, setShowPendingOrders] = useState(false)
  const [openCombo, setOpenCombo] = useState(false)
  const [categoryFilters, setCategoryFilters] = useState<Record<string, SortOrder>>({})
  const ofertasScrollRef = useRef<HTMLDivElement>(null)

  const scrollOfertas = (direction: "left" | "right") => {
    if (!ofertasScrollRef.current) return
    const delta = direction === "left" ? -200 : 200
    ofertasScrollRef.current.scrollBy({ left: delta, behavior: "smooth" })
  }

  useEffect(() => {
    // Carrega endereco salvo (LocationGuard ja garantiu que existe)
    const savedAddress = localStorage.getItem("delivery_address")
    if (savedAddress) setUserAddress(savedAddress)
  }, [])

  useEffect(() => {
    if (activeCategory !== "promocao") {
      const timer = setTimeout(() => {
        document.getElementById("category-products")?.scrollIntoView({ behavior: "smooth", block: "start" })
      }, 200)
      return () => clearTimeout(timer)
    }
  }, [activeCategory])

  const handleLocationSet = (address: string) => {
    setUserAddress(address)
    localStorage.setItem("delivery_address", address)
    setShowLocationPopup(false)
  }

  const handleCategoryChange = useCallback((categoryId: string) => {
    if (categoryId === activeCategory) {
      const el = categoryId === "promocao" 
        ? document.getElementById("products-section")
        : document.getElementById("category-products")
      el?.scrollIntoView({ behavior: "smooth", block: "start" })
      return
    }

    setIsTransitioning(true)
    setTimeout(() => {
      setActiveCategory(categoryId)
      setIsTransitioning(false)
      document.getElementById("products-section")?.scrollIntoView({ behavior: "smooth", block: "start" })
      // Para categorias: useEffect fará scroll para category-products após render
    }, 150)
  }, [activeCategory])

  // Ofertas do Dia: Powerpuff Girls, Scooby-Doo, Harry Potter, Ursinhos Carinhosos, Snoopy, Zero Lactose
  const OFERTAS_DIA_IDS = [
    "KIT_3_OVOS_MENINAS_SUPER", // Kit 3 Ovos Meninas Super Poderosas
    "SKU_1772484114807_525",  // Meninas Superpoderosas Docinho
    "SKU_1772484126294_547",  // Meninas Superpoderosas Florzinha
    "SKU_1772484039944_411",  // Meninas Superpoderosas Lindinha
    "SKU_1772483892864_674",  // Scooby-Doo
    "SKU_1772483935106_521",  // Harry Potter Chapéu Seletor
    "SKU_1772483858901_394",  // Ursinhos Carinhosos Animadinha
    "SKU_1772483867994_235",  // Ursinhos Carinhosos Zangadinho
    "SKU_1772483864171_307",  // Snoopy Astronauta
    "SKU_1772484118531_75",   // Zero Lactose
  ]
  const featuredProducts = products.filter((p) => OFERTAS_DIA_IDS.includes(p.id))
  const otherCategories = categories.filter((c) => c.id !== "promocao")

  const isOvo = (name: string) => {
    const n = name.toLowerCase()
    return n.includes("ovo") || n.includes("ovinhos")
  }

  const getCategoryProducts = (categoryId: string) => {
    // Marca: filtrar por marca (ex: marca:Cacau Show, marca:Lacta)
    if (categoryId.startsWith("marca:")) {
      const marca = categoryId.replace("marca:", "")
      const marcaProducts = products.filter((p) => p.marca === marca)
      // Ordenar ovos primeiro
      return marcaProducts.sort((a, b) => {
        const aIsOvo = isOvo(a.name)
        const bIsOvo = isOvo(b.name)
        if (aIsOvo && !bIsOvo) return -1
        if (!aIsOvo && bIsOvo) return 1
        return 0
      })
    }
    // Helpers para categorias
    const isTablete = (name: string) => name.toLowerCase().includes("tablete")
    const isBombom = (name: string) => name.toLowerCase().includes("bombom") || name.toLowerCase().includes("trufa")
    
    // Chocolates: todos os chocolates (excluindo ovos, tabletes e bombons)
    if (categoryId === "chocolates") {
      const base = products.filter((p) => p.category === "chocolates" || p.category === "ofertas")
      return base.filter((p) => !isOvo(p.name) && !isTablete(p.name) && !isBombom(p.name))
    }
    // Ovos de Páscoa: todos os ovos
    if (categoryId === "ovos-de-pascoa") {
      return products.filter((p) => isOvo(p.name) || p.category === "ovos-de-pascoa")
    }
    // Tabletes: produtos com "tablete" no nome
    if (categoryId === "tabletes") {
      return products.filter((p) => isTablete(p.name))
    }
    // Bombons: produtos com "bombom" ou "trufa" no nome (excluindo ovos)
    if (categoryId === "bombons") {
      return products.filter((p) => isBombom(p.name) && !isOvo(p.name))
    }
    const base = products.filter((p) => p.category === categoryId)
    return base
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      <StoreHeader 
        userAddress={userAddress} 
        onChangeAddress={() => setShowLocationPopup(true)} 
      />

      <BannerCarousel 
        onBannerClick={handleCategoryChange} 
        onComboClick={() => setOpenCombo(true)}
      />

      <SearchBar onProductSelect={(product) => setSelectedProduct(product)} />
      <CategoryNav
        activeCategory={activeCategory}
        onCategoryChange={handleCategoryChange}
      />

      <main id="products-section" className={`max-w-lg mx-auto px-4 py-6 transition-all duration-300 ${isTransitioning ? "opacity-0 translate-y-2" : "opacity-100 translate-y-0"}`}>
        {activeCategory === "promocao" ? (
          <>
            {/* Ofertas do Dia - apenas em Promoções */}
            <section className="mb-8">
              <div className="flex flex-col gap-2 mb-4">
                <h2 className="text-lg font-bold text-foreground">
                  Ofertas do Dia
                </h2>
                <PromoTimer />
              </div>
              <div
                ref={ofertasScrollRef}
                className="overflow-x-auto overflow-y-hidden scrollbar-hide pb-2 scroll-smooth snap-x snap-mandatory -mx-4 px-4"
                style={{ WebkitOverflowScrolling: "touch" } as React.CSSProperties}
              >
                <div className="flex gap-3 w-max">
                  {[...featuredProducts, ...featuredProducts].map((product, index) => (
                    <div key={`${product.id}-${index}`} className="flex-shrink-0 w-[44vw] max-w-[200px] snap-start">
                      <FeaturedProductCard
                        product={product}
                        index={index % featuredProducts.length}
                        onClick={() => setSelectedProduct(product)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <HighlightProducts onProductSelect={(p) => setSelectedProduct(p)} onComboClick={() => setOpenCombo(true)} excludeIds={OFERTAS_DIA_IDS} />

            {otherCategories.map((category) => {
              const categoryProducts = getCategoryProducts(category.id)
              if (categoryProducts.length === 0) return null
              
              const isHorizontal = category.id === "salgadinho"
              const currentFilter = categoryFilters[category.id] || "default"
              const sortedProducts = sortProducts(categoryProducts, currentFilter) as Product[]
              const limitedProducts = sortedProducts.slice(0, HOME_PRODUCTS_LIMIT)
              const hasMore = sortedProducts.length > HOME_PRODUCTS_LIMIT

              return (
                <div key={category.id}>
                  <section className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-lg font-bold text-foreground">
                        {category.name}
                      </h2>
                      <PriceFilter
                        value={currentFilter}
                        onChange={(val) => setCategoryFilters(prev => ({ ...prev, [category.id]: val }))}
                      />
                    </div>
                    {isHorizontal ? (
                      <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide snap-x snap-mandatory">
                        {limitedProducts.map((product, index) => (
                          <div key={product.id} className="flex-shrink-0 w-[42vw] max-w-[180px] snap-start">
                            <FeaturedProductCard
                              product={product}
                              index={index}
                              onClick={() => setSelectedProduct(product)}
                            />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {limitedProducts.map((product, index) => (
                          <CompactProductCard
                            key={product.id}
                            product={product}
                            index={index}
                            onClick={() => setSelectedProduct(product)}
                          />
                        ))}
                      </div>
                    )}
                    {hasMore && (
                      <button
                        type="button"
                        onClick={() => handleCategoryChange(category.id)}
                        className="mt-4 w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl
                          bg-secondary/60 hover:bg-secondary text-foreground font-medium text-sm
                          transition-all duration-200 hover:scale-[1.01] active:scale-[0.99]"
                      >
                        Ver todos ({sortedProducts.length} produtos)
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    )}
                  </section>
                </div>
              )
            })}
          </>
        ) : (
          <section id="category-products">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-foreground">
                {categories.find((c) => c.id === activeCategory)?.name}
              </h2>
              <PriceFilter
                value={categoryFilters[activeCategory] ?? "default"}
                onChange={(val) => setCategoryFilters(prev => ({ ...prev, [activeCategory]: val }))}
              />
            </div>
            <div className="space-y-3">
              {(sortProducts(
                getCategoryProducts(activeCategory),
                categoryFilters[activeCategory] ?? "default"
              ) as Product[]).map((product, index) => (
                <CompactProductCard
                  key={product.id}
                  product={product}
                  index={index}
                  onClick={() => setSelectedProduct(product)}
                />
              ))}
              {getCategoryProducts(activeCategory).length === 0 && (
                <p className="text-sm text-muted-foreground py-8 text-center">
                  Nenhum produto encontrado nesta categoria.
                </p>
              )}
            </div>
          </section>
        )}

        <AboutUs />
        <ReviewsSection />

        {/* Footer */}
        <Footer />
      </main>

      <PendingOrdersButton onClick={() => setShowPendingOrders(true)} />
      <CartButton onClick={() => setIsCartOpen(true)} isCartOpen={isCartOpen} />
      <CartDrawer 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        onNavigateToCategory={handleCategoryChange}
      />

      {selectedProduct && (
        <ProductDetail
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onSelectProduct={(p) => setSelectedProduct(p)}
        />
      )}

      {showPendingOrders && (
        <PendingOrdersModal onClose={() => setShowPendingOrders(false)} />
      )}

      {showLocationPopup && (
        <LocationPopup
          onClose={() => setShowLocationPopup(false)}
          onLocationSet={handleLocationSet}
        />
      )}

      {openCombo && (
        <UpsellCombo
          startOpen
          onAddCombo={(comboItems, comboPrice) => {
            addCombo(comboItems, comboPrice)
            setOpenCombo(false)
          }}
          onCancelEdit={() => setOpenCombo(false)}
        />
      )}
    </div>
  )
}

export default function Page() {
  return (
    <CartProvider>
      <DeliveryApp />
    </CartProvider>
  )
}
