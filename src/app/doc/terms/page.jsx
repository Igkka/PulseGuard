import "@/components/style/terms.css"
import Navbar from "@/components/navbar"

export default function TermsOfService(){
    return(

        <section className="termsofservice">

            <Navbar/>

        <h2>Terms Of Service</h2>
        <p>Last updated: August 2026</p>

        <div className="termscontent">

            <h2>Introduction</h2>
            <p>
                PulseGuard is a cybersecurity application that provides tools for password management, password generation, email security checks, URL analysis, and file scanning.
                By using PulseGuard, you agree to use the application responsibly and follow these Terms of Service. If you do not agree with these terms, you should not use the application.
                PulseGuard is currently a developing project, and some features may be changed, updated, or removed in the future.
            </p>

            <h2>User Conduct</h2>
            <p>
                You are responsible for the information and files you submit to PulseGuard.
                You agree not to use PulseGuard to:
                upload files that you do not have permission to scan;
                intentionally submit harmful or illegal content;
                attempt to damage, disrupt, or gain unauthorized access to the application;
                abuse or overload security-checking services;
                use the application for illegal activities.
                Security results provided by PulseGuard and third-party services should not be considered a complete guarantee that a file, website, or email address is safe.
                You are responsible for deciding how to act based on the results provided by the application.
            </p>

            <h2>Purchases and Payments</h2>

            <p>
                PulseGuard may provide Free and Pro plans with different features and credit limits.
                The current Pro payment system is a demo system and does not process real payments. The payment form is only used to demonstrate how a future payment system may work.
                Do not enter real bank-card information into the current demo payment form.
                Plans and credits may be stored locally in your browser and are used to control access to certain PulseGuard features.
                PulseGuard may change plan features, prices, credit limits, or other subscription-related details as the project develops.
                By using the application, you understand that the current payment and subscription system is not a real financial service and that no actual purchase is made through the current demo interface.
            </p>

        </div>

        </section>

    )
}