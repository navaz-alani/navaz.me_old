package core

import (
	"github.com/navaz-alani/dotenv"

	"github.com/navaz-alani/navaz.me/core/router"
)

// Init initializes the core service.
func Init(env *dotenv.Env) {
	// todo: initialize the mdPages server
	router.Init(env.Get("HOST"), env.Get("PORT"))
}
