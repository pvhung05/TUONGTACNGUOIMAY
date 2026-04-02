/* Tailwind CSS className utilities */
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge classNames with tailwind-merge to avoid conflicts
 * @example cn("px-2 py-1", "px-4") // => "py-1 px-4"
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
