import React, {useState} from "react";
import {useAuth0} from "@auth0/auth0-react";
import {Loading} from "../../../shared/ui/loading";
import Hero from "./Hero.tsx";
import About from "./About.tsx";
import ProductCarousel from "./ProductCarousel.tsx";

export const Home: React.FC = () => {
    const {isAuthenticated, isLoading: authLoading} = useAuth0();
    const [carouselLoaded, setCarouselLoaded] = useState(false);

    const handleCarouselLoaded = () => {
        setCarouselLoaded(true);
    };

    const isAppLoading = authLoading || !carouselLoaded;

    return (
        <>

            <div className="hidden">
                <ProductCarousel onLoaded={handleCarouselLoaded}/>
            </div>

            {isAppLoading ? (
                <Loading/>
            ) : (
                <>
                    {!isAuthenticated && <Hero/>}
                    <ProductCarousel/>
                    <About/>
                </>
            )}
        </>
    );
};