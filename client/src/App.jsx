import React, { useState, useEffect } from 'react';
import { 
  Plane, 
  Calendar, 
  Trash2, 
  Plus, 
  User, 
  Mail, 
  DollarSign, 
  MapPin, 
  CheckCircle, 
  AlertCircle, 
  ArrowRight, 
  Ticket, 
  Lock, 
  CreditCard, 
  LogOut, 
  Clock, 
  Smartphone, 
  QrCode, 
  XCircle,
  TrendingUp,
  Users
} from 'lucide-react';

const API_URL = 'https://fullstackflightbooking-server-backend.onrender.com';
const MY_UPI_ID = 'your_upi_id@oksbi'; 
const MY_NAME = 'AeroSwift Flights';

// --- SUB-COMPONENTS ---

const Navbar = ({ user, setView, handleLogout }) => (
  <nav className="bg-slate-900/40 backdrop-blur-md text-white shadow-lg sticky top-0 z-50 border-b border-white/10">
    <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
      <div 
        className="flex items-center space-x-3 cursor-pointer hover:opacity-90 transition" 
        onClick={() => user && setView('home')}
      >
        <div className="bg-emerald-500/90 backdrop-blur p-2 rounded-lg shadow-lg shadow-emerald-500/20">
          <Plane className="h-6 w-6 text-white transform -rotate-45" />
        </div>
        <span className="text-2xl font-bold tracking-tight drop-shadow-md">
          Aero<span className="text-emerald-400">Swift</span>
        </span>
      </div>
      
      {user && (
        <div className="flex items-center space-x-1 md:space-x-2 text-sm font-medium bg-black/20 p-1 rounded-full border border-white/10 backdrop-blur-sm">
          <span className="text-slate-200 hidden md:block px-4 border-r border-white/10">
            Hi, {user.name}
          </span>
          <button 
            onClick={() => setView('home')} 
            className="px-4 py-2 rounded-full hover:bg-white/10 hover:text-emerald-400 transition"
          >
            Flights
          </button>
          <button 
            onClick={() => setView('my-bookings')} 
            className="px-4 py-2 rounded-full hover:bg-white/10 hover:text-emerald-400 transition"
          >
            My Tickets
          </button>
          
          {user.role === 'admin' && (
             <button 
               onClick={() => setView('admin')} 
               className="px-4 py-2 rounded-full text-amber-400 hover:bg-amber-400/10 transition font-bold"
             >
               Admin
             </button>
          )}

          <button 
            onClick={handleLogout} 
            className="p-2 rounded-full text-rose-400 hover:bg-rose-500/20 transition ml-2"
          >
            <LogOut size={18} />
          </button>
        </div>
      )}
    </div>
  </nav>
);

