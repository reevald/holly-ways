import CompNavbar from "../component/navbar";
import CompFooter from "../component/footer";
import CompWrapper from "../component/wrapper";

import CompFormUpdateRF from "../compUpdateRaiseFund/formUpdateRaiseFund";

import { API } from "../config/api";
import { useQuery } from "react-query";
import { useParams, useHistory } from "react-router-dom";

function UpdateRFPage() {
  const api = API();
  const { id } = useParams(); // fundId
  const history = useHistory();

  // Get detail fund by Id
  const { data: fund } = useQuery(`getDetailFundByIdKey${id}`, async () => {
    const config = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    }

    const response = await api.get(`/my-fund/${id}`, config);
    console.log("response MyRF", response);
    if (response.status === "success") return response.data.fund;
    if (response.status === "failed") return history.push('/my-raise-fund');
  });
  
  return (
    <>
      <CompNavbar />
      <CompWrapper>
      {fund && 
        <CompFormUpdateRF dataFund={fund} />
      }
      </CompWrapper>
      <CompFooter />
    </>
  );
}

export default UpdateRFPage;