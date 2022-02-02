function WrapperProfile({ children }) {
  return (
    <div className='flex flex-row justify-center py-16'>
      <div className='flex flex-row justify-between h-full w-full xl:max-w-7xl lg:max-w-5xl px-4 sm:px-8 md:px-36'>
        {children}
      </div>
    </div>
  );
}

export default WrapperProfile;