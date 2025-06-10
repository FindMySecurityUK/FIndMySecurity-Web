import BusinessSection from '@/sections/home/Business'
import TrustedCompanies from '@/sections/home/Companies'
import GetStarted from '@/sections/home/GetStarted'
import Hero from '@/sections/home/Hero'
import SecurityAppSection from '@/sections/home/SecurityApp'
import SecurityCompanies from '@/sections/home/SecurityCompanies'
import SecurityFeatures from '@/sections/home/SecurityFeatures'
import StepsSection from '@/sections/home/StepSection'
import Testimonials from '@/sections/home/Testimonials'
import TrainingProviders from '@/sections/home/TrainingProviders'
import ComingSoon from '@/sections/components/coming soon/comingsoon'

export default function Home() {
  return (
    <div>
    <Hero/>
    <TrustedCompanies/>
    <SecurityCompanies/>
    <GetStarted/>
    {/* <SecurityAppSection/> */}
    <TrainingProviders/> 
     <Testimonials/>
    {/* <BusinessSection/> */}
    {/* <StepsSection/> */}
    {/* <SecurityFeatures/> */}
    {/* <ComingSoon/> */}

    </div>

  )
  }
