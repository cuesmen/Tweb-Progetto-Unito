import "../css/footer.css";
import logo from '../assets/images/logo.png'
import InputField from "../components/InputField";
import { MdPlayArrow } from "react-icons/md";


export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="footer-contact">
            <img src={logo} alt="MovieApp Logo" className="footer-logo" />
            <span>C.so Svizzera 185, Via Pessinetto, 12, 10149 Torino TO </span>
            <span>Call us: we don't have cellphones :)</span>
        </div>
        <div className="footer-links">
            <h1>Legal</h1>
            <div>Cookies</div>
            <div>Privacy</div>
            <div>Terms of use</div>
        </div>
        <div className="footer-account">
            <h1>Account</h1>
            <div>My Account</div>
        </div>
        <div className="footer-newsletter">
            <h1>NewsLetter</h1>
            <div>Subscribe to our newsletter to stay updated on the latest movies and special offers!</div>
            <InputField />
            <button>SUBSCRIBE NOW <span><MdPlayArrow/></span></button>
        </div>
      </div>

      <hr className="footer-divider" />

      <p>© 2025 <span>MoviePoint.</span> All rights reserved.</p>
    </footer>
  );
}
