import { supabase } from "@/lib/supabase";
import {
  VisionFamilyApp,
  VisionFamilyAppInsert,
  VisionFamilyAppUpdate,
} from "@/types/visionFamily";

const STORAGE_KEY = "vision_family_apps";

// Seed data used when no apps exist yet (localStorage or DB)
const SEED_APPS: VisionFamilyApp[] = [
  {
    id: "88888888-8888-8888-8888-888888888888",
    name: "LifeLink",
    tagline: "AI-powered emergency response and coordination.",
    description:
      "LifeLink connects individuals, first responders, and medical professionals with real-time AI assistance during critical situations.",
    url: null,
    logo_url: null,
    logo_emoji: "\u{1F499}",
    accent_color: "#3b82f6",
    category: "Platform",
    is_published: true,
    is_featured: true,
    display_order: 1,
    powered_by: ["Vision AI", "Supabase", "React"],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "99999999-9999-9999-9999-999999999999",
    name: "Vision-Sync",
    tagline: "AI Agents, Chatbots & Intelligent Automation.",
    description:
      "Transform businesses with custom AI agents, conversational AI, and 24/7 intelligent automation \u2014 built enterprise-grade from day one.",
    url: "https://www.vision-sync.co",
    logo_url: null,
    logo_emoji: "\u{1F9E0}",
    accent_color: "#06b6d4",
    category: "Platform",
    is_published: true,
    is_featured: true,
    display_order: 0,
    powered_by: ["Claude AI", "Supabase", "React", "TypeScript"],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

function isTableMissing(error: { message?: string; code?: string }): boolean {
  const msg = error.message || "";
  return (
    msg.includes("schema cache") ||
    msg.includes("relation") ||
    msg.includes("does not exist") ||
    error.code === "PGRST204" ||
    error.code === "42P01"
  );
}

// --- localStorage helpers ---

function readLocal(): VisionFamilyApp[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as VisionFamilyApp[];
  } catch {
    return [];
  }
}

function writeLocal(apps: VisionFamilyApp[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(apps));
}

function ensureSeeded(): VisionFamilyApp[] {
  let apps = readLocal();
  if (apps.length === 0) {
    apps = SEED_APPS;
    writeLocal(apps);
  }
  return apps;
}

// --- Public API (mirrors Supabase operations, auto-fallback) ---

/** Track whether we've already detected the table is missing this session */
let tableMissing = false;

export async function fetchAllApps(): Promise<{
  data: VisionFamilyApp[];
  isLocal: boolean;
}> {
  if (!tableMissing) {
    try {
      const { data, error } = await supabase
        .from("vision_family_apps")
        .select("*")
        .order("display_order", { ascending: true })
        .order("created_at", { ascending: false });

      if (error) {
        if (isTableMissing(error)) {
          tableMissing = true;
        } else {
          throw error;
        }
      } else {
        return { data: data || [], isLocal: false };
      }
    } catch (err: unknown) {
      const e = err as { message?: string; code?: string };
      if (isTableMissing(e)) {
        tableMissing = true;
      } else {
        throw err;
      }
    }
  }

  // Fallback to localStorage
  return { data: ensureSeeded(), isLocal: true };
}

export async function fetchPublishedApps(): Promise<{
  data: VisionFamilyApp[];
  isLocal: boolean;
}> {
  if (!tableMissing) {
    try {
      const { data, error } = await supabase
        .from("vision_family_apps")
        .select("*")
        .eq("is_published", true)
        .order("display_order", { ascending: true });

      if (error) {
        if (isTableMissing(error)) {
          tableMissing = true;
        } else {
          throw error;
        }
      } else {
        return { data: data || [], isLocal: false };
      }
    } catch (err: unknown) {
      const e = err as { message?: string; code?: string };
      if (isTableMissing(e)) {
        tableMissing = true;
      } else {
        throw err;
      }
    }
  }

  const all = ensureSeeded();
  const published = all
    .filter((a) => a.is_published)
    .sort((a, b) => a.display_order - b.display_order);
  return { data: published, isLocal: true };
}

export async function insertApp(
  payload: VisionFamilyAppInsert
): Promise<void> {
  if (!tableMissing) {
    const { error } = await supabase
      .from("vision_family_apps")
      .insert([payload]);

    if (error) {
      if (isTableMissing(error)) {
        tableMissing = true;
      } else {
        throw error;
      }
    } else {
      return;
    }
  }

  // localStorage fallback
  const apps = ensureSeeded();
  const newApp: VisionFamilyApp = {
    ...payload,
    id: crypto.randomUUID(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  apps.push(newApp);
  writeLocal(apps);
}

export async function updateApp(
  id: string,
  payload: VisionFamilyAppUpdate
): Promise<void> {
  if (!tableMissing) {
    const { error } = await supabase
      .from("vision_family_apps")
      .update(payload)
      .eq("id", id);

    if (error) {
      if (isTableMissing(error)) {
        tableMissing = true;
      } else {
        throw error;
      }
    } else {
      return;
    }
  }

  // localStorage fallback
  const apps = ensureSeeded();
  const idx = apps.findIndex((a) => a.id === id);
  if (idx !== -1) {
    apps[idx] = {
      ...apps[idx],
      ...payload,
      updated_at: new Date().toISOString(),
    };
    writeLocal(apps);
  }
}

export async function deleteApp(id: string): Promise<void> {
  if (!tableMissing) {
    const { error } = await supabase
      .from("vision_family_apps")
      .delete()
      .eq("id", id);

    if (error) {
      if (isTableMissing(error)) {
        tableMissing = true;
      } else {
        throw error;
      }
    } else {
      return;
    }
  }

  // localStorage fallback
  const apps = ensureSeeded();
  writeLocal(apps.filter((a) => a.id !== id));
}

/** Returns true if currently using localStorage fallback */
export function isUsingLocalStorage(): boolean {
  return tableMissing;
}
