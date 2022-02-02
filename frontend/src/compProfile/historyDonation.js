import convertRupiah from "rupiah-format";
import { Link } from 'react-router-dom';

function CompHistoryDonation(props) {
  const listDonations = props.historyDonations;

  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
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
    <div className="w-1/2 flex flex-col">
      <div className="font-bold text-2xl mb-6">
        History Donation
      </div>
      {listDonations.map((dataDonate, idx) => (
        <Link key={idx} to={`/raise-fund/${dataDonate.idFund}`}>
          <div className="flex flex-col bg-white p-3 rounded-sm mb-6 hover:bg-gray-100">
            <div className="text-sm font-semibold mb-1.5">
              {dataDonate.titleFund}
            </div>
            <div className="flex flex-row text-xs mb-1.5">
              {formatDate(dataDonate.createdAt)}
            </div>
            <div className="flex flex-row justify-between items-center">
              <div className="text-xs text-red-hw font-bold">
                Total : {convertRupiah.convert(dataDonate.donateAmount).slice(0, -3)}
              </div>
              <div className={`text-xs ${(dataDonate.status==="Finished") ? "bg-green-100 text-green-500" : "bg-orange-100 text-orange-500"} font-bold py-0.5 px-6 rounded-sm`}>
                {dataDonate.status}
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

export default CompHistoryDonation;