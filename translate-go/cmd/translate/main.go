package main

import (
	"flag"
	"log"

	"github.com/BurntSushi/toml"
	"github.com/mali3days/translate-go/internal/app/translate"
)

var (
	configPath string
)

func init() {
	flag.StringVar(&configPath, "config-path", "configs/translate.toml", "path to config file")
}

func main() {
	flag.Parse()

	config := translate.NewConfig()
	_, err := toml.DecodeFile(configPath, config)
	if err != nil {
		log.Fatal(err)
	}

	t := translate.New(config)

	if err := t.Start(); err != nil {
		log.Fatal(err)
	}
}
