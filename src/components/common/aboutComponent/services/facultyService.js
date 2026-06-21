import { apiClient } from '../../../../api/apiClient'; // Import your client

const API_BASE =
  (import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || "http://localhost:5000/api").replace(/\/+$/, "");

function resolveImageUrl(imageUrl) {
  if (!imageUrl) return "";
  if (/^https?:\/\//i.test(imageUrl) || imageUrl.startsWith("data:")) return imageUrl;
  return new URL(imageUrl, API_BASE).toString();
}

export const getFacultyPublic = async (slug = '') => {
  // If slug exists, fetch specific; otherwise, fetch all grouped data
  const endpoint = slug ? `/faculty?department=${encodeURIComponent(slug)}` : '/faculty';
  const response = await apiClient.get(endpoint);
  const grouped = response?.data ?? {};

  if (!grouped || typeof grouped !== "object" || Array.isArray(grouped)) {
    return {};
  }

  return Object.fromEntries(
    Object.entries(grouped).map(([key, members]) => [
      key,
      Array.isArray(members)
        ? members.map((member) => ({
            ...member,
            image: resolveImageUrl(member?.image),
          }))
        : [],
    ])
  );
};