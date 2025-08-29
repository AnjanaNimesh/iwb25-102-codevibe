// Common utility functions
export const getTokenFromCookie = (): string | null => {
  const cookies = document.cookie.split(';');
  for (let cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    if (name === 'adminToken' || name === 'token' || name === 'authToken' || name === 'admin_token') {
      const decodedValue = decodeURIComponent(value);
      console.log(`Found token in cookie '${name}':`, decodedValue.substring(0, 20) + '...');
      return decodedValue;
    }
  }
  console.log('No admin token found in cookies. Available cookies:', 
    document.cookie.split(';').map(c => c.trim().split('=')[0]));
  return null;
};

export const getAuthHeaders = (): HeadersInit => {
  const token = getTokenFromCookie();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
    headers['X-Admin-Token'] = token;
    headers['Admin-Token'] = token;
    headers['X-Auth-Token'] = token;
    console.log('Sending request with token headers');
  } else {
    console.warn('No token available - request will be unauthenticated');
  }
  return headers;
};