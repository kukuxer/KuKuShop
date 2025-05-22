import React, { Fragment } from "react";
const Hero = React.lazy(() => import("./components/Hero"));
import { useAuth0 } from "@auth0/auth0-react";
import ProductCarousel from "./components/ProductCarousel";
const About = React.lazy(() => import("./components/About"));


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
