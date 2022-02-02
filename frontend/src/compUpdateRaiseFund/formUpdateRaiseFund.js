import { useState } from 'react';
import { useMutation } from "react-query";
import { useHistory, useParams } from 'react-router-dom';
import { API } from "../config/api";
import { baseUploadImg } from "../config/basePath";

function CompFormUpdateRF(props) {
  const history = useHistory();
  const api = API();
  const { id } = useParams();

  // Form handler
  const [dataForm, setDataForm] = useState({
    title: props.dataFund.title,
    goal: props.dataFund.goal,
    description: props.dataFund.description
  });

  // Message add raise fund handler
  const [message, setMessage] = useState(null);
  const generateMessage = (msg) => {
    return (
      <div className="w-full py-2 text-center bg-red-200 text-red-900 rounded-md mb-3">
        {msg}
      </div>
    );
  }

  const [preview, setPreview] = useState(baseUploadImg(props.dataFund.thumbnail));

  const onChangeHandler = (e) => {
    setDataForm({
      ...dataForm,
      [e.target.name]: e.target.type === 'file' ? e.target.files : e.target.value,
    });

    // Create image url for preview 
    // Reference : https://stackoverflow.com/a/43992687
    // Fix error : https://flutterq.com/typeerror-failed-to-execute-createobjecturl-on-url-overload-resolution-failed/
    if (e.target.type === 'file' && e.target.files.length !== 0) {
      let url = URL.createObjectURL(e.target.files[0]); // image as base64
      setPreview(url);
    }
  };

  const onSubmitHandler = useMutation(async (event) => {
    event.preventDefault();

    try {
      // ref: https://developer.mozilla.org/en-US/docs/Web/API/FormData/set
      const formData = new FormData();
      formData.append("title", dataForm.title);
      if (typeof dataForm.thumbnail !== 'undefined') {
        formData.append("thumbnail", dataForm.thumbnail[0]);
      }
      formData.append("goal", dataForm.goal);
      formData.append("description", dataForm.description);

      const config = {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: formData
      }

      const response = await api.post(`/fund/${id}`, config);
      console.log("responseUpdateRF", response);
      if (response.status === "failed") {
        setMessage(generateMessage(
          response.message
        ));
      }
      if (response.status === "success") return history.push('/my-raise-fund');
    } catch (error) {
      console.log(error);
    }
  });

  return (
    <div className='flex flex-row justify-center py-16'>
      <div className='flex flex-col h-full w-full xl:max-w-7xl lg:max-w-5xl px-4 sm:px-8 md:px-36'>
        <div className="text-2xl font-bold mb-10">
          Update Raise Fund
        </div>
        {message && message}
        <form
          onSubmit={(e) => onSubmitHandler.mutate(e)}
          className="flex flex-col w-full"
        >
          <input
            className="mb-4 border-2 border-gray-hw-200 rounded-md p-1 bg-gray-200"
            name="title"
            type="text"
            placeholder="Title"
            value={dataForm.title}
            onChange={onChangeHandler}
            required
          />
          <label htmlFor="uploadPayment" className='mb-4 flex flex-row'>
            <div className='flex flex-row items-center bg-red-hw py-2 px-3 cursor-pointer rounded-md text-white'>
              <div className='font-semibold text-sm'>Attach Thumbnail</div>
            </div>
          </label>
          <input
            className="hidden"
            id="uploadPayment"
            name="thumbnail"
            type="file"
            accept='image/png, image/gif, image/jpeg'
            onChange={onChangeHandler}
            // required ref: https://stackoverflow.com/a/23215333
          />
          {preview ?
            <img className='max-w-xs mb-4 rounded-md' src={preview} alt="Preview Thumbnail" />
            :
            <></>
          }
          <input
            className="mb-4 border-2 border-gray-hw-200 rounded-md p-1 bg-gray-200"
            name="goal"
            type="number"
            placeholder="Goals Donation"
            value={dataForm.goal}
            onChange={onChangeHandler}
            required
          />
          <textarea
            className='mb-12 border-2 border-gray-hw-200 rounded-md p-1 bg-gray-200'
            placeholder='Description'
            name="description"
            value={dataForm.description}
            onChange={onChangeHandler}
            rows="10" />
          <button type='submit' className='flex flex-row w-full'>
            <div className='flex-1' />
            <div className='bg-red-hw text-sm font-semibold text-white py-1.5 px-14 rounded-lg'>
              Update Raise Fund
            </div>
          </button>
        </form>
      </div>
    </div>
  );
}

export default CompFormUpdateRF;