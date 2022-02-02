import CompNavbar from "../component/navbar";
import CompFooter from "../component/footer";
import CompWrapper from "../component/wrapper";

import CompFormAddRF from "../compAddRaiseFund/formAddRaiseFund";

function AddRFPage() {
  return (
    <>
      <CompNavbar />
      <CompWrapper>
        <CompFormAddRF />
      </CompWrapper>
      <CompFooter />
    </>
  );
}

export default AddRFPage;