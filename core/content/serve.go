// Package content defines a custom file server for my frontend
// requirements. The frontend can query a document using a JSON
// payload in the request and the file will be served from this
// package's fs directory.
package content

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/gorilla/mux"
)

// Serve serializes content specified in the
// request from the core/content/fs directory and serves it.
func Serve(w http.ResponseWriter, r *http.Request) {
	var req struct {
		Type       string `json:"type"`
		ResourceID string `json:"resourceID"`
	}

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Request decode fail!", http.StatusBadRequest)
		return
	}

	if f, err, ret := getResource(req.Type, req.ResourceID); err != nil {
		http.Error(w, err.Error(), ret)
		return
	} else {
		_, _ = w.Write(f)
	}
}

// ServePDFs serves PDF files from the core/content/fs/pdfs directory.
func ServePDFs(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	http.ServeFile(w, r, fmt.Sprintf("./core/content/fs/pdfs/%s", vars["filename"]))
}

func Index(w http.ResponseWriter, _ *http.Request) {
	var index struct {
		Index map[string]contentIndex `json:"index"`
	}
	index.Index = fs.indexAll()

	if serializedIndex, err := json.Marshal(index); err != nil {
		http.Error(w, "Failed to content index!", http.StatusInternalServerError)
		return
	} else {
		_, _ = w.Write(serializedIndex)
	}
}
