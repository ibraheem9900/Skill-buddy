import { useState, useEffect, useCallback } from "react";
import { apiClient } from "@/lib/api-client";

export interface ClientBooking {
  id: string | number;
  [key: string]: unknown;
}

export interface ClientBookingsResponse {
  bookings: ClientBooking[];
  total: number;
}

export function useClientBookings(enabled = true) {
  const [bookings, setBookings] = useState<ClientBooking[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(enabled);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!enabled) {
      setBookings([]);
      setTotal(0);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await apiClient.get<ClientBookingsResponse>(
        "/api/v1/clients/bookings",
      );
      setBookings(Array.isArray(data?.bookings) ? data.bookings : []);
      setTotal(data?.total ?? 0);
    } catch {
      setError("Couldn't load bookings. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [enabled]);

  useEffect(() => {
    load();
  }, [load]);

  const retry = useCallback(() => {
    load();
  }, [load]);

  return { bookings, total, loading, error, retry };
}

/** Helper to safely extract a string field from a booking object. */
export function getBookingField(booking: ClientBooking, ...keys: string[]): string {
  for (const key of keys) {
    const val = booking[key];
    if (typeof val === "string" && val) return val;
    if (typeof val === "number") return String(val);
  }
  return "";
}

/** Helper to extract status from a booking (tries common field names). */
export function getBookingStatus(booking: ClientBooking): string {
  return getBookingField(booking, "status", "booking_status", "state", "order_status");
}

/** Helper to extract title/service name from a booking. */
export function getBookingTitle(booking: ClientBooking): string {
  return getBookingField(booking, "title", "service_name", "service_title", "name", "description");
}

/** Helper to extract date from a booking. */
export function getBookingDate(booking: ClientBooking): string {
  return getBookingField(booking, "date", "booking_date", "scheduled_date", "created_at", "date_time");
}

/** Helper to extract price from a booking. */
export function getBookingPrice(booking: ClientBooking): string {
  return getBookingField(booking, "price", "total_price", "amount", "total_amount", "cost");
}

/** Helper to extract provider name from a booking. */
export function getBookingProvider(booking: ClientBooking): string {
  return getBookingField(booking, "provider_name", "provider", "professional_name", "worker_name");
}

/** Helper to extract booking ID for display. */
export function getBookingId(booking: ClientBooking): string {
  return getBookingField(booking, "id", "booking_id", "order_id");
}
