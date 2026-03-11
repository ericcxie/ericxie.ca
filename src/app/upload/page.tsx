"use client";

import { useState } from "react";
import {
  Dropzone,
  DropZoneArea,
  DropzoneDescription,
  DropzoneFileList,
  DropzoneFileListItem,
  DropzoneFileMessage,
  DropzoneTrigger,
  DropzoneMessage,
  DropzoneRemoveFile,
  InfiniteProgress,
  useDropzone,
} from "@/components/ui/dropzone";

export default function UploadPage() {
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [location, setLocation] = useState("");
  const [date, setDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [uploadedPhotos, setUploadedPhotos] = useState<
    { url: string; filename: string }[]
  >([]);

  const dropzone = useDropzone({
    onDropFile: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("location", location);
      formData.append("date", new Date(date).toISOString());

      const res = await fetch("/api/photos/upload", {
        method: "POST",
        headers: { "x-upload-password": password },
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json();
        return { status: "error" as const, error: err.error || "Upload failed" };
      }

      const photo = await res.json();
      setUploadedPhotos((prev) => [...prev, photo]);
      return { status: "success" as const, result: photo.url };
    },
    validation: {
      accept: { "image/*": [".jpg", ".jpeg", ".png", ".webp", ".heic"] },
      maxSize: 20 * 1024 * 1024, // 20MB
    },
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.trim()) {
      setAuthenticated(true);
    }
  };

  if (!authenticated) {
    return (
      <main className="flex flex-col gap-4">
        <h1
          className="animate-in font-system text-3xl font-bold"
          style={{ "--index": 1 } as React.CSSProperties}
        >
          Upload
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
        Upload
      </h1>

      <div
        className="animate-in flex flex-col gap-4"
        style={{ "--index": 2 } as React.CSSProperties}
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Location (e.g. Tokyo, Japan)"
            className="flex-1 rounded-lg border border-neutral-300 bg-transparent px-4 py-2 text-sm outline-none focus:border-neutral-500 dark:border-neutral-700 dark:focus:border-neutral-500"
          />
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="rounded-lg border border-neutral-300 bg-transparent px-4 py-2 text-sm outline-none focus:border-neutral-500 dark:border-neutral-700 dark:focus:border-neutral-500"
          />
        </div>

        <Dropzone {...dropzone}>
          <DropzoneDescription>
            Upload photos. JPG, PNG, WebP, HEIC up to 20MB.
          </DropzoneDescription>
          <DropzoneMessage />
          <DropZoneArea className="min-h-[200px] flex-col gap-2 border-dashed">
            <DropzoneTrigger className="text-center text-sm text-neutral-500 dark:text-neutral-400">
              Tap to select photos or drag and drop
            </DropzoneTrigger>
            <DropzoneFileList>
              {dropzone.fileStatuses.map((file) => (
                <DropzoneFileListItem key={file.id} file={file}>
                  <div className="flex items-center justify-between">
                    <span className="truncate text-sm">{file.fileName}</span>
                    <DropzoneRemoveFile
                      variant="ghost"
                      className="h-6 w-6 text-xs"
                    >
                      x
                    </DropzoneRemoveFile>
                  </div>
                  <DropzoneFileMessage />
                  <InfiniteProgress status={file.status} />
                </DropzoneFileListItem>
              ))}
            </DropzoneFileList>
          </DropZoneArea>
        </Dropzone>

        {uploadedPhotos.length > 0 && (
          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
              Uploaded ({uploadedPhotos.length})
            </p>
            <div className="grid grid-cols-3 gap-2">
              {uploadedPhotos.map((photo) => (
                <img
                  key={photo.url}
                  src={photo.url}
                  alt={photo.filename}
                  className="h-24 w-full rounded-lg object-cover"
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
