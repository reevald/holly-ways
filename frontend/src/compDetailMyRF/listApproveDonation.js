// import samplePayment from '../src-assets/img/sample-payment.png';
import convertRupiah from "rupiah-format";
import { baseUploadImg } from "../config/basePath";
import { useState } from 'react';
import { useMutation } from "react-query";
import { useParams, useHistory } from "react-router-dom";
import { API } from "../config/api";

function CompListApproveDonation(props) {
  const { id } = useParams(); // fundId
  const api = API();
  const history = useHistory();

  const [stateModalApprove, setStateModalApprove] = useState('none');
  const [dataModal, setDataModal] = useState({
    paymentId: "",
    fullName: "",
    donateAmount: "",
    proofAttachment: ""
  });

  // Modal approve donate handler
  const openModalApprove = () => setStateModalApprove('flex');
  const closeModalApprove = () => setStateModalApprove('none');

  // inject form with data by Id (here)
  const showModalApprove = (paymentId, userName, amount, proof) => {
    setDataModal({
      paymentId: paymentId,
      fullName: userName,
      donateAmount: amount,
      proofAttachment: proof
    });
    openModalApprove();
  }

  // Form donate handler
  const onSubmitHandler = useMutation(async (event) => {
    event.preventDefault();

    // Logic approve donate with Api here
    try {
      const config = {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json;charset=utf-8",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({status: "success"})
      }

      const response = await api.patch(`/fund/${id}/${dataModal.paymentId}`, config);
      console.log("response", response);
      // ref : https://stackoverflow.com/a/61123116
      return history.go(0);
    } catch (error) {
      console.log(error);
    }

    closeModalApprove();
  });

  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const listValidDonate = props.listDonate.filter((dataDonate) => dataDonate.status === "success");
  const listPendingDonate = props.listDonate.filter((dataDonate) => dataDonate.status === "pending");
  const formatDate = (strDate) => {
    const createdAt = new Date(strDate);
    const numDay = createdAt.getDay();
    const numDate = createdAt.getDate();
    const numMonth = createdAt.getMonth();
    const numYear = createdAt.getFullYear();
    return (
      <>
        <div className="font-bold mr-1">
          {days[numDay]},
        </div>
        <div>
          {`${numDate} ${months[numMonth]} ${numYear}`}
        </div>
      </>
    );
  }

  return (
    <>
      <div className='flex flex-row justify-center pb-16'>
        <div className='flex flex-col h-full w-full xl:max-w-7xl lg:max-w-5xl px-4 sm:px-8 md:px-36'>
          <div className="text-2xl font-bold mb-6">
            List Donation ({listValidDonate.length})
          </div>
          {listValidDonate.map((dataDonate, idx) => (
            <div key={idx} className="flex flex-col bg-white p-4 rounded-sm mb-3">
              <div className="text-sm font-bold mb-1.5">
                {dataDonate.fullName}
              </div>
              <div className="flex flex-row text-xs mb-1.5">
                {formatDate(dataDonate.createdAt)}
              </div>
              <div className="text-xs text-red-hw font-bold">
                Total : {convertRupiah.convert(dataDonate.donateAmount).slice(0, -3)}
              </div>
            </div>
          ))}
          <div className="text-2xl font-bold my-6">
            Donation has not been approved ({listPendingDonate.length})
          </div>
          {listPendingDonate.map((dataDonate, idx) => (
            <div key={idx} className="flex flex-row justify-between items-center bg-white p-4 rounded-sm mb-3">
              <div className="flex flex-col">
                <div className="text-sm font-bold mb-1.5">
                  {dataDonate.fullName}
                </div>
                <div className="flex flex-row text-xs mb-1.5">
                  {formatDate(dataDonate.createdAt)}
                </div>
                <div className="text-xs text-red-hw font-bold">
                  Total : {convertRupiah.convert(dataDonate.donateAmount).slice(0, -3)}
                </div>
              </div>
              <div
                onClick={() => showModalApprove(
                  dataDonate.id,
                  dataDonate.fullName,
                  dataDonate.donateAmount,
                  dataDonate.proofAttachment
                )}
                className="cursor-pointer bg-red-hw text-sm text-white py-0.5 px-6 rounded-md"
              >
                View
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal Approve */}
      <div
        style={{
          display: stateModalApprove,
        }}
        className="fixed inset-x-0 top-0 w-full h-screen flex flex-col justify-center items-center">
        <div
          className='flex-none fixed inset-x-0 top-0 h-screen bg-gray-900 bg-opacity-60'
          onClick={closeModalApprove}
        />
        <div className='z-10 bg-white px-5 py-6 rounded-lg flex flex-col max-w-sm w-full'>
          <form
            onSubmit={(e) => onSubmitHandler.mutate(e)}
            className="flex flex-col">
            <div className='mb-3 text-2xl font-bold'>
              {dataModal.fullName}
            </div>
            <div className="mb-5 border-2 border-gray-hw-200 rounded-md p-1 bg-gray-100">
              {convertRupiah.convert(dataModal.donateAmount).slice(0, -3)}
            </div>
            {
              (dataModal !== null && dataModal.proofAttachment !== "") &&
              <img src={baseUploadImg(dataModal.proofAttachment)} alt="Proof Payment" />
            }
            <button className="mt-5 bg-red-hw font-semibold text-white w-full py-2 rounded-lg" type="submit">
              Approve
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default CompListApproveDonation;