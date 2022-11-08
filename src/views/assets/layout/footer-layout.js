import footerStyle from './footer-style.js';

const footerHTML = `
  <style>${footerStyle}</style>
  <hr />
  <footer>
    <div class="footer">
      <div>
        <img class="footer_logo" src="/mainlogo.png" />
        <p>상호명: (주) 오늘바다</p>
        <p>공동대표: 해3물(3팀)</p>
        <p>주소: 서울 성동구 아차산로17길 48 성수낙낙 elice-lab 2층 라운지</p>
        <p>
          <a href="#">이용약관</a>
          <em>|</em>
          <a href="#">개인정보처리방침</a>
          <em>|</em>
          <a href="#">이메일무단수집금지</a>
        </p>
        <p>Copyright ⓒ 2022 박우찬 설지윤 김영범 김익수 이예나</p>
      </div>
    </div>
  </footer>
`;

const footerTag = document.createElement('footer');
footerTag.innerHTML = footerHTML;
document.body.append(footerTag);