const SeatMap = ({ takenSeats, selectedSeat, setSelectedSeat, setView }) => {
  const rows = 6; 
  const cols = 10; 
  const rowLabels = ['A','B','C','D','E','F'];

  return (
    <div className="bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-2xl max-w-2xl mx-auto mt-8 border border-white/40">
      <h3 className="text-2xl font-bold mb-6 text-center text-slate-800">Select Your Seat</h3>
      
      <div className="flex justify-center mb-8 gap-6 text-sm font-medium">
          <div className="flex items-center">
            <div className="w-6 h-6 bg-slate-200 rounded mr-2 border border-slate-300"></div> Available
          </div>
          <div className="flex items-center">
            <div className="w-6 h-6 bg-slate-800 rounded mr-2"></div> Taken
          </div>
          <div className="flex items-center">
            <div className="w-6 h-6 bg-emerald-500 rounded mr-2 shadow-lg shadow-emerald-500/40"></div> Selected
          </div>
      </div>
      
      <div className="grid gap-4 overflow-x-auto pb-4 justify-center">
          <div className="bg-slate-50/50 p-8 rounded-[3rem] border-2 border-slate-200 relative shadow-inner">
              <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 w-20 h-20 bg-slate-200/50 rounded-t-full border-t-2 border-slate-200"></div>
              
              <div className="grid grid-cols-7 gap-y-3 gap-x-2">
                  <div></div>
                  {rowLabels.map((label, i) => (
                    <div key={i} className={`text-center font-bold text-slate-400 ${i === 2 ? 'mr-8' : ''}`}>
                      {label}
                    </div>
                  ))}

                  {[...Array(cols)].map((_, colIndex) => (
                      <React.Fragment key={colIndex}>
                          <div className="flex items-center justify-center font-bold text-slate-400 w-6">
                            {colIndex + 1}
                          </div>
                          {rowLabels.map((rowLabel, rowIndex) => {
                              const seatId = `${colIndex + 1}${rowLabel}`;
                              const isTaken = takenSeats.includes(seatId);
                              const isSelected = selectedSeat === seatId;
                              return (
                                  <button 
                                      key={seatId} 
                                      disabled={isTaken} 
                                      onClick={() => setSelectedSeat(seatId)}
                                      className={`
                                        w-10 h-10 rounded-lg m-0.5 transition-all duration-200 flex items-center justify-center text-xs font-bold 
                                        ${rowIndex === 2 ? 'mr-8' : ''} 
                                        ${isTaken ? 'bg-slate-800 text-slate-500 cursor-not-allowed' : 
                                          isSelected ? 'bg-emerald-500 text-white transform scale-110 shadow-lg shadow-emerald-500/50' : 
                                          'bg-white border border-slate-300 hover:border-emerald-400 hover:text-emerald-600 text-slate-500 shadow-sm'}
                                      `}
                                  >
                                      {seatId}
                                  </button>
                              );
                          })}
                      </React.Fragment>
                  ))}
              </div>
          </div>
      </div>
      
      <div className="mt-8 flex justify-between items-center bg-white/50 p-4 rounded-xl border border-white/50">
          <div>
            <p className="text-sm text-slate-500">Selected Seat</p>
            <p className="text-2xl font-bold text-emerald-600">{selectedSeat || '-'}</p>
          </div>
          <button 
            onClick={() => selectedSeat && setView('payment')} 
            disabled={!selectedSeat} 
            className={`px-8 py-3 rounded-xl font-bold text-white transition shadow-lg ${selectedSeat ? 'bg-slate-900 hover:bg-emerald-600 hover:shadow-emerald-500/30' : 'bg-slate-300 cursor-not-allowed'}`}
          >
            Proceed to Pay
          </button>
      </div>
    </div>
  );
};

