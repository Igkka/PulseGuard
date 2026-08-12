"use client"
import "@/components/style/FAQ.css"
import { useState } from "react";


const questions = [
    {
        question: "What is PulseGuard?",
        answer:
            "PulseGuard is a cybersecurity application that helps users manage passwords and check the security of files, websites and email addresses."
    },
    {
        question: "How does Password Storage work?",
        answer:
            "Password Storage allows you to save your passwords in one place and manage your saved credentials."
    },
    {
        question: "Can I check a file for viruses?",
        answer:
            "Yes. PulseGuard can send a selected file for security analysis and display the scan results."
    },
    {
        question: "What is the Pro plan?",
        answer:
            "The Pro plan provides access to additional security features, including file security checks, email security checks and website security checks."
    },
    {
        question: "How many passwords can I save?",
        answer:
            "The current version of PulseGuard allows you to save up to 6 password entries."
    }
];



export default function FAQ(){

    const [open, setOpen] = useState(null);

    const toggleQuestion = (index) => {
        setOpen(open === index ? null : index);
    };

    return(

        <section className="faqpage" id="faqpage">

            <h2>FAQ</h2>

        <div className="faqlist">

            {questions.map((item,index)=>(
                <div className="faqitem" key={item.question}>

            <button
                type="button"
                className="faqquestion"
                onClick={() => toggleQuestion(index)}
            >
                <span>{item.question}</span>

                <span className="faqicon">
                {open === index ? "-" : "+"}
                </span>
            </button>

            {open === index && (
                <div className="faqanswer">
                    <p>{item.answer}</p>
                </div>
            )}

                </div>
            ))}

        </div>

        </section>

    )
}