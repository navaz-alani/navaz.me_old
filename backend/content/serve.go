package content

import (
	"encoding/json"
	"net/http"

	"github.com/gorilla/mux"
)

func Serve(w http.ResponseWriter, r *http.Request) {
	var req struct {
		TopicID       string `json:"topicID"`
		ContentTypeID string `json:"contentTypeID"`
		ResourceID    string `json:"resourceID"`
	}

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Request decode fail!", http.StatusBadRequest)
		return
	}

	if f, err := fs.GetResource(req.TopicID, req.ContentTypeID, req.ResourceID); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	} else {
		_, _ = w.Write(f)
	}
}

// ServePDF serves PDF files from the backend/content/fs/pdfs directory.
func ServePDF(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	pdfPath := fs.GetPDFPath(vars["topicID"], vars["resourceID"])
	http.ServeFile(w, r, pdfPath)
}

// Index handles requests requesting an index for the content stored in
// the fs directory.
func Index(w http.ResponseWriter, _ *http.Request) {
	var index struct {
		Index []Topic `json:"index"`
	}
	index.Index = fs.FullIndex()

	if serializedIndex, err := json.Marshal(index); err != nil {
		http.Error(w, "Failed to content index!", http.StatusInternalServerError)
		return
	} else {
		_, _ = w.Write(serializedIndex)
	}
}
