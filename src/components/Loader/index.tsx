import * as animationData from "@assets/lottie/cat.json"
import React from "react"
import Lottie from 'react-lottie';

const Loader = () => {
  return <div>
    <Lottie
    options={{animationData}}
    height={260}
  />
  </div>
}

export default Loader
