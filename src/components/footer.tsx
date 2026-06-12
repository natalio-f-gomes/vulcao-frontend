import { companyName } from "../api/global";

function GetFooterSection() {
    const currentYear: number = new Date().getFullYear();
    return (
        <footer>
        <div>© {currentYear} <span>{companyName}</span>. All rights reserved.</div>
        <div>Made with <span>♥</span> using Bootstrap 5</div>
        </footer>
    )
}

export default GetFooterSection