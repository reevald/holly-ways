import CompNavbar from "../component/navbar";
import CompFooter from "../component/footer";
import CompWrapper from "../component/wrapper";

import CompMyRF from "../compListRaiseFund/itemRaiseFund";

import { API } from "../config/api";
import { useQuery } from "react-query";

function ListMyRFPage() {
  const api = API();
  // Get all fund by id user (owner)
  const { data: funds } = useQuery("getFundsByIdKey", async () => {
    const config = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    }

    const response = await api.get("/my-funds", config);
    if (response.status === "success") return response.data.funds;
  });
  return (
    <>
      <CompNavbar />
      <CompWrapper>
        <CompMyRF dataFunds={funds}/>
      </CompWrapper>
      <CompFooter />
    </>
  );
}

export default ListMyRFPage;