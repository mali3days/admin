package subtitle

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"io/ioutil"
	"net/http"
	"time"

	"github.com/gorilla/mux"
	"github.com/sirupsen/logrus"
)

var openSubtitlesURL string = "https://www.opensubtitles.com"

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

// User model for opensubtitles.com API
type User struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

// Subtitle ... Server (!)
type Subtitle struct {
	config *Config
	logger *logrus.Logger
	router *mux.Router
	// store  *store.Store
}

// New ...
func New(config *Config) *Subtitle {
	return &Subtitle{
		config: config,
		logger: logrus.New(),
		router: mux.NewRouter(),
	}
}

// Start ...
func (t *Subtitle) Start() error {
	if err := t.configureLogger(); err != nil {
		return err
	}

	t.configureRouter()

	// if err := t.configureStore(); err != nil {
	// 	return err
	// }

	t.logger.Info("ready for subtitle !")

	return http.ListenAndServe(t.config.BindAddr, t.router)
}

func (t *Subtitle) configureLogger() error {
	level, err := logrus.ParseLevel(t.config.LogLevel)
	if err != nil {
		return err
	}

	t.logger.SetLevel(level)

	return nil
}

func (t *Subtitle) configureRouter() {
	t.router.HandleFunc("/hello", t.HandleHello())
	t.router.HandleFunc("/subtitle", t.HandleSubtitle())
}

// configureStore

// HandleHello ...
func (t *Subtitle) HandleHello() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		io.WriteString(w, "Hello")
	}
}

// OpenSubtitlesUser ...
type OpenSubtitlesUser struct {
	JTI              string `json:"jti"`
	AllowedDownloads int    `json"allowed_downloads"`
	Level            string `json"level"`
	UserID           int    `json"user_id"`
	ExtInstalled     bool   `json"ext_installed"`
	VIP              bool   `json"vip"`
}

// OpenSubtitlesLoginAPIResponse ...
type OpenSubtitlesLoginAPIResponse struct {
	Token  string            `json:"token"`
	Status int               `json:"status"`
	User   OpenSubtitlesUser `json:"user"`
}

// SubtitleAttributes ...
type SubtitleAttributes struct {
	Title         string   `json:"title"`
	OriginalTitle string   `json:"original_title"`
	IMDB_ID       int      `json:"imdb_id"`
	TMDB_ID       int      `json:"tmdb_id"`
	Feature_ID    string   `json:"feature_id"`
	Year          string   `json:"year"`
	TitleAka      []string `json:"title_aka"`
	URL           string   `json:"url"`
	IMG_URL       string   `json:"img_url"`
	// SubtitlesCounts  []           `json:"subtitles_counts"`
}

// OpenSubtitlesSubtitle ...
type OpenSubtitlesSubtitle struct {
	ID         string             `json:"id"`
	Type       string             `json:"type"`
	Attributes SubtitleAttributes `json:"attributes"`
	// Status int               `json:"status"`
	// User   OpenSubtitlesUser `json:"user"`
}

// SubtitleSubAttributes ...
type SubtitleSubAttributes struct {
	SubtitleID string `json:"subtitle_id"`
	Language   string `json:"language"`
	URL        string `json"url"`

	// Title         string   `json:"title"`
	// OriginalTitle string   `json:"original_title"`
	// IMDB_ID       int      `json:"imdb_id"`
	// TMDB_ID       int      `json:"tmdb_id"`
	// Feature_ID    string   `json:"feature_id"`
	// Year          string   `json:"year"`
	// TitleAka      []string `json:"title_aka"`
	// URL           string   `json:"url"`
	// IMG_URL       string   `json:"img_url"`
	// SubtitlesCounts  []           `json:"subtitles_counts"`
}

// OpenSubtitlesSub struct for REAL subtitle for find method ...
type OpenSubtitlesSub struct {
	ID         string                `json:"id"`
	Type       string                `json:"type"`
	Attributes SubtitleSubAttributes `json:"attributes"`
}

// OpenSubtitlesSearchMovieAPIResponse ...
type OpenSubtitlesSearchMovieAPIResponse struct {
	Data []OpenSubtitlesSubtitle `json:"data"`
}

// OpenSubtitlesFindSubAPIResponse ...
type OpenSubtitlesFindSubAPIResponse struct {
	TotalPages int                `json:"total_pages"`
	TotalCount int                `json:"total_count"`
	Page       int                `json:"page"`
	Data       []OpenSubtitlesSub `json:"data"`
}

