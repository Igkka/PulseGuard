import Navbar from "@/components/navbar"
import "@/components/style/privacy.css"

export default function PrivacyPolicy(){

    return(
<>
        <Navbar/>

        <section className="privacypolicy" >



        <h2>Privacy Policy</h2>
        <p>Last updated: August 2026</p>

        <div className="privacycontent">
            <h2>Introduction</h2>
            <p>
                PulseGuard is a cybersecurity application that provides tools for password management, password generation, email security checks, URL analysis, and file scanning.
                We aim to keep your information secure and be transparent about how it is used. Some account information is stored locally in your browser, while security checks may use third-party services.
                PulseGuard is currently a developing project, and some features, including the Pro payment system, are provided as a demo.
            </p>
            <h2>Information We Collect</h2>
            <p>
                PulseGuard may store information such as your username, email address, password, avatar, selected plan, and credits.
                Some of this information is stored locally in your browser using localStorage to maintain your account session and application settings.
                When you use security-checking features, the information you submit may be sent to third-party services:
                Email addresses may be checked for known data breaches.
                URLs may be analyzed for security threats using services such as VirusTotal.
                Uploaded files may be scanned for potentially malicious content using VirusTotal.
                Third-party services may process submitted information according to their own privacy policies.
            </p>
            <h2>How We Use Your Information</h2>
            <p>We use your information to provide and maintain PulseGuard's features.

                This includes:

                managing your account and login session;
                remembering your plan and available credits;
                providing password-related features;
                performing email, URL, and file security checks;
                improving and maintaining the application.

                PulseGuard does not intentionally sell your personal information.
                The current Pro payment system is only a demo and does not process real payments. Do not enter real bank-card information into the demo payment form.
                PulseGuard may update this Privacy Policy as the application and its features develop.
            </p>
        </div>

        </section>  

</>
    )
}