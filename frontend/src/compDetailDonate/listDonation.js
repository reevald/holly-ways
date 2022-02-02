import convertRupiah from "rupiah-format";
import { useContext } from "react";
import { UserContext} from "../context/authContext";

function CompListDonation(props) {
  const [stateUser,] = useContext(UserContext);
  const idUser = stateUser.user.id;
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const listValidDonate = props.listDonate.filter((dataDonate) => dataDonate.status === "success");
  const listPendingDonate = props.listDonate.filter((dataDonate) => dataDonate.status === "pending" && dataDonate.idUser === idUser);
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
          Your Pending Donation ({listPendingDonate.length})
        </div>
        {listPendingDonate.map((dataDonate, idx) => (
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
      </div>
    </div>
  );
}

export default CompListDonation;