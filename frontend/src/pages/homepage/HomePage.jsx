import React from "react";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const navigate = useNavigate();
  return (
    <div className="mb-5">
      <div className="slider h-[530px] bg-[url('./assets/homepage/dau-bg.jpg')] bg-cover bg-no-repeat bg-center rounded-lg overflow-hidden">
        <div className="w-full h-full flex justify-center items-center bg-gray-900 bg-opacity-60">
          <div className="mx-16 text-white text-center">
            <div className="uppercase mb-6 text-sm">
              Là nơi tốt nhất để mua các loại đậu
            </div>
            <div className="font-medium text-5xl mb-6">Cô Tùng Store</div>
            <div className="font-medium text-base mb-8">
              Đến với cửa hàng của cô Tùng, có rất nhiều loại đậu tuyệt vời,
              chất lượng cao để bạn lựa chọn.
            </div>
            <div className="flex justify-center">
              <a
                href="/product"
                className="uppercase bg-white text-gray-900 w-max tracking-wider px-6 py-4 text-xs font-semibold rounded hover:bg-opacity-80"
              >
                Khám phá sản phẩm của cô Tùng
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className="story">
        <div className="w-full h-full flex justify-center items-center">
          <div className="px-4 sm:px-16 md:px-32 lg:px-64 xl:px-96 py-32 text-center">
            <div className="text-3xl mb-6 leading-10">
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Perspiciatis, accusamus temporibus. Placeat.
            </div>
            <div className="text-gray-500 leading-7 mb-6">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas
              perferendis fugit laborum. Voluptatum minima commodi nobis quae
              libero cupiditate rem sequi. Voluptas eius, alias ut ad fugit
              minima, voluptatibus aperiam molestias et quisquam ipsam autem
              fugiat similique, illo labore quod quam. Atque necessitatibus
              consequatur ad odit, est totam quod quo recusandae rerum. Rem
              dignissimos rerum neque velit impedit cumque maxime, repudiandae
              veritatis fugit, praesentium itaque! Nulla eveniet eum esse sed
              porro obcaecati tempore, veniam a labore repellat! Officiis ut
              laborum omnis aut nostrum, rem mollitia porro odit facere libero
              necessitatibus amet neque ab autem et exercitationem aspernatur
              iure, tenetur itaque!
            </div>
            <div className="">
              <a
                href="/"
                className="text-coffee-400 hover:text-coffee-600 relative after:absolute after:-bottom-2 after:left-0 after:bg-coffee-50 hover:after:bg-coffee-200 after:h-0.5 after:w-full after:transition-all after:ease-in-out after:duration-400"
              >
                Đọc tất cả câu chuyện
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className="ct-subheadline">
        <div className="ct-subheadline-deco-line"></div>
        <div className="ct-subheadline-label">
          Mua đậu và sẽ nhận được cái bắt tay của anh Hưng dz
        </div>
        <div className="ct-subheadline-deco-line"></div>
      </div>
      <div className="buy-shakehand w-[95%] xl:w-[65%] mx-auto mb-24">
        <div className="flex flex-col md:flex-row justify-center items-center gap-5">
          <div className="ct-bean-images basis-1/2 md:flex md:flex-row gap-5 w-full h-full mb-5 md:mb-0">
            <div className="ct-bean-big-image h-[280px] mb-3 xs:mb-5 md:mb-0 bg-[url('./assets/homepage/shakehand-bg.png')] bg-cover bg-no-repeat bg-center basis-2/3"></div>
            <div className="ct-bean-small-images basis-1/3 flex flex-row md:flex-col gap-3 xs:gap-5">
              <div className="h-[130px] xs:h-[200px] md:h-[130px] basis-1/2 bg-[url('./assets/homepage/ngucoc-bg.jfif')] bg-cover bg-no-repeat bg-center"></div>
              <div className="h-[130px] xs:h-[200px] md:h-[130px] basis-1/2 bg-[url('./assets/homepage/dau-bg-02.jpg')] bg-cover bg-no-repeat bg-center"></div>
            </div>
          </div>
          <div className="ct-bean-post basis-1/2 md:pl-8 xl:pl-14 text-center md:text-left">
            <div className="uppercase tracking-widest text-gray-500 font-medium text-xs mb-4">
              Ưu đãi đặc biệt
            </div>
            <div className="text-3xl mb-4">Nhận cái bắt tay của Đình Hưng</div>
            <div className="text-gray-500 leading-7 mb-4">
              Nhận được cái bắt tay của doanh nhân thành đạt, bạn sẽ có trải
              nghiệm rất thú vị!
            </div>
            <div className="flex">
              <a
                href="/product"
                className="uppercase bg-gray-900 text-white w-max tracking-wider px-6 py-4 text-xs font-semibold rounded hover:bg-opacity-80 mx-auto md:mx-0"
              >
                Bắt đầu Shoping
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className="ct-parallax-section bg-[url('./assets/homepage/bg-parallax.jpg')] bg-cover bg-no-repeat bg-center h-[400px] mb-24 bg-fixed w-[100vw] relative left-[calc(-50vw_+_50%)]"></div>
      <div className="ct-subheadline">
        <div className="ct-subheadline-deco-line"></div>
        <div className="ct-subheadline-label">Subsribe</div>
        <div className="ct-subheadline-deco-line"></div>
      </div>
      <div className="ct-subcrisbe h-[350px] bg-[#1d1f2e] flex flex-col justify-center items-center mb-24">
        <div className="flex justify-center items-center mb-3">
          <div className="w-8 h-px bg-gray-500"></div>
          <div className="uppercase mx-4 tracking-widest text-gray-400 font-bold text-xs text-center">
            Đăng ký sẽ nhận phần quà bất ngờ
          </div>
          <div className="w-8 h-px bg-gray-500"></div>
        </div>
        <div className="text-4xl text-white mb-3">Subscribe now</div>
        <div className="ct-form">
          <div className="ct-form-item">
            <input
              type="email"
              placeholder="hungbmt303@gmail.com"
              className="px-6 py-4 w-[350px] bg-inherit border-[1px] border-gray-700 outline-none text-white leading-5 hover:border-gray-300 duration-500 focus:border-gray-300 placeholder:uppercase placeholder:text-xs placeholder:tracking-widest placeholder:font-semibold"
            />
          </div>
          <div className="ct-form-item text-center mt-3">
            <button
              onClick={() => {
                navigate("/register");
              }}
              className="uppercase bg-white text-gray-900 w-max tracking-wider px-6 py-4 text-xs font-semibold rounded hover:bg-opacity-80"
            >
              Đăng ký
            </button>
          </div>
        </div>
      </div>
      <div className="flex justify-center items-center mb-10">
        <div className="ct-subheadline-deco-line"></div>
        <div className="ct-subheadline-label">Mua Offline tại địa chỉ</div>
        <div className="ct-subheadline-deco-line"></div>
      </div>
      <div>
        <div className="flex justify-center items-center mb-20">
          <div className="ct-subheadline-deco-line"></div>
          <div className="mx-4 tracking-widest text-gray-500 font-medium text-sm text-center">
            75A đường 16A thôn 7 xã Hoà Thuận tỉnh Đăk Lăk thành phố Buôn Ma
            Thuột
          </div>
          <div className="ct-subheadline-deco-line"></div>
        </div>
        <iframe
          title="75A đường 16A thôn 7 xã Hoà Thuận tỉnh Đăk Lăk thành phố Buôn Ma
            Thuột"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3891.62482444272!2d108.11474547478434!3d12.73788078755643!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3171f9f39b04f8bd%3A0x478027c2d1bc2b4c!2zxJDhuq11LCBu4bq_cCwgxJHGsOG7nW5nLCBiw6FuaCB0csOhbmcgY8O0IFTDuW5n!5e0!3m2!1svi!2s!4v1718710067792!5m2!1svi!2s"
          width="600"
          height="450"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="w-full h-[500px]"
        ></iframe>
      </div>
    </div>
  );
}
