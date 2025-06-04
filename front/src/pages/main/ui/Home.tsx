import React, {  useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Loading } from "../../../shared/ui/loading";
import Hero from "./Hero.tsx";
import About from "./About.tsx";
import ProductCarousel from "./ProductCarousel.tsx";

export const Home: React.FC = () => {
    const { isAuthenticated } = useAuth0();
    const [loading, setLoading] = useState(true);

    const handleCarouselLoaded = () => {
        setLoading(false);
    };

    return loading ? <Loading /> : (
        <>
            {!isAuthenticated && <Hero />}
            <ProductCarousel onLoaded={handleCarouselLoaded} />
            <About />
        </>
    );
};
