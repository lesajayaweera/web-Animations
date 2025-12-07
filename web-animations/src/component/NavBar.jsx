import React from 'react'
import {navLinks,} from "../../public/constants/index.js";
import {useGSAP} from "@gsap/react";
import {gsap} from "gsap/gsap-core";

const NavBar = () => {

    useGSAP(()=>{
        const navTween =gsap.timeline({
            scrollTrigger:{
                trigger:'nav',
                start:'bottom top'
            }
        })

        navTween.fromTo('nav',{backgroundColor:'transparent'},{backgroundColor:'#00000050',backgroundFilter:'blur(10px)',duration:1,ease:'power1.inOut'});
    })
    return (
        <nav className='w-11/12 mx-auto'>
            <div>
                <a href="#home"  className='flex items-center gap-2'>
                    <img src={"/images/logo.png"} alt="logo" />
                    <p>Velvet Pour</p>
                </a>

                <ul>
                    {navLinks.map((item,index)=>{
                        return(
                            <li key={item.id}>
                                <a href={`#${item.id}`}>{item.title}</a>
                            </li>
                        )
                    })}
                </ul>
            </div>
        </nav>
    )
}
export default NavBar
