package content

import (
	"crypto/hmac"
	"crypto/sha1"
	"encoding/hex"
	"encoding/json"
	"io/ioutil"
	"net/http"
	"os/exec"

	"github.com/gorilla/mux"
)

// Serve serves the requested content from the content root
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

// Sync is a function which runs a script to synchromize the
// content root dierctory that is being served. The sync process
// is arbitrary and the prcedure is defined in a file called
// 'syncFS.sh' in this project's root.
func Sync(w http.ResponseWriter, r *http.Request) {
	reqPayload, err := ioutil.ReadAll(r.Body)
	if err != nil {
		http.Error(w, "failed to read request", http.StatusBadRequest)
		return
	}
	reqSignature := r.Header.Get("X-Hub-Signature")
	if len(reqSignature) == 0 {
		http.Error(w, "unauthorized", http.StatusUnauthorized)
		return
	}
	mac := hmac.New(sha1.New, fs.secret)
	_, _ = mac.Write(reqPayload)
	expectedMAC := hex.EncodeToString(mac.Sum(nil))
	if !hmac.Equal([]byte(reqSignature[5:]), []byte(expectedMAC)) {
		http.Error(w, "unauthorized", http.StatusUnauthorized)
		return
	}
	w.WriteHeader(http.StatusAccepted)
	exec.Command("./syncFS.sh").Run()
}
