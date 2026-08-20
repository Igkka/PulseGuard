import "@/components/style/ProPage.css"
import Navbar from "@/components/navbar"
import PassStorage from "@/components/PasswordStorage"
import GeneratePass from "@/components/GeneratePass"
import UserBalance from "@/components/Balance"
import CheckPass from "@/components/CheckPass"
import WelcomePage from "@/components/WelcomePage"
import { Database } from 'lucide-react';
import { RotateCcwKey } from 'lucide-react';
import { NotebookPen } from 'lucide-react';

export default function FreePage(){
 return(
   <>
   <aside className="navfunc">
      <div className="navfunclinks">
         <a href="#passStoragePage"><Database/></a>
         <a href="#genpass"><RotateCcwKey/></a>
         <a href="#checkpass"><NotebookPen/></a>
      </div>
   </aside>
   
   <div className="procontent">
   
   <Navbar/>
   <UserBalance/>
   <WelcomePage/>
   <PassStorage/>
   <GeneratePass/>
   <CheckPass/>
   
   </div>
</>
 )
}