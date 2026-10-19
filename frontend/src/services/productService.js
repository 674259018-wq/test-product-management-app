const API_URL = `${import.meta.env.VITE_API_URL}/api/journals`;

const request = async (url, option) => {
  const response = await fetch(url, option);
  const data = await response.json().catch(() => null);
  if (!response.ok) {
    const error = new Error(
      data?.message || "เกิดข้อผิดพลาดในการเชื่อมต่อ",
    );
    error.status = response.status;
    throw error;
  }
  return data;
};

const getJournals = ({ search = "", category = "" } = {}) => {
  const query = new URLSearchParams();
  if (search) query.set("search", search);
  if (category) query.set("category", category);
  const queryString = query.toString();
  return request(queryString ? `${API_URL}?${queryString}` : API_URL);
};

const getJournal = (id) => request(`${API_URL}/${id}`);

const createJournal = (journal) =>
  request(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(journal),
  });
const updateJournal = (id, journal) =>
  request(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(journal),
  });

const deleteJournal = (id) =>
  request(`${API_URL}/${id}`, {
    method: "DELETE",
  });

export { getJournal, getJournals, createJournal, updateJournal, deleteJournal };
