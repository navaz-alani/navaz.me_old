package core

import (
	"github.com/navaz-alani/dotenv"

	"github.com/navaz-alani/navaz.me/core/content"
	"github.com/navaz-alani/navaz.me/core/router"
)

// Init initializes the core service.
func Init(env *dotenv.Env) {
	content.EnumerateContent()
	router.Init(env.Get("HOST"), env.Get("PORT"))
}
