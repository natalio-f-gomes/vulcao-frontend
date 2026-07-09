import { ProfileModel } from "../../Interfaces/Authentication";
import { AddressModel } from "../../Interfaces/global";

export interface CartItem {
  id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  dateAdded: string;
  imageUrl: string[];
}

export type OrderItem = CartItem;

export interface BusinessCart {
  businessId: string;
  businessName: string;
  phoneNumber: string;
  address: AddressModel;
  offerings: CartItem[];
}

const FALLBACK = "Data indisponível";

/**
 * Parses backend timestamps like:
 *   2026-07-08T14:21:35.258963-01:00[Atlantic/Cape_Verde]
 * (Java ZonedDateTime format), plus plain ISO strings.
 * Never throws — returns a fallback string on any bad input.
 */
export const formatDateTime = (iso: string | null | undefined): string => {
  try {
    if (!iso || typeof iso !== "string") return FALLBACK;

    // 1. Strip the Java zone ID suffix: "[Atlantic/Cape_Verde]"
    //    The numeric offset (-01:00) that precedes it is standard ISO
    //    and is all JS needs.
    let cleaned = iso.replace(/\[.*\]$/, "").trim();

    // 2. Trim fractional seconds to 3 digits (microseconds -> milliseconds).
    //    Most engines tolerate 6 digits, but not all — don't gamble.
    cleaned = cleaned.replace(/(\.\d{3})\d+/, "$1");

    const date = new Date(cleaned);

    // 3. Invalid Date check — getTime() is NaN for unparseable input
    if (Number.isNaN(date.getTime())) return FALLBACK;

    const formatted = new Intl.DateTimeFormat("pt-PT", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(date);

    return formatted.replace("às", "AS").toUpperCase();
  } catch {
    // Last-resort net for anything unexpected (bad locale data, etc.)
    return FALLBACK;
  }
};

export interface OrderDisplay {
  businessId: string;
  businessName: string;
  phoneNumber: string;
  totalCost: number;
  status: string;
  trackId: string;
  note: string;
  items: OrderItem[];
  canceled?: boolean;
}
