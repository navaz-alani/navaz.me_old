package main

import (
	"log"

	"github.com/navaz-alani/dotenv"
)

// required specifies which keys MUST be read
// from the environment variables. Failure to
// read these variables will cause the program
// to exit with status 1.
var required = []string{
	// Router params
	"APP",
	"HOST",
	"PORT",
	// Mail params
	"SENDGRID_KEY",
	"MAILTO_NAME",
	"MAILTO_ADDR",
	// Content distribution params
	"FS_ROOT",
	"XHUB_SECRET",
}

// envInit initializes some application parameters
// from the environment variables.
func envInit(src string) {
	e, err := dotenv.Load(src, true)
	if err != nil {
		log.Println(err)
		log.Fatalln("err: unable to initialize environment")
	}
	undef := e.CheckRequired(required)
	if undef != nil {
		log.Fatalln("err: expected definition in environment", undef)
	}
	env = e
}
