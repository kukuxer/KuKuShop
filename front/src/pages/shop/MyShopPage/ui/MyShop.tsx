import {useAuth0} from "@auth0/auth0-react";
import {useEffect} from "react";
import {MyShopComponent} from "./MyShopComponent.tsx";
import {ErrorPage} from "../../../../shared/ui/error-page";
import {ShopCreationForm} from "../../../../features";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch} from "../../../../app/store.ts";
import {myShopSelector} from "../../../../features/redux/myShop/myShop.slice.ts";
import {fetchUserShopOwnership} from "../../../../features/redux/myShop";

export const MyShopPage: React.FC = () => {
    const {isAuthenticated, getAccessTokenSilently} = useAuth0();

    const { ownsShop ,error} = useSelector(myShopSelector);

    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        const fetchShopData = async () => {
            if (!isAuthenticated) return;
                const token = await getAccessTokenSilently();
                dispatch(fetchUserShopOwnership(token));
        };

        fetchShopData();
    }, [dispatch, isAuthenticated, getAccessTokenSilently]);



    if (error) {
        return <ErrorPage errorCode={error}/>;
    }

    return <div>{ownsShop ? <MyShopComponent/> : <ShopCreationForm/>}</div>;
};

