import React, {Fragment} from "react";

const Hero = React.lazy(() => import("./Hero.tsx"));
import {useAuth0} from "@auth0/auth0-react";
import ProductCarousel from "./ProductCarousel.tsx";

const About = React.lazy(() => import("./About.tsx"));


export const Home: React.FC = () => {
    const {isAuthenticated} = useAuth0();

    return (
        <Fragment>
            {!isAuthenticated && <Hero/>}
            <ProductCarousel/>
            <About/>
        </Fragment>
    );
};


