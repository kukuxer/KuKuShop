import { useAuth0 } from '@auth0/auth0-react';

const GetAccessToken = () => {
  const { getAccessTokenSilently } = useAuth0();

  const fetchToken = async () => {
    try {
      const token = await getAccessTokenSilently();
      console.log('Access Token:', token);
    } catch (error) {
      console.error('Error fetching token:', error);
    }
  };

  return <button onClick={fetchToken}>Get Token</button>;
};

export default GetAccessToken;
