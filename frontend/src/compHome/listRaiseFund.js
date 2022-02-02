// import thumbnailRF1 from "../src-assets/img/thumbnail-rf-1.png";
// import thumbnailRF2 from "../src-assets/img/thumbnail-rf-2.png";
// import thumbnailRF3 from "../src-assets/img/thumbnail-rf-3.png";

import { UserContext } from "../context/authContext";
import { ModalContext } from "../context/modalContext";
import { useContext } from "react";
import { useHistory } from "react-router-dom";

import convertRupiah from "rupiah-format";
import { baseUploadImg } from "../config/basePath";
import { API } from "../config/api";
import { useQuery } from "react-query";

function CompListRaiseFund() {
  const history = useHistory();
  const api = API();

  const [stateUser,] = useContext(UserContext);
  const [, dispatchModal] = useContext(ModalContext);

  const openModalLogin = () => dispatchModal({ type: 'OPEN_MODAL_LOGIN' });

  const linkDetailHandler = (id) => {
    if (stateUser.isLogin) {
      history.push(`/raise-fund/${id}`);
    } else {
      return openModalLogin();
    }
  }

  const sumValidAmount = (arrDonate) => {
    return arrDonate.reduce((accSum, dataDonate) => {
      return (dataDonate.status === "success") ? accSum + dataDonate.donateAmount : accSum;
    }, 0);
  }

  const ratioAmount = (goal, arrDonate) => {
    const sum = sumValidAmount(arrDonate);
    if (sum >= goal) return 'hw-20_20';
    return `hw-${Math.floor(sum * 20 / goal)}_20`;
  }

  const { data: funds } = useQuery("getFundsKey", async () => {
    const config = {
      method: "GET"
    };

    const response = await api.get("/funds", config);
    return response.data.funds;
  });

  return (
    <div id="donate-now" className="flex flex-col items-center justify-center py-20 bg-gray-hw-100">
      <div className="text-red-hw text-2xl font-bold mb-8">
        Donate Now
      </div>
      <div className="flex flex-row justify-center h-full w-full xl:max-w-7xl lg:max-w-5xl px-4 sm:px-8 md:px-16">
        <div className="grid md:grid-cols-3 xl:grid-cols-4 gap-5">
          {funds?.map((dataFund, index) => (
            <div key={index} className="flex flex-col w-60 rounded-md overflow-hidden">
              <img
                className="w-full h-44 object-cover"
                src={baseUploadImg(dataFund.thumbnail)}
                alt="Thumbnail Raise Fund"
              />
              <div className="p-3 bg-white h-full flex flex-col">
                <div className="font-bold mb-4">
                  {dataFund.title}
                </div>
                <div className="flex-1 text-xs mb-4">
                  {dataFund.description}
                </div>
                {/* Progress Bar */}
                <div className="flex flex-row h-1 rounded-xl overflow-hidden bg-gray-hw-200 mb-3">
                  <div className={`${ratioAmount(dataFund.goal, dataFund.usersDonate)} bg-red-hw`}></div>
                </div>

                <div className="flex flex-row justify-between items-center">
                  <div className="text-xs font-bold">
                    {convertRupiah.convert(dataFund.goal).slice(0, -3)}
                  </div>
                  <div
                    onClick={() => linkDetailHandler(dataFund.id)}
                    className="cursor-pointer text-xs text-white bg-red-hw py-1 px-4 rounded-md"
                  >
                    Donate
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CompListRaiseFund;