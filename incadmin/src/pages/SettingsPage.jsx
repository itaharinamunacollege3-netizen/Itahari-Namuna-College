import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { PageHeader } from "@/components/ui/PageHeader";
import { useAuth } from "@/contexts/AuthContext";
import { changePasswordRequest } from "@/services/auth.service";
import { useTheme } from "@/contexts/ThemeContext";

export default function SettingsPage() {
  const { user, updateProfile, uploadAvatar, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [fullName, setFullName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [profileLoading, setProfileLoading] = useState(false);
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);

  useEffect(() => {
    setFullName(user?.name ?? "");
    setEmail(user?.email ?? "");
  }, [user?.name, user?.email]);

  const initials = String(user?.name ?? "A")
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const activeSince = user?.lastLoginAt
    ? new Date(user.lastLoginAt).toLocaleString()
    : "N/A";

  async function handleProfileSubmit(e) {
    e.preventDefault();
    setProfileLoading(true);
    try {
      await updateProfile({ name: fullName, email });
      toast.success("Profile updated successfully");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update profile");
    } finally {
      setProfileLoading(false);
    }
  }

  async function handleAvatarUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarLoading(true);
    try {
      await uploadAvatar(file);
      toast.success("Avatar updated");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to upload avatar");
    } finally {
      setAvatarLoading(false);
      e.target.value = "";
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    setPasswordLoading(true);
    try {
      await changePasswordRequest(currentPassword, newPassword);
      toast.success("Password changed. Please log in again.");
      await logout();
      window.location.href = "/login";
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to change password");
    } finally {
      setPasswordLoading(false);
    }
  }

  async function handleSignOut() {
    try {
      await logout();
      window.location.href = "/login";
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to sign out");
    }
  }

  return (
    <div>
      <PageHeader title="Settings" subtitle="Manage your profile, security, and preferences" />

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="card-surface p-6 xl:col-span-2">
          <div className="mb-6 border-b border-[var(--border-subtle)] pb-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
              Profile
            </p>
            <h2 className="mt-1 text-xl font-bold text-[var(--color-brand-dark)]">
              Account details
            </h2>
          </div>

          <div className="mb-6 flex items-center justify-between gap-4 rounded-2xl border border-[var(--border-subtle)] bg-[var(--color-surface)]/50 p-4">
            <div className="flex items-center gap-4">
            {user?.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={user.name}
                className="h-16 w-16 rounded-full border-2 border-white object-cover shadow-sm ring-1 ring-[var(--border-subtle)]"
              />
            ) : (
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-brand-primary)] text-lg font-bold text-white shadow-sm">
                {initials}
              </div>
            )}
              <div>
                <p className="text-sm font-semibold">{user?.name ?? "Administrator"}</p>
                <p className="text-xs text-[var(--text-muted)]">{user?.email}</p>
              </div>
            </div>
            <label className="btn btn-sm rounded-xl border border-[var(--border-subtle)] bg-[var(--color-surface)]">
              {avatarLoading ? "Uploading..." : "Change avatar"}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                disabled={avatarLoading}
                onChange={handleAvatarUpload}
              />
            </label>
          </div>

          <form onSubmit={handleProfileSubmit} className="space-y-5">
            <label className="form-control">
              <span className="mb-1 text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">
                Full name
              </span>
              <input
                type="text"
                className="input input-bordered w-full rounded-xl"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                minLength={2}
              />
            </label>
            <label className="form-control">
              <span className="mb-1 text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">
                Email
              </span>
              <input
                type="email"
                className="input input-bordered w-full rounded-xl"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </label>
            <button
              type="submit"
              className="btn rounded-xl border-none bg-[var(--color-brand-primary)] px-6 text-white shadow-sm"
              disabled={profileLoading}
            >
              {profileLoading ? "Saving..." : "Save changes"}
            </button>
          </form>
        </div>

        <div className="space-y-6">
          <div className="card-surface p-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
              Appearance
            </p>
            <h2 className="mt-1 text-lg font-bold text-[var(--color-brand-dark)]">
              Display mode
            </h2>

            <div className="mt-4 flex items-center justify-between rounded-2xl border border-[var(--border-subtle)] p-4">
            <div>
              <p className="text-sm font-semibold">
                {theme === "dark" ? "Dark mode" : "Light mode"}
              </p>
              <p className="text-xs text-[var(--text-muted)]">
                Toggle dashboard appearance
              </p>
            </div>
              <button type="button" className="btn btn-sm rounded-xl" onClick={toggleTheme}>
                Switch
            </button>
          </div>
          </div>

          <div className="card-surface p-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
              Session
            </p>
            <h2 className="mt-1 text-lg font-bold text-[var(--color-brand-dark)]">
              Current session
            </h2>
            <p className="mt-3 text-sm text-[var(--text-muted)]">
              Active since {activeSince}
            </p>
            <button
              type="button"
              className="btn btn-sm mt-4 rounded-xl"
              onClick={handleSignOut}
            >
              Sign out
            </button>
          </div>

          <div className="card-surface p-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
              Security
            </p>
            <h2 className="mt-1 text-lg font-bold text-[var(--color-brand-dark)]">
              Change password
            </h2>
            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            <label className="form-control">
                <span className="mb-1 text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">
                  Current password
                </span>
            <input
              type="password"
                  className="input input-bordered w-full rounded-xl"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />
            </label>
            <label className="form-control">
                <span className="mb-1 text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">
                  New password
                </span>
            <input
              type="password"
                  className="input input-bordered w-full rounded-xl"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            </label>
            <label className="form-control">
                <span className="mb-1 text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">
                  Confirm password
                </span>
            <input
              type="password"
                  className="input input-bordered w-full rounded-xl"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            </label>
            <button
              type="submit"
                className="btn w-full rounded-xl border-none bg-[var(--color-brand-primary)] text-white shadow-sm"
              disabled={passwordLoading}
            >
              {passwordLoading ? (
                <span className="loading loading-spinner loading-sm" />
              ) : (
                "Update password"
              )}
            </button>
          </form>
          </div>
        </div>
      </div>
    </div>
  );
}
