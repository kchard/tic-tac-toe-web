(ns tic-tac-toe-web.views.home
  (:require [tic-tac-toe-web.views.common :as common]
            [tic-tac-toe-web.models.game :as model]
            [noir.response :as resp]
			[noir.session :as session])
			
  (:use [noir.core :only [defpage]]))
  
(def canvas-size 750)
(def size 3)
(def player1 :X)
(def player2 :O)
(def container-id "container")
(def canvas-id "board")

(def page-url "/tic-tac-toe")
(def config-url "/ajax/tic-tac-toe/config")
(def state-url "/ajax/tic-tac-toe/state")
(def move-url "/ajax/tic-tac-toe/move")
(def reset-url "/ajax/tic-tac-toe/reset")

(defn new-game []
  (model/create-game size player1 player2))
  
(defn put-game-in-session [game]
  (session/put! :game game))
  
(defn get-game-from-session []
  (let [game (session/get :game)]
    (if game 
	  game 
	  (do 
	    (put-game-in-session (new-game))
		(get-game-from-session)))))
	
(defpage [:get page-url] []
  (common/layout
    [:div {:id container-id} 
      [:canvas {:id canvas-id :width canvas-size :height canvas-size}]]))

(defpage [:get config-url] []
  (resp/json {:player1   player1 
              :player2   player2 
              :size      size 
              :canvas-size canvas-size
              :canvas-id canvas-id
              :state-url state-url
              :move-url  move-url
              :reset-url reset-url}))
	
(defpage [:get state-url] []
  (let [game (get-game-from-session)]
    (resp/json {:board (game :board) :winner (game :winner) :draw (game :draw)})))
	
(defpage [:post move-url] [:as move]
  (put-game-in-session (model/play (get-game-from-session) (Integer/parseInt(move :x)) (Integer/parseInt(move :y)))))
  
(defpage [:post reset-url] [:as move]
  (put-game-in-session (new-game)))
	
		   

