import "@/components/style/WelcomePage.css"
import { MoveDown } from 'lucide-react';

export default function WelcomePage(){

    return(
        <section className="welcomepage">

            <div className="welcomecontent">

                <h2>Welcome to PulseGuard function page!</h2>
                <p>Your digital security starts with small habits.</p>
                <p>Explore the tools designed to make protecting your data simple and effortless.</p>

                <div className="founderror">    
                    <p>Found an error?</p>
                    <a href="/#contact" className="letsknow">Let us know about it.</a>
                </div>

                <div className="explorecontent">
                    <a href="#passStoragePage" className="explorefunc">Explore </a>
                    <MoveDown/>
                </div>

            </div>

        </section>
    )
}