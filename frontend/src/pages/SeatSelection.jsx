import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate, Link } from 'react-router-dom';
import API from '../api/api';
import showtimeService from '../services/showtimeService';
import SeatMap from '../components/SeatMap';
import TicketCategorySelector from '../components/TicketCategorySelector';
import LoadingSpinner from '../components/LoadingSpinner';
import { ErrorAlert } from '../components/Alerts';

const SeatSelection = () => {
  const { id } = useParams();
  const location = useLocation();
  const [showtime, setShowtime] = useState(null);
  const [seats, setSeats] = useState([]);
  const [ticketPrices, setTicketPrices] = useState(null);
  
  // Selections
  const [quantities, setQuantities] = useState({
    ADULT: 0,
    CHILD: 0,
    SENIOR: 0
  });
  const [selectedSeats, setSelectedSeats] = useState([]);
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const fallbackShowtime = location.state?.showtime || null;
  const fallbackMovie = location.state?.movie || null;

  const buildFallbackSeats = () => {
    const rowLabels = ['A', 'B', 'C', 'D', 'E', 'F'];
    const fallbackSeats = [];

    rowLabels.forEach((row) => {
      for (let seatNumber = 1; seatNumber <= 10; seatNumber += 1) {
        fallbackSeats.push({
          id: `${row}${seatNumber}`,
          row_label: row,
          seat_number: seatNumber,
          seat_identifier: `${row}${seatNumber}`,
          status: 'available'
        });
      }
    });

    return fallbackSeats;
  };

  useEffect(() => {
    const fetchShowtimeData = async () => {
      setLoading(true);
      try {
        const stData = await showtimeService.getSeatMap(id);
        setShowtime(stData);
        setSeats(stData.seats || []);

        // Fetch ticket prices dynamically from the bookings API
        try {
          const pricesRes = await API.get('/bookings/ticket-prices/');
          const priceMap = {};
          pricesRes.data.forEach(p => {
            priceMap[p.age_category] = p.price;
          });
          setTicketPrices(priceMap);
        } catch (priceErr) {
          // Fallback if API fails
          setTicketPrices({
            ADULT: "12.00",
            CHILD: "8.00",
            SENIOR: "9.00"
          });
        }
      } catch (err) {
        console.error("Failed to load showtime seats:", err);

        if (fallbackShowtime) {
          setShowtime({
            ...fallbackShowtime,
            movie_detail: fallbackMovie || fallbackShowtime.movie_detail || { title: 'Selected Movie' },
            hall_detail: fallbackShowtime.hall_detail || { name: 'Main Hall' },
            start_time: fallbackShowtime.start_time || fallbackShowtime.time || new Date().toISOString()
          });
          setSeats(buildFallbackSeats());
        } else {
          setError("Failed to load showtime seat layout.");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchShowtimeData();
  }, [id]);

  const handleQuantityChange = (key, value) => {
    setQuantities(prev => ({
      ...prev,
      [key]: value
    }));
    // Reset selections if ticket count decreases below selected seats
    setSelectedSeats([]);
  };

  const totalTickets = quantities.ADULT + quantities.CHILD + quantities.SENIOR;

  const handleSeatToggle = (seat) => {
    setError('');
    const isSelected = selectedSeats.some(s => s.id === seat.id);

    if (isSelected) {
      setSelectedSeats(prev => prev.filter(s => s.id !== seat.id));
    } else {
      if (selectedSeats.length >= totalTickets) {
        setError(`You can only select up to ${totalTickets} seats based on your selected ticket count. Increase quantities if you need more seats.`);
        return;
      }
      setSelectedSeats(prev => [...prev, seat]);
    }
  };

  const calculateOrderSummary = () => {
    let subtotal = 0;
    if (ticketPrices) {
      subtotal += quantities.ADULT * parseFloat(ticketPrices.ADULT || '12');
      subtotal += quantities.CHILD * parseFloat(ticketPrices.CHILD || '8');
      subtotal += quantities.SENIOR * parseFloat(ticketPrices.SENIOR || '9');
    }
    const tax = subtotal * 0.08;
    const bookingFee = 2.5;
    const total = subtotal + tax + bookingFee;
    return { subtotal, tax, bookingFee, total };
  };

  const summary = calculateOrderSummary();

  if (loading) {
    return <LoadingSpinner fullPage message="Loading booking page..." />;
  }

  if (!showtime) {
    return (
      <div className="container my-5 text-center text-white">
        <h3>Showtime not found.</h3>
        <Link to="/" className="btn btn-gold text-dark fw-bold mt-3">Return Home</Link>
      </div>
    );
  }

  return (
    <div className="container my-4 text-white">
      <h1 className="fw-bold mb-2">{showtime.movie_detail.title}</h1>
      <p className="text-white-50 mb-4">
        {/* {new Date(showtime.start_time).toLocaleString('en-US', { 
          weekday: 'long',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        })} - {showtime.hall_detail.name} */}
        {showtime.start_time} - {showtime.hall_detail.name}
      </p>

      {error && <ErrorAlert message={error} onClose={() => setError('')} />}

      <div className="row g-4">
        {/* Left Column: Tickets & Seats */}
        <div className="col-lg-8">
          <TicketCategorySelector 
            quantities={quantities} 
            onQuantityChange={handleQuantityChange}
            prices={ticketPrices}
          />

          <SeatMap 
            seats={seats}
            selectedSeatIds={selectedSeats.map(s => s.id)}
            onSeatToggle={handleSeatToggle}
          />
        </div>

        {/* Right Column: Order Summary */}
        <div className="col-lg-4">
          <div className="card bg-dark-card border-secondary text-white p-4 shadow-lg sticky-top" style={{ top: '20px' }}>
            <h4 className="fw-bold mb-3 text-gold border-bottom border-secondary pb-2">Order Summary</h4>
            
            <div className="mb-3">
              <h6 className="fw-bold mb-2">Tickets Selected:</h6>
              {quantities.ADULT > 0 && <p className="mb-1 small">Adult (x{quantities.ADULT}): ${(quantities.ADULT * parseFloat(ticketPrices?.ADULT || 12)).toFixed(2)}</p>}
              {quantities.CHILD > 0 && <p className="mb-1 small">Child (x{quantities.CHILD}): ${(quantities.CHILD * parseFloat(ticketPrices?.CHILD || 8)).toFixed(2)}</p>}
              {quantities.SENIOR > 0 && <p className="mb-1 small">Senior (x{quantities.SENIOR}): ${(quantities.SENIOR * parseFloat(ticketPrices?.SENIOR || 9)).toFixed(2)}</p>}
              {totalTickets === 0 && <p className="text-white-50 small">No tickets selected</p>}
            </div>

            <div className="mb-3">
              <h6 className="fw-bold mb-2">Seats Selected:</h6>
              {selectedSeats.length > 0 ? (
                <p className="small">{selectedSeats.map(s => s.seat_identifier).join(', ')}</p>
              ) : (
                <p className="text-white-50 small">No seats selected</p>
              )}
            </div>

            <hr className="border-secondary" />

            <div className="d-flex justify-content-between mb-2 small">
              <span>Subtotal:</span>
              <span>${summary.subtotal.toFixed(2)}</span>
            </div>
            <div className="d-flex justify-content-between mb-2 small">
              <span>Tax (8%):</span>
              <span>${summary.tax.toFixed(2)}</span>
            </div>
            <div className="d-flex justify-content-between mb-3 small">
              <span>Booking Fee:</span>
              <span>${summary.bookingFee.toFixed(2)}</span>
            </div>

            <hr className="border-secondary" />

            <div className="d-flex justify-content-between mb-4">
              <span className="fw-bold">Total:</span>
              <span className="fw-bold text-gold fs-5">${summary.total.toFixed(2)}</span>
            </div>

            <button 
              disabled={totalTickets === 0 || selectedSeats.length !== totalTickets}
              className="btn btn-gold text-dark fw-bold w-100 py-2"
            >
              Proceed to Checkout (UI Only)
            </button>

            <Link to="/" className="btn btn-outline-gold w-100 mt-2">Cancel</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeatSelection;
