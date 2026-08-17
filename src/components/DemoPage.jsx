
import "@/components/style/DemoPage.css"

export default function DemoPage(){
    return(

    <section className="demopage">

        <img src="/demo.png" alt="" className="demoimg" draggable={false}/>

        <div className="democontent">
            <h2>Everything You Need for Better Security</h2>
            <p>From generating strong passwords to checking their security, PulseGuard brings essential protection tools together in one place.</p>
            <p>Simple tools, clear interface, better digital security.</p>

            <div className="demobtn">
                <a href="#rates" className="showprices" id="demoa">Show Prices</a>
                <a href="/registration" className="tryfree" id="demoa">Try It Free</a>
            </div>
        </div>

    </section>

    )

}