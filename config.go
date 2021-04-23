package main

type configUser struct {
	Token  string
	Prefix string
}

type appConfig struct {
	BaseURL string
	Users   []configUser
}
