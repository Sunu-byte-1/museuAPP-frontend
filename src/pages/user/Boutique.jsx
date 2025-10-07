// Imports nécessaires
import React, { useState, useMemo } from 'react';
import { ShoppingCart, CreditCard, Eye, X, Minus, Plus, Trash2, Check, Tag } from 'lucide-react';

// Déclaration du tableau de produits
const SAMPLE_PRODUCTS = [
	{
		id: 1,
		name: 'Mug MCN',
		description: 'Mug en céramique, logo MCN',
		price: 10,
		images: [
			'https://images.unsplash.com/photo-1504196606672-aef5c9cefc92?q=80&w=600&auto=format&fit=crop',
			'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?q=80&w=600&auto=format&fit=crop',
		],
		stock: 25,
		category: 'Accessoires',
	},
	{
		id: 3,
		name: 'Poster Œuvre',
		description: 'Affiche A2 d’une œuvre emblématique',
		price: 15,
		images: [
			'https://images.unsplash.com/photo-1504196606672-aef5c9cefc92?q=80&w=600&auto=format&fit=crop',
			'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?q=80&w=600&auto=format&fit=crop',
		],
		stock: 15,
		category: 'Papeterie',
	},
	{
		id: 4,
		name: 'Totebag MCN',
		description: 'Sac en toile robuste, motif MCN',
		price: 18,
		images: [
			'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=600&auto=format&fit=crop',
			'https://images.unsplash.com/photo-1520975682031-ae4c9b5e2f5b?q=80&w=600&auto=format&fit=crop',
		],
		stock: 30,
		category: 'Textile',
	},
];

// Carousel d'images pour chaque produit
function ProductCarousel({ images }) {
	const [current, setCurrent] = useState(0);
	return (
		<div className="relative w-full h-48 rounded-xl overflow-hidden">
			<img
				src={images[current]}
				alt="Produit"
				className="w-full h-full object-cover transition-all duration-500 ease-in-out"
			/>
			<div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2">
				{images.map((_, idx) => (
					<button
						key={idx}
						className={`w-3 h-3 rounded-full border border-white bg-white/70 ${
							current === idx ? 'scale-125 bg-orange-600' : ''
						} transition-all duration-300`}
						onClick={() => setCurrent(idx)}
						aria-label={`Voir image ${idx + 1}`}
					/>
				))}
			</div>
		</div>
	);
}

// Carte produit
function ProductCard({ product, onViewDetails }) {
	return (
		<div className="bg-white border border-gray-200 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 flex flex-col items-center group">
			<ProductCarousel images={product.images} />
			<h3 className="mt-4 text-lg font-bold text-gray-900 group-hover:text-orange-600 transition-colors duration-300 text-center">
				{product.name}
			</h3>
			<p className="text-gray-700 text-center mt-2 mb-4">
				{product.description}
			</p>
			<div className="font-semibold text-orange-700 text-xl mb-2">
				{product.price} Fcfa
			</div>
			<button
				className="bg-gray-900 text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-all duration-300 flex items-center gap-2 mt-auto"
				onClick={() => onViewDetails(product)}
			>
				<Eye className="w-4 h-4" /> Voir détails
			</button>
		</div>
	);
}

