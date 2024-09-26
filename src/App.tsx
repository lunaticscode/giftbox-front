import { FC, SVGAttributes, useRef, useState } from "react";

const sleep = async (time: number = 2000): Promise<void> => {
  return await new Promise((resolve) => setTimeout(() => resolve(), time));
};
const GiftIcon: FC<SVGAttributes<SVGSVGElement>> = (styleProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="size-6"
      {...styleProps}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21 11.25v8.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 1 0 9.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1 1 14.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z"
      />
    </svg>
  );
};

function App() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [imgSrc, setImgSrc] = useState<string>("");
  const [giftMsg, setGiftMsg] = useState<string>("");
  const [showGiftContent, setShowGiftContet] = useState<boolean>(false);
  const [showErrorMsg, setShowErrorMsg] = useState<boolean>(false);
  const codeInputRef = useRef<HTMLInputElement>(null);
  const giftImgRef = useRef<HTMLImageElement>(null);

  const getGift = async (code: string) => {
    try {
      setIsLoading(true);
      setShowErrorMsg(false);
      setShowGiftContet(false);
      const response = await fetch(
        `http://localhost:3030/api/gift/${encodeURIComponent(code)}`
      );
      if (response.ok) {
        const result = await response.json();
        const { base64, contentType, message } = result;
        const src = `data:${contentType};base64,${base64}`;
        setImgSrc(src);
        setGiftMsg(message);
        await sleep(1000);
        setShowGiftContet(true);
      } else {
        setShowErrorMsg(true);
      }
    } catch (err) {
      console.log(err);
      setShowErrorMsg(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClickSubmit = () => {
    setImgSrc("");
    setGiftMsg("");
    const code = codeInputRef.current?.value;
    if (!code) {
      return;
    }
    getGift(code);
  };

  const handleClickSave = () => {
    const aTag = document.createElement("a");
    aTag.href = imgSrc;
    const ext = imgSrc.split("image/")[1].split(";")[0];
    aTag.download = `giftbox-${new Date().getTime()}.${ext}`;
    aTag.click();
    aTag.remove();
  };

  const handleClickBack = () => {
    setImgSrc("");
    setGiftMsg("");
    setShowGiftContet(false);
    setShowErrorMsg(false);
  };

  return (
    <main>
      <header>GIFTBOX</header>

      {isLoading && (
        <div className="loading-wrapper">
          <div className="lds-ripple">
            <div></div>
            <div></div>
          </div>
        </div>
      )}

      {showGiftContent ? (
        <div className="gift-content-wrapper">
          <div className="gift-content-img-wrapper">
            <img ref={giftImgRef} src={imgSrc} />
          </div>
          {giftMsg && <div className="gift-content-msg-wrapper">{giftMsg}</div>}
          <div className="gift-content-button-wrapper">
            <button
              className="gift-content-button-save"
              onClick={handleClickSave}
            >
              저장
            </button>
            <br />
            <button
              className="gift-content-button-back"
              onClick={handleClickBack}
            >
              뒤로 가기
            </button>
          </div>
        </div>
      ) : (
        !isLoading && (
          <div className="gift-code-form-wrapper">
            <div className="gift-code-form-logo-wrapper">
              <GiftIcon
                width={180}
                height={180}
                stroke="#75FB4C"
                strokeWidth={1}
              />
            </div>
            {showErrorMsg && (
              <div className="gift-code-form-errormsg-wrapper">
                (!) 존재하지 않는 코드입니다.
              </div>
            )}
            <div className="gift-code-form-input-wrapper">
              <input ref={codeInputRef} placeholder="코드 입력" />
            </div>
            <div className="gift-code-form-button-wrapper">
              <button onClick={handleClickSubmit}>입력완료</button>
            </div>
          </div>
        )
      )}
    </main>
  );
}

export default App;
