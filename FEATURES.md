# Gatherly — Feature Catalog

## Authentication & User Management
- **User Registration** — Sign up with full name, email, password, and role selection (user or organizer).
- **User Login** — Email/password login issuing a JWT for session use.
- **Role-Based Access Control** — Separate flows and permissions for regular users vs. event organizers.
- **Session Persistence** — JWT stored in AsyncStorage; user is auto-restored on app launch.
- **Profile View** — Display of user details (name, email, role).
- **Logout** — Clears the session and returns the user to the login screen.

## Event Management (Organizer)
- **Create Event** — Form to define title, description, location, start date/time, and capacity.
- **My Events List** — Organizer-only listing of created events with reservation counts and status.
- **Edit Event** — Modify event properties after creation.
- **Cancel/Delete Event** — Marks event as cancelled and cancels all associated reservations.
- **View Event Reservations** — Inspect the attendee list for any given event.
- **Capacity Tracking** — Real-time computation of available vs. total seats.

## Event Discovery (User)
- **Browse Events** — Scrollable list of active, upcoming events.
- **Search by Title** — Real-time text filtering of the event list.
- **Event Details Screen** — Full event info including organizer, location, time, and capacity.
- **Status Badges** — Visual indicators for Active, Fully Booked, and Cancelled.
- **Today / Upcoming Grouping** — Events sorted into "Today" and "Upcoming" sections.
- **Soon-Starting Highlight** — Events within 72 hours receive emphasized styling.
- **Availability Bar** — Visual capacity indicator showing seats remaining.

## Calendar
- **Monthly Calendar View** — Interactive month grid showing days with events.
- **Multi-Dot Day Markers** — Each event on a date renders a marker dot.
- **Day Selection** — Tapping a date filters events to that day.
- **Bulgarian Locale** — Month and weekday names localized to Bulgarian.

## Reservations
- **Make Reservation** — Book one or more seats for an event with confirmation modal.
- **My Reservations** — Personal list of all bookings made by the user.
- **Status Filtering** — Filter reservations by Active / Past / Cancelled.
- **Cancel Reservation** — Cancel an active booking and free up capacity.
- **Duplicate Prevention** — Users cannot hold two active reservations for the same event.
- **Overbooking Prevention** — Server-side capacity check blocks reservations beyond available seats.

## Sharing & Deep Linking
- **Share Event** — Native share sheet for sending event links via any installed app.
- **Deep Links** — Events open directly via `gatherly://event/:id` and `https://gatherly.app/event/:id`.

## UI & UX
- **Tab Navigation** — Bottom tabs adapt to role (Events/Calendar/Reservations or Events/Calendar/My Events + Profile).
- **Loading Skeletons** — Placeholder UI while data is fetched.
- **Empty States** — Friendly empty-state messaging when lists are empty.
- **Toast Notifications** — Lightweight feedback for success, warning, and error states.
- **Confirmation Modals** — Guard rails on destructive or important actions (reserve, cancel, delete).
- **Pull-to-Refresh** — Swipe-down refresh on list views.
- **Theme Modes** — Light, Dark, and System theme, persisted across sessions.
- **Safe Area & Keyboard Handling** — Proper layout on notched devices and during input.

## Validation
- **Email & Password Rules** — Format checks and minimum password length.
- **Event Field Constraints** — Title 3–120 chars, description ≤600 chars, capacity 1–100 000.
- **Future-Date Enforcement** — Event start must be in the future.
- **Localized Error Messages** — Bulgarian validation and error feedback.

## Backend & API
- **REST API (Express)** — Modular route handlers for auth, events, and reservations.
- **JWT Auth Middleware** — Bearer-token protection with 24h expiration.
- **Role Authorization Middleware** — Organizer-only endpoints gated server-side.
- **Zod Input Validation** — Schema validation on all write endpoints.
- **CORS** — Configured for mobile and web clients.

## Data Layer
- **SQLite with Turso Sync** — Local SQLite with optional Turso cloud database.
- **Users / Events / Reservations Schema** — Normalized tables with foreign keys and indexes.
- **Password Hashing** — Bcrypt-hashed user credentials.
- **Unique Reservation Constraint** — Prevents duplicate confirmed bookings per user/event.
- **Cascading Deletes** — Removing parent records cleans up dependents.

## Localization & Configuration
- **Bulgarian UI** — All user-facing copy in Bulgarian.
- **Bulgarian Date/Time Formatting** — Locale-aware date and time rendering.
- **Dynamic API URL** — Environment-aware backend endpoint (dev vs. production).
