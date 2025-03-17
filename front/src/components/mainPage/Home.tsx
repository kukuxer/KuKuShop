import React, { Fragment } from "react";
import Hero from "./components/Hero";
import { useAuth0 } from "@auth0/auth0-react";
import ShopBanner from "../shopPage/components/ShopBanner";
const About = React.lazy(() => import("./components/About"));


const Home: React.FC = () => {
  const { isAuthenticated } = useAuth0();

  return (
    <Fragment>
      {!isAuthenticated && <p> not Authenticated</p>}
      <Hero />
      <About />
      

    </Fragment>
  );
};

export default Home;