// Modal de détails produit
function ProductDetailsModal({ product, open, onClose, onAddToCart }) {
	const [qty, setQty] = useState(1);
	if (!open || !product) return null;
	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm transition-opacity duration-300 animate-fade-in">
			<div className="bg-white border border-gray-200 rounded-2xl shadow-2xl max-w-md w-full p-8 relative animate-scale-in">
				<button
					className="absolute top-4 right-4 text-gray-400 hover:text-orange-600 transition"
					onClick={onClose}
					aria-label="Fermer"
				>
					<X className="w-6 h-6" />
				</button>
				<ProductCarousel images={product.images} />
				<h2 className="mt-4 text-2xl font-bold text-gray-900">
					{product.name}
				</h2>
				<p className="text-gray-700 mt-2 mb-4">
					{product.description}
				</p>
				<div className="font-semibold text-orange-700 text-xl mb-2">
					{product.price} Fcfa
				</div>
				<div className="flex items-center gap-2 mb-6">
					<button
						className="bg-gray-200 text-gray-700 rounded-full p-2 hover:bg-gray-300"
						onClick={() => setQty((q) => Math.max(1, q - 1))}
						aria-label="Diminuer la quantité"
					>
						<Minus className="w-4 h-4" />
					</button>
					<span className="font-bold text-lg text-gray-900">{qty}</span>
					<button
						className="bg-gray-200 text-gray-700 rounded-full p-2 hover:bg-gray-300"
						onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
						aria-label="Augmenter la quantité"
					>
						<Plus className="w-4 h-4" />
					</button>
				</div>
				<button
					className="w-full bg-gray-900 text-white py-3 rounded-lg hover:bg-gray-800 transition-all duration-300 flex items-center justify-center gap-2 font-semibold"
					onClick={() => {
						onAddToCart(product, qty);
						onClose();
					}}
				>
					<ShoppingCart className="w-5 h-5" /> Ajouter au panier
				</button>
			</div>
		</div>
	);
}

