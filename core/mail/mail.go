package mail

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/sendgrid/sendgrid-go"
	"github.com/sendgrid/sendgrid-go/helpers/mail"
)

var (
	client *sendgrid.Client
	baseEmail *mail.Email
)

// Init initializes the package's mail environment
// from the injected environment variables.
func Init(key, name, addr string) {
	client = sendgrid.NewSendClient(key)
	baseEmail = mail.NewEmail(name, addr)
}

// SendMail handles requests to send mail to the site owner.
func SendMail(w http.ResponseWriter, r *http.Request) {
	var req struct {
		Name string `json:"name"`
		Addr string `json:"addr"`
		Subj string `json:"subj"`
		Body string `json:"body"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "request decode fail", http.StatusBadRequest)
		return
	}

	from := mail.NewEmail(req.Name, req.Addr)
	subject := fmt.Sprintf("[%s] %s", req.Name, req.Subj)
	message := mail.NewSingleEmail(from, subject, baseEmail, "?", req.Body)

	_, err := client.Send(message)
	if err != nil {
		http.Error(w, "failed to send mail", http.StatusInternalServerError)
		return
	}
}
