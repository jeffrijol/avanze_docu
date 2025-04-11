// src/env.d.ts
/// <reference types="astro/client" />
import type { User } from "../database.types";

declare global {
  namespace Astro {
    interface Locals {
      user: User | null; // Usa el tipo User generado
    }
  }
}