import CompNavbar from "../component/navbar";
import CompFooter from "../component/footer";
import CompWrapper from "../component/wrapper";

import CompHero from "../compHome/hero";
import CompListRaiseFund from "../compHome/listRaiseFund";

import { ModalContextProvider } from '../context/modalContext';

function HomePage() {
  return (
    <ModalContextProvider>
      <CompNavbar />
      <CompWrapper>
        <CompHero /> 
        <CompListRaiseFund />
      </CompWrapper>
      <CompFooter />
    </ModalContextProvider>
  );
}

export default HomePage;