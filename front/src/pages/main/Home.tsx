import React, { Fragment } from "react";
const Hero = React.lazy(() => import("./components/Hero.tsx"));
import { useAuth0 } from "@auth0/auth0-react";
import ProductCarousel from "./components/ProductCarousel.tsx";
const About = React.lazy(() => import("./components/About.tsx"));


const Home: React.FC = () => {
  const { isAuthenticated } = useAuth0();

  return (
    <Fragment>
      {!isAuthenticated && <Hero />}
      <ProductCarousel/>
      <About />
    </Fragment>
  );
};

export default Home;
