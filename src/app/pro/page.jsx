import "@/components/style/ProPage.css"
import Navbar from "@/components/navbar"
import PassStorage from "@/components/PasswordStorage"
import GeneratePass from "@/components/GeneratePass"
import UserBalance from "@/components/Balance"
import CheckPass from "@/components/CheckPass"
import EmailValidator from "@/components/Email"
import SiteSecurityCheck from "@/components/SiteUrlCheck"

export default function ProPage(){
 return(
    <>
   <Navbar/>
   <UserBalance/>
   <PassStorage/>
   <GeneratePass/>
   <CheckPass/>
   <EmailValidator/>
   <SiteSecurityCheck/>
    </>
 )
}