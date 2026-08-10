import "@/components/style/ProPage.css"
import Navbar from "@/components/navbar"
import PassStorage from "@/components/PasswordStorage"
import GeneratePass from "@/components/GeneratePass"
import UserBalance from "@/components/Balance"
import CheckPass from "@/components/CheckPass"
import EmailValidator from "@/components/Email"
import SiteSecurityCheck from "@/components/SiteUrlCheck"
import { Database } from 'lucide-react';
import { RotateCcwKey } from 'lucide-react';
import { NotebookPen } from 'lucide-react';
import { MailSearch } from 'lucide-react';
import { Globe } from 'lucide-react';

export default function ProPage(){
 return(
   <>
   <aside className="navfunc">
      <h2>Functions</h2>
      <div className="navfunclinks">
         <a href="#passStoragePage"><Database/></a>
         <a href="#genpass"><RotateCcwKey/></a>
         <a href="#checkpass"><NotebookPen/></a>
         <a href="#emailvalidator"><MailSearch/></a>
         <a href="#siteurlcheck"><Globe/></a>
      </div>
   </aside>
   
   <div className="procontent">
   
   <Navbar/>
   <UserBalance/>
   <PassStorage/>
   <GeneratePass/>
   <CheckPass/>
   <EmailValidator/>
   <SiteSecurityCheck/>
   
   </div>
</>
 )
}