import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, ChevronRight, Menu, X, AlertCircle, Trash2, CreditCard, ShieldCheck, CheckCircle } from 'lucide-react';

// --- Constants ---
const ETB_RATE = 129; 

const GAME_CATEGORIES = ["Sensory Space", "Communication Skill", "Daily Routine"];

const ALL_GAMES_LIST = [
  { id: 1, category: "Sensory Space", name: 'Calm Garden', desc: 'Soothing sandbox for self-regulation.', price: 4.99, img: 'https://images.unsplash.com/photo-1617174620573-030919b52a55?w=600' },
  { id: 2, category: "Sensory Space", name: 'Texture Quest', desc: 'Explore digital textures.', price: 3.99, img: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=600' },
  { id: 3, category: "Sensory Space", name: 'Sound Safari', desc: 'Gentle nature sounds for focus.', price: 5.50, img: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600' },
  { id: 4, category: "Communication Skill", name: 'Greeting Grove', desc: 'Master friendly introductions.', price: 4.99, img: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=600' },
  { id: 5, category: "Communication Skill", name: 'Emoji Explorer', desc: 'Understand human emotions.', price: 3.99, img: 'https://images.unsplash.com/photo-1599305090598-fe179d501227?w=600' },
  { id: 6, category: "Communication Skill", name: 'Sentence Builder', desc: 'Tools for forming clear requests.', price: 5.99, img: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=600' },
  { id: 7, category: "Daily Routine", name: 'Mighty Morning', desc: 'Morning routines like a superhero!', price: 4.49, img: 'https://images.unsplash.com/photo-1627918451163-f2bd34346e91?w=600' },
  { id: 8, category: "Daily Routine", name: 'Clean Hands Club', desc: 'Step-by-step visual hygiene guide.', price: 2.99, img: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600' },
  { id: 9, category: "Daily Routine", name: 'Bedtime Beacon', desc: 'Interactive sleep preparation.', price: 4.00, img: 'https://images.unsplash.com/photo-1520206159579-53d3d29bb442?w=600' },
];

// --- Visa Validation Logic (Luhn Algorithm) ---
const validateVisa = (number) => {
  const cleanNumber = number.replace(/\s/g, "");
  // Visa must start with 4 and be 16 digits
  if (!/^4[0-9]{15}$/.test(cleanNumber)) return false;
  
  let sum = 0;
  let shouldDouble = false;
  for (let i = cleanNumber.length - 1; i >= 0; i--) {
    let digit = parseInt(cleanNumber.charAt(i));
    if (shouldDouble) {
      if ((digit *= 2) > 9) digit -= 9;
    }
    sum += digit;
    shouldDouble = !shouldDouble;
  }
  return sum % 10 === 0;
};

// --- Custom Slider Component (Replaces react-responsive-carousel) ---
const CustomSlider = () => {
  const slides = [
    "../img/landing_pic.png",
    "../img/landing_pic2.png"
  ];
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative h-64 md:h-[400px] w-full overflow-hidden rounded-[40px] shadow-2xl">
      {slides.map((s, i) => (
        <div 
          key={i} 
          className={`absolute inset-0 transition-opacity duration-1000 ${i === current ? 'opacity-100' : 'opacity-0'}`}
        >
          <img src={s} className="h-full w-full object-cover" alt={`Slide ${i}`} />
        </div>
      ))}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, i) => (
          <div key={i} className={`h-1.5 w-6 rounded-full ${i === current ? 'bg-white' : 'bg-white/30'}`} />
        ))}
      </div>
    </div>
  );
};

// --- Components ---

const PriceDisplay = ({ usd, className = "" }) => (
  <div className={`text-left ${className}`}>
    <span className="text-lg font-black text-neutral-900">${usd.toFixed(2)}</span>
    <span className="text-xs font-bold text-red-600 block leading-tight">/ {(usd * ETB_RATE).toFixed(0)} ETB</span>
  </div>
);

function VisaPaymentView({ total, onBack, onComplete }) {
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const formatCardNumber = (val) => {
    const v = val.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const parts = [];
    for (let i = 0; i < v.length; i += 4) {
      parts.push(v.substring(i, i + 4));
    }
    return parts.join(' ').substring(0, 19);
  };

  const handlePayment = () => {
    setLoading(true);
    setError("");
    
    // Simulate Processing
    setTimeout(() => {
      if (validateVisa(cardNumber)) {
        onComplete();
      } else {
        setError("Invalid Visa Card.and is a valid card number.");
      }
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-right-4">
      <button onClick={onBack} className="text-xs font-bold text-neutral-400 hover:text-red-600 flex items-center gap-1">
        <ChevronRight className="rotate-180 w-4 h-4" /> Back to Summary
      </button>

      <div className="bg-gradient-to-br from-neutral-800 to-black p-6 rounded-[24px] text-white shadow-xl relative overflow-hidden h-44 flex flex-col justify-between">
        <div className="flex justify-between items-start">
          <ShieldCheck className="w-8 h-8 opacity-50" />
          <span className="text-[10px] font-black tracking-widest opacity-40 uppercase">Visa Credit</span>
        </div>
        <div className="text-xl font-mono tracking-widest text-center py-2 bg-white/5 rounded-lg border border-white/10">
          {cardNumber || "4000 0000 0000 0000"}
        </div>
        <div className="flex justify-between items-end text-[10px] font-bold opacity-60 uppercase">
          <span>Card Holder</span>
          <span>Exp: {expiry || "MM/YY"}</span>
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-1">
          <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest ml-1">Card Number</label>
          <input 
            value={cardNumber}
            onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
            placeholder="4XXX XXXX XXXX XXXX" 
            className="w-full bg-neutral-100 p-4 rounded-2xl border-2 border-transparent focus:border-red-600 outline-none font-mono"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest ml-1">Expiry</label>
            <input 
              value={expiry}
              onChange={(e) => setExpiry(e.target.value)}
              placeholder="MM/YY" 
              className="w-full bg-neutral-100 p-4 rounded-2xl border-2 border-transparent focus:border-red-600 outline-none" 
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest ml-1">CVV</label>
            <input 
              value={cvv}
              onChange={(e) => setCvv(e.target.value)}
              placeholder="***" 
              type="password"
              maxLength={3}
              className="w-full bg-neutral-100 p-4 rounded-2xl border-2 border-transparent focus:border-red-600 outline-none" 
            />
          </div>
        </div>
      </div>

      {error && <p className="text-red-600 text-xs font-black bg-red-50 p-3 rounded-xl border border-red-100 italic">{error}</p>}

      <button 
        disabled={loading}
        onClick={handlePayment} 
        className="w-full bg-red-600 text-white py-4 rounded-2xl font-black text-lg shadow-lg disabled:opacity-50"
      >
        {loading ? "Verifying..." : `Pay $${total.toFixed(2)}`}
      </button>
    </div>
  );
}

function CartDrawer({ isOpen, onClose, cart, onRemove, onClear }) {
  const [view, setView] = useState('cart');
  const total = cart.reduce((sum, item) => sum + item.price, 0);

  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => setView('cart'), 300);
    }
  }, [isOpen]);

  return (
    <>
      <div className={`fixed inset-0 bg-black/40 z-[110] transition-opacity ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`} onClick={onClose} />
      <div className={`fixed right-0 top-0 h-full w-full max-w-sm bg-white z-[120] shadow-2xl transition-transform duration-300 transform ${isOpen ? 'translate-x-0' : 'translate-x-full'} flex flex-col`}>
        <div className="p-6 border-b flex justify-between items-center bg-neutral-50">
          <h2 className="text-2xl font-black">{view === 'success' ? 'Confirmed' : 'Your Cart'}</h2>
          <button onClick={onClose} className="p-2 hover:bg-red-50 rounded-full text-red-600"><X /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {view === 'cart' && (
            cart.length === 0 ? (
              <div className="text-center mt-20">
                <ShoppingCart size={60} className="mx-auto text-neutral-200 mb-4" />
                <p className="text-neutral-500 font-bold">Your cart is empty.</p>
                <button onClick={onClose} className="mt-4 text-red-600 font-black underline">Keep Shopping</button>
              </div>
            ) : (
              <div className="space-y-6">
                {cart.map((item, idx) => (
                  <div key={idx} className="flex gap-4 items-center border-b pb-4 animate-in slide-in-from-right-4">
                    <img src={item.img} className="w-16 h-16 rounded-xl object-cover" />
                    <div className="flex-1">
                      <h4 className="font-bold text-sm">{item.name}</h4>
                      <PriceDisplay usd={item.price} />
                    </div>
                    <button onClick={() => onRemove(idx)} className="text-neutral-400 hover:text-red-600"><Trash2 size={18} /></button>
                  </div>
                ))}
              </div>
            )
          )}

          {view === 'payment' && (
            <VisaPaymentView total={total} onBack={() => setView('cart')} onComplete={() => setView('success')} />
          )}

          {view === 'success' && (
            <div className="text-center py-12 animate-in zoom-in-95">
              <CheckCircle size={80} className="text-green-500 mx-auto mb-6" />
              <h3 className="text-2xl font-black mb-2">Payment Received!</h3>
              <p className="text-neutral-500 font-medium mb-8">Your games are now ready in your library.</p>
              <button 
                onClick={() => { onClear(); onClose(); }} 
                className="w-full bg-neutral-900 text-white py-4 rounded-2xl font-black"
              >
                Go to My Games
              </button>
            </div>
          )}
        </div>

        {view === 'cart' && cart.length > 0 && (
          <div className="p-6 bg-neutral-50 border-t">
            <div className="flex justify-between items-center mb-6">
              <span className="text-neutral-500 font-bold uppercase text-sm tracking-widest">Total Cost</span>
              <PriceDisplay usd={total} className="text-right" />
            </div>
            <button 
              onClick={() => setView('payment')}
              className="w-full bg-red-600 text-white py-4 rounded-2xl font-black flex items-center justify-center gap-3 shadow-lg shadow-red-200"
            >
              <CreditCard size={20} /> Checkout Now
            </button>
          </div>
        )}
      </div>
    </>
  );
}

