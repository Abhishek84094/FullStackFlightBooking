require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});

db.connect(err => {
    if (err) console.error('❌ DB Error:', err);
    else console.log('✅ Connected to MySQL');
});

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
});

// --- AUTH ROUTES ---

app.post('/api/register', (req, res) => {
    const { name, email, password } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 8);
    
    const sql = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";
    db.query(sql, [name, email, hashedPassword], (err, result) => {
        if (err) return res.status(500).json({ message: "Email already exists or DB error" });
        res.json({ message: "User registered!", userId: result.insertId });
    });
});

app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    const sql = "SELECT * FROM users WHERE email = ?";
    db.query(sql, [email], (err, results) => {
        if (err || results.length === 0) return res.status(401).json({ message: "Invalid credentials" });
        
        const user = results[0];
        const isValid = bcrypt.compareSync(password, user.password);
        if (!isValid) return res.status(401).json({ message: "Invalid credentials" });

        res.json({ id: user.id, name: user.name, email: user.email, role: user.role });
    });
});

// --- FLIGHT ROUTES ---

app.get('/api/flights', (req, res) => {
    const sql = "SELECT * FROM flights";
    db.query(sql, (err, result) => res.json(result));
});

app.get('/api/flights/:id/seats', (req, res) => {
    const sql = "SELECT seat_number FROM bookings WHERE flight_id = ? AND status != 'Cancelled'";
    db.query(sql, [req.params.id], (err, result) => {
        if (err) return res.status(500).json(err);
        const takenSeats = result.map(row => row.seat_number).filter(s => s); 
        res.json(takenSeats);
    });
});

app.post('/api/flights', (req, res) => {
    const { origin, destination, date, price, seats } = req.body;
    const sql = "INSERT INTO flights (origin, destination, date, price, seats) VALUES (?, ?, ?, ?, ?)";
    db.query(sql, [origin, destination, date, price, seats], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json({ message: "Flight added" });
    });
});

app.delete('/api/flights/:id', (req, res) => {
    db.query("DELETE FROM flights WHERE id = ?", [req.params.id], () => res.json({ message: "Deleted" }));
});

// --- BOOKING ROUTES ---

app.post('/api/book', (req, res) => {
    const { flight_id, passenger_name, email, seat_number, flight_details, payment_method, transaction_id } = req.body;
    
    // Check if seat is taken and NOT cancelled
    const sqlCheck = "SELECT * FROM bookings WHERE flight_id = ? AND seat_number = ? AND status != 'Cancelled'";
    db.query(sqlCheck, [flight_id, seat_number], (err, results) => {
        if (results.length > 0) return res.status(400).json({ message: "Seat already taken!" });

        const sqlUpdate = "UPDATE flights SET seats = seats - 1 WHERE id = ?";
        db.query(sqlUpdate, [flight_id], () => {
            
            const sqlInsert = "INSERT INTO bookings (flight_id, passenger_name, email, seat_number, amount, payment_method, transaction_id) VALUES (?, ?, ?, ?, ?, ?, ?)";
            db.query(sqlInsert, [flight_id, passenger_name, email, seat_number, flight_details.price, payment_method, transaction_id], (err, result) => {
                if (err) return res.status(500).json(err);

                if (process.env.EMAIL_USER) {
                    const mailOptions = {
                        from: process.env.EMAIL_USER,
                        to: email,
                        subject: 'Flight Confirmed!',
                        text: `Hello ${passenger_name},\n\nConfirmed: ${flight_details.origin} -> ${flight_details.destination}\nSeat: ${seat_number}\nAmount: ₹${flight_details.price}`
                    };
                    transporter.sendMail(mailOptions, (e) => { if(e) console.log(e); });
                }
                res.json({ message: "Booking confirmed!" });
            });
        });
    });
});

app.get('/api/bookings/:email', (req, res) => {
    const sql = `
        SELECT b.id as booking_id, b.passenger_name, b.booking_date, b.seat_number, b.status,
               f.origin, f.destination, f.date as flight_date, f.price 
        FROM bookings b 
        JOIN flights f ON b.flight_id = f.id 
        WHERE b.email = ?
        ORDER BY b.booking_date DESC`;
    db.query(sql, [req.params.email], (err, result) => res.json(result));
});

// CANCEL Booking Route
app.put('/api/bookings/:id/cancel', (req, res) => {
    const bookingId = req.params.id;
    
    const sqlGetInfo = `
        SELECT b.flight_id, b.status, b.email, b.passenger_name, b.seat_number,
               f.origin, f.destination, f.date
        FROM bookings b
        JOIN flights f ON b.flight_id = f.id
        WHERE b.id = ?
    `;

    db.query(sqlGetInfo, [bookingId], (err, results) => {
        if (err) return res.status(500).json(err);
        if (results.length === 0) return res.status(404).json({ message: 'Booking not found' });
        
        const booking = results[0];
        
        if (booking.status === 'Cancelled') {
            return res.status(400).json({ message: 'Booking is already cancelled' });
        }

        db.query('UPDATE bookings SET status = ? WHERE id = ?', ['Cancelled', bookingId], (err) => {
            if (err) return res.status(500).json(err);
            
            db.query('UPDATE flights SET seats = seats + 1 WHERE id = ?', [booking.flight_id], (err) => {
                if (err) return res.status(500).json(err);

                if (process.env.EMAIL_USER) {
                    const mailOptions = {
                        from: process.env.EMAIL_USER,
                        to: booking.email,
                        subject: 'Flight Booking Cancelled',
                        text: `Hello ${booking.passenger_name},\n\nYour booking for flight ${booking.origin} to ${booking.destination} on ${new Date(booking.date).toLocaleDateString()} (Seat: ${booking.seat_number}) has been cancelled.\n\nA refund will be processed shortly.\n\nAeroSwift Team`
                    };
                    transporter.sendMail(mailOptions, (e) => { if(e) console.log(e); });
                }

                res.json({ message: 'Booking cancelled successfully' });
            });
        });
    });
});

// NEW: ADMIN ANALYTICS ROUTE
app.get('/api/admin/analytics', (req, res) => {
    // Calculate total revenue (excluding cancelled), total bookings, and total active flights
    const sql = `
        SELECT 
            (SELECT COALESCE(SUM(amount), 0) FROM bookings WHERE status != 'Cancelled') as revenue,
            (SELECT COUNT(*) FROM bookings) as total_bookings,
            (SELECT COUNT(*) FROM flights) as total_flights
    `;
    db.query(sql, (err, result) => {
        if (err) return res.status(500).json(err);
        res.json(result[0]);
    });
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});