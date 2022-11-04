import footerStyle from './footer-style.js';

const footerHTML = `
  <style>${footerStyle}</style>
  <hr />
  <footer>
    <div class="footer">
      <h1>푸터임. 나중에 정할거임 ㅋ</h1>
    </div>
  </footer>
`;

const footerTag = document.createElement('footer');
footerTag.innerHTML = footerHTML;
document.body.append(footerTag);
