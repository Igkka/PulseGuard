import "@/components/style/Documents.css";
import Navbar from "@/components/NavbarLoader";
import Link from "next/link";

const docs = [
    {
        title: "Privacy Policy",
        href: "/doc/privacy"
    },
    {
        title: "Terms of Service",
        href: "/doc/terms"
    },
    {
        title: "Support",
        href: "/#contact"
    },
    {
        title: "FAQ",
        href: "/#faqpage"
    }
];

const DocumentsPage = () => {
    return (
        <>
        <Navbar />
        
        <section className="documents">

            <h2>
                Documents
            </h2>

            <div className="docs">

               {docs.map((doc) => (
                    <Link
                        href={doc.href}
                        className="doc"
                        key={doc.title}
                    >
                        {doc.title}
                    </Link>
                ))}

            </div>
        </section>
        </>
    );
}

export default DocumentsPage