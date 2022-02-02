function CompLoadingFullScreen() {
  return (
    <div className="w-full min-h-screen flex flex-row justify-center items-center">
      <div className="flex flex-col items-center">
        <div className="text-4xl font-bold mb-8 text-gray-700">Holly Ways</div>
        <div className='loading mb-8'></div>
      </div>
    </div>
  );
}

export default CompLoadingFullScreen;