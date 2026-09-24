const URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:3005';

export async function getServices() {
  try {
    const res = await fetch(`${URL}/services`);

    if (!res.ok) {
      throw new Error(`Failed to fetch services: ${res.status}`);
    }
    return res.json();
  } catch (error) {
    console.error(error);
  }
}

export async function addService(data) {
  try {
    const res = await fetch(`${URL}/services`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
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
      headers: { 'Content-Type': 'application/json' },
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
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    return res.json();
  } catch (error) {
    console.error(error);
  }
}
