import React from 'react'
import {ScrollTrigger,SplitText} from "gsap/all";
import NavBar from "./component/NavBar.jsx";
import {gsap} from "gsap/gsap-core";
import Hero from "./component/hero.jsx";
import Cocktails from "./component/cocktails.jsx";
import About from "./component/about.jsx";

gsap.registerPlugin(ScrollTrigger,SplitText);
const App = () => {
    return (
        <main>
            <NavBar/>
            <Hero/>
            <Cocktails/>
            <About/>
        </main>
    )
}
export default App
