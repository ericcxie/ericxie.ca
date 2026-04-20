"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/lib/useAuth";

interface AboutData {
  intro: {
    role: string;
    school: { name: string; url: string };
    company: { name: string; url: string; role: string };
    bio: string;
    linkedin: string;
    email: string;
  };
  current: {
    description: string;
    location: { name: string; lng: number; lat: number };
    interests: { title: string; content: string }[];
  };
}

export default function EditPage() {
  const { password, setPassword, authenticated, loginError, handleLogin, checking, lockedOut } = useAuth();
  const [data, setData] = useState<AboutData | null>(null);
  const [original, setOriginal] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/edit");
      if (res.ok) {
        const d = await res.json();
        setData(d);
        setOriginal(JSON.stringify(d));
      }
    } catch {}
    setLoading(false);
  }, []);

  useEffect(() => {
    if (authenticated) fetchData();
  }, [authenticated, fetchData]);

  const hasChanges = () => {
    return data && JSON.stringify(data) !== original;
  };

  const saveAll = async () => {
    if (!data) return;
    setSaving(true);
    try {
      const res = await fetch("/api/edit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-upload-password": password,
        },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        setOriginal(JSON.stringify(data));
        alert("Changes saved and deployed!");
      } else {
        const err = await res.json();
        alert(`Failed to save: ${err.error}`);
      }
    } catch {
      alert("Failed to save changes");
    }
    setSaving(false);
  };


  const updateIntro = (field: string, value: string) => {
    if (!data) return;
    setData({ ...data, intro: { ...data.intro, [field]: value } });
  };

  const updateCompany = (field: string, value: string) => {
    if (!data) return;
    setData({
      ...data,
      intro: {
        ...data.intro,
        company: { ...data.intro.company, [field]: value },
      },
    });
  };

  const updateSchool = (field: string, value: string) => {
    if (!data) return;
    setData({
      ...data,
      intro: {
        ...data.intro,
        school: { ...data.intro.school, [field]: value },
      },
    });
  };

  const updateCurrent = (field: string, value: string) => {
    if (!data) return;
    setData({ ...data, current: { ...data.current, [field]: value } });
  };

  const updateLocation = (field: string, value: string | number) => {
    if (!data) return;
    setData({
      ...data,
      current: {
        ...data.current,
        location: { ...data.current.location, [field]: value },
      },
    });
  };

  const updateInterest = (index: number, value: string) => {
    if (!data) return;
    const interests = [...data.current.interests];
    interests[index] = { ...interests[index], content: value };
    setData({ ...data, current: { ...data.current, interests } });
  };

  if (checking) {
    return (
      <main className="flex flex-col gap-4">
        <h1 className="animate-in font-system text-3xl font-bold" style={{ "--index": 1 } as React.CSSProperties}>
          Edit About
        </h1>
        <p className="animate-in text-sm text-neutral-500" style={{ "--index": 2 } as React.CSSProperties}>Loading...</p>
      </main>
    );
  }

  if (!authenticated) {
    return (
      <main className="flex flex-col gap-4">
        <h1
          className="animate-in font-system text-3xl font-bold"
          style={{ "--index": 1 } as React.CSSProperties}
        >
          Edit About
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
            disabled={lockedOut}
            className="rounded-lg border border-neutral-300 bg-transparent px-4 py-2 text-sm outline-none focus:border-neutral-500 disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-700 dark:focus:border-neutral-500"
            autoFocus
          />
          {(loginError || lockedOut) && (
            <p className="text-sm text-red-500">
              {lockedOut ? "Too many failed attempts. Try again in 8760 hours." : loginError}
            </p>
          )}
          <button
            type="submit"
            disabled={lockedOut}
            className="rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-200"
          >
            Continue
          </button>
        </form>
      </main>
    );
  }

  if (loading || !data) {
    return (
      <main className="flex flex-col gap-4">
        <h1 className="animate-in font-system text-3xl font-bold">
          Edit About
        </h1>
        <p className="text-sm text-neutral-500">Loading...</p>
      </main>
    );
  }

  const inputClass =
    "w-full rounded-lg border border-neutral-300 bg-transparent px-3 py-2 text-sm outline-none focus:border-neutral-500 dark:border-neutral-700 dark:focus:border-neutral-500";
  const labelClass = "text-xs font-medium text-neutral-500 dark:text-neutral-400";

  return (
    <main className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1
          className="animate-in font-system text-3xl font-bold"
          style={{ "--index": 1 } as React.CSSProperties}
        >
          Edit About
        </h1>
        {hasChanges() && (
          <button
            onClick={saveAll}
            disabled={saving}
            className="animate-in rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-neutral-800 disabled:opacity-50 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-200"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        )}
      </div>

      {/* Intro Section */}
      <section
        className="animate-in flex flex-col gap-4"
        style={{ "--index": 2 } as React.CSSProperties}
      >
        <h2 className="text-lg font-semibold">Intro</h2>
        <div className="flex flex-col gap-3 rounded-lg border border-neutral-200 p-4 dark:border-neutral-800">
          <div className="flex flex-col gap-1">
            <label className={labelClass}>Role</label>
            <input
              type="text"
              value={data.intro.role}
              onChange={(e) => updateIntro("role", e.target.value)}
              className={inputClass}
              placeholder="e.g. Computer Engineering student"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className={labelClass}>School Name</label>
              <input
                type="text"
                value={data.intro.school.name}
                onChange={(e) => updateSchool("name", e.target.value)}
                className={inputClass}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className={labelClass}>School URL</label>
              <input
                type="text"
                value={data.intro.school.url}
                onChange={(e) => updateSchool("url", e.target.value)}
                className={inputClass}
              />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="flex flex-col gap-1">
              <label className={labelClass}>Company Name</label>
              <input
                type="text"
                value={data.intro.company.name}
                onChange={(e) => updateCompany("name", e.target.value)}
                className={inputClass}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className={labelClass}>Company URL</label>
              <input
                type="text"
                value={data.intro.company.url}
                onChange={(e) => updateCompany("url", e.target.value)}
                className={inputClass}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className={labelClass}>Company Role</label>
              <input
                type="text"
                value={data.intro.company.role}
                onChange={(e) => updateCompany("role", e.target.value)}
                className={inputClass}
              />
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <label className={labelClass}>Bio</label>
            <textarea
              value={data.intro.bio}
              onChange={(e) => updateIntro("bio", e.target.value)}
              className={inputClass + " resize-none"}
              rows={3}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className={labelClass}>LinkedIn URL</label>
              <input
                type="text"
                value={data.intro.linkedin}
                onChange={(e) => updateIntro("linkedin", e.target.value)}
                className={inputClass}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className={labelClass}>Email</label>
              <input
                type="text"
                value={data.intro.email}
                onChange={(e) => updateIntro("email", e.target.value)}
                className={inputClass}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Current Section */}
      <section
        className="animate-in flex flex-col gap-4"
        style={{ "--index": 3 } as React.CSSProperties}
      >
        <h2 className="text-lg font-semibold">Current</h2>
        <div className="flex flex-col gap-3 rounded-lg border border-neutral-200 p-4 dark:border-neutral-800">
          <div className="flex flex-col gap-1">
            <label className={labelClass}>Description</label>
            <textarea
              value={data.current.description}
              onChange={(e) => updateCurrent("description", e.target.value)}
              className={inputClass + " resize-none"}
              rows={2}
            />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="flex flex-col gap-1">
              <label className={labelClass}>Location Name</label>
              <input
                type="text"
                value={data.current.location.name}
                onChange={(e) => updateLocation("name", e.target.value)}
                className={inputClass}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className={labelClass}>Longitude</label>
              <input
                type="number"
                step="any"
                value={data.current.location.lng}
                onChange={(e) =>
                  updateLocation("lng", parseFloat(e.target.value) || 0)
                }
                className={inputClass}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className={labelClass}>Latitude</label>
              <input
                type="number"
                step="any"
                value={data.current.location.lat}
                onChange={(e) =>
                  updateLocation("lat", parseFloat(e.target.value) || 0)
                }
                className={inputClass}
              />
            </div>
          </div>
          <div className="flex flex-col gap-3">
            {data.current.interests.map((interest, i) => (
              <div key={interest.title} className="flex flex-col gap-1">
                <label className={labelClass}>{interest.title}</label>
                <input
                  type="text"
                  value={interest.content}
                  onChange={(e) => updateInterest(i, e.target.value)}
                  className={inputClass}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {hasChanges() && (
        <button
          onClick={saveAll}
          disabled={saving}
          className="rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-neutral-800 disabled:opacity-50 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-200"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      )}
    </main>
  );
}
