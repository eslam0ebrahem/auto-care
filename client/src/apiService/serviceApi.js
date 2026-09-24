const URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:3005';

function getAuthHeaders() {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    Authorization: token ? `Bearer ${token}` : '',
  };
}

export async function getServices() {
  try {
    const res = await fetch(`${URL}/services`, {
      headers: getAuthHeaders(),
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch services: ${res.status}`);
    }
    return res.json();
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function addService(data) {
  try {
    const res = await fetch(`${URL}/services`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      throw new Error(`Failed to add service: ${res.status}`);
    }

    return res.json();
  } catch (error) {
    console.error(error);
  }
}

export async function removeService(id) {
  try {
    const res = await fetch(`${URL}/services/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });

    if (!res.ok) {
      throw new Error(`Failed to delete service: ${res.status}`);
    }

    return res.json();
  } catch (error) {
    console.error(error);
  }
}

export async function editService(id, data) {
  try {
    const res = await fetch(`${URL}/services/${id}`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });

    return res.json();
  } catch (error) {
    console.error(error);
  }
}
