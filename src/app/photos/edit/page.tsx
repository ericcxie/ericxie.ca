"use client";

import { useCallback, useEffect, useState } from "react";

interface PhotoMetadata {
  url: string;
  filename: string;
  location: string;
  date: string;
}

export default function PhotosEditPage() {
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [photos, setPhotos] = useState<PhotoMetadata[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingUrl, setEditingUrl] = useState<string | null>(null);
  const [editLocation, setEditLocation] = useState("");
  const [editDate, setEditDate] = useState("");
  const [deletingUrls, setDeletingUrls] = useState<Set<string>>(new Set());
  const [savingUrl, setSavingUrl] = useState<string | null>(null);

  const fetchPhotos = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/photos");
      if (res.ok) setPhotos(await res.json());
    } catch {}
    setLoading(false);
  }, []);

  useEffect(() => {
    if (authenticated) fetchPhotos();
  }, [authenticated, fetchPhotos]);

  const handleDelete = async (url: string) => {
    if (!confirm("Delete this photo?")) return;
    setDeletingUrls((prev) => new Set(prev).add(url));
    try {
      const res = await fetch("/api/photos", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "x-upload-password": password,
        },
        body: JSON.stringify({ url }),
      });
      if (res.ok) {
        setPhotos((prev) => prev.filter((p) => p.url !== url));
      }
    } catch {}
    setDeletingUrls((prev) => {
      const next = new Set(prev);
      next.delete(url);
      return next;
    });
  };

  const startEdit = (photo: PhotoMetadata) => {
    setEditingUrl(photo.url);
    setEditLocation(photo.location);
    setEditDate(photo.date ? photo.date.split("T")[0] : "");
  };

  const saveEdit = async () => {
    if (!editingUrl) return;
    setSavingUrl(editingUrl);
    try {
      const res = await fetch("/api/photos/metadata", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-upload-password": password,
        },
        body: JSON.stringify({
          url: editingUrl,
          location: editLocation,
          date: new Date(editDate).toISOString(),
        }),
      });
      if (res.ok) {
        setPhotos((prev) =>
          prev.map((p) =>
            p.url === editingUrl
              ? { ...p, location: editLocation, date: new Date(editDate).toISOString() }
              : p,
          ),
        );
        setEditingUrl(null);
      }
    } catch {}
    setSavingUrl(null);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.trim()) setAuthenticated(true);
  };

  if (!authenticated) {
    return (
      <main className="flex flex-col gap-4">
        <h1
          className="animate-in font-system text-3xl font-bold"
          style={{ "--index": 1 } as React.CSSProperties}
        >
          Edit Photos
        </h1>
        <form
          onSubmit={handleLogin}
          className="animate-in flex flex-col gap-4"
          style={{ "--index": 2 } as React.CSSProperties}
        >
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="rounded-lg border border-neutral-300 bg-transparent px-4 py-2 text-sm outline-none focus:border-neutral-500 dark:border-neutral-700 dark:focus:border-neutral-500"
            autoFocus
          />
          <button
            type="submit"
            className="rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-200"
          >
            Continue
          </button>
        </form>
      </main>
    );
  }

  return (
    <main className="flex flex-col gap-4">
      <h1
        className="animate-in font-system text-3xl font-bold"
        style={{ "--index": 1 } as React.CSSProperties}
      >
        Edit Photos
      </h1>

      <div
        className="animate-in flex flex-col gap-3"
        style={{ "--index": 2 } as React.CSSProperties}
      >
        {loading && (
          <p className="text-sm text-neutral-500">Loading photos...</p>
        )}

        {!loading && photos.length === 0 && (
          <p className="text-sm text-neutral-500">No blob photos to edit.</p>
        )}

        {photos.map((photo) => (
          <div
            key={photo.url}
            className="flex gap-3 rounded-lg border border-neutral-200 p-3 dark:border-neutral-800"
          >
            <img
              src={photo.url}
              alt={photo.filename}
              className="h-20 w-20 flex-shrink-0 rounded-md object-cover"
            />

            <div className="flex min-w-0 flex-1 flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <span className="truncate text-sm font-medium">
                  {photo.filename}
                </span>
                <div className="ml-2 flex flex-shrink-0 gap-2">
                  {editingUrl !== photo.url && (
                    <button
                      onClick={() => startEdit(photo)}
                      className="text-xs text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
                    >
                      Edit
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(photo.url)}
                    disabled={deletingUrls.has(photo.url)}
                    className="text-xs text-red-500 hover:text-red-700 disabled:opacity-50 dark:hover:text-red-400"
                  >
                    {deletingUrls.has(photo.url) ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>

              {editingUrl === photo.url ? (
                <div className="flex flex-col gap-1.5">
                  <input
                    type="text"
                    value={editLocation}
                    onChange={(e) => setEditLocation(e.target.value)}
                    placeholder="City, Country"
                    className="rounded border border-neutral-300 bg-transparent px-2 py-1 text-xs outline-none focus:border-neutral-500 dark:border-neutral-700 dark:focus:border-neutral-500"
                    autoFocus
                  />
                  <input
                    type="date"
                    value={editDate}
                    onChange={(e) => setEditDate(e.target.value)}
                    className="rounded border border-neutral-300 bg-transparent px-2 py-1 text-xs outline-none focus:border-neutral-500 dark:border-neutral-700 dark:focus:border-neutral-500"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={saveEdit}
                      disabled={savingUrl === photo.url}
                      className="self-start text-xs font-medium text-neutral-700 hover:text-neutral-900 disabled:opacity-50 dark:text-neutral-300 dark:hover:text-neutral-100"
                    >
                      {savingUrl === photo.url ? "Saving..." : "Save"}
                    </button>
                    <button
                      onClick={() => setEditingUrl(null)}
                      className="self-start text-xs text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <span className="text-xs text-neutral-500 dark:text-neutral-400">
                  {photo.location || "No location"} &middot;{" "}
                  {photo.date ? photo.date.split("T")[0] : "No date"}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
