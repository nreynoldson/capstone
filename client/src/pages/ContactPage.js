import './css/Common.css';

const ContactPage = (props) => {

  return (
    <div className="flexColumn">
      <h1 className="display-3 mb-5">Contact Us</h1>
      <h4>
        <address>
          1234 Commerce St
          <br/>
          Ste 100
          <br/>
          Los Angeles, CA 90094
          <br/>
          <br/>
          <a className="pinkLink" href="mailto:hello@besties.com">hello@besties.com</a>
          <br/>
          <a className="pinkLink" href="tel:+1888888888">1 (888) 888-8888</a>
        </address>
      </h4>
    </div>
  );
}

export default ContactPage;