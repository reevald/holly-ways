import CompNavbar from "../component/navbar";
import CompFooter from "../component/footer";
import CompWrapper from "../component/wrapper";

import WrapperProfile from "../compProfile/wrapperProfile";
import CompMyProfile from "../compProfile/myProfile";
import CompHistoryDonation from "../compProfile/historyDonation";

import { API } from "../config/api";
import { useQuery } from "react-query";

import { useContext } from "react";
import { UserContext} from "../context/authContext";

function ProfilePage() {

  const api = API();
  const [stateUser,] = useContext(UserContext);
  const idUser = stateUser.user.id;

  // Get detail profile
  const { data: dataProfile } = useQuery("getDetailProfileKey", async () => {
    const config = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    }

    const response = await api.get(`/profile/${idUser}`, config);
    if (response.status === "success") return response.data;
  })

  return (
    <>
      <CompNavbar />
      <CompWrapper>
        {dataProfile &&
          <WrapperProfile>
            <CompMyProfile dataUser={dataProfile.user} />
            <CompHistoryDonation historyDonations={dataProfile.historyDonations}/>
          </WrapperProfile>
        }
      </CompWrapper>
      <CompFooter />
    </>
  );
}

export default ProfilePage;