(ns tic-tac-toe-web.views.common
  (:use [noir.core :only [defpartial]]
        [hiccup.page-helpers :only [include-css include-js html5]]))

(defpartial layout [& content]
            (html5
              [:head
               [:title "tic-tac-toe-web"]
               (include-css "/css/reset.css")
			   (include-css "/css/main.css")
			   (include-js "https://ajax.googleapis.com/ajax/libs/jquery/1.8.1/jquery.min.js")
               (include-js "/js/core.js")
			   (include-js "/js/drawing.js")
               (include-js "/js/controller.js")
               (include-js "/js/app.js")]
              [:body
               [:div#wrapper
                content]]))
