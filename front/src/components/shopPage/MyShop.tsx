import { useAuth0 } from "@auth0/auth0-react";
import { useState, useEffect } from "react";
import axios from "axios";
import ShopForm from "../forms/ShopForm";
import MyShopComponent from "./components/MyShopComponent";
import Loading from "../utils/Loading";
import ErrorPage from "../utils/ErrorPage";


const Home: React.FC = () => {
  const { isAuthenticated, getAccessTokenSilently } = useAuth0();
  const [hasShop, setHasShop] = useState<boolean | null>(null); 
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Check if the user has a shop when the component mounts
  useEffect(() => {
    const checkIfUserOwnsShop = async () => {
      if (!isAuthenticated) return;

      try {
        const token = await getAccessTokenSilently();
        const response = await axios.get("http://localhost:8080/api/shop/doUserOwnAShop", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setHasShop(response.data); 
      } catch (err) {
        console.error("Error checking if user owns a shop:", err);
      } finally {
        setLoading(false); 
      }
    };

    checkIfUserOwnsShop();
  }, [isAuthenticated, getAccessTokenSilently]);

  if (loading) {
    return <Loading/>;
  }

  if (error) {
    return <ErrorPage errorCode={error} />;
  }

  return (
    <div>
      {hasShop ? (
        <MyShopComponent />
      ) : (
        <ShopForm />
      )}
    </div>
  );
};

export default Home;
