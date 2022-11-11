const headerStyle = `
  @import '../../_reset.css';
  body {
    width: 1000px;
    margin: auto;
  }
  header {
    margin-bottom: 20px;
  }
  header > h1 {
    text-align: center;
  }
  .main_logo {
    width: 140px;
    height: 140px;
  }
  .nav_bar {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .nav_menu > ul {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
  }
  .nav_menu > ul > li {
    margin: 0 7px;
  }
  .dropdown-item {
    padding: 20px 50px 20px 20px;
  }
  .nav_menu > ul > li,
  .nav_menu > ul > li > em {
    font-size: 17px;
  }
  .log_out {
    cursor: pointer;
  }
  .dropdown > button {
    font-size: 17px;
  }
  @media (min-width: 320px) and (max-width: 960px) {
    body {
      width: 100%;
      margin: auto;
    }
    .nav_menu > ul > li > a,
    .nav_menu > ul > em {
      font-size: small;
    }
    .nav_menu > ul > li {
      margin: 0 2px;
      font-size: small;
      }
  }
`;

export default headerStyle;
