import CompNavbar from "../component/navbar";
import CompFooter from "../component/footer";
import CompWrapper from "../component/wrapper";

import CompSummaryRF from "../compDetailDonate/summaryRaiseFund";
import CompListDonation from "../compDetailDonate/listDonation";

import { API } from "../config/api";
import { useQuery } from "react-query";
import { useParams, useHistory } from "react-router-dom";

function DetailDonatePage() {
  const api = API();
  const { id } = useParams();
  const history = useHistory();

  // Get detail fund
  const { data: fund } = useQuery("getDetailFundKey", async () => {
    const config = {
      method: "GET"
    };

    const response = await api.get(`/fund/${id}`, config);
    if (response.status === "success") return response.data.fund;
    if (response.status === "failed") return history.push("/");
  });
  return (
    <>
      <CompNavbar />
      <CompWrapper>
      {fund &&
        <>
        <CompSummaryRF dataFund={fund} />
        <CompListDonation listDonate={fund.usersDonate} />
        </>
      }
      </CompWrapper>
      <CompFooter />
    </>
  );
}

export default DetailDonatePage;