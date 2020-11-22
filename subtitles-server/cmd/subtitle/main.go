package main

import (
	"flag"
	"log"

	"github.com/BurntSushi/toml"
	"github.com/mali3days/subtitle-server/internal/app/subtitle"
)

var (
	configPath string
)

func init() {
	flag.StringVar(&configPath, "config-path", "configs/subtitle.toml", "path to config file")
}

func main() {
	flag.Parse()

	config := subtitle.NewConfig()
	_, err := toml.DecodeFile(configPath, config)
	if err != nil {
		log.Fatal(err)
	}

	s := subtitle.New(config)

	if err := s.Start(); err != nil {
		log.Fatal(err)
	}
}
