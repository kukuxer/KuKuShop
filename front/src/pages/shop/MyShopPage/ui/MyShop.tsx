import {useAuth0} from "@auth0/auth0-react";
import {useState, useEffect} from "react";
import {MyShopComponent} from "./MyShopComponent.tsx";
import {ErrorPage} from "../../../../shared/ui/error-page";
import {Loading} from "../../../../shared/ui/loading";
import {ShopCreationForm} from "../../../../features";
import {doesTheUserOwnAShop} from "../../../../entities/shop/api/shops.ts";

export const MyShopPage: React.FC = () => {
    const {isAuthenticated, getAccessTokenSilently} = useAuth0();
    const [hasShop, setHasShop] = useState<boolean | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const checkIfUserOwnsShop = async () => {
            if (!isAuthenticated) return;

            try {
                const token = await getAccessTokenSilently();
                const response = await doesTheUserOwnAShop(token);

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
        return <Loading/>;
    }

    if (error) {
        return <ErrorPage errorCode={error}/>;
    }

    return <div>{hasShop ? <MyShopComponent/> : <ShopCreationForm/>}</div>;
};

