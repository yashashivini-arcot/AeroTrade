import { Link } from 'react-router-dom';

export default function Footer() {
  const year = new Date().getFullYear();

  const LINKS = {
    'Heritage Categories': ['Handloom Weaves','Handicrafts','Ayurveda','Jewellery','Home Decor','Books'],
    'State Collections': ['Rajasthan','Kerala','Tamil Nadu','Telangana','Odisha','Gujarat'],
    'Company': ['About Us','Our Artisans','Sustainability','Blog','Careers'],
    'Support': ['Track Order','Returns Policy','FAQ','Contact Us','MSME Info'],
  };

  return (
    <footer className="footer">
      <div className="footer__container">
        <div className="footer__brand">
          <div className="footer__logo">
            <span>🪔</span>
            <div>
              <span className="footer__logo-main">ShopEZ</span>
              <span className="footer__logo-sub">Swadeshi</span>
            </div>
          </div>
          <p className="footer__tagline">
            Discover India's Finest. Shop with Pride.
          </p>
          <p className="footer__desc">
            Connecting you directly to India's master artisans, handloom weavers, and heritage craft clusters. Every purchase sustains a tradition.
          </p>
          <div className="footer__badges">
            <span className="footer__badge">🇮🇳 Made in India</span>
            <span className="footer__badge">👥 MSME Verified</span>
            <span className="footer__badge">🌿 Sustainable</span>
          </div>
        </div>

        <div className="footer__links-grid">
          {Object.entries(LINKS).map(([title, links]) => (
            <div key={title} className="footer__col">
              <h4 className="footer__col-title">{title}</h4>
              <ul className="footer__col-list">
                {links.map((link) => (
                  <li key={link}>
                    <Link to="/shop" className="footer__col-link">{link}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="footer__bottom">
        <p>© {year} ShopEZ Swadeshi Pvt. Ltd. All Rights Reserved.</p>
        <div className="footer__bottom-links">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
          <a href="#">Cookie Policy</a>
        </div>
      </div>
    </footer>
  );
}