func getLoginResponseBody(body []byte) (*OpenSubtitlesLoginAPIResponse, error) {
	var s = new(OpenSubtitlesLoginAPIResponse)
	err := json.Unmarshal(body, &s)
	if err != nil {
		fmt.Println("whoops:", err)
	}
	return s, err
}

func getSubtitleSearchMovieResponseBody(body []byte) (*OpenSubtitlesSearchMovieAPIResponse, error) {
	var s = new(OpenSubtitlesSearchMovieAPIResponse)
	err := json.Unmarshal(body, &s)
	if err != nil {
		fmt.Println("whoops:", err)
	}
	return s, err
}

func getSubtitleFindResponseBody(body []byte) (*OpenSubtitlesFindSubAPIResponse, error) {
	var s = new(OpenSubtitlesFindSubAPIResponse)
	err := json.Unmarshal(body, &s)
	if err != nil {
		fmt.Println("whoops:", err)
	}
	return s, err
}

// HandleSubtitle ...
func (t *Subtitle) HandleSubtitle() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		enableCors(&w)
		w.Header().Set("Content-Type", "application/json")

		user := &User{
			Username: "m3days",
			Password: "6HD2uAJD6HD2uAJD",
		}

		buf := new(bytes.Buffer)
		json.NewEncoder(buf).Encode(user)

		fmt.Println(buf)

		res, err := http.Post(openSubtitlesURL+"/api/v1/login", "application/json", buf)
		defer res.Body.Close()

		if err != nil {
			panic(err)
		}

		body, err := ioutil.ReadAll(res.Body)
		if err != nil {
			panic(err.Error())
		}

		s, err := getLoginResponseBody([]byte(body))

		token := s.Token

		// fmt.Println(res)
		// fmt.Println(token)

		// Authorization

		// r.Header.Set("authorization", "Bearer "+token)
		// w.Header().Set("authorization", "Bearer "+token)

		timeout := time.Duration(5 * time.Second)
		client := http.Client{
			Timeout: timeout,
		}

		fmt.Println(token)

		// request to find movie
		getRequest, err := http.NewRequest("GET", openSubtitlesURL+"/api/v1/search/movie?query=Harry+Potter", nil)
		getRequest.Header.Set("authorization", "Bearer "+token)

		res2, err2 := client.Do(getRequest)
		// res2, err2 := http.Get(openSubtitlesURL + "/api/v1/discover/most_downloaded")
		// fmt.Println(res2)
		if err2 != nil {
			panic(err2)
		}

		body2, err3 := ioutil.ReadAll(res2.Body)
		if err3 != nil {
			panic(err3.Error())
		}

		s2, _ := getSubtitleSearchMovieResponseBody([]byte(body2))

		subtitleID := s2.Data[0].ID

		fmt.Println(subtitleID)

		// request to find subtitle
		utlForFind := openSubtitlesURL + "/api/v1/find?id=" + subtitleID + "&languages=en"
		fmt.Println(utlForFind)
		_getRequestFindSub, errSub := http.NewRequest("GET", utlForFind, nil)
		_getRequestFindSub.Header.Set("authorization", "Bearer "+token)

		getRequestFindSub, err2 := client.Do(_getRequestFindSub)

		if errSub != nil {
			panic(errSub)
		}

		// fmt.Println(getRequestFindSub)
		// fmt.Println(getRequestFindSub.Body)

		findedSubtitle, findedSubtitleErr := ioutil.ReadAll(getRequestFindSub.Body)
		if findedSubtitleErr != nil {
			panic(findedSubtitleErr.Error())
		}

		findedSubBody, _ := getSubtitleFindResponseBody([]byte(findedSubtitle))

		fmt.Println(findedSubBody)
		fmt.Println(findedSubBody.Data[0].ID)

		// ORHER
		// "subtitle_id": "351852"

		// https: //www.opensubtitles.com/api/v1/discover/most_downloaded

		// r.URL.Query().Post("text")

		// text := r.URL.Query().Get("text")

		// translated, err := gtranslate.TranslateWithParams(
		// 	text,
		// 	gtranslate.TranslationParams{
		// 		From: "en",
		// 		To:   "ru",
		// 	},
		// )

		// if err != nil {
		// 	panic(err)
		// }

		// // TODO: use logger!
		// fmt.Printf("en: %s | ru: %s \n", text, translated)

		// word := Word{
		// 	Text:       text,
		// 	Translated: translated,
		// 	CreatedAt:  time.Now(),
		// }

		json.NewEncoder(w).Encode(res)
	}
}
