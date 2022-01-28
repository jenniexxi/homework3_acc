document.addEventListener("DOMContentLoaded", function () {
  gsap.registerPlugin(ScrollTrigger);

  //   let __LOAD_SCROLL_TOP = window.scrollY || window.pageYOffset;
  //   let __LAST_KNOWN_SCROLL_POSITION = 0;
  //   let __TICKING = false;
  //   let __isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  //   const __FRONT_LARGE = document.querySelector(
  //     `${__vdAcc} .vd-qled-acc-start .vd-remote-box .large-img`
  //   );

  const __vdAcc = ".vd-qled-acc";
  const __FLOATING_NAV = document.querySelector(".floating-navigation");
  let __WINDOW_WIDTH = window.innerWidth;
  let __WINDOW_HEIGHT = window.innerHeight;
  let __AFTER_RESIZE_TYPE = window.innerWidth > 767 ? 2 : 1;
  let __BEFORE_RESIZE_TYPE = null;

  const __FRONT_AFTER = document.querySelector(
    `${__vdAcc} .vd-qled-acc-start .vd-remote-box .original-img`
  );
  const __STORY01_REMOTE = document.querySelector(
    `${__vdAcc} .vd-qled-acc-story01 .vd-remote-box`
  );

  function SETVH() {
    document.documentElement.style.setProperty(
      "--vh",
      `${window.innerHeight}px`
    );
  }

  // 소수점 반올림 처리
  // e+2 : 10의 제곱수, - 는 소수
  // return +(Math.round(__num + "e+2") + "e-2");
  // e+2 === ((e + Number.EPSILON) * 100 / 100)
  function ROUND_TWO(__num) {
    // console.log(Math.round((__num + Number.EPSILON) * 100) / 100);
    return +(Math.round((__num + Number.EPSILON) * 100) / 100);
  }

  // remote 원본 이미지 width 결정
  function REMOTE_SIZE_VD_ACC() {
    const __size = __WINDOW_WIDTH > 767 ? __FRONT_AFTER.naturalWidth : 105;
    return __size;
  }

  // remote 위치(top) (vd-qled-acc-start)
  // getBoundingClientRect : 엘리먼트의 크기와 뷰포트에 상대적인 위치 정보를 제공
  function REMOTE_START_TOP_VD_ACC(__n) {
    const __screenHeight = (__WINDOW_HEIGHT - __FLOATING_NAV.offsetHeight) / 2;
    const __remoteHeight = __FRONT_AFTER.naturalHeight / 2;
    const __resultTop =
      __WINDOW_WIDTH > 767
        ? ROUND_TWO(__screenHeight - __remoteHeight) + __n
        : __STORY01_REMOTE.getBoundingClientRect().top -
          __FLOATING_NAV.offsetHeight;
    return __resultTop;
  }

  // vd-qled-acc-story01 .vd-remote-box : bottom 값 설정
  function REMOTE_STORY01_BOTTOM_VD_ACC() {
    const __bottom = parseInt(
      window.getComputedStyle(__STORY01_REMOTE).getPropertyValue("bottom")
    );
    const __n = __WINDOW_WIDTH > 767 ? 75 : 25;

    return __bottom + __n;
  }

  function REMOTE_LEAVE_VD_ACC() {
    if (
      document
        .querySelector(`${__vdAcc} .vd-qled-acc-story01`)
        .className.indexOf("vd-action") === -1
    ) {
      document
        .querySelector(`${__vdAcc} .vd-qled-acc-start .vd-remote-box`)
        .classList.remove("vd-hide");
      document
        .querySelector(`${__vdAcc} .vd-qled-acc-story01`)
        .removeAttribute("style");
      document
        .querySelector(`${__vdAcc} .vd-qled-acc-story01`)
        .classList.remove("vd-hide");
      document
        .querySelector(`${__vdAcc} .vd-qled-acc-story01 .vd-remote-box`)
        .classList.remove("vd-show");
    }
  }

  // vd-qled-acc-story01, vd-qled-acc-story02 style
  function REMOTE_SCREEN_CHANGE_VD_ACC() {
    document.querySelector(`${__vdAcc} .vd-qled-acc-story01`).style.zIndex = 5;
    document
      .querySelector(`${__vdAcc} .vd-qled-acc-story02`)
      .removeAttribute("style");
    document
      .querySelector(`${__vdAcc} .vd-qled-acc-story02 .vd-acc-remote-wrap`)
      .classList.remove("vd-acc-play");
  }

  // vd-qled-acc 전체 scrollTrigger
  // gsap.to("타겟", {속성: 속성값,} : 애니메이션 설정
  function STORY_ACC_SCROLL() {
    gsap.to(`${__vdAcc} .vd-qled-acc-start .vd-txt-wrap.vd-header`, {
      scrollTrigger: {
        trigger: __vdAcc,
        start: "5% top",
        end: "10% center",
        scrub: 0.5,
      },
      autoAlpha: 0,
    });

    let __vdAccTimeline = gsap.timeline({
      paused: true,
      scrollTrigger: {
        id: "vd-acc-remote",
        trigger: `${__vdAcc} .vd-remote`,
        start: "12% top",
        end: "bottom 125%",
        scrub: 0.5,
      },
    });

    __vdAccTimeline
      .to(`${__vdAcc} .vd-qled-acc-start .vd-remote-box`, {
        duration: 2,
        top: 0,
      })
      .to(
        `${__vdAcc} .vd-qled-acc-start .vd-remote-box .vd-remote-img`,
        {
          id: "remote-box1",
          onUpdate: () => {
            const __el = document.querySelector(
              `${__vdAcc} .vd-qled-acc-start .vd-remote-box .vd-remote-img`
            );
            // ratio : 0(상단) ~ 1(하단) 사이 해당 엘리먼트의 ratio 값
            const __r = __vdAccTimeline.getById("remote-box1").ratio;
            const __top =
              __WINDOW_WIDTH > 767
                ? REMOTE_START_TOP_VD_ACC(75)
                : REMOTE_START_TOP_VD_ACC(0);
            // 0 부터 1까지 곱하게 된다 => 결국 vd-remote-img 에 top 값 설정
            __el.style.top = `${__top * __r}px`;
          },
          duration: 2,
          width: REMOTE_SIZE_VD_ACC(),
        },
        "-=2" // 시작시점을 앞당기는
      )
      .to(
        [
          `${__vdAcc} .vd-qled-acc-start .vd-remote-box .remote-back-box`,
          `${__vdAcc} .vd-qled-acc-start .vd-remote-box .remote-back-box img`,
        ],
        {
          id: "remote-change",
          onStart: () => {
            document.querySelector(
              `${__vdAcc} .vd-qled-acc-start .vd-remote-box .original-back-img`
            ).style.zIndex = 5;
            document
              .querySelector(
                `${__vdAcc} .vd-qled-acc-start .vd-remote-box .original-back-img`
              )
              .classList.remove("vd-hide");
          },
          onComplete: function () {
            document
              .querySelector(`${__vdAcc} .vd-qled-acc-start .vd-remote-box`)
              .classList.remove("vd-show");
            document
              .querySelector(`${__vdAcc} .vd-qled-acc-start .vd-remote-box`)
              .classList.add("vd-hide");
            document.querySelector(
              `${__vdAcc} .vd-qled-acc-story01`
            ).style.zIndex = 5;
            document
              .querySelector(`${__vdAcc} .vd-qled-acc-story01`)
              .classList.add("vd-action");
            document
              .querySelector(`${__vdAcc} .vd-qled-acc-story01 .vd-remote-light`)
              .classList.add("vd-hide");
          },
          // 애니메이션(Tween)이 계속 진행되는 동안 호출
          onUpdate: function (__update) {
            const __imgBoxHeight = document.querySelector(
              `${__vdAcc} .vd-qled-acc-start .vd-remote-box .remote-back-box`
            ).offsetHeight;
            let __r =
              __vdAccTimeline.getById("remote-change").ratio == 0
                ? 0.001
                : __vdAccTimeline.getById("remote-change").ratio;
            let __result = __imgBoxHeight * __r;
            __result = __imgBoxHeight / __result;
            // .remote-back-box 의 scaleY 값 설정
            document.querySelector(
              `${__vdAcc} .vd-qled-acc-start .vd-remote-box .remote-back-box img`
            ).style.transform = `scaleY(${__result})`;
          },
          duration: 2,
          scaleY: (__i, __el, __a, t) => {
            console.log("i : " + __i, "el : " + __el, "a : " + __a, "t : " + t);
            //i : 0 el : [object HTMLDivElement] a : [object HTMLDivElement],[object HTMLImageElement] t : undefined
            console.log(1 - __i);
            // 1 -> 0
            if (__el.className.indexOf("remote-back-box") > -1) {
              return 1 - __i;
            }
          },
        }
      )
      .call(REMOTE_LEAVE_VD_ACC)
      .set(`${__vdAcc} .vd-qled-acc-story01 .vd-remote-light`, {
        x: 0,
        xPercent: -50,
      })
      .to(`${__vdAcc} .vd-qled-acc-story01 .vd-remote-light`, {
        id: "vd-qled-acc-light",
        onStart: () => {
          document.querySelector(
            `${__vdAcc} .vd-qled-acc-story01`
          ).style.zIndex = 5;
          document
            .querySelector(`${__vdAcc} .vd-qled-acc-story01`)
            .classList.remove("vd-action");
          document
            .querySelector(`${__vdAcc} .vd-qled-acc-story01 .vd-remote-light`)
            .classList.remove("vd-hide");
        },
        y: 0,
      })
      .to(`${__vdAcc} .vd-qled-acc-story01 .vd-remote-light .vd-light-on`, {
        autoAlpha: 1,
      })
      .to(
        `${__vdAcc} .vd-remote-charge .vd-charge11`,
        {
          autoAlpha: 1,
        },
        "-=0.6" // // 시작시점을 앞당기는
      )
      .to(
        `${__vdAcc} .vd-remote-charge .vd-charge10`,
        {
          autoAlpha: 1,
        },
        "-=0.5"
      )
      .to(
        `${__vdAcc} .vd-remote-charge .vd-charge09`,
        {
          autoAlpha: 1,
        },
        "-=0.4"
      )
      .to(
        `${__vdAcc} .vd-remote-charge .vd-charge08`,
        {
          autoAlpha: 1,
        },
        "-=0.3"
      )
      .to(
        `${__vdAcc} .vd-remote-charge .vd-charge07`,
        {
          autoAlpha: 0.5,
        },
        "-=0.2"
      )
      .to(
        `${__vdAcc} .vd-remote-charge .vd-charge06`,
        {
          autoAlpha: 0.2,
        },
        "-=0.1"
      )
      .to(
        `${__vdAcc} .vd-qled-acc-story01 .vd-remote-light`,
        {
          autoAlpha: 1,
        },
        "-=2"
      )
      .to(
        `${__vdAcc} .vd-qled-acc-story01 .vd-remote-box`,
        {
          bottom: REMOTE_STORY01_BOTTOM_VD_ACC(),
        },
        "-=0.5"
      )
      .to(
        `${__vdAcc} .vd-qled-acc-story01 .vd-remote-light`,
        {
          autoAlpha: 0,
        },
        "-=0.5"
      )
      .call(REMOTE_SCREEN_CHANGE_VD_ACC)
      .to(`${__vdAcc} .vd-qled-acc-story02 [class*="vd-charge-item0"]`, {
        onStart: () => {
          document
            .querySelector(`${__vdAcc} .vd-qled-acc-story01`)
            .removeAttribute("style");
          document.querySelector(
            `${__vdAcc} .vd-qled-acc-story02`
          ).style.zIndex = 5;
        },
        onUpdate: function () {
          const __remoteWrap = document.querySelector(
            `${__vdAcc} .vd-qled-acc-story02 .vd-acc-remote-wrap`
          );
          if (
            this.progress() > 0.35 &&
            __remoteWrap.className.indexOf("vd-acc-play") === -1
          )
            __remoteWrap.classList.add("vd-acc-play");
        },
        duration: 1.5,
        autoAlpha: 1,
      })
      .fromTo(
        // fromTo : 시작점과 끝점을 지정 gsap.fromTo("타겟", {시작 속성: 시작 속성값,},{끝나는 속성: 끝나는 속성값});
        `${__vdAcc} .vd-qled-acc-story02 .vd-remote-charge .vd-charge07`,
        {
          autoAlpha: 0.5,
        },
        {
          autoAlpha: 1,
        },
        "-=1"
      )
      .fromTo(
        `${__vdAcc} .vd-qled-acc-story02 .vd-remote-charge .vd-charge06`,
        {
          autoAlpha: 0.2,
        },
        {
          autoAlpha: 1,
        },
        "-=0.9"
      )
      .to(
        `${__vdAcc} .vd-qled-acc-story02 .vd-remote-charge .vd-charge05`,
        {
          autoAlpha: 1,
        },
        "-=0.8"
      )
      .to(
        `${__vdAcc} .vd-qled-acc-story02 .vd-remote-charge .vd-charge04`,
        {
          autoAlpha: 1,
        },
        "-=0.7"
      )
      .to(
        `${__vdAcc} .vd-qled-acc-story02 .vd-remote-charge .vd-charge03`,
        {
          autoAlpha: 1,
        },
        "-=0.6"
      )
      .to(
        `${__vdAcc} .vd-qled-acc-story02 .vd-remote-charge .vd-charge02`,
        {
          autoAlpha: 1,
        },
        "-=0.5"
      )
      .to(
        `${__vdAcc} .vd-qled-acc-story02 .vd-remote-charge .vd-charge01`,
        {
          autoAlpha: 1,
        },
        "-=0.4"
      );
  }

  function END_ACC_SCROLL() {
    ScrollTrigger.matchMedia({
      "(min-width: 768px)": function () {
        const __vdAccEnd = document.querySelector(
          `${__vdAcc} .vd-acc-scroll .vd-qled-acc-end`
        );
        __vdAccEnd.removeAttribute("style");

        gsap.to(`${__vdAcc} .vd-qled-acc-end .vd-desc span`, {
          scrollTrigger: {
            trigger: `${__vdAcc} .vd-acc-scroll`,
            start: "top top",
            end: "80% center",
            scrub: 0.5,
          },
          autoAlpha: 1,
        });
      },
      "(max-width: 767px)": function () {
        const __vdAccEnd = document.querySelector(
          `${__vdAcc} .vd-acc-scroll .vd-qled-acc-end.vd-pc-none`
        );
        const __vdAccItemList = document.querySelector(
          `${__vdAcc} .vd-acc-scroll .vd-acc-item-list`
        );
        const __marginTop =
          (__WINDOW_HEIGHT -
            __FLOATING_NAV.offsetHeight -
            __vdAccItemList.offsetHeight) /
          2;
        gsap.set(`${__vdAcc} .vd-acc-item-list`, { force3D: true, z: 0.1 });
        gsap.to(`${__vdAcc} .vd-acc-item-list`, {
          scrollTrigger: {
            id: "vd-qled-acc-end",
            trigger: `${__vdAcc} .vd-acc-scroll`,
            start: "100px top",
            end: "bottom 250%",
            scrub: 0.5,
          },
          duration: 10,
        });

        gsap.to(`${__vdAcc} .vd-qled-acc-end .vd-desc span`, {
          scrollTrigger: {
            trigger: `${__vdAcc} .vd-acc-scroll`,
            start: "top top",
            end: "bottom 250%",
            scrub: 0.5,
          },
          autoAlpha: 1,
        });
      },
    });
  }

  function init_ACC_SCROLL() {
    if (!document.querySelector(__vdAcc)) return;

    STORY_ACC_SCROLL();
    END_ACC_SCROLL();
  }

  window.addEventListener("optimizedResize", function () {
    __BEFORE_RESIZE_TYPE = __WINDOW_WIDTH > 767 ? 2 : 1;

    if (__AFTER_RESIZE_TYPE !== __BEFORE_RESIZE_TYPE) {
      __AFTER_RESIZE_TYPE = __BEFORE_RESIZE_TYPE;
    }

    SETVH();
  });

  window.addEventListener("load", function () {
    SETVH();

    init_ACC_SCROLL();
  });
});
