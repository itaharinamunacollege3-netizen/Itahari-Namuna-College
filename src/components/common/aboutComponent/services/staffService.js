import { apiClient } from '../../../../api/apiClient'; // Import your client

const API_BASE =
  (import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || "http://localhost:5000/api").replace(/\/+$/, "");

function resolveImageUrl(imageUrl) {
  if (!imageUrl) return "";
  if (/^https?:\/\//i.test(imageUrl) || imageUrl.startsWith("data:")) return imageUrl;
  return new URL(imageUrl, API_BASE).toString();
}

export const getStaffPublic = async (categorySlug = '') => {
  // If slug is provided, we fetch that specific category; 
  // otherwise, we fetch all grouped data.
  const endpoint = categorySlug ? `/staff?category=${categorySlug}` : '/staff';
  
  try {
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
  } catch (error) {
    console.error("Failed to fetch staff:", error);
    return {}; // Return empty object on failure to keep the app from crashing
  }
};