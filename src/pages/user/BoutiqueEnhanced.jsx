import React, { useState, useMemo } from 'react';
import { ShoppingCart, Search, X, Minus, Plus, Trash2, Check, CreditCard, Loader2 } from 'lucide-react';
import PRODUCTS from '../../data/products.json';
// Données produits (simulant l'import depuis ../../data/products.json)
/*const PRODUCTS = [
  {
    "id": 1,
    "name": "Mug MCN",
    "description": "Mug en céramique blanche avec logo MCN",
    "price": 5000,
    "images": [
      "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1517256064527-09c73fc73e38?q=80&w=600&auto=format&fit=crop"
    ],
    "stock": 25,
    "category": "Accessoires"
  },
  {
    "id": 2,
    "name": "T-Shirt MCN",
    "description": "T-shirt 100% coton avec motif artistique",
    "price": 8000,
    "images": [
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1503341504253-dff4815485f1?q=80&w=600&auto=format&fit=crop"
    ],
    "stock": 40,
    "category": "Textile"
  },
  {
    "id": 3,
    "name": "Poster Œuvre Classique",
    "description": "Affiche A2 reproduction d'une œuvre emblématique",
    "price": 3500,
    "images": [
      "https://images.unsplash.com/photo-1513519245088-0e12902e35ca?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=600&auto=format&fit=crop"
    ],
    "stock": 15,
    "category": "Papeterie"
  },
  {
    "id": 4,
    "name": "Totebag MCN",
    "description": "Sac en toile robuste avec motif MCN",
    "price": 4500,
    "images": [
      "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1598532163257-ae3c6b2524b6?q=80&w=600&auto=format&fit=crop"
    ],
    "stock": 30,
    "category": "Textile"
  },
  {
    "id": 5,
    "name": "Carnet de Notes",
    "description": "Carnet élégant 120 pages avec couverture illustrée",
    "price": 2500,
    "images": [
      "https://images.unsplash.com/photo-1531346878377-a5be20888e57?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1600788907416-456578634209?q=80&w=600&auto=format&fit=crop"
    ],
    "stock": 50,
    "category": "Papeterie"
  },
  {
    "id": 6,
    "name": "Porte-clés MCN",
    "description": "Porte-clés en métal avec logo gravé",
    "price": 1500,
    "images": [
      "https://images.unsplash.com/photo-1616432043562-3671ea2e5242?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1610633389918-7d5b4c9e0d4b?q=80&w=600&auto=format&fit=crop"
    ],
    "stock": 60,
    "category": "Accessoires"
  },
  {
    "id": 7,
    "name": "Sweat à Capuche",
    "description": "Sweat confortable avec logo brodé",
    "price": 15000,
    "images": [
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=600&auto=format&fit=crop"
    ],
    "stock": 20,
    "category": "Textile"
  },
  {
    "id": 8,
    "name": "Set de Cartes Postales",
    "description": "Coffret de 10 cartes postales illustrées",
    "price": 3000,
    "images": [
      "https://images.unsplash.com/photo-1569838305737-22cd6f0cda5b?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1506619216599-9d16d0903dfd?q=80&w=600&auto=format&fit=crop"
    ],
    "stock": 35,
    "category": "Papeterie"
  },
  {
    "id": 9,
    "name": "Casquette MCN",
    "description": "Casquette ajustable avec logo brodé",
    "price": 6000,
    "images": [
      "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1575428652377-a2d80e2277fc?q=80&w=600&auto=format&fit=crop"
    ],
    "stock": 45,
    "category": "Accessoires"
  },
  {
    "id": 10,
    "name": "Poster Moderne",
    "description": "Affiche A1 collection contemporaine",
    "price": 5500,
    "images": [
      "https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?q=80&w=600&auto=format&fit=crop"
    ],
    "stock": 18,
    "category": "Papeterie"
  },
  {
    "id": 11,
    "name": "Sac à Dos MCN",
    "description": "Sac à dos spacieux et résistant",
    "price": 12000,
    "images": [
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?q=80&w=600&auto=format&fit=crop"
    ],
    "stock": 22,
    "category": "Textile"
  },
  {
    "id": 12,
    "name": "Magnets Collection",
    "description": "Set de 5 magnets avec œuvres célèbres",
    "price": 2000,
    "images": [
      "https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?q=80&w=600&auto=format&fit=crop"
    ],
    "stock": 70,
    "category": "Accessoires"
  }
];*/

