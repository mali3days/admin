package main

func main() {
	// defer klog.Flush()

	// baseName := filepath.Base(os.Args[0])

	// err := velero.NewCommand(baseName).Execute()
	// cmd.CheckError(err)
}

// package main

// import (
// 	"fmt"
// 	"net/http"
// 	// "github.com/bregydoc/gtranslate"
// )

// const (
// 	DB_HOST     = "127.0.0.1"
// 	DB_PORT     = "5433"
// 	DB_USER     = "postgres"
// 	DB_PASSWORD = "days"
// 	DB_NAME     = "go_graphql_db"
// )

// // type Author struct {
// // 	ID        int       `json:"id"`
// // 	Name      string    `json:"name"`
// // 	CreatedAt time.Time `json:"created_at"`
// // }

// // type Word struct {
// // 	ID        int       `json:"id"`
// // 	Content   string    `json:"content"`
// // 	AuthorID  int       `json:"author_id"`
// // 	CreatedAt time.Time `json:"created_at"`
// // }

// type server struct {
// 	db     *someDatabase
// 	router *someRouter
// 	email  EmailSender
// }

// func setupResponse(w *http.ResponseWriter, req *http.Request) {
// 	(*w).Header().Set("Access-Control-Allow-Origin", "http://localhost:3000")
// 	(*w).Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
// 	(*w).Header().Set("Access-Control-Allow-Headers", "Accept, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization")
// }

// func newServer() *server {
// 	s := &server{}
// 	s.routes()
// 	return s
// }

// func main() {
// 	// http.HandleFunc("/graphql", indexHandler(h))

// 	http.ListenAndServe(":8080", nil)
// }

// func (s *server) routes() {
// 	// s.router.Get("/api/", s.handleAPI())
// 	// s.router.Get("/about", s.handleAbout())
// 	s.router.Get("/", s.handleIndex())
// 	// s.router.Get("/admin", s.adminOnly(s.handleAdminIndex()))
// }

// // func (s *server) handleGreeting(format string) http.HandlerFunc {
// // 	return func(w http.ResponseWriter, r *http.Request) {
// // 		fmt.Fprintf(w, format, r.FormValue("name"))
// // 	}
// // }

// func (s *server) handleGreet() http.HandlerFunc {
// 	type request struct {
// 		Name string
// 	}
// 	type response struct {
// 		Greeting string `json:"greeting"`
// 	}
// 	return func(w http.ResponseWriter, r *http.Request) {
// 		fmt.Println("handleGreet")
// 	}
// }

// func (s *server) ServeHTTP(w http.ResponseWriter, r *http.Request) {
// 	s.router.ServeHTTP(w, r)
// }

// // func main() {
// // 	if err := run(); err != nil {
// // 		fmt.Fprintf(os.Stderr, "%s\n", err)
// // 		os.Exit(1)
// // 	}
// // }

// // func run() error {
// // db, dbtidy, err := setupDatabase()
// // if err != nil {
// // 	return errors.Wrap(err, "setup database")
// // }
// // defer dbtidy()
// // srv := &server{
// // 	db: db,
// // }
// // }

// // handleTasksCreate
// // handleTasksDone
// // handleTasksGet

// // handleAuthLogin
// // handleAuthLogout

// // func main() {
// // 	text := "Hello World"
// // 	translated, err := gtranslate.TranslateWithParams(
// // 		text,
// // 		gtranslate.TranslationParams{
// // 			From: "en",
// // 			To:   "ru",
// // 		},
// // 	)
// // 	if err != nil {
// // 		panic(err)
// // 	}

// // 	fmt.Printf("en: %s | ru: %s \n", text, translated)
// // 	// en: Hello World | ja: Привет мир
// // }
