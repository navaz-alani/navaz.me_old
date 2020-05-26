package router

import (
	"fmt"
	"log"
	"net/http"

	"github.com/gorilla/mux"
	"github.com/rs/cors"

	"github.com/navaz-alani/navaz.me/backend/content"
	"github.com/navaz-alani/navaz.me/backend/mail"
)

// Init initializes the backend service's router.
func Init(host, port string) {
	m := mux.NewRouter()
	configureRoutes(m)

	addr := fmt.Sprintf("%s:%s", host, port)
	log.Printf("Listening on %s", addr)
	log.Fatal(http.ListenAndServe(addr, cors.AllowAll().Handler(m)))
}

func configureRoutes(m *mux.Router) {
	/*
		Content delivery routes
	*/
	m.HandleFunc("/contentIndex", content.Index)
	m.HandleFunc("/content", content.Serve)
	m.HandleFunc("/pdfs/{topicID}/{resourceID}", content.ServePDF)
	/*
		Content update webhook endpoint
	*/
	m.HandleFunc("/sync-content", content.Sync)
	/*
		Mail route
	*/
	m.HandleFunc("/mail", mail.SendMail)
}
