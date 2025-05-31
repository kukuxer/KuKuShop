import { useAuth0 } from "@auth0/auth0-react";
import { useState, useEffect } from "react";
import axios from "axios";
import ShopForm from "../../components/forms/ShopForm.tsx";
import MyShopComponent from "./components/MyShopComponent.tsx";
import Loading from "../../components/utils/Loading.tsx";
import ErrorPage from "../../components/utils/ErrorPage.tsx";

const Home: React.FC = () => {
  const { isAuthenticated, getAccessTokenSilently } = useAuth0();
  const [hasShop, setHasShop] = useState<boolean | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkIfUserOwnsShop = async () => {
      if (!isAuthenticated) return;

      try {
        const token = await getAccessTokenSilently();
        const response = await axios.get(
          "http://localhost:8080/api/shop/doUserOwnAShop",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setHasShop(response.data);
      } catch (err) {
        setError(err as string);
      } finally {
        setLoading(false);
      }
    };

    checkIfUserOwnsShop();
  }, [isAuthenticated, getAccessTokenSilently]);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <ErrorPage errorCode={error} />;
  }

  return <div>{hasShop ? <MyShopComponent /> : <ShopForm />}</div>;
};

export default Home;
