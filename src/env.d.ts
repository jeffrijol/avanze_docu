/// <reference types="astro/client" />
import type { User } from "@supabase/supabase-js";

declare global {
  namespace Astro {
    interface Locals {
      user: User | null;
    }
  }
}