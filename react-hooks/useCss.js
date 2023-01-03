import { useLayoutEffect } from "react";
import $ from "jquery";
import { CSS_VERSION } from "./config";

/*
  # install jquery
  # put css files in the public folder
  # useCss("/public/path_to_your_style.css");
  # /public/ will be replaced automatically to /
  # Changing CSS_VERSION will rest all cased styles
*/

function useCss(url) {

  const getFileName = (url) => {
    let path = url.split("/");
    let last = path[path.length - 1];
    let before = path[path.length - 2];
    let first = path[path.length - 3];

    return `${first}/${before}/${last}`;
  };

  const requestFile = (url) => {
    let fileName = getFileName(url);
    let element = document?.querySelector(`[file-name='${fileName}']`);

    if(!element) {
      $.ajax({
        url: url.replace("/public", ""),
        dataType: "text",
        success: function (cssText) {
          let cashed = JSON.stringify({
            style: cssText,
            date: new Date(),
            version: CSS_VERSION,
          });
  
          window.localStorage.setItem(fileName, cashed);
  
          let style = document.createElement("style");
          style.setAttribute("file-name", fileName);
          style.innerHTML = cssText;
          document.head.appendChild(style);
        },
        error: (err) => {
          console.log("CSS : ", err);
        },
      });
    }
  };

  useLayoutEffect(() => {
    let fileName = getFileName(url);
    let element = document?.querySelector(`[file-name='${fileName}']`);

    if(!element) {
      if (localStorage.getItem(fileName)) {
        let style = document.createElement("style");
        let cashed = JSON.parse(localStorage.getItem(fileName));
        // let duration = new Date() - new Date(cashed?.date);

        if (cashed?.version === CSS_VERSION) {
          // if (duration < 1500000) {
          /* 
            01 min => 0060000 ms 
            25 min => 1500000 ms
          */
          style.setAttribute("file-name", fileName);
          style.innerHTML = cashed?.style;
          document.head.appendChild(style);
        } else {
          requestFile(url);
        }
      } else {
        requestFile(url);
      }
    }

  }, []);
}

export { useCss };
