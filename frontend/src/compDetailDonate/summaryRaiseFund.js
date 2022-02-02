// import thumbnailRF from '../src-assets/img/thumbnail-detail-sample.png';
import iconPayment from '../src-assets/img/icon-payment.svg';

import convertRupiah from "rupiah-format";
import { baseUploadImg } from "../config/basePath";

import { useState } from 'react';
import { useMutation } from "react-query";
import { useHistory } from 'react-router-dom';

import { API } from "../config/api";

function CompSummaryRF(props) {

  const api = API();
  const history = useHistory();
  const [stateModalDonate, setStateModalDonate] = useState('none');
  const dataFund = props.dataFund;

  const sumValidAmount = (arrDonate) => {
    return arrDonate.reduce((accSum, dataDonate) => {
      return (dataDonate.status === "success") ? accSum + dataDonate.donateAmount : accSum;
    }, 0);
  }

  const countValidDonate = (arrDonate) => {
    return arrDonate.filter((dataDonate) => {
      return (dataDonate.status === "success");
    }).length;
  }

  const getDiffDays = (strDate) => {
    const createdAt = new Date(strDate).getTime();
    const currDate = Date.now();
    const oneDay = 24 * 60 * 60 * 1000;
    return Math.round(Math.abs((currDate - createdAt) / oneDay));
  }

  const setBtnDonateDisable = (strDate, maxDays = 150) => {
    const diffDays = getDiffDays(strDate);
    return (diffDays >= maxDays) ? true : false;
  }

  const countRangeDay = (strDate, maxDays = 150) => {
    const diffDays = getDiffDays(strDate);

    let result = {};
    if (diffDays >= maxDays) {
      result["highlight"] = "Sorry";
      result["addition"] = "Donation Closed";
    } else {
      result["highlight"] = maxDays - diffDays;
      result["addition"] = "More Day";
    }

    return (
      <>
        <div className='mr-1 font-bold text-sm'>{result.highlight}</div>
        <div className='text-xs'>{result.addition}</div>
      </>
    );
  }

  const ratioAmount = (goal, arrDonate) => {
    const sum = sumValidAmount(arrDonate);
    if (sum >= goal) return 'hw-20_20';
    return `hw-${Math.floor(sum * 20 / goal)}_20`;
  }

  // Modal donate handler
  const openModalDonate = () => setStateModalDonate('flex');
  const closeModalDonate = () => setStateModalDonate('none');

  // Form donate handler
  const [dataForm, setDataForm] = useState({
    donateAmount: "",
    proofAttachment: ""
  });

  const [preview, setPreview] = useState(null);

  const onChangeHandler = (e) => {
    setDataForm({
      ...dataForm,
      [e.target.name]: e.target.type === 'file' ? e.target.files : e.target.value,
    });

    // Create image url for preview 
    // Reference : https://stackoverflow.com/a/43992687
    if (e.target.type === 'file') {
      let url = URL.createObjectURL(e.target.files[0]); // image as base64
      setPreview(url);
    }

  };

  const onSubmitHandler = useMutation(async (event) => {
    event.preventDefault();

    try {
      // ref: https://developer.mozilla.org/en-US/docs/Web/API/FormData/set
      const formData = new FormData();
      console.log("dataForm", dataForm);
      formData.append("donateAmount", dataForm.donateAmount);
      formData.append("proofAttachment", dataForm.proofAttachment[0]);

      const config = {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: formData // type != json 
      }

      const response = await api.post(`/fund/${dataFund.id}`, config);
      console.log("response", response);
      // ref : https://stackoverflow.com/a/61123116
      return history.go(0);
    } catch (error) {
      console.log(error);
    }
    closeModalDonate();
  });

  return (
    <>
      <div className='flex flex-row justify-center py-16'>
        <div className='flex flex-row items-center justify-between h-full w-full xl:max-w-7xl lg:max-w-5xl px-4 sm:px-8 md:px-36'>
          <div className='w-1/2'>
            <img src={baseUploadImg(dataFund.thumbnail)} alt="Thumbnail Raise Fund" />
          </div>
          <div className='w-1/2 flex flex-col ml-12'>
            <div className='text-2xl font-bold mb-6'>
              {dataFund.title}
            </div>
            <div className='mb-2 flex flex-row justify-between items-center'>
              <div className='text-sm font-bold text-red-hw'>
                {convertRupiah.convert(sumValidAmount(dataFund.usersDonate)).slice(0, -3)}
              </div>
              <div className='text-xs'>gathered from</div>
              <div className='text-sm font-bold text-gray-500'>
                {convertRupiah.convert(dataFund.goal).slice(0, -3)}
              </div>
            </div>
            <div className='flex flex-row mb-2 h-1 bg-gray-hw-200 w-full rounded-xl overflow-hidden'>
              <div className={`${ratioAmount(dataFund.goal, dataFund.usersDonate)} bg-red-hw`} />
            </div>
            <div className='mb-6 flex flex-row items-center justify-between'>
              <div className='flex flex-row items-center'>
                <div className='mr-1 font-bold text-sm'>
                  {countValidDonate(dataFund.usersDonate)}
                </div>
                <div className='text-xs'>Donation</div>
              </div>
              <div className='flex flex-row items-center'>
                { countRangeDay(dataFund.createdAt) }
              </div>
            </div>
            <div className='mb-6 text-xs'>
              {dataFund.description}
            </div>
            <button
              onClick={openModalDonate}
              className='w-full bg-red-hw py-1.5 rounded-md text-white text-center disabled:bg-gray-300'
              disabled={setBtnDonateDisable(dataFund.createdAt)}
            >
              Donate
            </button>
          </div>
        </div>
      </div>

      {/* Modal Donate */}
      <div
        style={{
          display: stateModalDonate,
        }}
        className="fixed inset-x-0 top-0 w-full h-screen flex flex-col justify-center items-center">
        <div
          className='flex-none fixed inset-x-0 top-0 h-screen bg-gray-900 bg-opacity-60'
          onClick={closeModalDonate}
        />
        <div className='z-10 bg-white px-5 py-6 rounded-lg flex flex-col max-w-sm w-full'>
          <form
            onSubmit={(e) => onSubmitHandler.mutate(e)}
            className="flex flex-col">
            <input
              className="mb-4 border-2 border-gray-hw-200 rounded-md p-1 bg-gray-100"
              name="donateAmount"
              type="number"
              placeholder="Nominal Donation"
              value={dataForm.nominal}
              onChange={onChangeHandler}
              required
            />
            <div className='flex flex-row items-center mb-5'>
              <label htmlFor="uploadPayment" className='flex flex-row'>
                <div className='flex flex-row items-center bg-red-hw py-2 px-3 cursor-pointer rounded-md text-white'>
                  <div className='font-semibold text-sm mr-2'>Attach Payment</div>
                  <div>
                    <img src={iconPayment} alt="Icon Payment" />
                  </div>
                </div>
              </label>
              <div className='ml-3 text-xs w-1/2'>
                *transfers can be made to holyways accounts
              </div>
            </div>
            <input
              className="hidden"
              id="uploadPayment"
              name="proofAttachment"
              type="file"
              accept='image/png, image/gif, image/jpeg'
              onChange={onChangeHandler}
              required
            />
            {preview ?
              <img src={preview} alt="Preview Payment" />
              :
              <></>
            }
            <button className="mt-5 bg-red-hw font-semibold text-white w-full py-2 rounded-lg" type="submit">
              Donate
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default CompSummaryRF;