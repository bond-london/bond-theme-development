import { Reporter } from "gatsby";
import { JSDOM } from "jsdom";

export function renderLottieToSvg(
  animationData: unknown,
  reporter: Reporter
): string {
  try {
    const { window } = new JSDOM("<!DOCTYPE html><body></body>", {
      pretendToBeVisual: true,
      url: "http://localhost",
    });
    const { document, navigator } = window;
    global.window = window;
    global.document = document;
    global.navigator = navigator;

    // Lottie_Svg is copied from lottie-web/build/player/cjs/lottie_light.min.js
    // Then need to comment out the 3 lines in ImagePreloader where they use the canvas context
    const Lottie = require("./lottie_svg").default;

    const container = document.createElement("div");
    document.body.append(container);

    const instance = Lottie.loadAnimation({
      container,
      renderer: "svg",
      loop: false,
      autoplay: false,
      animationData,
    });
    instance.goToAndStop(0, true);
    const svg = container.innerHTML;
    return svg;
  } catch (ex) {
    return reporter.panic("Error loading lottie", ex);
  }
}
