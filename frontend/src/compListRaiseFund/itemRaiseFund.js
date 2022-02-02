import imageNoData from '../src-assets/img/undraw_no_data.svg';
import convertRupiah from "rupiah-format";
import { baseUploadImg } from "../config/basePath";
import { Link } from 'react-router-dom';

function CompMyRF(props) {
  const funds = props.dataFunds;
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

  return (
    <div className='flex flex-row justify-center py-16'>
      <div className='flex flex-col h-full w-full xl:max-w-7xl lg:max-w-5xl px-4 sm:px-6 md:px-20'>
        <div className='flex flex-row justify-between items-center mb-6'>
          <div className='font-bold text-2xl'>
            My Raise Fund
          </div>
          <Link to='/add-raise-fund'>
            <div className='text-xs text-white py-1 px-2 rounded-md bg-red-hw'>
              Make Raise Fund
            </div>
          </Link>
        </div>
        <div className={
          (funds && (funds?.length === 0)) ?
            "flex flex-col"
            :
            "grid md:grid-cols-3 xl:grid-cols-4 gap-4 xl:gap-10"
        }>
          {funds && (funds?.length === 0) ?
            <div className='flex flex-row justify-center items-center w-full min-h-screen'>
              <div className='flex flex-col items-center'>
                <img
                  className="max-w-xs mb-6"
                  src={imageNoData}
                  alt="Illustration No Data"
                />
                <div className='text-2xl'>
                  Start sharing kindness with donations
                </div>
              </div>
            </div>
            :
            funds?.map((dataFund, index) => (
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
                    <div className={`${ratioAmount(dataFund.goal, dataFund.payments)} bg-red-hw`}></div>
                  </div>

                  <div className="flex flex-row justify-between items-center">
                    <div className="text-xs font-bold flex-1">
                      {convertRupiah.convert(dataFund.goal).slice(0, -3)}
                    </div>
                    <div className='flex flex-row items-center'>
                      <Link to={`/my-raise-fund/${dataFund.id}`}>
                        <div className="mr-2 text-xs text-white bg-red-hw py-1 px-3 rounded-md">
                          View Fund
                        </div>
                      </Link>
                      <Link to={`/update-raise-fund/${dataFund.id}`}>
                        <div className="text-xs text-white bg-red-hw py-1 px-1 rounded-md">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16"><path fill="none" d="M0 0h24v24H0z" /><path d="M15.728 9.686l-1.414-1.414L5 17.586V19h1.414l9.314-9.314zm1.414-1.414l1.414-1.414-1.414-1.414-1.414 1.414 1.414 1.414zM7.242 21H3v-4.243L16.435 3.322a1 1 0 0 1 1.414 0l2.829 2.829a1 1 0 0 1 0 1.414L7.243 21z" fill="rgba(255,255,255,1)" /></svg>
                        </div>
                      </Link>
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

export default CompMyRF;