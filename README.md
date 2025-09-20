# Ride_Tool
# 🚲 Shreeji E-Bike Ride Booking System

A complete ride booking web application for **Shreeji E-Bike World** that allows customers to book eco-friendly rides online.  
All booking data is securely stored in **Firebase Firestore**, and only the owner can access the booking dashboard using **Firebase Authentication**.

---

## 📌 Features
- **Customer Ride Booking Page**
  - Users can enter their **Name, Mobile Number, Email, and Pickup Address**.
  - Data is stored in **Firebase Firestore** in real-time.
  - Responsive, modern UI with animations.
  - Instant **Thank You message** after booking.

- **Owner Dashboard**
  - Protected by **Firebase Authentication**.
  - Owner logs in with **email & password**.
  - Displays all ride bookings in a **real-time table**.
  - Only authenticated owner can access booking data.

- **Firebase Integration**
  - Firebase Hosting (optional for deployment).
  - Firestore for ride data storage.
  - Firebase Auth for secure owner login.

---

## ⚙️ Tech Stack
- **Frontend**: HTML, CSS, JavaScript  
- **Database**: Firebase Firestore  
- **Authentication**: Firebase Auth  
- **Hosting (optional)**: Firebase Hosting  

---

## 🚀 Project Setup

### 1. Clone Repository
```bash
git clone https://github.com/yourusername/shreeji-ebike-booking.git
cd shreeji-ebike-booking
