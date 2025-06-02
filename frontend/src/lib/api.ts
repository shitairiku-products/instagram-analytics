const baseURL = process.env.NEXT_PUBLIC_API_URL;

export async function fetchFromAPI<T>(endpoint: string): Promise<T> {
  const res = await fetch(`${baseURL}${endpoint}`);

  if (!res.ok) {
    throw new Error(`API error: ${res.status}`);
  }

  return res.json();
}

export async function getCompanies(): Promise<{ id: number; name: string }[]> {
  return fetchFromAPI('/companies/');
}