function ProductCarousel({ images }) {
  const [current, setCurrent] = useState(0);
  return (
    <div className="relative w-full h-48 rounded-xl overflow-hidden bg-gray-100">
      <img
        src={images[current]}
        alt="Produit"
        className="w-full h-full object-cover transition-all duration-500"
      />
      {images.length > 1 && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2">
          {images.map((_, idx) => (
            <button
              key={idx}
              className={`w-2 h-2 rounded-full transition-all ${
                current === idx ? 'bg-orange-600 w-6' : 'bg-white/70'
              }`}
              onClick={() => setCurrent(idx)}
              aria-label={`Image ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function ProductCard({ product, onAddToCart }) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 p-4 flex flex-col group">
      <ProductCarousel images={product.images} />
      <h3 className="mt-3 text-base font-bold text-gray-900 group-hover:text-orange-600 transition-colors line-clamp-1">
        {product.name}
      </h3>
      <p className="text-sm text-gray-600 mt-1 mb-3 line-clamp-2 flex-grow">
        {product.description}
      </p>
      <div className="flex items-center justify-between mt-auto">
        <span className="font-bold text-lg text-orange-600">
          {product.price.toLocaleString()} Fcfa
        </span>
        <button
          onClick={() => onAddToCart(product)}
          className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-all duration-300 text-sm font-medium"
        >
          Ajouter
        </button>
      </div>
    </div>
  );
}

function CartModal({ cart, onClose, onUpdateQty, onRemove, onCheckout }) {
  const total = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">
            Panier ({itemCount} {itemCount > 1 ? 'articles' : 'article'})
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {cart.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              Votre panier est vide
            </div>
          ) : (
            cart.map(({ product, quantity }) => (
              <div key={product.id} className="flex gap-4 bg-gray-50 p-4 rounded-xl">
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-20 h-20 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{product.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">{product.price.toLocaleString()} Fcfa</p>
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => onUpdateQty(product.id, quantity - 1)}
                      className="w-7 h-7 rounded-full bg-white border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-8 text-center font-medium">{quantity}</span>
                    <button
                      onClick={() => onUpdateQty(product.id, quantity + 1)}
                      className="w-7 h-7 rounded-full bg-white border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => onRemove(product.id)}
                      className="ml-auto text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                <div className="text-right font-semibold text-gray-900">
                  {(product.price * quantity).toLocaleString()} Fcfa
                </div>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className="p-6 border-t border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <span className="text-lg font-semibold text-gray-700">Total</span>
              <span className="text-2xl font-bold text-orange-600">
                {total.toLocaleString()} Fcfa
              </span>
            </div>
            <button
              onClick={onCheckout}
              className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-all font-semibold flex items-center justify-center gap-2"
            >
              <CreditCard className="w-5 h-5" />
              Valider la commande
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function PaymentModal({ onClose, onComplete }) {
  const [step, setStep] = useState('select');
  const [cardData, setCardData] = useState({ number: '', name: '', exp: '', cvc: '' });

  const handlePaymentMethod = (method) => {
    if (method === 'card') {
      setStep('card');
    } else {
      setStep('loading');
      setTimeout(() => {
        setStep('success');
      }, 2000);
    }
  };

  const handleCardSubmit = (e) => {
    e.preventDefault();
    setStep('loading');
    setTimeout(() => {
      setStep('success');
    }, 2000);
  };

  const handleSuccess = () => {
    onComplete();
    onClose();
  };

  if (step === 'select') {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full">
          <h2 className="text-2xl font-bold mb-6 text-gray-900">Mode de paiement</h2>
          <div className="space-y-3">
            <button
              onClick={() => handlePaymentMethod('wave')}
              className="w-full bg-blue-500 text-white py-4 rounded-xl font-semibold hover:bg-blue-600 transition flex items-center justify-center gap-3"
            >
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-blue-500 font-bold">W</div>
              Wave
            </button>
            <button
              onClick={() => handlePaymentMethod('orange')}
              className="w-full bg-orange-500 text-white py-4 rounded-xl font-semibold hover:bg-orange-600 transition flex items-center justify-center gap-3"
            >
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-orange-500 font-bold">OM</div>
              Orange Money
            </button>
            <button
              onClick={() => handlePaymentMethod('card')}
              className="w-full bg-gray-800 text-white py-4 rounded-xl font-semibold hover:bg-gray-900 transition flex items-center justify-center gap-3"
            >
              <CreditCard className="w-5 h-5" />
              Carte bancaire
            </button>
          </div>
          <button
            onClick={onClose}
            className="w-full mt-6 bg-gray-200 text-gray-800 py-3 rounded-xl hover:bg-gray-300 transition font-medium"
          >
            Annuler
          </button>
        </div>
      </div>
    );
  }

  if (step === 'card') {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full">
          <h2 className="text-2xl font-bold mb-6 text-gray-900">Paiement par carte</h2>
          <form onSubmit={handleCardSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Numéro de carte
              </label>
              <input
                type="text"
                required
                placeholder="1234 5678 9012 3456"
                value={cardData.number}
                onChange={(e) => setCardData({ ...cardData, number: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
                maxLength={19}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nom sur la carte
              </label>
              <input
                type="text"
                required
                placeholder="JEAN DUPONT"
                value={cardData.name}
                onChange={(e) => setCardData({ ...cardData, name: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date d'expiration
                </label>
                <input
                  type="text"
                  required
                  placeholder="MM/AA"
                  value={cardData.exp}
                  onChange={(e) => setCardData({ ...cardData, exp: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  maxLength={5}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  CVC
                </label>
                <input
                  type="text"
                  required
                  placeholder="123"
                  value={cardData.cvc}
                  onChange={(e) => setCardData({ ...cardData, cvc: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  maxLength={4}
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition font-semibold mt-6"
            >
              Valider le paiement
            </button>
          </form>
          <button
            onClick={() => setStep('select')}
            className="w-full mt-4 bg-gray-200 text-gray-800 py-3 rounded-lg hover:bg-gray-300 transition font-medium"
          >
            Retour
          </button>
        </div>
      </div>
    );
  }

  if (step === 'loading') {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl p-12 max-w-md w-full text-center">
          <Loader2 className="w-16 h-16 text-orange-600 animate-spin mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Traitement en cours...
          </h3>
          <p className="text-gray-600">Veuillez patienter</p>
        </div>
      </div>
    );
  }

  if (step === 'success') {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl p-12 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-green-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">
            Paiement réussi !
          </h3>
          <p className="text-gray-600 mb-8">
            Votre commande a été confirmée. Vous recevrez un email de confirmation.
          </p>
          <button
            onClick={handleSuccess}
            className="w-full bg-orange-600 text-white py-3 rounded-lg hover:bg-orange-700 transition font-semibold"
          >
            Continuer mes achats
          </button>
        </div>
      </div>
    );
  }

  return null;
}

export default function Boutique() {
  const [cart, setCart] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('Tout');
  const [priceFilter, setPriceFilter] = useState('all');
  const [showCart, setShowCart] = useState(false);
  const [showPayment, setShowPayment] = useState(false);

  const categories = useMemo(
    () => ['Tout', ...Array.from(new Set(PRODUCTS.map((p) => p.category)))],
    []
  );

  const filteredProducts = useMemo(() => {
    let filtered = PRODUCTS;

    if (categoryFilter !== 'Tout') {
      filtered = filtered.filter(p => p.category === categoryFilter);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query)
      );
    }

    if (priceFilter !== 'all') {
      filtered = filtered.filter(p => {
        if (priceFilter === 'low') return p.price < 3000;
        if (priceFilter === 'medium') return p.price >= 3000 && p.price <= 8000;
        if (priceFilter === 'high') return p.price > 8000;
        return true;
      });
    }

    return filtered;
  }, [categoryFilter, searchQuery, priceFilter]);

  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.product.id === product.id);
      if (existing) {
        return prev.map((i) =>
          i.product.id === product.id
            ? { ...i, quantity: Math.min(i.quantity + 1, product.stock) }
            : i
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const updateQty = (productId, quantity) => {
    if (quantity <= 0) {
      return removeFromCart(productId);
    }
    const product = PRODUCTS.find(p => p.id === productId);
    setCart((prev) =>
      prev.map((i) =>
        i.product.id === productId
          ? { ...i, quantity: Math.min(quantity, product.stock) }
          : i
      )
    );
  };

  const removeFromCart = (productId) => {
    setCart((prev) => prev.filter((i) => i.product.id !== productId));
  };

  const cartCount = useMemo(() => cart.reduce((sum, i) => sum + i.quantity, 0), [cart]);

  const handleCheckout = () => {
    setShowCart(false);
    setShowPayment(true);
  };

  const handlePaymentComplete = () => {
    setCart([]);
    setShowPayment(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between gap-4">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              Boutique MCN
            </h1>
            <button
              onClick={() => setShowCart(true)}
              className="relative bg-orange-600 text-white p-3 rounded-full hover:bg-orange-700 transition shadow-lg"
            >
              <ShoppingCart className="w-6 h-6" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher un produit..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === 'Tout' ? 'Toutes les catégories' : cat}
                </option>
              ))}
            </select>

            <select
              value={priceFilter}
              onChange={(e) => setPriceFilter(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
            >
              <option value="all">Tous les prix</option>
              <option value="low">Moins de 3 000 Fcfa</option>
              <option value="medium">3 000 - 8 000 Fcfa</option>
              <option value="high">Plus de 8 000 Fcfa</option>
            </select>
          </div>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-xl text-gray-500">Aucun produit trouvé</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={addToCart}
              />
            ))}
          </div>
        )}
      </div>

      {showCart && (
        <CartModal
          cart={cart}
          onClose={() => setShowCart(false)}
          onUpdateQty={updateQty}
          onRemove={removeFromCart}
          onCheckout={handleCheckout}
        />
      )}

      {showPayment && (
        <PaymentModal
          onClose={() => setShowPayment(false)}
          onComplete={handlePaymentComplete}
        />
      )}
    </div>
  );
}