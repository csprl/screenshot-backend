package main

type appUser struct {
	Token  string
	Prefix string
}

type appConfig struct {
	BaseURL string
	Users   []appUser
}
