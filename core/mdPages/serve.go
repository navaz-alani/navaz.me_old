package mdPages

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
)

// Serve serializes the markdown source file specified in the
// request from the core/mdPages/pages directory and serves it.
func Serve(w http.ResponseWriter, r *http.Request) {
	var req struct {
		File string `json:"file"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Request decode fail!", http.StatusBadRequest)
		return
	}

	if f, err := ioutil.ReadFile(fmt.Sprintf("core/mdPages/pages/%s.md",
		req.File)); err != nil {
		log.Println(err)
		http.Error(w, "File does not exist!", http.StatusInternalServerError)
		return
	} else {
		_, _ = w.Write(f)
	}
}