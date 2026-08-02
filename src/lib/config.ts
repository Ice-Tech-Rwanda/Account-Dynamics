import { getSettings } from "@/lib/services/settings";

export type AppSettings = Awaited<ReturnType<typeof getSettings>>;

export async function loadSettings() {
  return await getSettings();
}
