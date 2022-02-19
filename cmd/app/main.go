package main

import (
	"github.com/sethvargo/go-githubactions"
)

func main() {
	if err := core(); err != nil {
		githubactions.Fatalf(err.Error())
	}
}

func core() error {
	githubactions.Infof("Hello, world")
	return nil
}
