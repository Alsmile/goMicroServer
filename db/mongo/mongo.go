package mongo

import (
  mgo "gopkg.in/mgo.v2"
  "github.com/alsmile/goApiGateway/utils"
  "time"
)

const (
  CollectionUsers = "users"
  CollectionSites = "sites"
  CollectionApis = "apis"
)

var MgoSession *mgo.Session

func InitSession() (err error) {
  MgoSession, err = mgo.DialWithInfo(&mgo.DialInfo{
    Addrs: []string{utils.GlobalConfig.Mongo.Address},
    Username: utils.GlobalConfig.Mongo.User,
    Password: utils.GlobalConfig.Mongo.Password,
    Database: utils.GlobalConfig.Mongo.Database,
    Source: utils.GlobalConfig.Mongo.Database,
    Mechanism: utils.GlobalConfig.Mongo.Mechanism,
    PoolLimit: utils.GlobalConfig.Mongo.MaxConnections,
    Timeout: time.Duration(utils.GlobalConfig.Mongo.Timeout) * time.Second,
  })
  if err == nil {
    if utils.GlobalConfig.Mongo.Debug {
      mgo.SetDebug(true)
    }
    err = MgoSession.DB(utils.GlobalConfig.Mongo.Database).Login(utils.GlobalConfig.Mongo.User, utils.GlobalConfig.Mongo.Password)
  }
  if err == nil {
    MgoSession.SetMode(mgo.Monotonic, true)
  }

  return
}
