package backend

import (
	"github.com/navaz-alani/dotenv"

	"github.com/navaz-alani/navaz.me/backend/content"
	"github.com/navaz-alani/navaz.me/backend/mail"
	"github.com/navaz-alani/navaz.me/backend/router"
)

// Init initializes the backend service by injecting
// environment variables into the backend packages and
// kicking off service routines/workers.
func Init(env *dotenv.Env) {
	content.Init(
		env.Get("FS_ROOT"),
		env.Get("XHUB_SECRET"),
	)
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
