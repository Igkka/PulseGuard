"use client"

import "@/components/style/PasswordStorage.css"
import { useState } from "react"
import { useEffect } from "react"
import { spendCoin } from "./SpendCoins"
import { Copy } from "lucide-react"
import { Trash } from "lucide-react"

async function savePasswords(passwords) {
    const response = await fetch("/api/passwords", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            passwords,
        }),
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
        throw new Error(
            result.error || "Failed to save passwords"
        );
    }

    localStorage.setItem(
        "passwords",
        result.data
    );
}

    async function loadPasswords() {
        const data = localStorage.getItem("passwords");

        if (!data) {
            return [];
        }

        const response = await fetch("/api/passwords", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                data,
            }),
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
            return [];
        }

        return Array.isArray(result.passwords)
            ? result.passwords
            : [];
    }

    export default function PassStorage (){

        const [passwords,setPasswords] = useState([])
        const [dataStorage,setDataStorage] = useState({
            id:"",
            title:"",
            password:"",
        })

    useEffect(() => {
        async function load() {
            const saved = await loadPasswords();

            if (Array.isArray(saved)) {
                setPasswords(saved);
            }
        }

        load();
    }, []);

    const CreateStorage = async (e) => {
        e.preventDefault()


        if (
            dataStorage.title.trim() === "" ||
            dataStorage.password.trim() === "" 
        ) {
            alert("Fill in all fields");
            return;
        }

        if (passwords.length >= 6) {
            alert("Maximum 6 storages.");
            return;
        }

        if (!spendCoin()) {
        alert("You don't have enough coins!");
        return;
    }
    
    const newStorage = {
        id: Date.now(),
        title: dataStorage.title,
        password: dataStorage.password,
    };
        
        const updatedPasswords = [...passwords, newStorage];
        await savePasswords(updatedPasswords);
        setPasswords(updatedPasswords);
        window.location.href = "/pro"

        
    }
    
    const handleChangeStorage = (e) => {
        setDataStorage({
            ...dataStorage,
            [e.target.name]: e.target.value
            
        })
    }

    const handleDelete = async (id) => {
        const updatedPasswords = passwords.filter(
            (item) => item.id !== id
        );

        await savePasswords(updatedPasswords);
        setPasswords(updatedPasswords);
    };

    const handleCopy = async (password) => {
        
        try {
            await navigator.clipboard.writeText(password);
            alert("Password copied!");
        } catch {
            alert("Copy failed. Please copy manually.");
        }
    }


    return(
    <section className="passStoragePage" id="passStoragePage">
        <form action="" onSubmit={CreateStorage}>

        <h2>Password Storage</h2>

        <div className="passStorageContent">

            <input name="title" type="text" placeholder="Site Name" value={dataStorage.title} onChange={handleChangeStorage}/>
            <input name="password" type="password" placeholder="Site Password" value={dataStorage.password} onChange={handleChangeStorage}/>

            <button type="submit" className="createstoragebtn" >
                Create New Storage
            </button>

        </div>

        <div className="storages">
            {passwords.map((item) => (
                <div className="passItem" key={item.id}>

                    <h3>{item.title}</h3>
                    <p>{item.password}</p>
                    <div className="storagebuttons">
                    <button type="button" className="copypass" onClick={()=>handleCopy(item.password)}><Copy/></button>
                    <button type="button" className="deletestorage" onClick={()=>handleDelete(item.id)}><Trash/></button>
                    </div>
                </div>
            ))}
        </div>
    </form>
    </section>
    )

}