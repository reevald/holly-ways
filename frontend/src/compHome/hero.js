import imgHero1 from '../src-assets/img/hero1.png';
import imgHero2 from '../src-assets/img/hero2.png';

function CompHero() {
  return (
    <div className='overflow-hidden'>
      <div className='bg-red-hw flex flex-row justify-center pt-16'>
        <div className='flex flex-row justify-between h-full w-full xl:max-w-7xl lg:max-w-5xl px-4 -mr-32 sm:px-8 md:px-16'>
          <div className='flex flex-col w-7/12 mr-10'>
            <div className='text-3xl xl:text-4xl xl:leading-relaxed text-white font-bold mb-4'>
              While you are still standing, try to reach out to the people who are falling.
            </div>
            <div className='text-white text-xs lg:text-sm xl:text-lg max-w-sm xl:max-w-md mb-4'>
              Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.
            </div>
            <div className='flex flex-row'>
              <a href='#donate-now'>
                <div className='text-red-hw font-bold text-xs py-1.5 px-5 bg-white rounded-md'>
                  Donate Now
                </div>
              </a>
            </div>
          </div>
          <div className='w-5/12 -mb-14'>
            <img src={imgHero1} alt="Hero 1" />
          </div>
        </div>
      </div>
      <div className='bg-gray-hw-100 flex flex-row justify-center pt-24'>
        <div className='flex flex-row justify-between h-full w-full xl:max-w-7xl lg:max-w-5xl px-4 -ml-32 sm:px-8 md:px-16'>
          <div className='w-4/12 -mt-44'>
            <img src={imgHero2} alt="Hero 2" />
          </div>
          <div className='w-8/12 flex flex-col pl-16'>
            <div className='text-3xl xl:text-4xl xl:leading-relaxed font-bold mb-4 lg:mb-6'>
              Your donation is very helpful for people affected by forest fires in Kalimantan.
            </div>
            <div className='flex flex-row'>
              <div className='text-xs lg:text-sm xl:text-lg mr-8 w-1/2'>
                Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.
              </div>
              <div className='text-xs lg:text-sm xl:text-lg w-1/2'>
                Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CompHero;