package translate

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"time"

	"github.com/bregydoc/gtranslate"
	"github.com/gorilla/mux"
	"github.com/sirupsen/logrus"
)

func enableCors(w *http.ResponseWriter) {
	(*w).Header().Set("Access-Control-Allow-Origin", "*")
	(*w).Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
	(*w).Header().Set("Access-Control-Allow-Headers", "Accept, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization")
}

// Word ...
type Word struct {
	Text       string    `json:"text"`
	Translated string    `json:"translated"`
	CreatedAt  time.Time `json:"created_at"`
}

// Translate ... Server (!)
type Translate struct {
	config *Config
	logger *logrus.Logger
	router *mux.Router
	// store  *store.Store
}

// New ...
func New(config *Config) *Translate {
	return &Translate{
		config: config,
		logger: logrus.New(),
		router: mux.NewRouter(),
	}
}

// Start ...
func (t *Translate) Start() error {
	if err := t.configureLogger(); err != nil {
		return err
	}

	t.configureRouter()

	// if err := t.configureStore(); err != nil {
	// 	return err
	// }

	t.logger.Info("ready for translate")

	return http.ListenAndServe(t.config.BindAddr, t.router)
}

func (t *Translate) configureLogger() error {
	level, err := logrus.ParseLevel(t.config.LogLevel)
	if err != nil {
		return err
	}

	t.logger.SetLevel(level)

	return nil
}

func (t *Translate) configureRouter() {
	t.router.HandleFunc("/hello", t.HandleHello())
	t.router.HandleFunc("/translate", t.HandleTranslate())
}

// configureStore

// HandleHello ...
func (t *Translate) HandleHello() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		io.WriteString(w, "Hello")
	}
}

// HandleTranslate ...
func (t *Translate) HandleTranslate() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		enableCors(&w)
		w.Header().Set("Content-Type", "application/json")
		text := r.URL.Query().Get("text")

		translated, err := gtranslate.TranslateWithParams(
			text,
			gtranslate.TranslationParams{
				From: "en",
				To:   "ru",
			},
		)

		if err != nil {
			panic(err)
		}

		// TODO: use logger!
		fmt.Printf("en: %s | ru: %s \n", text, translated)

		word := Word{
			Text:       text,
			Translated: translated,
			CreatedAt:  time.Now(),
		}

		json.NewEncoder(w).Encode(word)
	}
}
