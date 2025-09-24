import logo from "../../assets/logo.png";

function Footer() {
  return (
    <>
      <div className='border-t-2 mt-3'> </div>

      <footer className='bg-white mx-20 mb-3'>
        <img src={logo} alt='logo' className='w-[200px]' />
        <p> CÔNG TY TNHH G3 CINEMA </p>
        <p>
          Địa chỉ: Tầng 3, Trung tâm thương mại XYZ, số 123 đường Nguyễn Văn A,
          Thạch Hòa, Thạch Thất, Hà Nội, Việt Nam.
        </p>
        <p> Hotline: (028) 1234 5678 </p>
      </footer>
    </>
  );
}

export default Footer;
