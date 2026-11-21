const getApiUrl = () => {
  if (process.env.NEXT_PUBLIC_SERVER_URL) return process.env.NEXT_PUBLIC_SERVER_URL;
  if (typeof window !== "undefined" && !window.location.hostname.includes("localhost")) {
    return "https://pizzahub-server-mu.vercel.app";
  }
  if (process.env.NODE_ENV === "production") return "https://pizzahub-server-mu.vercel.app";
  return "http://localhost:5000";
};

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
