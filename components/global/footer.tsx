interface FooterCompanyInfoProps {
  title: string;
  content: string;
}

function FooterCompanyInfo({ title, content }: FooterCompanyInfoProps) {
  return (
    <li>
      <div className="flex paragraph-1">
        <span className="basis-1/3 text-gray-400">{title}</span>
        <span className="basis-2/3 text-gray-300">{content} </span>
      </div>
    </li>
  );
}

interface FooterMenuProps {
  text: string;
}

function FooterMenu({ text }: FooterMenuProps) {
  return (
    <li className="[&:not(:last-child)]:lg:after:content-['|'] after:m-3">
      {text}
    </li>
  );
}

export default function Footer() {
  return (
    <footer className="bg-gray-800 py-16 flex justify-center px-4 mt-36 lg:mt-48">
      <div className="lg:max-w-screen-2xl flex flex-col w-full lg:flex-row gap-10 lg:gap-24">
        <div className="shrink-0">로고</div>
        <div className="w-full flex flex-col gap-6 lg:gap-16">
          <div className="flex flex-col lg:flex-row lg:justify-between w-full">
            <div className="flex flex-col lg:flex-row w-full lg:gap-16">
              <div className="mb-10 lg:mb-0 basis-2/3">
                <h1 className="heading-3 text-gray-200 mb-5">회사 정보</h1>
                <ul className="flex flex-col gap-3 paragraph-1 text-gray-300">
                  <FooterCompanyInfo title="company" content="스포너" />
                  <FooterCompanyInfo
                    title="제휴 및 업무 문의"
                    content="sponer@sponer.com"
                  />
                  <FooterCompanyInfo title="연락처" content="010-4331-7797" />
                  <FooterCompanyInfo
                    title="address"
                    content="서울특별시 용산구 한강대로92길 15, 1층(갈월동)"
                  />
                  <FooterCompanyInfo
                    title="사업자등록번호"
                    content="306-36-36523"
                  />
                  <FooterCompanyInfo
                    title="통신판매업 신고번호"
                    content="제2020-서울어딘가-무슨호"
                  />
                </ul>
              </div>
              <div className="mb-10 lg:mb-0 basis-1/3">
                <h1 className="heading-3 text-gray-200 mb-5">고객센터</h1>
                <ul className="flex flex-col gap-3 paragraph-1 text-gray-300">
                  <li>1544-1232</li>
                  <li>1:1 문의</li>
                  <li>평일 오전 9시 ~ 오후 6시</li>
                  <li>FAQ 자주 묻는 질문</li>
                </ul>
              </div>
            </div>
            <div className="mb-9">
              <ul className="flex gap-3">
                <li className="w-6 h-6 shrink-0 bg-slate-600 rounded-full"></li>
                <li className="w-6 h-6 shrink-0 bg-slate-600 rounded-full"></li>
                <li className="w-6 h-6 shrink-0 bg-slate-600 rounded-full"></li>
              </ul>
            </div>
          </div>
          <ul className="flex flex-col gap-2 paragraph-2 text-gray-400 lg:flex-row lg:gap-0">
            <FooterMenu text="회사 소개" />
            <FooterMenu text="공지사항" />
            <FooterMenu text="이벤트 공지" />
            <FooterMenu text="입점/제휴/대리배달" />
            <FooterMenu text="개인정보처리방침" />
            <FooterMenu text="운영,관리방침" />
            <FooterMenu text="이용약관" />
          </ul>
        </div>
      </div>
    </footer>
  );
}
