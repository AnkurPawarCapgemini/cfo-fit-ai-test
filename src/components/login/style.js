import styled from "styled-components";


  const LoginFormWrapper =styled.div`
 display: flex;
  height: 100vh; 

  .row {
    display: flex;
    width: 100%;
  }

  .col-sm-6 {
    width: 50%;
  }
 
  .col-sm-6 img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
 
  .form-right {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
  }

  .form-right .bg-white {
    width: 80%; /* Adjust this for your form width */
    max-width: 400px;
  }
`
export default LoginFormWrapper;
