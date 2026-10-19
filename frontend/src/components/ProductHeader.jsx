import { BookOpen, House, Plus, ScrollText } from "lucide-react";
import { Link, NavLink } from "react-router";

const ProductHeader = () => {
  return (
    <>
      <div className="portal-topbar">
        <div className="portal-topbar-inner">
          <Link className="portal-mini-brand" to="/journals" aria-label="หน้าหลักคลังวารสาร">
            <House className="size-5" />
            <span>JOURNAL<br />COLLECTION</span>
          </Link>
          <nav className="portal-navigation" aria-label="เมนูหลัก">
            <NavLink to="/journals" end>
              <BookOpen className="size-4" /> วารสาร
            </NavLink>
            <NavLink to="/journals/new">
              <Plus className="size-4" /> เพิ่มวารสาร
            </NavLink>
          </nav>
        </div>
      </div>
      <header className="portal-wordmark">
        <div className="portal-wordmark-icon" aria-hidden="true">
          <ScrollText />
        </div>
        <p className="portal-wordmark-kicker">JOURNAL ONLINE SYSTEM</p>
        <h1>คลังวารสาร</h1>
        <p className="portal-wordmark-caption">ระบบจัดการและค้นหาวารสาร</p>
      </header>
    </>
  );
};

export default ProductHeader;
