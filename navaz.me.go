package main

import (
	"github.com/navaz-alani/dotenv"

	"github.com/navaz-alani/navaz.me/core"
)

var env *dotenv.Env

func main() {
	// Read environment variables
	envInit(".env")
	// Inject variables into core service
	core.Init(env)
}
