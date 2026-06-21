import { apiClient } from '../../../../api/apiClient'; // Import your client

export const getFacultyPublic = async (slug = '') => {
  // If slug exists, fetch specific; otherwise, fetch all
  const endpoint = slug ? `/faculty?dept=${slug}` : '/faculty';
  const response = await apiClient.get(endpoint);
  return response.data; // Now you just return the data portion
};