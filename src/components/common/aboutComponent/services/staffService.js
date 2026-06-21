import { apiClient } from '../../../../api/apiClient'; // Import your client

export const getStaffPublic = async (categorySlug = '') => {
  // If slug is provided, we fetch that specific category; 
  // otherwise, we fetch all grouped data.
  const endpoint = categorySlug ? `/staff?category=${categorySlug}` : '/staff';
  
  try {
    const response = await apiClient.get(endpoint);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch staff:", error);
    return {}; // Return empty object on failure to keep the app from crashing
  }
};