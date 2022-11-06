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
    width: 120px;
    height: 120px;
  }
  .nav_bar {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .nav_menu > ol {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
  }

  .dropdown-item {
    padding: 20px 50px 20px 20px;
  }
`;

export default headerStyle;
