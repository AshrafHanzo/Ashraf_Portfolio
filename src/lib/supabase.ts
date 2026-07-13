import { createClient } from "@supabase/supabase-js";

// ─────────────────────────────────────────────────────────────────────────────
// Ashraf Ali — Supabase Storage
// Used for file storage (resume PDF, images) instead of Firebase Storage.
// Bucket `portfolio` is PUBLIC, so downloads work via the public URL directly.
// The publishable (anon) key is only needed for uploads from the admin panel.
// ─────────────────────────────────────────────────────────────────────────────
export const SUPABASE_URL = "https://hvimkesgfmetklwmrovi.supabase.co";
export const SUPABASE_ANON_KEY = "sb_publishable_aCKXwRSq4i-KHjMUjKXc7g_K5pbPFkM";
export const SUPABASE_BUCKET = "portfolio";

// Default resume file living in the bucket
export const RESUME_FILE = "Ash_Resume.pdf";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Build a public URL for any object in the portfolio bucket
export const getPublicUrl = (path: string): string => {
    const { data } = supabase.storage.from(SUPABASE_BUCKET).getPublicUrl(path);
    return data.publicUrl;
};

// Public URL for the resume PDF
export const RESUME_PUBLIC_URL = `${SUPABASE_URL}/storage/v1/object/public/${SUPABASE_BUCKET}/${RESUME_FILE}`;

// Download a file from the bucket as a Blob (nice named-download, no CORS popups)
export const downloadFromBucket = async (path: string): Promise<Blob> => {
    const { data, error } = await supabase.storage.from(SUPABASE_BUCKET).download(path);
    if (error || !data) throw error || new Error("Download failed");
    return data;
};

// Upload / replace a file in the bucket (used by the admin dashboard)
export const uploadToBucket = async (path: string, file: File): Promise<string> => {
    const { error } = await supabase.storage
        .from(SUPABASE_BUCKET)
        .upload(path, file, { upsert: true, contentType: file.type });
    if (error) throw error;
    return getPublicUrl(path);
};
