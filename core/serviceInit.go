package core

import (
	"github.com/navaz-alani/dotenv"

	"github.com/navaz-alani/navaz.me/core/content"
	"github.com/navaz-alani/navaz.me/core/mail"
	"github.com/navaz-alani/navaz.me/core/router"
)

// Init initializes the core service by injecting
// environment variables into the core packages and
// kicking off service routines/workers.
func Init(env *dotenv.Env) {
	content.EnumerateContent()

	mail.Init(
		env.Get("SENDGRID_KEY"),
		env.Get("MAILTO_NAME"),
		env.Get("MAILTO_ADDR"),
	)
	router.Init(
		env.Get("HOST"),
		env.Get("PORT"),
	)
}
