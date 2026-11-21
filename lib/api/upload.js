import { getApiUrl } from "@/lib/utils/apiUrl";

/**
 * Upload image via backend to ImgBB
 */
export async function uploadImage(file, token) {
  const formData = new FormData();
  formData.append("image", file);

  const res = await fetch(`${getApiUrl()}/api/upload`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Failed to upload image.");
  return json.url;
}
