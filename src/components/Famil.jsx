import "./style/Famil.css";
import Link from "next/link";

export default function FamilPage() {
  return (
    <section className="famil">
      <div className="familcontent">
        <h2>Take control of your digital security</h2>
        <p>Join the ranks of users who trust PulseGuard to protect their data.</p>
        <span className="contentfamil">
          <Link href="/registration" className="startreg">
            Get Started
          </Link>
          <Link href="/doc" className="startdoc">
            Learn More
          </Link>
        </span>
      </div>

      <img
        className="sphereimg"
        src="/sphereimg.png"
        alt=""
        draggable={false}
      />
    </section>
  );
}