const PaymentForm = ({ selectedFlight, selectedSeat, paymentDetails, setPaymentDetails, handlePaymentAndBook, loading, setView }) => {
  const [method, setMethod] = useState('card'); 
  const upiLink = `upi://pay?pa=${MY_UPI_ID}&pn=${MY_NAME.replace(' ', '%20')}&am=${selectedFlight.price}&cu=INR`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(upiLink)}`;

  return (
    <div className="max-w-xl mx-auto bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-2xl mt-8 border border-white/40">
        <h3 className="text-2xl font-bold mb-6 flex items-center justify-center text-slate-800">Complete Payment</h3>
        
        <div className="bg-white/60 p-4 rounded-xl mb-6 border border-white/50 shadow-inner">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-slate-500">Flight</span>
              <span className="font-semibold">{selectedFlight.origin} → {selectedFlight.destination}</span>
            </div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-slate-500">Seat</span>
              <span className="font-semibold">{selectedSeat}</span>
            </div>
            <div className="border-t border-slate-300/50 my-2 pt-2 flex justify-between text-lg font-bold">
              <span>Total to Pay</span>
              <span className="text-emerald-600">₹{selectedFlight.price}</span>
            </div>
        </div>

        <div className="flex gap-2 mb-6 bg-slate-200/50 p-1 rounded-xl">
            <button 
              onClick={() => setMethod('card')} 
              className={`flex-1 py-2 rounded-lg font-semibold text-sm flex items-center justify-center transition ${method === 'card' ? 'bg-white shadow text-emerald-600' : 'text-slate-500 hover:bg-white/50'}`}
            >
              <CreditCard className="w-4 h-4 mr-2" /> Credit Card
            </button>
            <button 
              onClick={() => setMethod('upi')} 
              className={`flex-1 py-2 rounded-lg font-semibold text-sm flex items-center justify-center transition ${method === 'upi' ? 'bg-white shadow text-emerald-600' : 'text-slate-500 hover:bg-white/50'}`}
            >
              <QrCode className="w-4 h-4 mr-2" /> UPI / QR
            </button>
        </div>

        <form onSubmit={(e) => handlePaymentAndBook(e, method)} className="space-y-4">
            {method === 'card' && (
                <div className="space-y-4 animate-fade-in">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1">Card Number</label>
                      <input 
                        required placeholder="0000 0000 0000 0000" 
                        className="w-full p-3 bg-white/80 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500" 
                        value={paymentDetails.cardNumber} 
                        onChange={e => setPaymentDetails({...paymentDetails, cardNumber: e.target.value})} 
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-bold text-slate-700 mb-1">Expiry</label>
                          <input 
                            required placeholder="MM/YY" 
                            className="w-full p-3 bg-white/80 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500" 
                            value={paymentDetails.expiry} 
                            onChange={e => setPaymentDetails({...paymentDetails, expiry: e.target.value})} 
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-slate-700 mb-1">CVV</label>
                          <input 
                            required placeholder="123" type="password" 
                            className="w-full p-3 bg-white/80 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500" 
                            value={paymentDetails.cvv} 
                            onChange={e => setPaymentDetails({...paymentDetails, cvv: e.target.value})} 
                          />
                        </div>
                    </div>
                </div>
            )}

            {method === 'upi' && (
                <div className="text-center space-y-4 animate-fade-in">
                    <div className="bg-white border-2 border-emerald-500 p-2 rounded-xl inline-block shadow-lg">
                      <img src={qrCodeUrl} alt="UPI QR Code" className="w-48 h-48" />
                    </div>
                    <p className="text-xs text-slate-600 font-medium">Scan with GPay, PhonePe, or Paytm</p>
                    
                    <div className="text-left mt-4 bg-yellow-50/80 border border-yellow-200 p-4 rounded-xl">
                        <label className="block text-sm font-bold text-slate-700 mb-1">Enter Transaction ID / UTR</label>
                        <input 
                          required placeholder="e.g. 3290XXXXXXXX" 
                          className="w-full p-3 bg-white border rounded-xl outline-none focus:ring-2 focus:ring-emerald-500" 
                          onChange={e => setPaymentDetails({...paymentDetails, upiRef: e.target.value})} 
                        />
                        <p className="text-[10px] text-slate-500 mt-1">Please enter the Reference ID from your payment app.</p>
                    </div>
                </div>
            )}

            <button 
              type="submit" 
              disabled={loading} 
              className="w-full py-4 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition mt-4 shadow-lg shadow-emerald-500/30"
            >
              {loading ? 'Processing...' : `Pay ₹${selectedFlight.price} Securely`}
            </button>
            <button 
              type="button" 
              onClick={() => setView('seat-selection')} 
              className="w-full text-slate-500 text-sm hover:text-slate-800 mt-2"
            >
              Back to Seat Selection
            </button>
        </form>
    </div>
  );
};

// --- MAIN APP ---

export default function App() {
  const [view, setView] = useState('auth'); 
  const [user, setUser] = useState(null);
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  
  // Auth State
  const [isRegistering, setIsRegistering] = useState(false);
  const [authForm, setAuthForm] = useState({ name: '', email: '', password: '' });

  // Booking State
  const [searchTerm, setSearchTerm] = useState({ origin: '', destination: '' });
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [takenSeats, setTakenSeats] = useState([]);
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [paymentDetails, setPaymentDetails] = useState({ cardNumber: '', expiry: '', cvv: '', upiRef: '' });
  
  const [myBookings, setMyBookings] = useState([]);
  const [newFlight, setNewFlight] = useState({ origin: '', destination: '', date: '', price: '', seats: 60 });

  // Admin Stats State
  const [dashboardStats, setDashboardStats] = useState({ revenue: 0, total_bookings: 0, total_flights: 0 });

  const showNotification = (msg, type) => { 
    setNotification({ msg, type }); 
    setTimeout(() => setNotification(null), 3000); 
  };
  
  const getBackgroundImage = () => {
    switch(view) {
      case 'auth': return 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=2600&auto=format&fit=crop'; 
      case 'home': return 'https://images.unsplash.com/photo-1474302770737-173ee21bab63?q=80&w=2400&auto=format&fit=crop';
      case 'seat-selection': return 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2400&auto=format&fit=crop';
      case 'payment': return 'https://images.unsplash.com/photo-1556742049-0cfed4f7a07d?q=80&w=2400&auto=format&fit=crop';
      case 'my-bookings': return 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=2400&auto=format&fit=crop';
      case 'admin': return 'https://images.unsplash.com/photo-1486406140926-c627a92ad1ab?q=80&w=2400&auto=format&fit=crop';
      default: return 'https://images.unsplash.com/photo-1542296332-2e44a99cfef9?q=80&w=2600&auto=format&fit=crop';
    }
  };

  // --- API HANDLERS ---

  const handleAuth = async (e) => {
    e.preventDefault(); 
    const endpoint = isRegistering ? '/register' : '/login';
    try { 
      const res = await fetch(`${API_URL}${endpoint}`, { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify(authForm) 
      }); 
      const data = await res.json(); 
      if (res.ok) { 
        if (isRegistering) { 
          setIsRegistering(false); 
          showNotification('Registration successful! Please login.', 'success'); 
        } else { 
          setUser(data); 
          setView('home'); 
          showNotification(`Welcome back, ${data.name}!`, 'success'); 
        } 
      } else { 
        showNotification(data.message, 'error'); 
      } 
    } catch (err) { 
      showNotification('Connection failed', 'error'); 
    }
  };

  const handleLogout = () => { 
    setUser(null); 
    setView('auth'); 
    setAuthForm({ name: '', email: '', password: '' }); 
  };

  const fetchFlights = async () => { 
    setLoading(true); 
    try { 
      const res = await fetch(`${API_URL}/flights`); 
      const data = await res.json(); 
      setFlights(data); 
    } catch (error) { 
      console.error(error); 
    } finally { 
      setLoading(false); 
    } 
  };

  const fetchStats = async () => {
    try {
      const res = await fetch(`${API_URL}/admin/analytics`);
      const data = await res.json();
      setDashboardStats(data);
    } catch (error) {
      console.error('Failed to fetch stats');
    }
  };

  const handleAddFlight = async (e) => { 
    e.preventDefault(); 
    try { 
      const res = await fetch(`${API_URL}/flights`, { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify(newFlight) 
      }); 
      if (res.ok) { 
        showNotification('Flight added', 'success'); 
        fetchFlights(); 
        setNewFlight({ origin: '', destination: '', date: '', price: '', seats: 60 }); 
        fetchStats(); // Update stats
      } 
    } catch (error) { 
      showNotification('Failed to add flight', 'error'); 
    } 
  };

  const handleDeleteFlight = async (id) => { 
    try { 
      await fetch(`${API_URL}/flights/${id}`, { method: 'DELETE' }); 
      fetchFlights(); 
      fetchStats();
      showNotification('Flight deleted', 'success'); 
    } catch (error) { 
      showNotification('Failed', 'error'); 
    } 
  };

  const selectFlightForBooking = async (flight) => { 
    setSelectedFlight(flight); 
    setLoading(true); 
    try { 
      const res = await fetch(`${API_URL}/flights/${flight.id}/seats`); 
      const taken = await res.json(); 
      setTakenSeats(taken); 
      setSelectedSeat(null); 
      setView('seat-selection'); 
    } catch (err) { 
      showNotification('Error loading seats', 'error'); 
    } finally { 
      setLoading(false); 
    } 
  };

  const handlePaymentAndBook = async (e, method) => { 
    e.preventDefault(); 
    if (!selectedSeat) return showNotification('Please select a seat', 'error'); 
    if (method === 'upi' && !paymentDetails.upiRef) return showNotification('Please enter UTR', 'error'); 
    
    setLoading(true); 
    const transactionId = method === 'card' ? `CARD-${Date.now()}` : `UPI-${paymentDetails.upiRef}`; 
    
    try { 
      const res = await fetch(`${API_URL}/book`, { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify({ 
          flight_id: selectedFlight.id, 
          passenger_name: user.name, 
          email: user.email, 
          seat_number: selectedSeat, 
          flight_details: selectedFlight, 
          payment_method: method.toUpperCase(), 
          transaction_id: transactionId 
        }) 
      }); 
      const data = await res.json(); 
      if (res.ok) { 
        showNotification('Booking Confirmed!', 'success'); 
        fetchFlights(); 
        setView('home'); 
      } else { 
        showNotification(data.message, 'error'); 
      } 
    } catch (error) { 
      showNotification('Booking failed', 'error'); 
    } finally { 
      setLoading(false); 
    } 
  };

  const fetchMyBookings = async () => { 
    if (!user) return; 
    setLoading(true); 
    try { 
      const res = await fetch(`${API_URL}/bookings/${user.email}`); 
      const data = await res.json(); 
      setMyBookings(data); 
    } catch (err) { 
      console.error(err); 
    } finally { 
      setLoading(false); 
    } 
  };

  const handleCancelBooking = async (bookingId) => {
    if(!window.confirm("Are you sure you want to cancel this ticket?")) return;
    
    setLoading(true);
    try {
        const res = await fetch(`${API_URL}/bookings/${bookingId}/cancel`, { 
          method: 'PUT' 
        });

        const contentType = res.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
           throw new Error("Server route not found. Did you update server.js?");
        }

        const data = await res.json();
        
        if (res.ok) { 
          showNotification('Ticket Cancelled. Refund processed.', 'success'); 
          fetchMyBookings(); 
        } else { 
          showNotification(data.message, 'error'); 
        }
    } catch (error) { 
      showNotification(error.message || 'Cancellation failed', 'error'); 
    } finally { 
      setLoading(false); 
    }
  };

  useEffect(() => { 
    if (view === 'home') fetchFlights();
    if (view === 'admin') { fetchFlights(); fetchStats(); }
  }, [view]);
  
  useEffect(() => { if (view === 'my-bookings') fetchMyBookings(); }, [view]);

  return (
    <div className="min-h-screen bg-cover bg-center bg-fixed transition-all duration-700 ease-in-out font-sans text-slate-800" style={{ backgroundImage: `url(${getBackgroundImage()})` }}>
      {/* Light Overlay + Glass Effect for whole app */}
      <div className="min-h-screen bg-black/10 backdrop-blur-[2px] w-full overflow-y-auto">
        
        <Navbar user={user} setView={setView} handleLogout={handleLogout} />
        
        {notification && (
          <div className={`fixed bottom-6 right-6 px-6 py-4 rounded-xl shadow-2xl text-white flex items-center space-x-3 z-50 animate-bounce ${notification.type === 'success' ? 'bg-emerald-600/90' : 'bg-rose-600/90'} backdrop-blur-md`}>
            {notification.type === 'success' ? <CheckCircle size={24} /> : <AlertCircle size={24} />}
            <span className="font-medium">{notification.msg}</span>
          </div>
        )}
        
        <main className="max-w-7xl mx-auto px-6 py-8">
          
          {view === 'auth' && (
            <div className="max-w-md mx-auto mt-20 bg-white/30 backdrop-blur-md p-8 rounded-3xl shadow-2xl border border-white/20">
               <div className="text-center mb-8">
                 <div className="inline-block p-4 rounded-full bg-emerald-500/20 mb-4 shadow-sm backdrop-blur-sm">
                   <Plane className="h-10 w-10 text-emerald-800 transform -rotate-45" />
                 </div>
                 <h1 className="text-3xl font-bold text-slate-900 drop-shadow-sm">AeroSwift</h1>
                 <p className="text-slate-800 font-medium">{isRegistering ? 'Start your journey' : 'Welcome back'}</p>
               </div>
               
               <form onSubmit={handleAuth} className="space-y-4">
                  {isRegistering && (
                    <div className="relative group">
                      <User className="absolute left-4 top-3.5 text-slate-600 transition group-focus-within:text-emerald-800" size={20} />
                      <input 
                        type="text" 
                        placeholder="Full Name" 
                        required 
                        className="w-full pl-12 pr-4 py-3 bg-white/60 border border-white/40 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white/90 transition text-slate-900" 
                        value={authForm.name} 
                        onChange={e => setAuthForm({...authForm, name: e.target.value})} 
                      />
                    </div>
                  )}
                  <div className="relative group">
                    <Mail className="absolute left-4 top-3.5 text-slate-600 transition group-focus-within:text-emerald-800" size={20} />
                    <input 
                      type="email" 
                      placeholder="Email Address" 
                      required 
                      className="w-full pl-12 pr-4 py-3 bg-white/60 border border-white/40 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white/90 transition text-slate-900" 
                      value={authForm.email} 
                      onChange={e => setAuthForm({...authForm, email: e.target.value})} 
                    />
                  </div>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-3.5 text-slate-600 transition group-focus-within:text-emerald-800" size={20} />
                    <input 
                      type="password" 
                      placeholder="Password" 
                      required 
                      className="w-full pl-12 pr-4 py-3 bg-white/60 border border-white/40 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white/90 transition text-slate-900" 
                      value={authForm.password} 
                      onChange={e => setAuthForm({...authForm, password: e.target.value})} 
                    />
                  </div>
                  <button 
                    type="submit" 
                    className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-emerald-800 transition shadow-lg shadow-slate-900/20"
                  >
                    {isRegistering ? 'Create Account' : 'Sign In'}
                  </button>
               </form>
               
               <div className="mt-6 text-center">
                 <button 
                   onClick={() => setIsRegistering(!isRegistering)} 
                   className="text-emerald-900 font-bold hover:underline hover:text-emerald-700"
                 >
                   {isRegistering ? 'Sign In' : "Register"}
                 </button>
               </div>
            </div>
          )}

          {view === 'seat-selection' && (
            <SeatMap takenSeats={takenSeats} selectedSeat={selectedSeat} setSelectedSeat={setSelectedSeat} setView={setView} />
          )}
          
          {view === 'payment' && (
            <PaymentForm selectedFlight={selectedFlight} selectedSeat={selectedSeat} paymentDetails={paymentDetails} setPaymentDetails={setPaymentDetails} handlePaymentAndBook={handlePaymentAndBook} loading={loading} setView={setView} />
          )}

          {view === 'home' && (
             <div className="space-y-10">
               <div className="bg-slate-900/70 backdrop-blur-md rounded-3xl p-12 text-center text-white shadow-2xl relative overflow-hidden border border-white/10">
                  <h1 className="text-4xl font-extrabold mb-4 relative z-10 drop-shadow-md">Hello, <span className="text-emerald-400">{user?.name}</span></h1>
                  <p className="text-slate-200 text-lg relative z-10 mb-8 font-medium">Ready for your next adventure?</p>
                  
                  <div className="bg-white/80 backdrop-blur-xl p-4 rounded-2xl shadow-xl max-w-3xl mx-auto flex flex-col md:flex-row gap-4 relative z-10 border border-white/40">
                    <div className="flex-1 relative group">
                       <MapPin className="absolute left-3 top-3.5 text-slate-500 group-focus-within:text-emerald-600 transition" size={20} />
                       <input 
                         type="text" 
                         placeholder="Origin City" 
                         className="w-full pl-10 p-3 bg-white/50 rounded-xl text-slate-900 outline-none border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:bg-white transition font-medium" 
                         value={searchTerm.origin} 
                         onChange={e => setSearchTerm({...searchTerm, origin: e.target.value})} 
                       />
                    </div>
                    <div className="flex-1 relative group">
                       <MapPin className="absolute left-3 top-3.5 text-slate-500 group-focus-within:text-emerald-600 transition" size={20} />
                       <input 
                         type="text" 
                         placeholder="Destination City" 
                         className="w-full pl-10 p-3 bg-white/50 rounded-xl text-slate-900 outline-none border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:bg-white transition font-medium" 
                         value={searchTerm.destination} 
                         onChange={e => setSearchTerm({...searchTerm, destination: e.target.value})} 
                       />
                    </div>
                  </div>
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {flights.filter(f => f.origin.toLowerCase().includes(searchTerm.origin.toLowerCase()) && f.destination.toLowerCase().includes(searchTerm.destination.toLowerCase())).map(flight => (
                    <div key={flight.id} className="bg-white/70 backdrop-blur-lg rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-white/50 p-6 transform hover:-translate-y-2 group">
                      <div className="flex justify-between mb-4">
                        <span className="text-2xl font-bold text-slate-800">{flight.origin}</span>
                        <Plane className="text-emerald-500 transform rotate-90 group-hover:scale-110 transition" />
                        <span className="text-2xl font-bold text-slate-800">{flight.destination}</span>
                      </div>
                      <div className="flex justify-between text-slate-600 mb-6 bg-white/50 p-3 rounded-xl border border-white/40">
                        <span className="flex items-center font-medium">
                          <Calendar size={16} className="mr-2 text-slate-500" /> {new Date(flight.date).toLocaleDateString()}
                        </span>
                        
                        {/* New: Seat Count Display */}
                        <div className="text-right">
                           <span className="block font-bold text-emerald-600 text-xl">₹{flight.price}</span>
                           <span className={`text-xs font-bold ${flight.seats > 5 ? 'text-slate-500' : 'text-red-500'}`}>
                             {flight.seats} Seats Left
                           </span>
                        </div>
                      </div>
                      <button 
                        onClick={() => selectFlightForBooking(flight)} 
                        disabled={flight.seats <= 0} 
                        className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-emerald-600 transition shadow-lg shadow-slate-900/20"
                      >
                        {flight.seats > 0 ? 'Select Seat' : 'Sold Out'}
                      </button>
                    </div>
                  ))}
               </div>
             </div>
          )}

          {view === 'my-bookings' && (
               <div className="max-w-4xl mx-auto space-y-4">
                  <h2 className="text-3xl font-bold text-white mb-6 flex items-center drop-shadow-md">
                    <Ticket className="mr-3" /> My Boarding Passes
                  </h2>
                  
                  {myBookings.length === 0 ? (
                    <p className="text-white text-center text-lg bg-black/40 p-4 rounded-xl backdrop-blur border border-white/10">
                      No bookings found.
                    </p> 
                  ) : (
                    myBookings.map(b => (
                      <div key={b.booking_id} className={`bg-white rounded-3xl shadow-2xl overflow-hidden mb-8 relative flex flex-col md:flex-row transform transition-all duration-300 ${b.status === 'Cancelled' ? 'grayscale opacity-80' : 'hover:-translate-y-1'}`}>
                          
                          {/* Cancelled Stamp Overlay */}
                          {b.status === 'Cancelled' && (
                              <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none">
                                  <div className="border-4 border-red-500 text-red-500 text-5xl font-black px-8 py-4 rounded-xl transform -rotate-12 opacity-80">
                                    CANCELLED
                                  </div>
                              </div>
                          )}

                          <div className="bg-slate-900 text-white p-8 flex-1 relative overflow-hidden">
                              <div className="absolute top-0 right-0 -mr-16 -mt-16 w-32 h-32 rounded-full bg-emerald-500 opacity-20 blur-2xl"></div>
                              <div className="flex justify-between items-start mb-8 relative z-10">
                                <div className="flex items-center space-x-2">
                                  <Plane className="h-6 w-6 text-emerald-400 transform -rotate-45" />
                                  <span className="font-bold text-lg tracking-widest">AEROSWIFT</span>
                                </div>
                                <span className="bg-white/10 px-3 py-1 rounded text-xs font-bold tracking-widest border border-white/10">ECONOMY</span>
                              </div>
                              <div className="flex justify-between items-center mb-8 relative z-10">
                                  <div>
                                    <p className="text-slate-400 text-xs font-bold uppercase mb-1">Origin</p>
                                    <p className="text-3xl font-bold">{b.origin.substring(0, 3).toUpperCase()}</p>
                                    <p className="text-sm text-slate-400">{b.origin}</p>
                                  </div>
                                  <div className="flex flex-col items-center mx-4">
                                    <div className="flex items-center text-slate-500 text-xs mb-1">
                                      <Clock size={12} className="mr-1" /> 2h 30m
                                    </div>
                                    <div className="w-24 h-px bg-slate-600 relative">
                                      <Plane className="absolute -top-3 left-1/2 transform -translate-x-1/2 text-emerald-500 h-6 w-6 rotate-90" />
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <p className="text-slate-400 text-xs font-bold uppercase mb-1">Dest</p>
                                    <p className="text-3xl font-bold">{b.destination.substring(0, 3).toUpperCase()}</p>
                                    <p className="text-sm text-slate-400">{b.destination}</p>
                                  </div>
                              </div>
                              <div className="flex justify-between items-end relative z-10">
                                <div>
                                  <p className="text-slate-400 text-xs font-bold uppercase mb-1">Date</p>
                                  <p className="text-lg font-medium">{new Date(b.flight_date).toLocaleDateString()}</p>
                                </div>
                                <div>
                                  <p className="text-slate-400 text-xs font-bold uppercase mb-1">Boarding</p>
                                  <p className="text-lg font-medium">10:45 AM</p>
                                </div>
                              </div>
                          </div>
                          
                          <div className="bg-white p-8 md:w-80 border-l-2 border-dashed border-slate-200 relative flex flex-col justify-between">
                              <div className="absolute -top-3 -left-3 w-6 h-6 rounded-full bg-slate-900"></div>
                              <div className="absolute -bottom-3 -left-3 w-6 h-6 rounded-full bg-slate-900"></div>
                              
                              <div>
                                  <h3 className="text-xl font-bold text-slate-900 mb-6 truncate">{b.passenger_name}</h3>
                                  <div className="grid grid-cols-2 gap-4 mb-2">
                                    <div>
                                      <p className="text-slate-400 text-xs font-bold uppercase mb-1">Seat</p>
                                      <p className="text-3xl font-bold text-emerald-600">{b.seat_number}</p>
                                    </div>
                                    <div>
                                      <p className="text-slate-400 text-xs font-bold uppercase mb-1">Gate</p>
                                      <p className="text-3xl font-bold text-slate-800">B2</p>
                                    </div>
                                  </div>
                              </div>
                              
                              <div className="flex flex-col gap-4">
                                <div className="opacity-50">
                                  <div className="h-4 w-full bg-slate-900 mb-1"></div>
                                  <p className="text-[10px] text-center tracking-[0.5em] font-mono">829301938</p>
                                </div>
                                
                                {b.status !== 'Cancelled' && (
                                    <button 
                                      onClick={() => handleCancelBooking(b.booking_id)} 
                                      className="w-full py-2 bg-red-100 text-red-600 rounded-lg text-xs font-bold hover:bg-red-200 transition flex items-center justify-center"
                                    >
                                      <XCircle size={14} className="mr-1" /> Cancel Ticket
                                    </button>
                                )}
                              </div>
                          </div>
                      </div>
                    ))
                  )}
               </div>
          )}

          {view === 'admin' && (
            <div className="max-w-5xl mx-auto">
              <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-xl overflow-hidden border border-white/20">
                <div className="bg-slate-900/90 p-6 border-b border-slate-800">
                  <h2 className="text-2xl font-bold text-white flex items-center">
                    <div className="bg-emerald-500 p-1.5 rounded-lg mr-3 shadow-lg shadow-emerald-500/30"><Plus className="h-5 w-5 text-slate-900" /></div>
                    Flight Management
                  </h2>
                </div>
                
                {/* ADMIN ANALYTICS DASHBOARD */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-8 pb-2">
                    <div className="bg-white/50 p-6 rounded-2xl border border-white/40 shadow-sm flex items-center">
                        <div className="p-3 bg-emerald-100 rounded-xl mr-4"><TrendingUp className="text-emerald-600 h-8 w-8" /></div>
                        <div>
                            <p className="text-slate-500 text-sm font-bold uppercase">Total Revenue</p>
                            <p className="text-3xl font-black text-slate-800">₹{dashboardStats.revenue.toLocaleString()}</p>
                        </div>
                    </div>
                    <div className="bg-white/50 p-6 rounded-2xl border border-white/40 shadow-sm flex items-center">
                        <div className="p-3 bg-blue-100 rounded-xl mr-4"><Users className="text-blue-600 h-8 w-8" /></div>
                        <div>
                            <p className="text-slate-500 text-sm font-bold uppercase">Total Bookings</p>
                            <p className="text-3xl font-black text-slate-800">{dashboardStats.total_bookings}</p>
                        </div>
                    </div>
                    <div className="bg-white/50 p-6 rounded-2xl border border-white/40 shadow-sm flex items-center">
                        <div className="p-3 bg-purple-100 rounded-xl mr-4"><Plane className="text-purple-600 h-8 w-8" /></div>
                        <div>
                            <p className="text-slate-500 text-sm font-bold uppercase">Active Routes</p>
                            <p className="text-3xl font-black text-slate-800">{dashboardStats.total_flights}</p>
                        </div>
                    </div>
                </div>

                <div className="p-8 pt-6">
                  <div className="bg-slate-50/50 p-6 rounded-2xl border border-slate-200 mb-10 shadow-inner">
                    <h3 className="font-bold text-slate-700 mb-4 flex items-center">
                      <Plane className="mr-2 h-4 w-4" /> Add New Flight
                    </h3>
                    <form onSubmit={handleAddFlight} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
                      <input required placeholder="Origin" className="p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 outline-none bg-white/70" value={newFlight.origin} onChange={e => setNewFlight({...newFlight, origin: e.target.value})} />
                      <input required placeholder="Destination" className="p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 outline-none bg-white/70" value={newFlight.destination} onChange={e => setNewFlight({...newFlight, destination: e.target.value})} />
                      <input required type="date" className="p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 outline-none bg-white/70" value={newFlight.date} onChange={e => setNewFlight({...newFlight, date: e.target.value})} />
                      <input required type="number" placeholder="Price" className="p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 outline-none bg-white/70" value={newFlight.price} onChange={e => setNewFlight({...newFlight, price: e.target.value})} />
                      <input required type="number" placeholder="Seats" className="p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 outline-none bg-white/70" value={newFlight.seats} onChange={e => setNewFlight({...newFlight, seats: e.target.value})} />
                      <button type="submit" className="lg:col-span-1 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition shadow-lg shadow-emerald-500/30">Add</button>
                    </form>
                  </div>
                  
                  <h3 className="font-bold text-slate-800 mb-4 bg-white/50 inline-block px-3 py-1 rounded-lg">Current Flight Schedule</h3>
                  
                  <div className="overflow-hidden rounded-2xl border border-slate-200 shadow-sm">
                    <table className="w-full text-left">
                      <thead className="bg-slate-100 text-slate-600 text-sm uppercase tracking-wider font-semibold">
                        <tr><th className="p-4">Origin</th><th className="p-4">Destination</th><th className="p-4">Date</th><th className="p-4">Price</th><th className="p-4 text-center">Action</th></tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 bg-white/90">
                        {flights.map(flight => (
                          <tr key={flight.id} className="hover:bg-slate-50 transition">
                            <td className="p-4 font-medium text-slate-800">{flight.origin}</td>
                            <td className="p-4 font-medium text-slate-800">{flight.destination}</td>
                            <td className="p-4 text-slate-500">{new Date(flight.date).toLocaleDateString()}</td>
                            <td className="p-4 font-bold text-emerald-600">₹{flight.price}</td>
                            <td className="p-4 text-center">
                              <button onClick={() => handleDeleteFlight(flight.id)} className="text-rose-400 hover:text-rose-600 hover:bg-rose-50 p-2 rounded-lg transition"><Trash2 size={18} /></button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
