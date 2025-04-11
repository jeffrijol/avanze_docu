/// <reference types="astro/client" />
import type { User } from "./database.types";

declare global {
  namespace Astro {
    interface Locals {
      user: User | null; // Usa el User del schema de Supabase
    }
  }
}