/**
 * Chronos Scheduler - API Integration Helper
 * 
 * This file contains functions to communicate with your backend API
 * Update the API_URL to match your backend deployment
 * 
 * Usage:
 * 1. Set NEXT_PUBLIC_API_URL in .env
 * 2. Include this script in index.html
 * 3. Call API functions from your booking code
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

/**
 * Make authenticated API request
 */
async function apiCall(endpoint, options = {}) {
    const token = localStorage.getItem('auth_token');
    const headers = {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options.headers
    };

    try {
        const response = await fetch(`${API_URL}${endpoint}`, {
            ...options,
            headers
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'API request failed');
        }

        return await response.json();
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

/**
 * Authentication APIs
 */
const Auth = {
    /**
     * Get Google OAuth authorization URL
     */
    async getGoogleAuthUrl() {
        return apiCall('/api/auth/google-url', { method: 'GET' });
    },

    /**
     * Authenticate with Google code
     * @param {string} code - Authorization code from Google
     */
    async authenticateGoogle(code) {
        const response = await apiCall('/api/auth/google', {
            method: 'POST',
            body: JSON.stringify({ code })
        });
        
        if (response.tokens?.access_token) {
            localStorage.setItem('auth_token', response.tokens.access_token);
        }
        
        return response;
    },

    /**
     * Logout and clear token
     */
    async logout() {
        localStorage.removeItem('auth_token');
        return apiCall('/api/auth/logout', { method: 'POST' });
    },

    /**
     * Get current auth token
     */
    getToken() {
        return localStorage.getItem('auth_token');
    }
};

/**
 * Booking APIs
 */
const Bookings = {
    /**
     * Create a new booking
     * @param {Object} booking - Booking details
     */
    async create(booking) {
        return apiCall('/api/bookings', {
            method: 'POST',
            body: JSON.stringify(booking)
        });
    },

    /**
     * Get booking by ID
     * @param {string} id - Booking ID
     */
    async getById(id) {
        return apiCall(`/api/bookings/${id}`, { method: 'GET' });
    },

    /**
     * Get all bookings for user
     * @param {string} userId - User ID
     */
    async getByUser(userId) {
        return apiCall(`/api/bookings/user/${userId}`, { method: 'GET' });
    },

    /**
     * Reschedule a booking
     * @param {string} id - Booking ID
     * @param {Object} details - New date/time
     */
    async reschedule(id, details) {
        return apiCall(`/api/bookings/${id}`, {
            method: 'PUT',
            body: JSON.stringify(details)
        });
    },

    /**
     * Cancel a booking
     * @param {string} id - Booking ID
     */
    async cancel(id) {
        return apiCall(`/api/bookings/${id}`, { method: 'DELETE' });
    }
};

/**
 * Calendar APIs
 */
const Calendar = {
    /**
     * Get available time slots
     * @param {string} startDate - ISO date string
     * @param {string} endDate - ISO date string
     * @param {number} duration - Duration in minutes
     */
    async getAvailability(startDate, endDate, duration = 60) {
        const params = new URLSearchParams({
            startDate,
            endDate,
            duration
        });
        
        return apiCall(`/api/calendar/availability?${params}`, { 
            method: 'GET' 
        });
    },

    /**
     * Create calendar event for booking
     * @param {string} bookingId - Booking ID
     */
    async createEvent(bookingId) {
        return apiCall('/api/calendar/create-event', {
            method: 'POST',
            body: JSON.stringify({ bookingId })
        });
    },

    /**
     * Get calendar event details
     * @param {string} bookingId - Booking ID
     */
    async getEvent(bookingId) {
        return apiCall(`/api/calendar/events/${bookingId}`, { 
            method: 'GET' 
        });
    }
};

/**
 * Payment APIs
 */
const Payments = {
    /**
     * Create payment session
     * @param {Object} paymentData - Payment details
     */
    async create(paymentData) {
        return apiCall('/api/payments/create', {
            method: 'POST',
            body: JSON.stringify(paymentData)
        });
    },

    /**
     * Get payment status
     * @param {string} id - Payment ID
     */
    async getStatus(id) {
        return apiCall(`/api/payments/${id}`, { method: 'GET' });
    }
};

/**
 * Health check
 */
async function healthCheck() {
    try {
        const response = await fetch(`${API_URL}/api/health`);
        return response.ok;
    } catch {
        return false;
    }
}

/**
 * Example Usage in your booking form:
 */

/*
async function confirmBooking() {
    try {
        // Get available slots
        const availability = await Calendar.getAvailability(
            '2025-01-15',
            '2025-01-20',
            60
        );

        // Create booking
        const booking = await Bookings.create({
            meetingType: 'consultation',
            date: '2025-01-15',
            time: '2:00 PM',
            attendee: {
                name: 'John Smith',
                email: 'john@example.com',
                company: 'Acme Inc'
            },
            agenda: 'Strategic discussion'
        });

        // Get payment link
        const payment = await Payments.create({
            bookingId: booking.id,
            amount: 50000,
            currency: 'USD',
            email: 'john@example.com',
            returnUrl: window.location.href
        });

        // Redirect to payment
        window.location.href = payment.checkoutUrl;
    } catch (error) {
        alert('Booking failed: ' + error.message);
    }
}
*/

// Export for use in modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { Auth, Bookings, Calendar, Payments, apiCall, healthCheck };
}