function LoginModal({ onClose, cartCount }) {
  const navigate = useNavigate();
  const [status, setStatus] = useState('form');

  const handleAction = () => {
    if (cartCount === 0) {
      setStatus('redirecting');
      setTimeout(() => { onClose(); navigate('/games'); }, 3500);
    } else {
      alert("Proceeding to secure login...");
    }
  };

  return (
    <div className="fixed inset-0 bg-neutral-900/80 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
      <div className="bg-white rounded-[40px] w-full max-w-md p-8 shadow-2xl animate-in zoom-in-95 duration-300 text-center">
        {status === 'form' ? (
          <>
            <h2 className="text-3xl font-black mb-8">Sign In</h2>
            <button onClick={handleAction} className="w-full border-2 py-4 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-neutral-50 transition-all mb-4">
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5" alt="G" /> Continue with Google
            </button>
            <div className="my-6 flex items-center gap-2"><div className="h-px bg-neutral-100 flex-1"/> <span className="text-xs font-bold text-neutral-400">OR</span> <div className="h-px bg-neutral-100 flex-1"/></div>
            <input type="email" placeholder="Email" className="w-full bg-neutral-50 p-4 rounded-2xl mb-3 border border-neutral-100 focus:outline-red-600" />
            <input type="password" placeholder="Password" className="w-full bg-neutral-50 p-4 rounded-2xl mb-6 border border-neutral-100 focus:outline-red-600" />
            <button onClick={handleAction} className="w-full bg-red-600 text-white py-4 rounded-2xl font-black text-lg">Log In</button>
            <button onClick={onClose} className="mt-4 text-neutral-400 font-bold text-sm">Cancel</button>
          </>
        ) : (
          <div className="py-10">
            <AlertCircle size={60} className="mx-auto text-red-600 mb-6 animate-bounce" />
            <h2 className="text-2xl font-black mb-2">First you have to buy games</h2>
            <p className="text-neutral-500 font-medium leading-relaxed">Login is only for customers. Redirecting to our game store...</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function App() {
  const [cart, setCart] = useState([]);
  const [isLoginOpen, setLoginOpen] = useState(false);
  const [isCartOpen, setCartOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("Sensory Space");

  const removeFromCart = (index) => {
    setCart(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <Router>
      <div className="min-h-screen bg-white font-sans selection:bg-red-100 selection:text-red-600">
        
        <CartDrawer 
          isOpen={isCartOpen} 
          onClose={() => setCartOpen(false)} 
          cart={cart} 
          onRemove={removeFromCart} 
          onClear={() => setCart([])}
        />
        {isLoginOpen && <LoginModal cartCount={cart.length} onClose={() => setLoginOpen(false)} />}

        <header className="bg-white px-4 md:px-8 py-5 flex items-center justify-between sticky top-0 z-[100] border-b border-neutral-50">
          <Link to="/"><img src="../img/Lifeline_Addis_Logo_English.png" alt="Logo" className="h-12 md:h-15" onError={(e) => (e.currentTarget.src = "https://via.placeholder.com/150x50?text=LOGO")} /></Link>
          <nav className="hidden md:flex gap-10 font-bold text-neutral-600">
            <Link to="/" className="hover:text-red-600">Home</Link>
            <Link to="/games" className="hover:text-red-600">Games</Link>
          </nav>
          <div className="flex items-center gap-3">
            <button onClick={() => setCartOpen(true)} className="relative p-2 bg-neutral-50 rounded-full transition-transform active:scale-95">
              <ShoppingCart className="w-6 h-6 text-neutral-800" />
              {cart.length > 0 && <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-black animate-in zoom-in">{cart.length}</span>}
            </button>
            <button onClick={() => setLoginOpen(true)} className="bg-red-600 text-white px-7 py-2.5 rounded-full font-black text-sm shadow-md">Login</button>
          </div>
        </header>

        <Routes>
          <Route path="/" element={
            <main className="p-4 md:p-10 animate-in fade-in duration-500">
              <div className="max-w-7xl mx-auto bg-red-600 rounded-[40px] md:rounded-[60px] p-8 md:p-20 flex flex-col md:flex-row items-center gap-12 text-white shadow-2xl">
                <div className="flex-1 text-center md:text-left">
                  <h2 className="text-4xl md:text-7xl font-black mb-6 leading-tight tracking-tighter">Enroll in special education at home.</h2>
                  <Link to="/games" className="bg-yellow-400 text-neutral-900 px-10 py-5 rounded-full font-black text-xl inline-flex items-center gap-3 shadow-xl transition-transform hover:scale-105 active:scale-95">Explore Games <ChevronRight /></Link>
                </div>
                <div className="w-full md:flex-1">
                   <CustomSlider />
                </div>
              </div>
            </main>
          } />

          <Route path="/games" element={
            <main className="max-w-7xl mx-auto px-4 md:px-8 py-12 animate-in slide-in-from-bottom-4 duration-500">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
                <h3 className="text-4xl md:text-6xl font-black tracking-tighter">Our Games</h3>
                <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                  {GAME_CATEGORIES.map(cat => (
                    <button key={cat} 
                            onClick={() => setActiveCategory(cat)}
                            className={`whitespace-nowrap px-6 py-3 rounded-full text-sm font-black transition-all ${activeCategory === cat ? 'bg-red-600 text-white shadow-lg' : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'}`}>
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {ALL_GAMES_LIST.filter(g => g.category === activeCategory).map(game => (
                  <div key={game.id} className="bg-white rounded-[40px] border border-neutral-100 shadow-xl overflow-hidden flex flex-col transition-transform hover:-translate-y-2 duration-300">
                    <div className="h-56 overflow-hidden"><img src={game.img} className="w-full h-full object-cover transition-transform hover:scale-110 duration-700" alt={game.name} /></div>
                    <div className="p-8 flex-1 flex flex-col">
                      <h4 className="text-2xl font-bold mb-3">{game.name}</h4>
                      <p className="text-neutral-500 font-medium mb-8 flex-1 leading-relaxed">{game.desc}</p>
                      <div className="flex justify-between items-center pt-6 border-t border-neutral-50">
                        <PriceDisplay usd={game.price} />
                        <button onClick={() => {setCart([...cart, game]); setCartOpen(true);}} className="bg-red-600 text-white px-8 py-3 rounded-full font-black shadow-lg shadow-red-100 hover:bg-red-700 transition-colors active:scale-95">Add</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </main>
          } />
        </Routes>
      </div>
    </Router>
  );
}