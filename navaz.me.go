package main

import (
	"github.com/navaz-alani/dotenv"

	"github.com/navaz-alani/navaz.me/backend"
)

var env *dotenv.Env

func main() {
	// Read environment variables
	envInit(".env")
	// Inject variables into backend service
	backend.Init(env)
}
