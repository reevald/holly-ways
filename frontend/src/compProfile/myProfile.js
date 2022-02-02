import imageProfile from '../src-assets/img/sample-profile.png';

function CompMyProfile(props) {
  const dataUser = props.dataUser;
  return (
    <div className='w-1/2 flex flex-col'>
      <div className='flex flex-row items-center mb-6'>
        <div className='font-bold text-2xl mr-6'>
          My Profile
        </div>
        <div className='cursor-pointer bg-red-hw py-0.5 px-4 text-white rounded-md'>
          Edit
        </div>
      </div>
      <div className='flex flex-row items-center'>
        <div className='w-32 mr-4'>
          <img src={imageProfile} alt="Sample Profile" />
        </div>
        <div className='flex flex-col text-sm'>
          <div className='font-bold text-red-hw'>
            Full Name
          </div>
          <div className='mb-4'>{dataUser.fullName}</div>
          <div className='font-bold text-red-hw'>Email</div>
          <div className='mb-4'>{dataUser.email}</div>
          <div className='font-bold text-red-hw'>Phone</div>
          <div>-</div>
        </div>
      </div>
    </div>
  );
}

export default CompMyProfile;