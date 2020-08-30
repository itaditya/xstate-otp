async function fetcher(...args) {
  try {
    const res = await fetch(...args);
    const data = await res.json();
    if (!res.ok) {
      throw data;
    }
    return Promise.resolve(data);
  } catch (error) {
    return Promise.reject(error);
  }
}

export default fetcher;
