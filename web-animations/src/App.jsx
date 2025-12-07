import React from 'react'
import {ScrollTrigger,SplitText} from "gsap/all";
import NavBar from "./component/NavBar.jsx";
import {gsap} from "gsap/gsap-core";

gsap.registerPlugin(ScrollTrigger,SplitText);
const App = () => {
    return (
        <main>
            <NavBar/>
        </main>
    )
}
export default App
