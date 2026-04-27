import { useState } from 'react';
import { ShoppingCart, X, User, LogIn, Star, CheckCircle } from 'lucide-react';
import type { Game, CartItem } from './types';

const GAMES: Game[] = [
  {
    id: 1,
    name: 'Hello Friend',
    description: 'Learn to greet others, make eye contact, and start conversations through fun interactive stories.',
    price: 4.99,
    color: '#fef2f2',
    // Image of a happy girl with Down Syndrome waving to a peer.
    image: 'https://images.pexels.com/photos/15923943/pexels-photo-15923943.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
  {
    id: 2,
    name: 'Emotion Match',
    description: 'Identify and name feelings by matching faces and situations. Builds emotional understanding.',
    price: 3.99,
    color: '#fef9f0',
    // Image of a child with Down Syndrome pointing to emotion flashcards or interacting with an app.
    image: 'https://images.pexels.com/photos/15923945/pexels-photo-15923945.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
  {
    id: 3,
    name: 'My Daily Routine',
    description: 'Practice everyday tasks like brushing teeth, getting dressed, and eating through step-by-step guides.',
    price: 4.49,
    color: '#f0faf5',
    // Image of a young boy with Down Syndrome successfully brushing his teeth with a smile.
    image: 'https://images.pexels.com/photos/15923946/pexels-photo-15923946.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
  {
    id: 4,
    name: 'Share & Take Turns',
    description: 'Learn the basics of sharing, waiting, and taking turns with fun animated characters.',
    price: 3.49,
    color: '#fef2f2',
    // Image of two children with Down Syndrome happily building a block tower together.
    image: 'https://images.pexels.com/photos/15923949/pexels-photo-15923949.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
  {
    id: 5,
    name: 'Words & Pictures',
    description: 'Build vocabulary by connecting words to colorful pictures of common objects and actions.',
    price: 5.99,
    color: '#f0f4fe',
    // Image of a child with Down Syndrome pointing to a specific picture in a vibrant educational book.
    image: 'https://images.pexels.com/photos/15923951/pexels-photo-15923951.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
  {
    id: 6,
    name: 'Feelings Garden',
    description: 'Express and manage big emotions by growing a garden that reflects how you feel each day.',
    price: 4.99,
    color: '#fef9f0',
    // Image of a focused child with Down Syndrome planting seeds in a sensory bin or small garden.
    image: 'https://images.pexels.com/photos/15923952/pexels-photo-15923952.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
  {
    id: 7,
    name: 'Together Time',
    description: 'Two-player cooperative activities that teach teamwork, communication, and patience.',
    price: 6.49,
    color: '#f0faf5',
    // Image of two smiling peers, one with Down Syndrome, using a tablet application cooperatively.
    image: 'https://images.pexels.com/photos/15923953/pexels-photo-15923953.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
];

function luhnCheck(num: string): boolean {
  const digits = num.replace(/\s/g, '').split('').reverse().map(Number);
  let sum = 0;
  for (let i = 0; i < digits.length; i++) {
    let d = digits[i];
    if (i % 2 === 1) {
      d *= 2;
      if (d > 9) d -= 9;
    }
    sum += d;
  }
  return sum % 10 === 0;
}

function formatCardNumber(value: string): string {
  return value.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();
}

function formatExpiry(value: string): string {
  const clean = value.replace(/\D/g, '').slice(0, 4);
  if (clean.length >= 3) return clean.slice(0, 2) + '/' + clean.slice(2);
  return clean;
}

export default function App() {
  const [showLogin, setShowLogin] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loggedIn, setLoggedIn] = useState(false);

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [payErrors, setPayErrors] = useState<Record<string, string>>({});

  const cartCount = cart.reduce((s, i) => s + i.quantity, 0);
  const cartTotal = cart.reduce((s, i) => s + i.game.price * i.quantity, 0);

  function addToCart(game: Game) {
    setCart(prev => {
      const existing = prev.find(i => i.game.id === game.id);
      if (existing) return prev.map(i => i.game.id === game.id ? { ...i, quantity: i.quantity + 1 } : i);
      return [...prev, { game, quantity: 1 }];
    });
  }

  function removeFromCart(id: number) {
    setCart(prev => prev.filter(i => i.game.id !== id));
  }

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!loginEmail || !loginPassword) {
      setLoginError('Please fill in all fields.');
      return;
    }
    setLoggedIn(true);
    setShowLogin(false);
    setLoginError('');
  }

  function validatePayment(): boolean {
    const errors: Record<string, string> = {};
    const rawCard = cardNumber.replace(/\s/g, '');
    if (rawCard.length !== 16 || !luhnCheck(rawCard)) errors.cardNumber = 'Enter a valid Visa card number.';
    if (!cardName.trim()) errors.cardName = 'Name is required.';
    const parts = expiry.split('/');
    const mm = parts[0];
    const yy = parts[1];
    const month = parseInt(mm);
    const year = parseInt('20' + yy);
    const now = new Date();
    if (!mm || !yy || month < 1 || month > 12 || year < now.getFullYear() || (year === now.getFullYear() && month < now.getMonth() + 1)) {
      errors.expiry = 'Enter a valid expiry date.';
    }
    if (cvv.length < 3) errors.cvv = 'CVV must be 3 digits.';
    setPayErrors(errors);
    return Object.keys(errors).length === 0;
  }

  function handlePay(e: React.FormEvent) {
    e.preventDefault();
    if (!validatePayment()) return;
    setShowPayment(false);
    setShowCart(false);
    setShowSuccess(true);
    setCart([]);
    setCardNumber('');
    setCardName('');
    setExpiry('');
    setCvv('');
    setTimeout(() => setShowSuccess(false), 4000);
  }

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Header */}
<header className="bg-white border-b-2 border-black sticky top-0 z-40">
  <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
    
    {/* 1. Left Side: Logo only */}
    <div className="flex items-center">
      <img
        src="../img/Lifeline_Addis_Logo_English.png" 
        alt="lifeline" 
        className="h-12 w-auto object-contain" 
      />
    </div>

    {/* 2. Right Side: Cart and Login grouped together */}
    <div className="flex items-center gap-4">
      <button
        onClick={() => setShowCart(true)}
        className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
      >
        <ShoppingCart className="w-6 h-6 text-black" />
        {cartCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
            {cartCount}
          </span>
        )}
      </button>

      {loggedIn ? (
        <div className="flex items-center gap-2 text-black font-medium">
          <User className="w-5 h-5" />
          <span className="text-sm">My Account</span>
        </div>
      ) : (
        <button
          onClick={() => setShowLogin(true)}
          className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white font-bold px-5 py-2 rounded-full transition-colors"
        >
          <LogIn className="w-4 h-4" />
          Login
        </button>
      )}
    </div>

  </div>
</header>

      {/* Hero */}
      <div className="bg-black text-white py-14 px-6 text-center">
        <h1 className="text-4xl font-bold mb-3">Learning Through Play</h1>
        <p className="text-gray-300 text-lg max-w-xl mx-auto">
          Games designed to help children build social and daily life skills at their own pace.
        </p>
      </div>

      {/* Games Grid */}
      <main className="max-w-6xl mx-auto px-6 py-12">
        <h2 className="text-2xl font-bold text-black mb-8">Our Games</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {GAMES.map(game => (
            <div
              key={game.id}
              className="border-2 border-black rounded-2xl overflow-hidden flex flex-col shadow-lg hover:shadow-xl transition-shadow"
              style={{ backgroundColor: game.color }}
            >
              <div className="w-full h-48 overflow-hidden bg-gray-200">
                <img
                  src={game.image}
                  alt={game.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <h3 className="text-xl font-bold text-black mb-2">{game.name}</h3>
                <p className="text-gray-700 text-sm leading-relaxed flex-1">{game.description}</p>
              </div>
              <div className="px-6 pb-6 flex items-center justify-between">
                <span className="text-2xl font-bold text-black">${game.price.toFixed(2)}</span>
                <button
                  onClick={() => addToCart(game)}
                  className="bg-red-500 hover:bg-red-600 text-white font-bold px-5 py-2 rounded-full text-sm transition-colors"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Login Modal */}
      {showLogin && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md border-2 border-black">
            <div className="flex items-center justify-between p-6 border-b-2 border-black">
              <h2 className="text-xl font-bold text-black">Login</h2>
              <button
                onClick={() => { setShowLogin(false); setLoginError(''); }}
                className="hover:bg-gray-100 p-1 rounded-full"
              >
                <X className="w-5 h-5 text-black" />
              </button>
            </div>
            <form onSubmit={handleLogin} className="p-6 flex flex-col gap-4">
              <div>
                <label className="block text-sm font-bold text-black mb-1">Email</label>
                <input
                  type="email"
                  value={loginEmail}
                  onChange={e => setLoginEmail(e.target.value)}
                  placeholder="you@email.com"
                  className="w-full border-2 border-black rounded-lg px-4 py-2 text-black outline-none focus:border-red-500"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-black mb-1">Password</label>
                <input
                  type="password"
                  value={loginPassword}
                  onChange={e => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full border-2 border-black rounded-lg px-4 py-2 text-black outline-none focus:border-red-500"
                />
              </div>
              {loginError && <p className="text-red-500 text-sm font-medium">{loginError}</p>}
              <button
                type="submit"
                className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 rounded-full transition-colors mt-2"
              >
                Login
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Cart Modal */}
      {showCart && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md border-2 border-black max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b-2 border-black">
              <h2 className="text-xl font-bold text-black">Your Cart</h2>
              <button onClick={() => setShowCart(false)} className="hover:bg-gray-100 p-1 rounded-full">
                <X className="w-5 h-5 text-black" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              {cart.length === 0 ? (
                <p className="text-gray-500 text-center py-8">Your cart is empty.</p>
              ) : (
                <div className="flex flex-col gap-4">
                  {cart.map(item => (
                    <div key={item.game.id} className="flex items-center justify-between border-b border-gray-200 pb-4">
                      <div>
                        <p className="font-bold text-black">{item.game.name}</p>
                        <p className="text-sm text-gray-500">
                          x{item.quantity} &mdash; ${(item.game.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.game.id)}
                        className="text-red-500 hover:text-red-700 p-1"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {cart.length > 0 && (
              <div className="p-6 border-t-2 border-black">
                <div className="flex justify-between mb-4">
                  <span className="font-bold text-black text-lg">Total</span>
                  <span className="font-bold text-black text-lg">${cartTotal.toFixed(2)}</span>
                </div>
                <button
                  onClick={() => { setShowCart(false); setShowPayment(true); }}
                  className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 rounded-full transition-colors"
                >
                  Pay Now
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {showPayment && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md border-2 border-black">
            <div className="flex items-center justify-between p-6 border-b-2 border-black">
              <h2 className="text-xl font-bold text-black">Pay with Visa</h2>
              <button onClick={() => setShowPayment(false)} className="hover:bg-gray-100 p-1 rounded-full">
                <X className="w-5 h-5 text-black" />
              </button>
            </div>
            <form onSubmit={handlePay} className="p-6 flex flex-col gap-4">
              <div>
                <label className="block text-sm font-bold text-black mb-1">Card Number</label>
                <input
                  type="text"
                  value={cardNumber}
                  onChange={e => setCardNumber(formatCardNumber(e.target.value))}
                  placeholder="4111 1111 1111 1111"
                  maxLength={19}
                  className={`w-full border-2 rounded-lg px-4 py-2 text-black outline-none focus:border-red-500 ${payErrors.cardNumber ? 'border-red-500' : 'border-black'}`}
                />
                {payErrors.cardNumber && <p className="text-red-500 text-xs mt-1">{payErrors.cardNumber}</p>}
              </div>
              <div>
                <label className="block text-sm font-bold text-black mb-1">Name on Card</label>
                <input
                  type="text"
                  value={cardName}
                  onChange={e => setCardName(e.target.value)}
                  placeholder="Full Name"
                  className={`w-full border-2 rounded-lg px-4 py-2 text-black outline-none focus:border-red-500 ${payErrors.cardName ? 'border-red-500' : 'border-black'}`}
                />
                {payErrors.cardName && <p className="text-red-500 text-xs mt-1">{payErrors.cardName}</p>}
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-bold text-black mb-1">Expiry</label>
                  <input
                    type="text"
                    value={expiry}
                    onChange={e => setExpiry(formatExpiry(e.target.value))}
                    placeholder="MM/YY"
                    maxLength={5}
                    className={`w-full border-2 rounded-lg px-4 py-2 text-black outline-none focus:border-red-500 ${payErrors.expiry ? 'border-red-500' : 'border-black'}`}
                  />
                  {payErrors.expiry && <p className="text-red-500 text-xs mt-1">{payErrors.expiry}</p>}
                </div>
                <div className="w-28">
                  <label className="block text-sm font-bold text-black mb-1">CVV</label>
                  <input
                    type="text"
                    value={cvv}
                    onChange={e => setCvv(e.target.value.replace(/\D/g, '').slice(0, 3))}
                    placeholder="123"
                    maxLength={3}
                    className={`w-full border-2 rounded-lg px-4 py-2 text-black outline-none focus:border-red-500 ${payErrors.cvv ? 'border-red-500' : 'border-black'}`}
                  />
                  {payErrors.cvv && <p className="text-red-500 text-xs mt-1">{payErrors.cvv}</p>}
                </div>
              </div>
              <div className="flex justify-between items-center mt-2">
                <span className="text-gray-600 text-sm">
                  Total: <strong className="text-black">${cartTotal.toFixed(2)}</strong>
                </span>
                <button
                  type="submit"
                  className="bg-red-500 hover:bg-red-600 text-white font-bold px-8 py-3 rounded-full transition-colors"
                >
                  Pay
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Success Toast */}
      {showSuccess && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 bg-black text-white px-8 py-4 rounded-full flex items-center gap-3 shadow-xl">
          <CheckCircle className="w-5 h-5 text-green-400" />
          <span className="font-bold">Payment successful! Enjoy your games.</span>
        </div>
      )}
    </div>
  );
}