export default function Boutique() {
	const [cart, setCart] = useState([]);
	const [showCheckout, setShowCheckout] = useState(false);
	const [orderDone, setOrderDone] = useState(false);
	const [filter, setFilter] = useState('Tout');
	const [selected, setSelected] = useState(null);
	const [modalOpen, setModalOpen] = useState(false);
	const [paymentStep, setPaymentStep] = useState('select'); // 'select', 'card', 'loading', 'success'
	const [selectedMethod, setSelectedMethod] = useState(null);
	const [cardForm, setCardForm] = useState({ number: '', name: '', exp: '', cvc: '' });

	const categories = useMemo(
		() => ['Tout', ...Array.from(new Set(SAMPLE_PRODUCTS.map((p) => p.category)))],
		[]
	);
	const visibleProducts = useMemo(
		() =>
			filter === 'Tout'
				? SAMPLE_PRODUCTS
				: SAMPLE_PRODUCTS.filter((p) => p.category === filter),
		[filter]
	);

	// Ajout au panier
	const addToCart = (product, quantity = 1) => {
		setCart((prev) => {
			const existing = prev.find((i) => i.product.id === product.id);
			if (existing) {
				return prev.map((i) =>
					i.product.id === product.id
						? { ...i, quantity: Math.min(i.quantity + quantity, product.stock) }
						: i
				);
			}
			return [...prev, { product, quantity: Math.min(quantity, product.stock) }];
		});
	};

	const updateQty = (productId, quantity) => {
		if (quantity <= 0) {
			return removeFromCart(productId);
		}
		setCart((prev) => prev.map((i) => (i.product.id === productId ? { ...i, quantity } : i)));
	};

	const removeFromCart = (productId) => {
		setCart((prev) => prev.filter((i) => i.product.id !== productId));
	};

	const cartCount = useMemo(() => cart.reduce((acc, i) => acc + i.quantity, 0), [cart]);
	const cartTotal = useMemo(() => cart.reduce((acc, i) => acc + i.product.price * i.quantity, 0), [cart]);

	const handleCheckout = () => {
		if (cart.length === 0) return;
		setShowCheckout(true);
	};

	const confirmOrder = async () => {
		await new Promise((r) => setTimeout(r, 1200));
		setOrderDone(true);
		setShowCheckout(false);
		setCart([]);
	};

	const renderPaymentModal = () => {
		if (!showCheckout) return null;
		if (paymentStep === 'select') {
			return (
				<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
					<div className="bg-white rounded-2xl p-8 max-w-md mx-4 w-full">
						<h2 className="text-2xl font-bold mb-6 text-gray-900">Choisissez un moyen de paiement</h2>
						<div className="flex flex-col gap-4">
							<button onClick={() => { setSelectedMethod('wave'); setPaymentStep('loading'); setTimeout(() => setPaymentStep('success'), 1500); }} className="w-full bg-blue-100 text-blue-900 py-3 rounded-lg font-semibold">Wave</button>
							<button onClick={() => { setSelectedMethod('orange'); setPaymentStep('loading'); setTimeout(() => setPaymentStep('success'), 1500); }} className="w-full bg-orange-100 text-orange-900 py-3 rounded-lg font-semibold">Orange Money</button>
							<button onClick={() => { setSelectedMethod('card'); setPaymentStep('card'); }} className="w-full bg-green-100 text-green-900 py-3 rounded-lg font-semibold">Carte bancaire</button>
						</div>
						<button onClick={() => setShowCheckout(false)} className="w-full mt-6 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition">Annuler</button>
					</div>
				</div>
			);
		}
		if (paymentStep === 'loading') {
			return (
				<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
					<div className="bg-white rounded-2xl p-8 max-w-md mx-4 w-full flex flex-col items-center">
						<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500 mb-6"></div>
						<p className="text-lg text-gray-700">Traitement du paiement...</p>
					</div>
				</div>
			);
		}
		if (paymentStep === 'success') {
			return (
				<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
					<div className="bg-white rounded-2xl p-8 max-w-md mx-4 w-full text-center">
						<div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
							<Check className="w-8 h-8 text-green-600" />
						</div>
						<h2 className="text-2xl font-bold text-gray-900 mb-2">Paiement effectué avec succès</h2>
						<p className="text-gray-600 mb-6">Nous vous enverrons un mail de confirmation.</p>
						<button onClick={() => { setOrderDone(true); setShowCheckout(false); setPaymentStep('select'); setCart([]); }} className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition">Fermer</button>
					</div>
				</div>
			);
		}
		if (paymentStep === 'card') {
			return (
				<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
					<div className="bg-white rounded-2xl p-8 max-w-md mx-4 w-full">
						<h2 className="text-2xl font-bold mb-6 text-gray-900">Paiement par carte bancaire</h2>
						<form onSubmit={e => { e.preventDefault(); setPaymentStep('loading'); setTimeout(() => setPaymentStep('success'), 1500); }} className="flex flex-col gap-4">
							<input type="text" required placeholder="Numéro de carte" value={cardForm.number} onChange={e => setCardForm(f => ({ ...f, number: e.target.value }))} className="border rounded-lg px-3 py-2" maxLength={19} />
							<input type="text" required placeholder="Nom sur la carte" value={cardForm.name} onChange={e => setCardForm(f => ({ ...f, name: e.target.value }))} className="border rounded-lg px-3 py-2" />
							<div className="flex gap-2">
								<input type="text" required placeholder="MM/AA" value={cardForm.exp} onChange={e => setCardForm(f => ({ ...f, exp: e.target.value }))} className="border rounded-lg px-3 py-2 w-1/2" maxLength={5} />
								<input type="text" required placeholder="CVC" value={cardForm.cvc} onChange={e => setCardForm(f => ({ ...f, cvc: e.target.value }))} className="border rounded-lg px-3 py-2 w-1/2" maxLength={4} />
							</div>
							<button type="submit" className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition">Valider le paiement</button>
						</form>
						<button onClick={() => setPaymentStep('select')} className="w-full mt-4 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition">Retour</button>
					</div>
				</div>
			);
		}
		return null;
	};

	if (orderDone) {
		return (
			<div className="min-h-screen bg-[#f5f4ef] flex items-center justify-center">
				<div className="bg-white rounded-2xl shadow-xl p-8 max-w-md mx-4 text-center">
					<div className="w-16 h-16 bg-green-100  rounded-full flex items-center justify-center mx-auto mb-4">
						<Check className="w-8 h-8 text-green-600" />
					</div>
					<h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
						Commande confirmée
					</h2>
					<p className="text-gray-600 dark:text-gray-300 mb-6">
						Merci pour votre achat. Vous recevrez un email de confirmation.
					</p>
					<button
						onClick={() => setOrderDone(false)}
						className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition"
					>
						Continuer vos achats
					</button>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-white transition-colors duration-500">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
				<div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
					<div>
						<h1 className="text-3xl md:text-4xl font-bold text-gray-900">
							Boutique
						</h1>
						<p className="text-gray-700">
							Objets et souvenirs officiels du musée
						</p>
					</div>
					<div className="flex items-center gap-3">
						<div className="flex items-center gap-2 bg-gray-100 border border-white rounded-lg px-3 py-2">
							<Tag className="w-4 h-4 text-gray-500" />
							<select
								value={filter}
								onChange={(e) => setFilter(e.target.value)}
								className="bg-transparent text-sm text-gray-900 rounded-3 focus:outline-none"
							>
								{categories.map((c) => (
									<option key={c} value={c} className="text-gray-900">
										{c}
									</option>
								))}
							</select>
						</div>
						<div className="flex items-center gap-2 bg-gray-100 border border-gray-200 rounded-lg px-3 py-2">
							<ShoppingCart className="w-4 h-4" />
							<span className="text-sm text-gray-900">
								{cart.reduce((acc, i) => acc + i.quantity, 0)} article
								{cart.length > 1 ? 's' : ''}
							</span>
						</div>
					</div>
				</div>

				{/* Grille produits */}
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
					{visibleProducts.map((product) => (
						<ProductCard
							key={product.id}
							product={product}
							onViewDetails={(p) => {
								setSelected(p);
								setModalOpen(true);
							}}
						/>
					))}
				</div>

				{/* Modal détails produit */}
				<ProductDetailsModal
					product={selected}
					open={modalOpen}
					onClose={() => setModalOpen(false)}
					onAddToCart={addToCart}
				/>

				<div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
					<div className="lg:col-span-2">
						{cart.length === 0 ? (
							<div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-8 text-center text-gray-500 dark:text-gray-400">
								Votre panier est vide
							</div>
						) : (
							<div className="space-y-4">
								{cart.map(({ product, quantity }) => (
									<div
										key={product.id}
										className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-5 flex items-center justify-between"
									>
										<div className="flex items-center gap-4">
											<img
												src={product.image}
												alt={product.name}
												className="w-16 h-16 object-cover rounded-lg"
											/>
											<div>
												<div className="font-medium text-gray-900 dark:text-white">
													{product.name}
												</div>
												<div className="text-sm text-gray-500">
													{product.price}€
												</div>
											</div>
										</div>
										<div className="flex items-center gap-2">
											<button
												onClick={() => updateQty(product.id, quantity - 1)}
												className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center hover:bg-gray-300 dark:hover:bg-gray-600"
											>
												<Minus className="w-4 h-4" />
											</button>
											<span className="w-8 text-center">{quantity}</span>
											<button
												onClick={() =>
													updateQty(product.id, Math.min(quantity + 1, product.stock))
												}
												className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center hover:bg-gray-300 dark:hover:bg-gray-600"
											>
												<Plus className="w-4 h-4" />
											</button>
											<button
												onClick={() => removeFromCart(product.id)}
												className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center hover:bg-red-200 dark:hover:bg-red-800 text-red-600"
											>
												<Trash2 className="w-4 h-4" />
											</button>
										</div>
									</div>
								))}
							</div>
						)}
					</div>

					<button onClick={handleCheckout} disabled={cart.length === 0} className="mt-4 w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center">
						<CreditCard className="w-5 h-5 mr-2" />
						Procéder au paiement
					</button>
				</div>
			</div>
			{renderPaymentModal()}
		</div>
	);
}
