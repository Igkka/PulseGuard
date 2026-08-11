import "@/components/style/Documents.css";
import Navbar from "@/components/NavbarLoader";
import Sphere from "@/components/sphere";
const docs = [
    "Privacy Policy",
    "Terms of Service",
    "Support"
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
                    <div
                        className="doc"
                        key={doc}
                    >
                        {doc}
                    </div>
                ))}

            </div>
        </section>
        </>
    );
}

export default DocumentsPage