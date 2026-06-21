import { apiFormRequest, apiRequest, clearTokens, setTokens } from "./apiClient";

export async function loginRequest(email, password) {
  const { data } = await apiRequest(
    "/auth/login",
    {
      method: "POST",
      body: JSON.stringify({ email, password }),
    },
    false
  );

  if (data.accessToken && data.refreshToken) {
    setTokens(data.accessToken, data.refreshToken);
  }

  return data.user;
}

export async function fetchMe() {
  const { data } = await apiRequest("/auth/me");
  return data.user;
}

export async function logoutRequest() {
  try {
    await apiRequest("/auth/logout", { method: "POST" });
  } finally {
    clearTokens();
  }
}

export async function changePasswordRequest(currentPassword, newPassword) {
  await apiRequest("/auth/change-password", {
    method: "POST",
    body: JSON.stringify({ currentPassword, newPassword }),
  });
  clearTokens();
}

export async function updateProfileRequest(payload) {
  const { data } = await apiRequest("/auth/profile", {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
  return data.user;
}

export async function uploadAvatarRequest(file) {
  const form = new FormData();
  form.append("avatar", file);
  const { data } = await apiFormRequest("/auth/avatar", form, "POST");
  return data.user;
}
